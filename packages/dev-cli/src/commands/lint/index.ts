import { Command } from '@oclif/core';
import { execSync } from 'child_process';

export default class Lint extends Command {
	static description = 'Run ESLint and Prettier checks';

	async run() {
		try {
			// Run ESLint with shared config
			this.log('Running ESLint checks...');
			execSync('pnpm eslint --config packages/eslint-config/base.js . --ext .ts,.tsx', {
				stdio: 'inherit',
			});

			// Run Prettier
			this.log('\nRunning Prettier checks...');
			execSync('pnpm prettier --check "**/*.{ts,tsx,md}"', { stdio: 'inherit' });

			this.log('\n✅ All checks passed!');
		} catch (error) {
			this.error('❌ Code quality checks failed. Please fix the issues and try again.');
			process.exit(1);
		}
	}
}
