import React from 'react';
import { Provider } from 'react-redux';

import { store } from './src/store/reduxStore';
import Screens from './src/screens';

export default function App() {
	return (
		<Provider store={store}>
			<Screens />
		</Provider>
	);
}
