const currentTask = process.env.npm_lifecycle_event
const path = require('path')
// minify css into a single bundle(file) from React, Js or Jsx components
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// Load and add the js and css scripts to our [index].html file
const HtmlWebpackPlugin = require('html-webpack-plugin')
// clean(delete) the unUsed css, js files from the [dist] folder
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// load files in a specific order
const ManifestPlugin = require('webpack-manifest-plugin')

const config = {
    // entry file to the main JS developmnet file
    entry: './src/index.js',
    // the Output for the production bundle path
    output: {
        filename: 'main.[fullhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    // dev or prod mode
    mode: "development",
    // webpack-dev-server config
    devServer: {
        port: 3001,
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true
    },
    // ~~~Webpack-Plugins~~~
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.html'})
    ],
    // ~~~Webpack-Loaders~~~
    module: {
        rules: [
            // babel loader to transpile or convert Es6,Es7,Es8,JSX,ect.. to old ES5 JS
            {
                test: /\.js$/, // for all file that has .js extention
                exclude: /(node_modules|bower_components)/, // exclude our dependencies
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                // parse es6,,to ES5
                                '@babel/preset-env',
                                // this is for async in js
                                {
                                    "useBuiltIns": "usage",
                                    "corejs": 3,
                                    "targets": "defaults"
                                }
                                
                            ],
                            // parse Jsx to ES5
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            // Style-loader to load-css into the page 
            // Css-loader to import and export css inside js files
            // Sass to compile Sass to css
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
}

// change the config to optimize the prod && dev bundles
if (currentTask === "build") {
    config.mode = "production"
    config.module.rules[1].use[0] = MiniCssExtractPlugin.loader

    config.plugins.push(
    new MiniCssExtractPlugin({
        filename: 'main.[fullhash].css'
    }),
    new CleanWebpackPlugin(),
    // new ManifestPlugin()
    )
}

module.exports = config