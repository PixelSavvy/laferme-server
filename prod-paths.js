import tsConfigPaths from "tsconfig-paths";
import tsConfig from "./tsconfig.json";

const baseUrl = "./dist";

export const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,
});
