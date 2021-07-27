import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, ApolloLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { RetryLink } from '@apollo/client/link/retry';

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
import Users from './pages/Users';
import SingleUser from './pages/SingleUser';
import PostUpdate from './pages/post/PostUpdate';
import SinglePost from './pages/post/SinglePost';
import SearchResults from './components/SearchResults';

function App(): React.ReactElement {
   // Grab the AuthContext state and destructure the user object from it
   const { state } = useContext(AuthContext);
   const { user } = state;

   // Create the Apollo httpLink between the frontend and the backend URI
   const httpLink = createHttpLink({
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
   });

   // Set the auth token in the headers for Apollo to send along when it makes requests to the backend
   const authLink = setContext((_, { headers }) => {
      return {
         headers: {
            ...headers,
            authtoken: user ? user.token : '',
         },
      };
   });

   // Remove the __typename field thats auto-added when Apollo GraphQL sends certain form fields to the backend. In this app it's removing __typename from the images form field in the Profile page.
   const cleanTypeName = new ApolloLink((operation, forward) => {
      if (operation.variables) {
         const omitTypename = (key: string, value: string) => (key === '__typename' ? undefined : value);
         operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
      }
      return forward(operation).map((data) => {
         return data;
      });
   });

   // Create a Web Socket Link for our realtime subscription server
   const wsLink = new WebSocketLink({
      uri: process.env.REACT_APP_GRAPHQL_WS_ENDPOINT,
      options: {
         reconnect: true,
      },
   });

   // Use the split function to use either WebSockets or HTTP based on the type of operation being executed.
   const splitLink = split(
      ({ query }) => {
         const definition = getMainDefinition(query);
         return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink,
   );

   // Build our backend link by combining all the links we created above. We clean the __typename, make sure the client retries the server if something went wrong, send any auth token headers, and finally link to the backend based on whether it's a subscription or http operation.
   const httpLinkWithErrorHandling = ApolloLink.from([cleanTypeName, new RetryLink(), authLink, splitLink]);

   // Create the Apollo client by using the link we built above and set up a memory cache for the queries we make to speed up duplicate queries.
   const client = new ApolloClient({
      link: httpLinkWithErrorHandling,
      cache: new InMemoryCache(),
   });

   return (
      <ApolloProvider client={client}>
         <Nav />
         <ToastContainer position="bottom-right" />
         <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/password/forgot" component={PasswordForgot} />
            <Route exact path="/password/reset" component={PasswordReset} />
            <PrivateRoute exact path="/password/update" component={PasswordUpdate} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/post/create" component={Post} />
            <PrivateRoute exact path="/post/update/:postid" component={PostUpdate} />
            <Route exact path="/user/:username" component={SingleUser} />
            <Route exact path="/post/:postid" component={SinglePost} />
            <Route exact path="/search/:query" component={SearchResults} />
         </Switch>
      </ApolloProvider>
   );
}

export default App;
