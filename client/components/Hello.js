import React from 'react'
import SetHeaderTitle from './shared/SetHeaderTitle';
import PropTypes from 'prop-types';

const Hello = ({auth}) => {
  return (
    <div>
      <SetHeaderTitle>Home</SetHeaderTitle>
      <h1>
        {auth.isAuthenticated?
        "Hello, " + auth.currentUser.username
        :
        "Not logged in"}
      </h1>
    </div>
  )
}

Hello.propTypes = {
  auth: PropTypes.object.isRequired
}

export default Hello;
