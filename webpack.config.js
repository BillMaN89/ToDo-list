const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true, 
  },
  mode: "development", 
  devtool: "eval-source-map", 
  devServer: {
    static: "./dist", // Δείχνει στον browser πού να σερβίρει αρχεία
    open: true,       // Ανοίγει αυτόματα τον browser
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i, // Υποστήριξη για εικόνες
          type: "asset/resource", // Μετατρέπει τις εικόνες σε αρχεία στον dist  
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
  },
};
