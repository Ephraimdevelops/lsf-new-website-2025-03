const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Mobile imports shared navigation and pure guide-content validation.
config.watchFolders = [
  ...config.watchFolders,
  path.resolve(__dirname, '../shared'),
  path.resolve(__dirname, '../convex/lib'),
];

module.exports = config;
