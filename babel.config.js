module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Aap yahan apne custom plugins add kar sakte ho
      'react-native-reanimated/plugin', // Ye hamesha last me ho
    ],
  };
};
