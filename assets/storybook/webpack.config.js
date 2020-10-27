const path = require('path');
// Import dependencies.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Import common configurations.
const common = require('./webpack.common');

// Webpack configuration.
module.exports = {
  mode: 'development',
  entry: {
    scripts: './storybook/scripts.ts',
    editor: './storybook/editor.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: { extensions: ['.ts', '.js'] },

  /**
   * Plugins.
   *
   * Add all common plugins.
   *
   * MiniCssExtractPlugin()
   * A Lightweight CSS extraction webpack plugin.
   */
  plugins: [
    ...common.plugins,
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      path: path.resolve(__dirname, 'dist'),
    }),
  ],
  module: {
    rules: [
      common.javascript,
      // Extend common CSS configuration with those used in build process.
      {
        ...common.css,
        use: [MiniCssExtractPlugin.loader, 'css-loader', ...common.css.use],
      },
      common.assets,
    ],
  },
};
