import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH } from '../graphql/queries';
import PostCard from './PostCard';

const SearchResults = (): React.ReactElement => {
   // Route query
   const { query }: { query: string } = useParams();

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

   type Post = {
      /** post id received from graphql server */
      _id: string;
      /** post content received from graphql server */
      content: string;
      /** image of the post */
      image: Image;
      /** post description received from graphql server */
      postedBy: PostedBy;
   };

   type SearchData = {
      /** allposts received from gql server as an array */
      search: Post[];
   };

   // gql query
   const { data, loading } = useQuery<SearchData>(SEARCH, { variables: { query } });

   if (data && !data.search.length) {
      return (
         <div className="container my-24">
            <h4 className="text-red-500 mb-10">No Results Found</h4>
         </div>
      );
   }

   return (
      <div className="container my-24">
         {loading ? <h4 className="text-red-500 mb-10">Loading...</h4> : <h4 className="mb-10">Search Results</h4>}
         <div className="grid md:grid-cols-4 gap-16 mb-5">
            {data && data.search.map((post) => <PostCard key={post._id} post={post} />)}
         </div>
      </div>
   );
};

export default SearchResults;
