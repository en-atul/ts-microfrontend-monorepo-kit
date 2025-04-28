import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Utility to calculate __filename and __dirname relative to the importing file.
 * @param importingFileUrl - The URL of the file importing this utility.
 */
function getFilePaths(importingFileUrl) {
  const __filename = fileURLToPath(importingFileUrl);
  const __dirname = path.resolve(path.dirname(__filename));

  return { __filename, __dirname };
}

export { getFilePaths };
