const path = require('path');

// Import dependencies.
const StyleLintPlugin = require('stylelint-webpack-plugin');

/**
 * Default modules loader for JavaScript and TypeScript.
 */
const javascript = {
  test: /\.(ts|js)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/env',
            {
              targets: { chrome: '63', ie: '11' },
            },
          ],
          ['@babel/typescript'],
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          '@babel/plugin-proposal-object-rest-spread',
        ],
      },
    },
    'eslint-loader',
  ],
};

/**
 * Default modules loader for CSS.
 */
const css = {
  test: /\.css$/,
  use: ['postcss-loader'],
};

/**
 * Default modules loader for assets.
 */
const assets = {
  test: /\.(woff|woff2|eot|ttf|svg|ico|jpe?g|png)$/,
  use: ['file-loader'],
};

/**
 * Shared plugins.
 *
 * StyleLintPlugin()
 * A webpack plugin to lint your CSS/Sass code using stylelint.
 */
const plugins = [
  new StyleLintPlugin({
    configFile: path.resolve(__dirname, '.stylelintrc'),
    ignorePath: path.resolve(__dirname, '.eslintignore'), // Use .eslintignore because it has ignored directories/files already.
    context: path.resolve(__dirname, ''),
    files: '**/*.css',
    failOnError: false,
    emitErrors: true,
    quiet: false,
  }),
];

// Export common webpack configurations.
module.exports = {
  javascript,
  css,
  assets,
  plugins,
};
