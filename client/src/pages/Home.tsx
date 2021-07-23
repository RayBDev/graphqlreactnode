import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { GET_ALL_POSTS, TOTAL_POSTS } from '../graphql/queries';
import PostCard from '../components/PostCard';
import PostPagination from '../components/PostPagination';

function Home(): React.ReactElement {
   const [page, setPage] = useState(1);

   type PostedBy = {
      /** ID of the user who made the post */
      _id: string;
      /** Username of the user you made the post */
      username: string;
   };

   type Image = {
      /** Post image url */
      url: string;
      /** Post image id */
      public_id: string;
   };

   type AllPosts = {
      /** post id received from graphql server */
      _id: string;
      /** post content received from graphql server */
      content: string;
      /** image of the post */
      image: Image;
      /** post description received from graphql server */
      postedBy: PostedBy;
   };

   type AllPostsData = {
      /** allposts received from gql server as an array */
      allPosts: AllPosts[];
   };

   const { data, loading } = useQuery<AllPostsData>(GET_ALL_POSTS, { variables: { page } });
   const { data: postCount } = useQuery(TOTAL_POSTS);

   // access context
   const { state } = useContext(AuthContext);

   if (loading) return <p className="p-5">Loading...</p>;

   return (
      <div className="container p-4 mt-24">
         <div className="grid md:grid-cols-4 gap-16 mb-5">
            {data && data.allPosts.map((post) => <PostCard post={post} key={post._id} />)}
         </div>
         <PostPagination page={page} setPage={setPage} postCount={postCount} />
         {JSON.stringify(state.user)}
      </div>
   );
}

export default Home;
