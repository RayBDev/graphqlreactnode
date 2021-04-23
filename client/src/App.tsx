import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { AuthContext } from './context/authContext';

// import components
import Home from './pages/Home';
import Nav from './components/Nav';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import PrivateRoute from './components/PrivateRoute';
import Post from './pages/post/Post';
import Profile from './pages/auth/Profile';
import PasswordForgot from './pages/auth/PasswordForgot';
import PasswordReset from './pages/auth/PasswordReset';

function App(): React.ReactElement {
   const { state } = useContext(AuthContext);
   const { user } = state;

   const httpLink = createHttpLink({
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
   });

   const authLink = setContext((_, { headers }) => {
      return {
         headers: {
            ...headers,
            authtoken: user ? user.token : '',
         },
      };
   });

   const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
   });

   return (
      <ApolloProvider client={client}>
         <Nav />
         <ToastContainer position="bottom-right" />
         <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/password/forgot" component={PasswordForgot} />
            <Route exact path="/password/reset" component={PasswordReset} />
            <PrivateRoute exact path="/password/update" component={PasswordUpdate} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/post/create" component={Post} />
         </Switch>
      </ApolloProvider>
   );
}

export default App;
