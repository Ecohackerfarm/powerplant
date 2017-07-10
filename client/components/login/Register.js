import React from 'react';

class Register extends React.Component {
  render() {
    return (
      <form action="">
        <input id="username" hint="Username" type="text"/>
        <input id="email" hint="Email" type="text"/>
        <input id="password" hint="Password" type="password"/>
        <button>Register</button>
      </form>
    )
  }
}

export default Register;
