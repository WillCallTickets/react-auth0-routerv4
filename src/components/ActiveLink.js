import React from 'react';
import { Link } from 'react-router-dom';

// spread the props - but instead of method 1, use method 2 to define a default for activeClassName
// in method 2, by declaring activeClassName first, we can override this in props - last declaration wins/overwrites
const ActiveLink = function(props){
  // method 1
  // return <Link {...props} activeClassName="active-link" />;
  // method 2
  return <Link className="item" {...props} />;
}

export default ActiveLink;