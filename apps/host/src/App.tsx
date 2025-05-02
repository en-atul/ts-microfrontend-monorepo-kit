import { toCall } from '@repo/utils/pathUtils';
import React, { Suspense, useEffect } from 'react';

import ErrorBoundary from './ErrorBoundary';

const RemoteComponent = React.lazy(() => import('remoteApp/RemoteComponent'));

const App: React.FC = () => {
	useEffect(() => {
		toCall();
	}, []);

	const TITLE = '🚀 MF: Host App!';

	return (
		<div>
			<h1>{TITLE}</h1>
			<ErrorBoundary message="Failed to load Remote component. Please try again later.">
				<Suspense fallback={<div>Loading Remote Component...</div>}>
					<RemoteComponent />
				</Suspense>
			</ErrorBoundary>
		</div>
	);
};

export default App;
