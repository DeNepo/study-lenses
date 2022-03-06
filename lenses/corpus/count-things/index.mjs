import fs from "fs";
import { readFile } from "fs/promises";
import { basename } from "path";

import { createJsVirDir } from "./create-js-vir-dir.mjs";
import { analyzeVirDir } from "./analyze-vir-dir.mjs";

import { analyzeSource } from "./analyze-source.mjs";

import { renderVirDirAnalysis, renderSourceAnalysis } from "./views/index.mjs";

export const countThings = async ({
  path = "",
  render = false,
  resource = {},
}) => {
  if (fs.lstatSync(path).isDirectory()) {
    const virDir = await createJsVirDir(path);
    const virDirAnalysis = await analyzeVirDir(virDir);
    // return virDirAnalysis;
    return render
      ? renderVirDirAnalysis(resource.content, virDirAnalysis)
      : virDirAnalysis;
  } else {
    const code = resource.content || (await readFile(path, "utf-8"));
    const sourceAnalysis = analyzeSource(code);
    return render
      ? renderSourceAnalysis(sourceAnalysis, basename(path), code)
      : sourceAnalysis;
  }
};
