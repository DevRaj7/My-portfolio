const {merge} = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')



module.exports = merge(
    commonConfiguration, 
    {
    mode: 'production',
    plugins:
        [
            new CleanWebpackPlugin()
        ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
});
