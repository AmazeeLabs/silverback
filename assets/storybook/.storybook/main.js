const path = require('path');

// Import common configurations.
const common = require('../webpack.common');

module.exports = {
  stories: [
    './styles.css',
    '../**/*.stories.@(ts|js)'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-viewport',
  ],

  // Config Webpack
  webpackFinal: async (config, { configType }) => {
    // Alias
    config.resolve.alias = {
      '@twig': path.resolve(__dirname, '../', 'twig'),
    };

    // Loaders
    config.module.rules.push(
      common.javascript,
      common.assets,
      common.css,
      {
        test: /\.twig$/,
        use: 'twigjs-loader',
      }
    );

    // Plugins
    config.plugins.push(
      ...common.plugins
    );

    // Support importing typescript files without extension.
    config.resolve.extensions.push('.ts');

    // Return the altered config
    return config;
  },
};
