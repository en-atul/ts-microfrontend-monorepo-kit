import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

import { Command, Flags } from '@oclif/core';
import { glob } from 'glob';
import ora from 'ora';
import pc from 'picocolors';

const execAsync = promisify(exec);

interface ExecError extends Error {
	stdout?: Buffer;
}

interface LintResult {
	success: boolean;
	output?: string;
	duration: number;
}

export default class Lint extends Command {
	static description = 'Run ESLint and Prettier checks';

	static flags = {
		fix: Flags.boolean({
			char: 'f',
			description: 'Automatically fix issues when possible',
			default: false,
		}),
		all: Flags.boolean({
			char: 'a',
			description: 'Check all files instead of just staged files',
			default: false,
		}),
	};

	private getFileCount = async (pattern: string): Promise<number> => {
		const files = await glob(pattern, { ignore: ['**/node_modules/**', '**/dist/**'] });
		return files.length;
	};

	private formatTime = (ms: number): string => {
		return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
	};

	private async getStagedFiles(pattern: string): Promise<string[]> {
		const { stdout: diffOutput } = await execAsync('git diff --cached --name-only');
		return diffOutput
			.split('\n')
			.filter((f) => f.match(pattern))
			.filter(Boolean)
			.map((f) => path.resolve(f));
	}

	private async getAllTypeScriptFiles(): Promise<string[]> {
		const { stdout } = await execAsync(
			'find apps packages -type f -name "*.ts" -o -name "*.tsx" | grep -v "node_modules\\|dist"',
		);
		return stdout
			.split('\n')
			.filter(Boolean)
			.map((f) => path.resolve(f));
	}

	private async findEslintConfigs(): Promise<string[]> {
		const { stdout } = await execAsync(
			'find apps packages -type f -name "eslint.config.js" | grep -v "node_modules\\|dist"',
		);
		return stdout
			.split('\n')
			.filter(Boolean)
			.map((f) => path.resolve(f));
	}

	private async runESLint(fix: boolean, stagedOnly: boolean): Promise<LintResult> {
		const startTime = Date.now();

		try {
			// Find all eslint config files
			const configs = await this.findEslintConfigs();
			if (!configs.length) {
				return {
					success: true,
					output: 'No ESLint config files found.',
					duration: Date.now() - startTime,
				};
			}

			// Run ESLint for each config directory
			const results = await Promise.all(
				configs.map(async (configPath) => {
					const configDir = path.dirname(configPath);
					let files: string[];

					if (stagedOnly) {
						// Get staged files relative to the config directory
						const stagedFiles = await this.getStagedFiles('\.(ts|tsx)$');
						files = stagedFiles
							.filter((f) => f.startsWith(configDir))
							.map((f) => path.relative(configDir, f));
					} else {
						files = ['**/*.ts', '**/*.tsx'];
					}

					if (files.length === 0) {
						return {
							success: true,
							output: `${path.basename(configDir)}: No files to lint`,
							duration: Date.now() - startTime,
						};
					}

					const cmd = `cd "${configDir}" && pnpm eslint ${files.map((f) => `"${f}"`).join(' ')}${fix ? ' --fix' : ''}`;

					try {
						const { stdout, stderr } = await execAsync(cmd);
						return {
							success: true,
							output: `${path.basename(configDir)}: ${stdout || 'No issues found.'}`,
							duration: Date.now() - startTime,
						};
					} catch (error) {
						const err = error as ExecError & { stdout?: string; stderr?: string };
						return {
							success: false,
							output: `${path.basename(configDir)}: ${err.stderr || err.stdout || err.message}`,
							duration: Date.now() - startTime,
						};
					}
				}),
			);

			const success = results.every((r) => r.success);
			const output = results
				.map((r) => r.output)
				.filter(Boolean)
				.join('\n\n');

			return {
				success,
				output: output || 'ESLint completed with no output.',
				duration: Date.now() - startTime,
			};
		} catch (error) {
			const err = error as ExecError & { stdout?: string; stderr?: string };
			return {
				success: false,
				output: err.stderr || err.stdout || err.message || 'ESLint failed with no error output',
				duration: Date.now() - startTime,
			};
		}
	}

	private async runPrettier(fix: boolean, stagedOnly: boolean): Promise<LintResult> {
		const startTime = Date.now();
		try {
			let cmd: string;

			if (stagedOnly) {
				const stagedFiles = await this.getStagedFiles('\.(ts|tsx|md)$');

				if (!stagedFiles.length) {
					return {
						success: true,
						output: 'No staged files to format.',
						duration: Date.now() - startTime,
					};
				}

				cmd = `pnpm prettier ${fix ? '--write' : '--check'} ${stagedFiles.map((f) => `"${f}"`).join(' ')}`;
			} else {
				cmd = `pnpm prettier ${fix ? '--write' : '--check'} "**/*.{ts,tsx,md}"`;
			}

			const { stdout } = await execAsync(cmd);
			return {
				success: true,
				output: stdout,
				duration: Date.now() - startTime,
			};
		} catch (error) {
			const err = error as ExecError & { stdout?: string; stderr?: string };
			return {
				success: false,
				output: err.stderr || err.stdout || err.message || 'Prettier failed with no error output',
				duration: Date.now() - startTime,
			};
		}
	}

	private printHeader(fix: boolean, stagedOnly: boolean) {
		this.log('\n' + pc.cyan(pc.bold('🚀 Running Code Quality Checks')));
		this.log(pc.dim(`Mode: ${fix ? 'Auto-fix enabled' : 'Check only'}`));
		this.log(pc.dim(`Scope: ${stagedOnly ? 'Staged files only' : 'All files'}\n`));
	}

	private printFileCount(tsFiles: number, mdFiles: number) {
		const total = tsFiles + mdFiles;
		this.log(
			pc.dim(
				`Found ${pc.bold(total)} files to check: ` +
					`${pc.cyan(tsFiles)} TypeScript, ` +
					`${pc.cyan(mdFiles)} other files\n`,
			),
		);
	}

	private printSummary(eslintResult: LintResult, prettierResult: LintResult) {
		const hasIssues = !eslintResult.success || !prettierResult.success;

		if (hasIssues) {
			this.log('\n' + pc.yellow(pc.bold('📝 Issues Found:')));
		}

		if (!eslintResult.success && eslintResult.output) {
			this.log('\n' + pc.yellow('ESLint Issues:'));
			this.log('─'.repeat(50));
			this.log(pc.dim(eslintResult.output.trim()));
		}

		if (!prettierResult.success && prettierResult.output) {
			this.log('\n' + pc.yellow('Prettier Issues:'));
			this.log('─'.repeat(50));
			this.log(pc.dim(prettierResult.output.trim()));
		}

		const totalTime = eslintResult.duration + prettierResult.duration;

		this.log('\n' + pc.bold('Summary:'));
		this.log('─'.repeat(50));
		this.log(`ESLint:   ${eslintResult.success ? pc.green('✓ Passed') : pc.red('✗ Failed')}`);
		this.log(`Prettier: ${prettierResult.success ? pc.green('✓ Passed') : pc.red('✗ Failed')}`);
		this.log(pc.dim(`Total time: ${this.formatTime(totalTime)}\n`));
	}

	async run() {
		const { flags } = await this.parse(Lint);
		const stagedOnly = !flags.all;

		try {
			// Print intro
			this.printHeader(flags.fix, stagedOnly);

			// Count files
			const tsFiles = await this.getFileCount('**/*.{ts,tsx}');
			const mdFiles = await this.getFileCount('**/*.md');
			this.printFileCount(tsFiles, mdFiles);

			// Spacer before tasks

			// 🔧 ESLint
			const eslintSpinner = ora({
				prefixText: '  ',
				text: 'Running ESLint...',
				spinner: 'dots',
			}).start();

			const eslintResult = await this.runESLint(flags.fix, stagedOnly);

			if (eslintResult.success) {
				eslintSpinner.stopAndPersist({
					symbol: pc.green('✓'),
					text: pc.green(`ESLint completed in ${this.formatTime(eslintResult.duration)}`),
				});
			} else {
				eslintSpinner.stopAndPersist({
					symbol: pc.red('✗'),
					text: pc.red(`ESLint failed in ${this.formatTime(eslintResult.duration)}`),
				});
			}

			// 🔧 Prettier
			const prettierSpinner = ora({
				prefixText: '  ',
				text: 'Running Prettier...',
				spinner: 'dots',
			}).start();

			const prettierResult = await this.runPrettier(flags.fix, stagedOnly);

			if (prettierResult.success) {
				prettierSpinner.stopAndPersist({
					symbol: pc.green('✓'),
					text: pc.green(`Prettier completed in ${this.formatTime(prettierResult.duration)}`),
				});
			} else {
				prettierSpinner.stopAndPersist({
					symbol: pc.red('✗'),
					text: pc.red(`Prettier failed in ${this.formatTime(prettierResult.duration)}`),
				});
			}

			this.log('');

			// Summary
			this.printSummary(eslintResult, prettierResult);

			// Fail if needed
			if (!eslintResult.success || !prettierResult.success) {
				throw new Error('Checks failed');
			}
		} catch (error) {
			this.error(
				pc.red(pc.bold('\n❌ Code quality checks failed. Please fix the issues and try again.\n')),
			);
			process.exit(1);
		}
	}
}
