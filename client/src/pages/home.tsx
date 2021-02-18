import React from 'react';

import { useQuery, useLazyQuery, gql } from '@apollo/client';

const GET_ALL_POSTS = gql`
   {
      allPosts {
         id
         title
         description
      }
   }
`;

function Home(): React.ReactElement {
   type AllPosts = {
      /** post id received from graphql server */
      id: number;
      /** post title received from graphql server */
      title: string;
      /** post description received from graphql server */
      description: string;
   };

   type AllPostsData = {
      /** allposts received from gql server as an array */
      allPosts: AllPosts[];
   };

   const { data, loading } = useQuery<AllPostsData>(GET_ALL_POSTS);
   const [fetchPosts, { data: posts }] = useLazyQuery<AllPostsData>(GET_ALL_POSTS);

   if (loading) return <p className="p-5">Loading...</p>;

   return (
      <div className="container p-4">
         <div className="grid md:grid-cols-4 gap-4">
            {data &&
               data.allPosts.map((post) => (
                  <div className="flex flex-col rounded shadow-md p-5" key={post.id}>
                     <h4 className="mb-2">{post.title}</h4>
                     <p>{post.description}</p>
                  </div>
               ))}
            <button className="btn btn-primary" onClick={() => fetchPosts()}>
               Fetch Posts
            </button>
            {JSON.stringify(posts)}
         </div>
      </div>
   );
}

export default Home;
