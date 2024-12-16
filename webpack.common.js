import GoogleFontsPlugin from "@beyonk/google-fonts-webpack-plugin";

import Dotenv from "dotenv-webpack";

export default {
  entry: "./src/js/index.ts",
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new GoogleFontsPlugin({
      fonts: [{ family: "Poppins", variants: ["300", "400", "500", "600"] }],

      // Add more fonts if needed
      local: false, // Use Google fonts CDN instead of downloading
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.(svg|jpg|jpeg|png|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.ts$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
