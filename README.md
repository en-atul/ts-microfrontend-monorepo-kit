# 🚀 Microfrontend Monorepo — Webpack 5 + Module Federation + React + TypeScript

> In Progress

A full-featured monorepo boilerplate for building scalable **microfrontend** applications using
**Webpack Module Federation**, **React**, **TypeScript**, and support for **CSS/SCSS Modules**.  
Includes secure Express middleware to protect remote module access based on allowed origins.

---

## ✨ Features

- 🛠 **Webpack 5** + **Module Federation**: Share components between independently deployed apps.
- ⚛️ **React 18** + **TypeScript**: Strong typing and best-in-class developer experience.
- 🎨 **CSS**, **SCSS**, and **CSS Modules**: Flexible styling support out-of-the-box.
- 🔥 **Hot Module Replacement**: Fast refresh support for instant development feedback.
- 🔒 **Secured Microfrontends**: Express middleware validates allowed origins.
- 📦 **Optimized Builds**: Production-ready configs with tree shaking and code splitting.

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/)

---

## 📦 Installation

1. **Clone this repository**

```bash
git clone https://github.com/your-username/ts-microfrontend-monorepo-kit.git
cd microfrontend-monorepo
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

---

## ⚡️ Development Workflow

This monorepo includes multiple microfrontend apps (both hosts and remotes). You can run them
separately or together.

### 🧑‍✈️ Start the Host App

```bash
npm run start:host
# or
pnpm start:host
```

> 🌐 Available at [http://localhost:3000](http://localhost:3000)

### 🛰️ Start the Remote App

```bash
npm run start:remote
# or
pnpm start:remote
```

> 🌐 Available at [http://localhost:3001](http://localhost:3001)

---

## 🔐 Securing Remote Modules

Remote apps are served using an **Express** server with **custom middleware** to protect module
federation endpoints.

Middleware functionality:

- ✅ Only allow requests from whitelisted origins
- 🛡️ Block unauthorized or suspicious requests
- 🧩 Easily customizable to add auth, IP restrictions, etc.

> 📝 Modify `server/middleware/allowedOrigins.ts` to adjust the security logic.

---

## 🔧 Webpack Configuration Overview

- **webpack.common.ts**: Shared Webpack config.
- **webpack.dev.ts**: Development config with source maps and HMR.
- **webpack.prod.ts**: Optimized production build with tree shaking and minification.
- **ModuleFederationPlugin**: Used to expose or consume remote modules dynamically at runtime.

Example Remote Config:

```ts
new ModuleFederationPlugin({
	name: 'remoteApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./Button': './src/components/Button',
	},
	shared: {
		react: { singleton: true, eager: true },
		'react-dom': { singleton: true, eager: true },
	},
});
```

Example Host Usage:

```tsx
const RemoteButton = React.lazy(() => import('remoteApp/Button'));

<Suspense fallback={<div>Loading...</div>}>
	<RemoteButton />
</Suspense>;
```

---

## 🏗️ Building for Production

### Build Host App

```bash
npm run build:host
# or
pnpm build:host
```

### Build Remote App

```bash
npm run build:remote
# or
pnpm build:remote
```

Outputs are placed in the `dist/` directory, ready for deployment 🚀.

---

## 🌐 Multi-Environment Support

Environment-specific builds are easy to configure using `NODE_ENV` values (e.g., `development`,
`staging`, `production`).

Example (for staging):

```bash
"build:staging:host": "NODE_ENV=staging webpack --config webpack.prod.ts"
```

---

## 💡 How Microfrontends Work

1. **Remote apps** expose components using `ModuleFederationPlugin`.
2. **Host apps** dynamically load these components using `React.lazy` at runtime.
3. **Express middleware** ensures only trusted requests reach remote modules.
4. **Independent deployment**: Update one app without affecting the others!

---

## 🧠 Developer Tips

- 🔥 Use Hot Module Replacement for faster dev cycles.
- 🔒 Keep the middleware updated for better security practices.
- ⚙️ Customize Webpack settings as needed for new features (e.g., SASS loader tweaks).
- 🧪 Wrap remote components in error boundaries for safer imports.

Example Error Handling:

```tsx
<Suspense fallback={<div>Loading...</div>}>
	<ErrorBoundary fallback={<div>Failed to load remote module.</div>}>
		<RemoteComponent />
	</ErrorBoundary>
</Suspense>
```

---

## 💬 Questions? Feedback?

Feel free to open an issue, suggest improvements, or ⭐️ the repo if you find it helpful!

---
