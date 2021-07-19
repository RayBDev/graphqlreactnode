import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

import { AuthContext } from '../../context/authContext';
import { POST_CREATE } from '../../graphql/mutations';
import { POSTS_BY_USER } from '../../graphql/queries';
import PostCard from '../../components/PostCard';

const initialState = {
   content: '',
   image: {
      url: 'https://res.cloudinary.com/tacticapps/image/upload/v1624277410/sample.jpg',
      public_id: 'sample',
   },
};

const Post = (): React.ReactElement => {
   const [values, setValues] = useState(initialState);
   const [imageURI, setImageURI] = useState('');
   const [loading, setLoading] = useState(false);

   // Get the AuthContext state so we can get the user token to pass to the backend
   const { state } = useContext(AuthContext);

   // Type Definitions for the data we receive from the Query
   type PostedBy = {
      /** ID of the user who made the post */
      _id: number;
      /** Username of the user you made the post */
      username: string;
   };

   type Image = {
      /** Post image url */
      url: string;
      /** Post image id */
      public_id: string;
   };

   type PostData = {
      /** post id received from graphql server */
      _id: number;
      /** post content received from graphql server */
      content: string;
      /** image of the post */
      image: Image;
      /** post description received from graphql server */
      postedBy: PostedBy;
   };

   type PostsByUser = {
      postsByUser: PostData[];
   };

   // query to get all posts by user
   const { data: posts } = useQuery(POSTS_BY_USER);

   // mutation to create a new post
   const [postCreate] = useMutation(POST_CREATE, {
      // update cache
      update: (cache, { data: { postCreate } }) => {
         // Read current data from the cache
         const data: PostsByUser | null = cache.readQuery({
            query: POSTS_BY_USER,
         });

         // Write data to the cache using the mutation result and the current cached data. The query argument is to determine the shape of the cache
         if (data && data.postsByUser) {
            // write Query to cache
            cache.writeQuery({
               query: POSTS_BY_USER,
               data: {
                  postsByUser: [postCreate, ...data.postsByUser],
               },
            });
         }
      },
   });

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         // Send image URI to our backend to add the resized image in the change handler to Cloudinary
         const response = await axios.post(
            `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
            { image: imageURI },
            {
               headers: {
                  authtoken: state.user?.token,
               },
            },
         );

         // Variable to store our values in state and add the image data provided back from Cloudinary
         const postInputValues = { ...values, image: response.data };
         // Send the values above to our backend to create a new post via GQL mutation
         await postCreate({ variables: { input: postInputValues } });
         // Reset our state values to default
         setValues(initialState);
         // Clear the image URI in state
         setImageURI('');
         // Set loading to false and toast success
         setLoading(false);
         toast.success('Post created successfully');
      } catch (error) {
         // Catch errors from Cloudinary and our backend server
         setLoading(false);
         toast.error(error);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      // Handle change for textarea but doing it in a more universal e.target.name way in case we want to add more fields
      setValues({ ...values, [e.target.name]: e.target.value });
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
         // If a file exists then resize it and save the URI in the state
         if (e.target.files && e.target.files[0]) {
            Resizer.imageFileResizer(
               e.target.files[0],
               300,
               300,
               'JPEG',
               100,
               0,
               (uri) => {
                  if (typeof uri === 'string') {
                     setImageURI(uri);
                  }
               },
               'base64',
               200,
               200,
            );
         }
      } catch {
         toast.error('There is a problem with that file. Please try a different image.');
      }
   };

   // Destructure post content from state
   const { content } = values;

   // Form JSX for the textarea
   const createForm = () => (
      <form onSubmit={handleSubmit}>
         <label htmlFor="content" className="text-primary-300">
            Post Content
         </label>
         <textarea
            value={content}
            onChange={handleChange}
            name="content"
            rows={10}
            placeholder="Write something fun"
            className="mt-2 block w-full px-3 border-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
            maxLength={150}
            disabled={loading}
         ></textarea>
         <button className="btn btn-primary" type="submit" disabled={loading || !content}>
            Post
         </button>
      </form>
   );

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Create</h4>};
         <div className="grid grid-cols-12 mb-10">
            <div className="col-span-3">
               <div className="mb-3">
                  <label className="text-primary-300 btn btn-primary cursor-pointer">
                     Add Post Image
                     <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        placeholder="Image"
                        className="mt-2 px-0.5 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70 hidden"
                     />
                  </label>
               </div>
            </div>
            <div className="col-span-9">
               <div className="float-right h-36 relative">
                  {/* Remove Image with X button */}
                  <div className="absolute top-3 right-3">
                     <img
                        className="cursor-pointer"
                        src="https://img.icons8.com/windows/30/000000/macos-close.png"
                        onClick={() => setImageURI('')}
                     />
                  </div>
                  {imageURI && <img src={imageURI} alt="" className="h-full" />}
               </div>
            </div>
            <div className="col-span-12">{createForm()}</div>
         </div>
         <div className="grid md:grid-cols-3 gap-16">
            {/* Loop through post data received from the GQL query */}
            {posts && posts.postsByUser.map((post: PostData) => <PostCard post={post} key={post._id} />)}
         </div>
      </div>
   );
};

export default Post;
