const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.ts",
  // entry: "./test/index.spec.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname), // 指定服务器当前域面资源的内容
    },
    open: true,
    port: 9000, // 端口号
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
    new HtmlWebpackPlugin({
      filename: `index.html`, //生成的文件名
      template: path.resolve(__dirname, `./template/index.html`), //模板文件的绝对路径
    }),
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "src"),
      extensions: ["js", "ts"],
      quiet: true, // 不报告和处理warning
    }),
  ],
};