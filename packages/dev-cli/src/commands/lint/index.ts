import { Command } from '@oclif/core';
import { execSync } from 'child_process';

export default class Lint extends Command {
	static description = 'Run ESLint and Prettier checks';

	async run() {
		try {
			// Run ESLint
			console.log('Running ESLint checks...');
			execSync('pnpm eslint . --ext .ts,.tsx', { stdio: 'inherit' });

			// Run Prettier
			console.log('\nRunning Prettier checks...');
			execSync('pnpm prettier --check "**/*.{ts,tsx,md}"', { stdio: 'inherit' });

			console.log('\n✅ All checks passed!');
		} catch (error) {
			console.error('❌ Code quality checks failed. Please fix the issues and try again.');
			process.exit(1);
		}
	}
}
