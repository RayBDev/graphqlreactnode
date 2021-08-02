import React, { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_ALL_POSTS, TOTAL_POSTS } from '../graphql/queries';
import { POST_ADDED, POST_UPDATED, POST_DELETED } from '../graphql/subscriptions';
import PostCard from '../components/PostCard';
import PostPagination from '../components/PostPagination';
import { toast } from 'react-toastify';

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

   // Queries
   const { data, loading, refetch } = useQuery<AllPostsData>(GET_ALL_POSTS, {
      variables: { page },
      fetchPolicy: 'cache-and-network',
   });
   // const { data: nextPageData } = useQuery<AllPostsData>(GET_ALL_POSTS, { variables: { page: page + 1 } });
   const { data: postCount } = useQuery(TOTAL_POSTS);

   // Subscriptions

   // Post Added
   useSubscription(POST_ADDED, {
      onSubscriptionData: ({ client: { cache }, subscriptionData: { data } }) => {
         // readQuery from cache
         const queryData: AllPostsData | null = cache.readQuery({
            query: GET_ALL_POSTS,
            variables: { page },
         });

         // write back to cache
         if (queryData && queryData.allPosts) {
            // Remove the last post from the page before adding the new post for consistent UI experience
            const queryDataLessOne = [];
            for (let i = 0; i < queryData.allPosts.length - 1; i++) {
               queryDataLessOne.push(queryData.allPosts[i]);
            }

            // Write to cache with new post and array with one removed post
            cache.writeQuery({
               query: GET_ALL_POSTS,
               variables: { page },
               data: {
                  allPosts: [data.postAdded, ...queryDataLessOne],
               },
            });
         }

         // May need to refetch all posts to update ui when several posts are added at once. Avoiding this for now to avoid multiple server calls. UselazyQuery here if necessary.

         // show toast notification
         toast.success('New Post!');
      },
   });

   // POST UPDATED
   useSubscription(POST_UPDATED, {
      onSubscriptionData: () => toast.success('Post Updated!'),
   });

   // POST DELETED
   useSubscription(POST_DELETED, {
      onSubscriptionData: () => {
         /* // readQuery from cache
         const queryData: AllPostsData | null = cache.readQuery({
            query: GET_ALL_POSTS,
            variables: { page },
         });

         if (queryData && queryData.allPosts) {
            console.log(nextPageData);
            const filteredPosts = queryData.allPosts.filter((post) => post._id !== data.postDeleted._id);

            if (nextPageData && nextPageData.allPosts) filteredPosts.push(nextPageData?.allPosts[0]);

            // Write to cache with new post and array with one removed post
            cache.writeQuery({
               query: GET_ALL_POSTS,
               variables: { page },
               data: {
                  allPosts: filteredPosts,
               },
            });
         } */

         refetch();

         // show toast notification
         toast.error('Post Deleted!');
      },
   });

   if (loading) return <p className="p-5">Loading...</p>;

   return (
      <div className="container p-4 mt-24">
         <div className="grid md:grid-cols-4 gap-16 mb-5">
            {data && data.allPosts.map((post) => <PostCard post={post} key={post._id} />)}
         </div>
         <PostPagination page={page} setPage={setPage} postCount={postCount} />
      </div>
   );
}

export default Home;
