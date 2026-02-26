<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseService
{
    protected $url;
    protected $key;
    protected $serviceKey;
    
    public function __construct()
    {
        $this->url = env('SUPABASE_URL');
        $this->key = env('SUPABASE_KEY');
        $this->serviceKey = env('SUPABASE_SERVICE_KEY', $this->key);
        
        if (!$this->url || !$this->key) {
            throw new \Exception('SUPABASE_URL and SUPABASE_KEY must be set in .env');
        }
    }
    
    public function select($table, $filters = [], $select = '*')
    {
        $url = $this->url . '/rest/v1/' . $table . '?select=' . urlencode($select);
        
        foreach ($filters as $key => $value) {
            if (is_array($value)) {
                $values = implode(',', $value);
                $url .= "&{$key}=in.({$values})";
            } else {
                $url .= "&{$key}=eq.{$value}";
            }
        }
        
        $response = Http::withHeaders([
            'apikey' => $this->key,
            'Authorization' => 'Bearer ' . $this->key,
        ])->get($url);
        
        if ($response->failed()) {
            Log::error('Supabase select error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return ['error' => $response->body()];
        }
        
        return $response->json();
    }
    
    public function insert($table, $data)
    {
        $response = Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => 'Bearer ' . $this->serviceKey,
            'Content-Type' => 'application/json',
            'Prefer' => 'return=representation'
        ])->post($this->url . '/rest/v1/' . $table, $data);
        
        if ($response->failed()) {
            Log::error('Supabase insert error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return ['error' => $response->body()];
        }
        
        return $response->json();
    }
    
    public function update($table, $id, $data)
    {
        $response = Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => 'Bearer ' . $this->serviceKey,
            'Content-Type' => 'application/json',
            'Prefer' => 'return=representation'
        ])->patch($this->url . '/rest/v1/' . $table . '?id=eq.' . $id, $data);
        
        if ($response->failed()) {
            Log::error('Supabase update error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return ['error' => $response->body()];
        }
        
        return $response->json();
    }
    
    public function delete($table, $id)
    {
        $response = Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => 'Bearer ' . $this->serviceKey,
        ])->delete($this->url . '/rest/v1/' . $table . '?id=eq.' . $id);
        
        if ($response->failed()) {
            Log::error('Supabase delete error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return ['error' => $response->body()];
        }
        
        return $response->json();
    }
    
    public function upload($bucket, $path, $file)
    {
        $response = Http::withHeaders([
            'apikey' => $this->serviceKey,
            'Authorization' => 'Bearer ' . $this->serviceKey,
        ])->withBody($file, 'application/octet-stream')
          ->post($this->url . '/storage/v1/object/' . $bucket . '/' . $path);
        
        return $response->json();
    }
}