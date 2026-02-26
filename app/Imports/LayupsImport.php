<?php

namespace App\Imports;

use App\Models\Layup;
use App\Models\Layer;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class LayupsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, WithChunkReading
{
    use Importable, SkipsFailures;

    protected $supplierId;
    protected $strategy;
    protected $dryRun;
    protected $conflicts = [];

    public function __construct($supplierId, $strategy = 'skip', $dryRun = false)
    {
        $this->supplierId = $supplierId;
        $this->strategy = $strategy;
        $this->dryRun = $dryRun;
    }

    public function model(array $row)
    {
        $existingLayup = Layup::where('supplier_id', $this->supplierId)
            ->where('name', $row['layup_name'])
            ->first();

        if ($existingLayup) {
            return $this->handleLayupConflict($existingLayup, $row);
        }

        if (!$this->dryRun) {
            $layup = new Layup([
                'supplier_id' => $this->supplierId,
                'name' => $row['layup_name'],
                'description' => $row['description'] ?? null,
            ]);
            $layup->save();

            if (isset($row['layers']) && !empty($row['layers'])) {
                $this->processLayers($layup->id, $row['layers']);
            }

            return $layup;
        }

        return null;
    }

    protected function handleLayupConflict($existingLayup, $row)
    {
        $conflict = [
            'type' => 'layup',
            'layup_id' => $existingLayup->id,
            'layup_name' => $existingLayup->name,
            'existing' => [
                'description' => $existingLayup->description
            ],
            'incoming' => [
                'description' => $row['description'] ?? null
            ]
        ];

        switch ($this->strategy) {
            case 'overwrite':
                if (!$this->dryRun) {
                    $existingLayup->update([
                        'description' => $row['description'] ?? $existingLayup->description
                    ]);
                    
                    if (isset($row['layers'])) {
                        $this->processLayers($existingLayup->id, $row['layers'], true);
                    }
                }
                $conflict['action'] = 'overwritten';
                break;

            case 'duplicate':
                if (!$this->dryRun) {
                    $newLayup = Layup::create([
                        'supplier_id' => $this->supplierId,
                        'name' => $row['layup_name'] . ' (imported)',
                        'description' => $row['description'] ?? null
                    ]);
                    
                    if (isset($row['layers'])) {
                        $this->processLayers($newLayup->id, $row['layers']);
                    }
                    $conflict['new_layup_id'] = $newLayup->id;
                }
                $conflict['action'] = 'duplicated';
                break;

            case 'skip':
            default:
                $conflict['action'] = 'skipped';
                break;
        }

        $this->conflicts[] = $conflict;
        return null; 
    }

    protected function processLayers($layupId, $layersJson, $overwrite = false)
    {
        $layers = json_decode($layersJson, true);
        if (!$layers) return;

        foreach ($layers as $layerData) {
            $existingLayer = Layer::where('layup_id', $layupId)
                ->where('layer_order', $layerData['layer_order'])
                ->first();

            if ($existingLayer) {
                $differs = $existingLayer->thickness != $layerData['thickness'] ||
                          $existingLayer->width != $layerData['width'] ||
                          $existingLayer->angle != $layerData['angle'];

                if ($differs) {
                    $layerConflict = [
                        'type' => 'layer',
                        'layup_id' => $layupId,
                        'layer_order' => $layerData['layer_order'],
                        'existing' => [
                            'thickness' => $existingLayer->thickness,
                            'width' => $existingLayer->width,
                            'angle' => $existingLayer->angle,
                        ],
                        'incoming' => [
                            'thickness' => $layerData['thickness'],
                            'width' => $layerData['width'],
                            'angle' => $layerData['angle'],
                        ]
                    ];

                    if ($this->strategy === 'overwrite' && !$this->dryRun) {
                        $existingLayer->update([
                            'thickness' => $layerData['thickness'],
                            'width' => $layerData['width'],
                            'angle' => $layerData['angle'],
                        ]);
                        $layerConflict['action'] = 'overwritten';
                    } else {
                        $layerConflict['action'] = 'skipped';
                    }

                    $this->conflicts[] = $layerConflict;
                }
            } else if (!$this->dryRun) {
                Layer::create([
                    'layup_id' => $layupId,
                    'layer_order' => $layerData['layer_order'],
                    'thickness' => $layerData['thickness'],
                    'width' => $layerData['width'],
                    'angle' => $layerData['angle'],
                ]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'layup_name' => 'required|string',
            'description' => 'nullable|string',
            'layers' => 'nullable|json'
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function getConflicts()
    {
        return $this->conflicts;
    }
}