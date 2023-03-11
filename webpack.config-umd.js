const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");


module.exports = {
  mode: 'production',
  entry: "./src/index.ts",
  output: {
    filename: "[name].umd.js",
    path: path.resolve(__dirname, "lib"),
    library: {
      // 注意这个name,应该就是export出来的东西的变量名
      name: 'EYStorage',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'globalThis',
    clean: true
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
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "src"),
      extensions: ["js", "ts"],
      quiet: true, // 不报告和处理warning
    }),
  ],
};