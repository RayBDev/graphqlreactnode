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
         </Switch>
      </ApolloProvider>
   );
}

export default App;
