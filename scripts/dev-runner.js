#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const blessed = require('blessed');

// Detect package manager
const isPnpm = fs.existsSync(path.join(process.cwd(), 'pnpm-workspace.yaml'));
const isYarn =
	fs.existsSync(path.join(process.cwd(), 'package.json')) &&
	JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')).workspaces;

const command = process.argv[2] || 'dev';

function resolvePackageDirs(glob) {
	const [baseDir, wildcard] = glob.split('/');
	if (wildcard !== '*') return [];

	const fullBase = path.join(process.cwd(), baseDir);
	if (!fs.existsSync(fullBase)) return [];

	return fs
		.readdirSync(fullBase)
		.map((name) => path.join(fullBase, name))
		.filter((pkgPath) => fs.existsSync(path.join(pkgPath, 'package.json')));
}

function resolvePnpmPackages() {
	const yamlPath = path.join(process.cwd(), 'pnpm-workspace.yaml');
	const yamlContent = fs.readFileSync(yamlPath, 'utf-8');

	const packageGlobs = Array.from(
		yamlContent.matchAll(/packages:\s*\n((?:\s*-\s*.*\n)+)/g),
	).flatMap(([, block]) =>
		block
			.split('\n')
			.map((line) => line.trim().replace(/^- /, '').replace(/['"]/g, ''))
			.filter(Boolean),
	);

	return packageGlobs.flatMap(resolvePackageDirs);
}

function resolveYarnPackages() {
	const packageJson = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'),
	);
	const workspaces = packageJson.workspaces || [];
	return workspaces.flatMap(resolvePackageDirs);
}

function runScript(pkgPath, name) {
	const proc = spawn('pnpm', ['run', command], {
		cwd: pkgPath,
		shell: true,
		stdio: ['ignore', 'pipe', 'pipe'],
	});

	proc.stdout.on('data', (data) => {
		updateLog(name, data.toString());
	});

	proc.stderr.on('data', (data) => {
		updateLog(name, data.toString());
	});

	proc.on('close', (code) => {
		updateLog(name, `exited with code ${code}`);
	});

	return proc;
}

function updateLog(appName, data) {
	if (!logs[appName]) logs[appName] = [];
	logs[appName].push(data);

	if (selectedAppName === appName && appLogBoxes[appName]) {
		appLogBoxes[appName].setContent(logs[appName].join('\n'));
		screen.render();
	}
}

// function updateLog(appName, data) {
// 	if (!logs[appName]) logs[appName] = [];

// 	// Remove ANSI escape codes and apply tag formatting
// 	const stripped = data.toString().replace(/\x1b\[[0-9;]*m/g, '');
// 	const highlighted = stripped.replace(/compiled successfully/gi, '{green-fg}compiled successfully{/green-fg}');

// 	logs[appName].push(highlighted);

// 	if (selectedAppName === appName && appLogBoxes[appName]) {
// 		appLogBoxes[appName].setContent(logs[appName].join(''));
// 		screen.render();
// 	}
// }


// ---------------- UI Setup ----------------

const screen = blessed.screen({
	smartCSR: true,
	title: 'Workspace Manager GUI',
	fullUnicode: true,
});

const logs = {};
const appLogBoxes = {};
let selectedAppName = null;

// Container for heading + list
const appListContainer = blessed.box({
	parent: screen,
	top: -1,
	left: 0,
	width: '25%',
	height: '100%',
	border: { type: 'line' },
	style: {
		border: { fg: 'black' },
	},
});

// Heading above list
blessed.box({
	parent: appListContainer,
	top: 0,
	width: '100%',
	height: 2,
	content: 'Applications List',
	tags: true,
	style: {
		fg: 'cyan',
		bg: 'black',
	},
});

// Application list
const appListBox = blessed.list({
	parent: appListContainer,
	top: 2,
	left: 0,
	width: '100%',
	height: '100%',
	items: [],
	style: {
		fg: 'white',
		bg: 'black',
		selected: { fg: 'yellow' },
	},
});

const divider = blessed.box({
	parent: screen,
	top: -1,
	left: '25%',
	width: 1,
	height: '100%',
	content: '│'.repeat(screen.height),
	style: {
		fg: 'gray',
		bg: 'black',
	},
});

screen.on('resize', () => {
	appListContainer.width = Math.floor(screen.width * 0.3);
	divider.left = appListContainer.width;
	Object.values(appLogBoxes).forEach((box) => {
		box.left = appListContainer.width + 1;
		box.width = screen.width - appListContainer.width - 1;
	});
	screen.render();
});

process.on('SIGINT', () => {
	Object.values(processes).forEach((proc) => proc.kill('SIGINT'));
	setTimeout(() => process.exit(0), 1000);
});

const allPkgPaths = isPnpm ? resolvePnpmPackages() : isYarn ? resolveYarnPackages() : [];
const processes = {};

if (allPkgPaths.length === 0) {
	logs['global'] = ['No packages found or no workspace configuration detected.'];
	screen.render();
	process.exit(1);
}

const runningPackages = allPkgPaths.filter((pkgPath) => {
	const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf-8'));
	return pkgJson.scripts?.[command];
});

if (runningPackages.length === 0) {
	logs['global'] = ['No running applications found with the specified command.'];
	screen.render();
	process.exit(1);
}

runningPackages.forEach((pkgPath) => {
	const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf-8'));
	const name = pkgJson.name || path.basename(pkgPath);

	appListBox.addItem(`${name} - Running`);

	const appLogBox = blessed.box({
		parent: screen,
		top: 0,
		left: '26%',
		width: screen.width - Math.floor(screen.width * 0.3) - 1,
		height: '100%',
		content: '',
		padding: { left: 1 },
		border: { type: 'line' },
		label: `Logs: ${name}`,
		style: {
			fg: 'white',
			bg: 'black',
			border: { fg: 'black' },
			label: { fg: 'yellow' },
		},
        tags: true,
		hidden: true,
	});

	appLogBoxes[name] = appLogBox;
	processes[name] = runScript(pkgPath, name);
});

appListBox.focus();

// Initial selection and display
appListBox.select(0);
const firstAppName = appListBox.getItem(0).getText().split(' - ')[0];
selectedAppName = firstAppName;

Object.entries(appLogBoxes).forEach(([name, box]) => {
	if (name === firstAppName) {
		box.show();
		box.setContent(logs[name]?.join('\n') || '');
		box.focus();
	} else {
		box.hide();
	}
});
screen.render();

// Handle navigation
screen.key(['up', 'down'], (ch, key) => {
	if (key.name === 'up') appListBox.up();
	else if (key.name === 'down') appListBox.down();

	const selectedItem = appListBox.getItem(appListBox.selected);
	const appName = selectedItem.getText().split(' - ')[0];
	selectedAppName = appName;

	Object.entries(appLogBoxes).forEach(([name, box]) => {
		if (name === appName) {
			box.show();
			box.setContent(logs[name]?.join('\n') || '');
			box.focus();
		} else {
			box.hide();
		}
	});
	screen.render();
});

screen.key(['escape', 'C-c'], () => process.exit(0));
screen.render();
