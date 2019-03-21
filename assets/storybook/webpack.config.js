const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const jsRule = {
  test: /\.tsx?$/,
  loader: 'babel-loader',
  options: {
    presets: [
      ["@babel/env", {
        targets: {chrome: '63'},
      }],
      ["@babel/react"],
      ["@babel/typescript"]
    ]
  }
};

module.exports = {
  entry: {
    scripts: './scripts.ts',
    editor: './editor.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: { extensions: ['.ts', '.js', '.tsx', '.jsx'] },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      path: path.resolve(__dirname, 'dist')
    })
  ],

  module: {
    rules: [
      jsRule,
      {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
        ]
      },
      {
        test: /\.twig$/,
        use: [
          {
            loader: 'twig-loader',
            options: {
              twigOptions: {
                namespaces: {
                  storybook: 'stories'
                }
              }
            }
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          }
        ],
      }
    ]
  }
};
