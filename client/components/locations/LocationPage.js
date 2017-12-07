import React from 'react';
import { Switch, Route } from 'react-router-dom';
import BedsPage from '../beds';

export default function({actions, location, match}) {
	return (
		<Switch>
			<Route
					path={`${match.url}`}
					component={BedsPage}/>
		</Switch>
	)
}
