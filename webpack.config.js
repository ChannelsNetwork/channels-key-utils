const path = require('path');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    library: "ChannelsKeyUtils",
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'dist'),
    filename: 'channels-key-utils.js'
  }
};