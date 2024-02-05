const path = require('path');

module.exports = {
  entry: './src/components/MailberryForm.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'MailberryForm.js',
    libraryTarget: '',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  target: 'web',
  devtool: 'source-map',
};