import React from 'react';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
// import components
import Home from './pages/home';

const client = new ApolloClient({
   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
   cache: new InMemoryCache(),
});

function App(): React.ReactElement {
   return (
      <ApolloProvider client={client}>
         <Home />
      </ApolloProvider>
   );
}

export default App;
