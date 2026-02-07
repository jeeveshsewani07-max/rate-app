const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure we're using our index.ts as entry point
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
