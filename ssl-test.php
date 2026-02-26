<?php
echo "OpenSSL: " . (extension_loaded('openssl') ? '✅ OK' : '❌ NOT LOADED') . "\n";
echo "cURL: " . (extension_loaded('curl') ? '✅ OK' : '❌ NOT LOADED') . "\n\n";

$cainfo = ini_get('curl.cainfo');
echo "curl.cainfo: " . ($cainfo ? $cainfo : '❌ NOT SET') . "\n";

$openssl_cafile = ini_get('openssl.cafile');
echo "openssl.cafile: " . ($openssl_cafile ? $openssl_cafile : '❌ NOT SET') . "\n\n";

// Test koneksi ke Supabase via HTTPS
echo "Testing HTTPS connection to Supabase...\n";
$ch = curl_init('https://kzlbaphvvdxxheyvqzen.supabase.co');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_VERBOSE, true);

$response = curl_exec($ch);
$error = curl_error($ch);
$info = curl_getinfo($ch);

if ($error) {
    echo "❌ cURL Error: $error\n";
} else {
    echo "✅ HTTPS connection successful!\n";
    echo "HTTP Code: " . $info['http_code'] . "\n";
}

curl_close($ch);
?>