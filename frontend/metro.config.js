const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to accept and bundle .mjs icon files
config.resolver.sourceExts.push('mjs');

module.exports = config;
