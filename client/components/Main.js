import React from 'react';
import { Redirect, Route, Switch, withRouter} from 'react-router-dom';
import Login from './login/LoginPage';
import Register from './register/RegisterPage';
import Recover from './recover/Recover';
import LocationsPage from './locations/LocationsPage';
import AboutPage from './about/AboutPage'
//Changes for MVP
import { saveLocationRequest } from '../actions/locationActions';

class Main extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			waitForMVP : true
		}
	}
	componentWillMount(){

		//for MVP generate default location
		if ( typeof this.props.store.getState().locations[0] === 'undefined' ){
			this.props.store.dispatch(saveLocationRequest(
				{
					'name':'Minimal Viable Product',
					'loc':{
						'address':'1015 15th St NW #750, Washington, DC 20005, USA',
						'coordinates':[-77.0340315,38.9031004]
					},
					'beds':{}
				}
			)).then(()=>{
				this.setState({
					waitForMVP : false
				});
			});
		} else {
			this.setState({
				waitForMVP : false
			});
		}
	}
	render() {
		if (this.state.waitForMVP){
			return <p>Loading...</p>;
		} else
			return (
				<div>
					<Switch>
					  {/*For MVP Redirect to default location*/}
						<Route
							exact
							path="/"
							render={() => <Redirect path="/" to="/locations/0/beds/add"/>}
						/>
						<Route path="/login" component={Login} />
						<Route path="/register" component={Register} />
						<Route path="/recover" component={Recover} />
						<Route path="/locations" component={LocationsPage} />
						<Route path="/about" component={AboutPage} />
					</Switch>
				</div>
			);
	}
}

export default withRouter(Main);
