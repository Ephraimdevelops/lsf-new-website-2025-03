import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, readFileSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import os from 'node:os';

// Exercise the composed Expo plugins. Merely checking app.json misses one
// plugin removing a permission requested by another plugin at native build time.
const mobile = fileURLToPath(new URL('../mobile/', import.meta.url));
// Use a clean project so stale generated native files cannot mask plugin changes.
const scratch = mkdtempSync(path.join(os.tmpdir(), 'haki-voice-permissions-'));
let config;
try {
  for (const name of ['app.json', 'package.json']) writeFileSync(path.join(scratch,name), readFileSync(path.join(mobile,name)));
  for (const name of ['node_modules', 'assets']) symlinkSync(path.join(mobile,name),path.join(scratch,name),'dir');
  config = JSON.parse(execFileSync(process.execPath,
    [path.join(mobile,'node_modules/expo/bin/cli'), 'config', '--type', 'introspect', '--json'], {
      cwd: scratch, encoding: 'utf8', timeout: 60000, maxBuffer: 20 * 1024 * 1024,
      env: { ...process.env, CI:'1', EXPO_NO_DOTENV:'1', EAS_BUILD_PROFILE:'development', EXPO_RELEASE_CHECK:'false' },
      stdio: ['ignore','pipe','pipe'],
    }));
} finally { rmSync(scratch,{recursive:true,force:true}); }

// Expo introspection covers app/plugin mods, not Android library manifest merging.
// ImagePicker declares CAMERA in its own native manifest, which Gradle merges.
const requireMobile = createRequire(path.join(mobile, 'package.json'));
const { AndroidConfig } = requireMobile('expo/config-plugins');
const pickerPackage = path.dirname(requireMobile.resolve('expo-image-picker/package.json'));
const pickerManifest = await AndroidConfig.Manifest.readAndroidManifestAsync(path.join(pickerPackage, 'android/src/main/AndroidManifest.xml'));
const libraryPermissions = pickerManifest.manifest['uses-permission'] ?? [];
const libraryDeclares = name => libraryPermissions.some(item => item.$['android:name'] === name && item.$['tools:node'] !== 'remove');
const mods = config._internal.modResults;
const manifest = mods.android.manifest.manifest;
const permissions = manifest['uses-permission'] ?? [];
const active = name => permissions.some(item => item.$['android:name'] === name && item.$['tools:node'] !== 'remove');
const removed = name => permissions.some(item => item.$['android:name'] === name && item.$['tools:node'] === 'remove');

test('native Android voice and document capture permissions survive all composed plugins', () => {
  for (const name of ['android.permission.RECORD_AUDIO','android.permission.CAMERA']) {
    assert.equal(active(name) || libraryDeclares(name), true, `${name} must be declared by the app or capture library`);
    assert.equal(removed(name), false, `${name} must not be globally removed by image picker`);
  }
});
test('iOS explains user-initiated microphone and document-camera access', () => {
  assert.match(mods.ios.infoPlist.NSMicrophoneUsageDescription, /record|transcrib/i);
  assert.match(mods.ios.infoPlist.NSCameraUsageDescription, /document/i);
});
test('voice configuration does not enable background recording or playback services', () => {
  assert.equal(active('android.permission.FOREGROUND_SERVICE_MICROPHONE'), false);
  assert.equal(active('android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK'), false);
  assert.ok(!(mods.ios.infoPlist.UIBackgroundModes ?? []).includes('audio'));
  const services = manifest.application.flatMap(app => app.service ?? []);
  for (const suffix of ['AudioControlsService','AudioRecordingService']) {
    assert.ok(!services.some(item => item.$['android:name']?.endsWith(suffix) && item.$['tools:node'] !== 'remove'));
  }
});
