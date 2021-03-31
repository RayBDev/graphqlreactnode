import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// import components
import Home from './pages/Home';
import Nav from './components/Nav';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

const client = new ApolloClient({
   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
   cache: new InMemoryCache(),
});

function App(): React.ReactElement {
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
