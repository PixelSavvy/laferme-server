import { CleanWebpackPlugin } from "clean-webpack-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { fileURLToPath } from "url";
import nodeExternals from "webpack-node-externals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('webpack').Configuration}
 */

const config = {
  mode: "production",
  target: "node",

  entry: path.resolve(__dirname, "src/index.ts"),

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.min.cjs",
    libraryTarget: "commonjs2",
  },

  resolve: {
    extensions: [".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "tsconfig.json"),
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, "tsconfig.json"),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === "production",
          },
        },
      }),
    ],
  },

  externals: [nodeExternals()],

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
    }),
  ],
};

export default config;
