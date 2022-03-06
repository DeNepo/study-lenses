import { readFileSync } from 'fs';
import { extname } from 'path';

import { analyzeSource } from './analyze-source.mjs';
import { summarizeJsFiles } from './summarize-js-files.mjs';

export const analyzeVirDir = async (virDir = {}) => {
  const report = {
    name: virDir.name,
    path: virDir.path,
  };

  let directories = null;
  if (virDir.directories?.length > 0) {
    directories = await Promise.all(virDir.directories.map(analyzeVirDir));
  }

  let files = null;
  if (virDir.files?.length > 0) {
    //  faster, but throws Error: ENFILE: file table overflow (errno: -23)
    // report.files = await Promise.all(
    //   virDir.files.map((file) =>
    //     readFile(file.path, "utf-8").then((code) =>
    //       Object.assign({}, file, analyzeSource(code))
    //     )
    //   )
    // );

    // slower, but doesn't overflow the file table
    files = virDir.files.map((file) =>
      extname(file.name) === '.js' &&
      (!file.name.includes('.min.') || !file.name.includes('.bundle.'))
        ? Object.assign(
            {},
            file,
            analyzeSource(readFileSync(file.path, 'utf-8')),
          )
        : file,
    );
  }

  const jsSummary = summarizeJsFiles({ directories, files, ...report });
  if (jsSummary) {
    report.javascriptSummary = jsSummary;
  }
  report.directories = directories;
  report.files = files;

  return report;
};
