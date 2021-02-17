import React, { useState } from 'react';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
   cache: new InMemoryCache(),
});

function App(): React.ReactElement {
   const [posts, setPosts] = useState([]);
   client
      .query({
         query: gql`
            {
               allPosts {
                  id
                  title
                  description
               }
            }
         `,
      })
      .then((result) => setPosts(result.data.allPosts));

   type Post = {
      /** post id received from graphql server */
      id: number;
      /** post title received from graphql server */
      title: string;
      /** post description received from graphql server */
      description: string;
   };

   return (
      <div className="container p-4">
         <div className="grid md:grid-cols-4 gap-4">
            {posts.map((post: Post) => (
               <div className="flex flex-col rounded shadow-md p-5" key={post.id}>
                  <h4 className="mb-2">{post.title}</h4>
                  <p>{post.description}</p>
               </div>
            ))}
         </div>
      </div>
   );
}

export default App;
