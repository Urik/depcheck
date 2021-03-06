import path from 'path';
import requirePackageName from 'require-package-name';

export default function parseCommitizen(content, filePath, deps, rootDir) {
  const packageJsonPath = path.resolve(rootDir, 'package.json');
  const resolvedFilePath = path.resolve(filePath);

  if (resolvedFilePath === packageJsonPath) {
    const metadata = JSON.parse(content);

    if (
      metadata.config &&
      metadata.config.commitizen &&
      metadata.config.commitizen.path
    ) {
      const commitizenPath = metadata.config.commitizen.path;

      if (!commitizenPath.startsWith('.')) {
        return [requirePackageName(commitizenPath)];
      }

      const normalizedPath = path.normalize(commitizenPath).replace(/\\/g, '/');

      if (!normalizedPath.startsWith('node_modules')) {
        // The path is not refering to a file in another module
        return [];
      }

      const packagePath = normalizedPath.substring('node_modules/'.length);

      return [requirePackageName(packagePath)];
    }
  }

  return [];
}
