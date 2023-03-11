const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");


module.exports = {
  mode: 'production',
  entry: "./src/index.ts",
  output: {
    filename: "[name].esm.js",
    path: path.resolve(__dirname, "es"),
    library: {
      type: 'module'
    },
    chunkFormat: 'module',
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname), // 指定服务器当前域面资源的内容
    },
    open: true,
    port: 9000, // 端口号
  },
  // 由于输出 ESM 格式文件为 Webpack 实验特性，因此需要加上此配置。
  experiments: {
    outputModule: true
  },
  // 使路径查找时，支持省略文件名的 ts 后缀
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  module: {
    rules: [{
      test: /\.([cm]?ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']]
          }
        },
        { loader: 'ts-loader' }
      ]
    }],
  },
  plugins: [
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "src"),
      extensions: ["js", "ts"],
      quiet: true, // 不报告和处理warning
    }),
  ],
};