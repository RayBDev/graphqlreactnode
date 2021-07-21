import React, { useContext } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { AuthContext } from '../context/authContext';
import { useHistory } from 'react-router-dom';
import { GET_ALL_POSTS } from '../graphql/queries';
import PostCard from '../components/PostCard';

function Home(): React.ReactElement {
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

   const { data, loading } = useQuery<AllPostsData>(GET_ALL_POSTS);
   const [fetchPosts, { data: posts }] = useLazyQuery<AllPostsData>(GET_ALL_POSTS);
   // access context
   const { state, dispatch } = useContext(AuthContext);
   // react router
   const history = useHistory();

   const updateUserName = () => {
      dispatch({
         type: 'LOGGED_IN_USER',
         payload: { user: { name: 'Ray Bernard' } },
      });
   };

   if (loading) return <p className="p-5">Loading...</p>;

   return (
      <div className="container p-4 mt-24">
         <div className="grid md:grid-cols-4 gap-16">
            {data && data.allPosts.map((post) => <PostCard post={post} key={post._id} />)}
            <button className="btn btn-primary" onClick={() => fetchPosts()}>
               Fetch Posts
            </button>
            {JSON.stringify(posts)}
            {JSON.stringify(state.user)}
            <button className="btn btn-primary" onClick={updateUserName}>
               Change User Name
            </button>
            {JSON.stringify(history)}
         </div>
      </div>
   );
}

export default Home;
