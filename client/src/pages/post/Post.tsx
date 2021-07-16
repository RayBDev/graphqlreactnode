import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

import { AuthContext } from '../../context/authContext';
import { POST_CREATE } from '../../graphql/mutations';

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

   const { state } = useContext(AuthContext);

   // mutation
   const [postCreate] = useMutation(POST_CREATE, {
      // update cache
   });

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await axios.post(
            `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
            { image: imageURI },
            {
               headers: {
                  authtoken: state.user?.token,
               },
            },
         );

         const postInputValues = { ...values, image: response.data };
         await postCreate({ variables: { input: postInputValues } });
         setValues(initialState);
         setImageURI('');
         setLoading(false);
         toast.success('Post created successfully');
      } catch (error) {
         setLoading(false);
         toast.error(error);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setValues({ ...values, [e.target.name]: e.target.value });
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
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

   const { content } = values;

   const createForm = () => (
      <form onSubmit={handleSubmit}>
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
         <div className="grid grid-cols-12">
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
                  <div className="absolute top-3 right-3">
                     <img className="cursor-pointer" src="https://img.icons8.com/windows/30/000000/macos-close.png" />
                  </div>
                  {imageURI && <img src={imageURI} alt="" className="h-full" />}
               </div>
            </div>
            <div className="col-span-12">{createForm()}</div>
         </div>
      </div>
   );
};

export default Post;
