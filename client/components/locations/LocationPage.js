import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BedsPage from '../beds';

export default function({
	actions,
	location,
	match,
	items,
	id
}) {
	return (
		<Switch>
			<Route
				path={`${match.url}`}
				render={ props => (
					<BedsPage
						beds={items[id].beds}
						{...props}
					/>
				)}
			/>
		</Switch>
	);
}
