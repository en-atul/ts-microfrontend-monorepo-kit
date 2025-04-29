import React, { Suspense, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { toCall } from '@repo/utils/pathUtils';

const RemoteComponent = React.lazy(() => import('remoteApp/RemoteComponent'));

const App: React.FC = () => {
	useEffect(() => {
		toCall();
	}, []);
	return (
		<div>
			<h1>🚀 MF: Host App!</h1>
			<ErrorBoundary message="Failed to load Remote component. Please try again later.">
				<Suspense fallback={<div>Loading Remote Component...</div>}>
					<RemoteComponent />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default App;
