import React from 'react';
import {
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import LoginForm from './LoginForm.jsx'



// class PrivateRoute extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render() {
//     const { Component, user, loggedIn} = this.props
//     console.log(this.props);
//     return (
//       <Route
//
//         render={props =>
//           loggedIn ? (
//             <Component {...props} />
//           ) : (
//             <LoginForm onUpdate={this.props.onUpdate} />
//           )
//         }
//       />
//     );
//   }
// }
//
// export default PrivateRoute;

const PrivateRoute = ({ component: Component, user: user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user.pub ? (
        <Component {...props} />
      ) : (
        <Redirect
         to={{
           pathname: "/login",
           state: { from: props.location }
         }}
       />
      )
    }
  />
);

export default PrivateRoute
