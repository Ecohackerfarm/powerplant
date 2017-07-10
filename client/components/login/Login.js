import React from 'react';
import {Link} from 'react-router-dom';

class Login extends React.Component {
  render() {
    return (
      <div>
        <form action="">
          <input type="text"/>
          <input type="text"/>
          <button>Login</button>
        </form>
        <Link to="/recover">Forgot password?</Link>
        <Link to="/register">Register</Link>
      </div>
    )
  }
}

export default Login;
