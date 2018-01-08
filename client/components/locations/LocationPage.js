import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
		  <Route exact path={`${match.path}`}>
		    {/*Redirect for MVP later here should be a Dashboard*/}
		    <Redirect to={`${match.url}/beds`}/>
		  </Route>
			<Route
				path={`${match.path}/beds`}
				render={ props => (
					<BedsPage
						beds={items[id].beds}
						locationId={id}
						{...props}
					/>
				)}
			/>
		</Switch>
	);
}
