import React from 'react';
import { Redirect } from 'react-router-dom';

export default function({
	actions,
	location,
	match,
	items,
	id
}) {
	/*Redirect for MVP*/
	return (
		<Redirect to={`${match.url}/edit`} />
	);
}
