# 🚀 TypeScript Microfrontend Monorepo Kit

![Banner](screenshots/banner.png)

A production-ready monorepo boilerplate for building scalable microfrontend applications, powered by
modern web technologies and best practices.

## 📚 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Tools](#-development-tools)
- [Architecture](#-architecture)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

This monorepo provides a complete foundation for building scalable microfrontend applications. It
solves several key challenges in modern web development:

- **Microfrontend Architecture**: Implement independent, deployable frontend applications that work
  together seamlessly
- **Code Sharing**: Share components and logic between applications efficiently using Webpack 5
  Module Federation
- **Type Safety**: Full TypeScript support across all applications and packages
- **Development Workflow**: Streamlined development experience with hot reloading and custom CLI
  tools
- **Security**: Built-in protection for remote module access
- **Scalability**: Monorepo structure that scales with your team and application needs

## 🌟 Key Features

### Core Features

- ⚡️ Webpack 5 Module Federation for component sharing
- 🔒 Secure Express middleware for remote module access
- 🔄 Hot Module Replacement (HMR) support
- 📦 Optimized production builds
- 🎨 CSS/SCSS Modules support
- 🧪 Testing setup with Jest

### Developer Experience

- 🛠 Custom dev-cli tool for workflow automation
- 📝 Comprehensive TypeScript support
- 🧹 Unified code formatting and linting
- 🔧 Shared configurations for all tools
- 📚 Component library setup

## 🔧 Technology Stack

- **Core**: React 18, TypeScript, Webpack 5
- **Styling**: CSS Modules, SCSS
- **Monorepo**: pnpm Workspaces, Lerna
- **Quality**: ESLint, Prettier, Jest
- **Development**: Custom CLI, Hot Module Replacement
- **Build**: Babel, Webpack optimizations

## 📁 Project Structure

\`\`\` ├── apps/ # Microfrontend applications │ ├── host/ # Host application │ └── remote/ # Remote
application ├── packages/ # Shared packages │ ├── dev-cli/ # Development workflow tools │ ├── ui/ #
Shared UI components │ ├── utils/ # Common utilities │ └── configs/ # Shared configurations ├──
scripts/ # Build and utility scripts └── package.json # Root package file \`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0

### Installation

\`\`\`bash

# Clone the repository

git clone https://github.com/your-username/ts-microfrontend-monorepo-kit.git

# Install dependencies

pnpm install

# Start development

pnpm dev \`\`\`

### Development Commands

- \`pnpm dev\`: Start all applications in development mode
- \`pnpm start:host\`: Start host application
- \`pnpm start:remote\`: Start remote application
- \`pnpm build\`: Build all applications
- \`pnpm lint\`: Run linting
- \`pnpm format\`: Format code

## 🛠 Development Tools

### Dev CLI (@repo/dev-cli)

Custom CLI tool that provides:

- Workflow automation
- Development server management
- Build process optimization
- Project scaffolding

Usage: \`\`\`bash

# Create a new component

dev-cli generate component

# Run development servers

dev-cli serve \`\`\`

### Shared Configurations

- TypeScript configurations
- ESLint rules
- Webpack configurations
- Babel presets
- Jest setup

## 🏗 Architecture

### Microfrontend Implementation

1. **Host Application**: Main application shell

   - Manages routing
   - Handles authentication
   - Orchestrates remote modules

2. **Remote Applications**: Independent features
   - Expose components via Module Federation
   - Can be deployed independently
   - Maintain their own state and routing

### Module Federation

- Dynamic loading of remote modules
- Shared dependencies management
- Runtime integration of components
- Version control of shared modules

## 🔒 Security

### Remote Module Protection

- Origin validation middleware
- Configurable access controls
- CORS protection
- Rate limiting support

### Best Practices

- Secure module loading
- Protected development endpoints
- Environment-based configurations
- Error boundary implementation

## 📦 Deployment

### Build Process

\`\`\`bash

# Production build

pnpm build

# Environment-specific builds

NODE_ENV=staging pnpm build \`\`\`

### Output

- Optimized bundles
- Source maps
- Asset optimization
- Cache management

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process
for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](license.md) file for details.

---

## 💬 Support

For questions and support, please open an issue in the GitHub repository.

⭐️ If you find this project helpful, please give it a star!
