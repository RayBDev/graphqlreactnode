import React, { useEffect, useMemo, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import { SINGLE_POST } from '../../graphql/queries';
import PostCard from '../../components/PostCard';

const SinglePost = (): React.ReactElement => {
   const [values, setValues] = useState({
      _id: '',
      content: '',
      image: {
         url: '',
         public_id: '',
      },
      postedBy: {
         _id: '',
         username: '',
      },
   });

   // GetSinglePost through useLazyQuery so we can execute the query within the useEffect hook
   const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);

   // Get the postid from the URL parameter as specified in our routes within App.tsx
   const { postid }: { postid: string } = useParams();

   // Set the state values once and only when singlePost changes. Avoids setting values constantly when state changes.
   useMemo(() => {
      if (singlePost) {
         setValues({
            ...values,
            _id: singlePost.singlePost._id,
            content: singlePost.singlePost.content,
            image: singlePost.singlePost.image,
            postedBy: singlePost.singlePost.postedBy,
         });
      }
   }, [singlePost]);

   // Get the singlePost by executing the useLazyQuery we created above
   useEffect(() => {
      getSinglePost({ variables: { postId: postid } });
   }, []);

   return (
      <div className="container p-4 mt-24">
         <PostCard post={values} />
      </div>
   );
};

export default SinglePost;
