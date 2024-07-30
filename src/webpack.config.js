// webpack.config.js
const fs = require('fs');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

// taken from https://github.com/webpack/webpack/issues/12506#issuecomment-1360810560
class RemoveLicenseFilePlugin {
    apply(compiler) {
        compiler.hooks.emit.tap("RemoveLicenseFilePlugin", (compilation) => {
            // compliation has assets to output
            // console.log(compilation.assets);
            for (let name in compilation.assets) {
                if (name.endsWith("LICENSE.txt")) {
                    delete compilation.assets[name];
                }
            }
        });
    }
}


module.exports = {
  entry: './src/onthisday.js',
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: packageData.FILENAME,
    library: {
      type: 'module',
    },
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  plugins: [new RemoveLicenseFilePlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
};
