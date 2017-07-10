import React from 'react'
import {Link} from 'react-router-dom';

export default () => {
  console.log("Rendering hello");
  return <Link to="/login">LOGIN</Link>
}
