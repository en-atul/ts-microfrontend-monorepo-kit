const { series, parallel } = require('gulp');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const appsDir = path.resolve('./apps');

function getAppDirs() {
  return fs.readdirSync(appsDir).filter((dir) => {
    const fullPath = path.join(appsDir, dir);
    return fs.statSync(fullPath).isDirectory();
  });
}

function buildApp(appName) {
  return async function buildAppTask() {
    const cwd = path.join(appsDir, appName);
    console.log(`🔧 Building ${appName}...`);
    await execAsync('pnpm gulp', { cwd, stdio: 'inherit' });
    console.log(`✅ Done: ${appName}`);
  };
}

const buildAllApps = parallel(...getAppDirs().map(buildApp));

exports.default = series(buildAllApps);
