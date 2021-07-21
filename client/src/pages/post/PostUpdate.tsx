import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import Resizer from 'react-image-file-resizer';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { AuthContext } from '../../context/authContext';
import { SINGLE_POST } from '../../graphql/queries';
import { POST_UPDATE } from '../../graphql/mutations';

const PostUpdate = (): React.ReactElement => {
   const [values, setValues] = useState({
      _id: '',
      content: '',
      image: {
         url: '',
         public_id: '',
      },
   });
   const [imageURI, setImageURI] = useState('');
   const [loading, setLoading] = useState(false);

   // Get the AuthContext state so we can get the user token to pass to the backend
   const { state } = useContext(AuthContext);

   // Destructure values
   const { content, image } = values;

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
         });
      }
   }, [singlePost]);

   // Get the singlePost by executing the useLazyQuery we created above
   useEffect(() => {
      getSinglePost({ variables: { postId: postid } });
   }, []);

   const [postUpdate] = useMutation(POST_UPDATE);

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

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      // Handle change for textarea but doing it in a more universal e.target.name way in case we want to add more fields
      setValues({ ...values, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         let postInputValues = { ...values };
         if (imageURI) {
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
            postInputValues = { ...values, image: response.data };

            // Remove the current post image as long as it's not the default sample image
            if (image.public_id !== 'sample') {
               await axios.post(
                  `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
                  { public_id: image.public_id },
                  {
                     headers: {
                        authtoken: state.user?.token,
                     },
                  },
               );
            }
         }
         // Send the values above to our backend to update the post via GQL mutation
         await postUpdate({ variables: { input: postInputValues } });
         console.log('post updated');
         // Set our state values to the new values
         setValues(postInputValues);
         // Clear the image URI in state
         setImageURI('');
         // Set loading to false and toast success
         setLoading(false);
         toast.success('Post updated successfully');
      } catch (error) {
         // Catch errors from Cloudinary and our backend server
         setLoading(false);
         toast.error(error);
      }
   };

   // Form JSX for the textarea
   const updateForm = () => (
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

   const imageDisplay = (): JSX.Element => {
      if (imageURI) {
         return <img src={imageURI} alt="" className="h-full" />;
      } else {
         return <img src={image.url} alt="" className="h-full" />;
      }
   };

   return (
      <div className="p-5">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Update Post</h4>}
         <div className="grid grid-cols-12 my-10">
            <div className="col-span-3">
               <div className="mb-3">
                  <label className="text-primary-300 btn btn-primary cursor-pointer">
                     Change Post Image
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
                  {imageDisplay()}
               </div>
            </div>
            <div className="col-span-12">{updateForm()}</div>
         </div>
      </div>
   );
};

export default PostUpdate;
