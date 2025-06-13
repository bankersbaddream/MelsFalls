module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      'react-native-reanimated/plugin', // This should be last
      // Ensure 'react-native-reanimated/plugin' is last if present
      // Existing projects might have it, add it here if needed or if it was previously in a non-existent babel.config.js
      // For now, only adding react-native-dotenv as per subtask scope
    ],
  };
};
