import Button from '@repo/ui/Button';
import React from 'react';

export default function RemoteComponent() {
	const [count, setCount] = React.useState(0);

	const onIncrement = () => {
		setCount((prev) => prev + 1);
	};

	const onDecrement = () => {
		setCount((prev) => prev - 1);
	};

	return (
		<div>
			<h1>Remote Component</h1>
			<p>Count: {count}</p>
			<div>
				<Button onClick={onIncrement}>Increment</Button>
				<Button onClick={onDecrement}>Decrement</Button>
			</div>
		</div>
	);
}
