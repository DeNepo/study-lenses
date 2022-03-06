import { join, basename } from 'path';
import { lstatSync } from 'fs';
import { readdir } from 'fs/promises';

export const createJsVirDir = async (path = '') => {
  const directoryPromises = [];
  const files = [];

  const ignore = ['.git', 'node_modules'];
  for (const childBase of await readdir(path)) {
    const childPath = join(path, childBase);

    if (lstatSync(childPath).isDirectory()) {
      if (!ignore.includes(childBase)) {
        directoryPromises.push(createJsVirDir(childPath));
      }
    } else {
      files.push({
        path: childPath,
        name: childBase,
      });
    }
  }

  const directories = (await Promise.all(directoryPromises)).map(
    (directory) => {
      const subDir = {
        name: basename(directory.path),
        path: directory.path,
      };
      if (directory?.files?.length > 0) {
        subDir.files = directory.files;
      }
      if (directory?.directories?.length > 0) {
        subDir.directories = directory.directories;
      }
      return subDir;
    },
  );

  return {
    path,
    name: basename(path),
    directories,
    files,
  };
};
