import React, { useState, useMemo, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';
import { AuthContext } from '../../context/authContext';

const Profile = (): React.ReactElement => {
   // Get state from AuthContext
   const { state } = useContext(AuthContext);
   // State for storing form values
   const [values, setValues] = useState({
      username: '',
      name: '',
      email: '',
      about: '',
      images: [{ url: '', public_id: '' }],
   });

   // State for setting loading when handleSubmit button is clicked
   const [loading, setLoading] = useState(false);

   // Execute the GQL query and destructure the data object
   const { data, loading: dataLoading } = useQuery(PROFILE);

   // Set the form values in state only once and again only if data changes. Data is memoized to avoid setting state on re-renders.
   useMemo(() => {
      if (data && !dataLoading) {
         setValues({
            ...values,
            username: data.profile.username,
            name: data.profile.name,
            email: data.profile.email,
            about: data.profile.about,
            images: data.profile.images,
         });
      }
   }, [data]);

   // Mutation
   const [userUpdate] = useMutation(USER_UPDATE);

   // Destructure the state values for easy use in the form JSX
   const { username, name, email, about, images } = values;

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // Execute the mutation using the state values as the expected "input". "Input" is predefined by the mutation setup in the backend
      try {
         await userUpdate({ variables: { input: values } });
         toast.success('Profile updated');
      } catch (error) {
         toast.error(`There was an error updating your profile. Error: ${error}`);
      }
      setLoading(false);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      setValues({ ...values, [e.target.name]: e.target.value });
   };

   const fileResizeAndUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Check if there are any files within the event to prevent null and also check the first file in the array
      if (e.target.files && e.target.files[0]) {
         try {
            setLoading(true);
            // Apply resizer properties to the file and get a URI
            Resizer.imageFileResizer(
               e.target.files[0],
               300,
               300,
               'JPEG',
               100,
               0,
               async (uri) => {
                  // Send the URI and auth credentials to the backend REST endpoint for upload to cloudinary
                  try {
                     const response = await axios.post(
                        `${process.env.REACT_APP_REST_ENDPOINT}/uploadimages`,
                        { image: uri },
                        {
                           headers: {
                              authtoken: state.user?.token,
                           },
                        },
                     );
                     // Call the userUpdate mutation and add the current and new image data from the response received
                     await userUpdate({
                        variables: {
                           input: {
                              images: [...images, response.data],
                           },
                        },
                     });
                     // Set Loading to false which will also trigger the useQuery hook to fire and update the state with the new image data that was just added
                     setLoading(false);
                     toast.success('Image Upload Successful');
                  } catch (error) {
                     // Catch error if either our backend or Cloudinary is down
                     toast.error(`Image Upload Failed. Our servers are down. Error: ${error}`);
                     setLoading(false);
                  }
               },
               'base64',
               200,
               200,
            );
         } catch (err) {
            console.log(err);
         }
      }
   };

   const handleImageRemove = async (public_id: string) => {
      setLoading(true);
      try {
         // Send the Public_ID of the image and auth details to our REST endpoint which will remove the image from Cloudinary
         await axios.post(
            `${process.env.REACT_APP_REST_ENDPOINT}/removeimage`,
            { public_id },
            {
               headers: {
                  authtoken: state.user?.token,
               },
            },
         );

         // Loop through the images state and remove the image with matching public_ic
         const filteredImages = images.filter((image) => {
            return image.public_id !== public_id;
         });

         // Send the newly filtered image array to our GQL backend with the useMutation hook
         await userUpdate({
            variables: {
               input: {
                  images: filteredImages,
               },
            },
         });

         // Set Loading to false which will trigger useQuery hook on re-render to update state to the newest image data
         setLoading(false);
         toast.success('Image deleted successfully!');
      } catch {
         setLoading(false);
         toast.error('There was a problem deleting your image.');
      }
   };

   const profileUpdateForm = (
      <form onSubmit={handleSubmit} className="mt-5">
         <div className="mb-3">
            <label htmlFor="username" className="text-primary-300">
               Username
            </label>
            <input
               type="text"
               name="username"
               value={username}
               onChange={handleChange}
               placeholder="Username"
               className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
               disabled={loading}
            />
         </div>
         <div className="mb-3">
            <label htmlFor="name" className="text-primary-300">
               Name
            </label>
            <input
               type="text"
               name="name"
               value={name}
               onChange={handleChange}
               placeholder="Name"
               className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
               disabled={loading}
            />
         </div>
         <div className="mb-3">
            <label htmlFor="email" className="text-primary-300">
               Email
            </label>
            <input
               type="email"
               name="email"
               value={email}
               onChange={handleChange}
               placeholder="Email"
               className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
               disabled
            />
         </div>

         <div className="mb-3">
            <label htmlFor="about" className="text-primary-300">
               About
            </label>
            <textarea
               name="about"
               value={about}
               onChange={handleChange}
               placeholder="About"
               className="mt-2 block w-full px-3 border-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
               disabled={loading}
            />
         </div>
         <button className="btn btn-primary" type="submit" disabled={!email || loading}>
            Submit
         </button>
      </form>
   );

   return (
      <div className="container">
         {loading ? <h4 className="text-red-500 mb-10">Loading...</h4> : <h4 className="mb-10">Profile</h4>}
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
               <div className="mb-3">
                  <label className="text-primary-300 btn btn-primary cursor-pointer">
                     Upload Image
                     <input
                        type="file"
                        accept="image/*"
                        onChange={fileResizeAndUpload}
                        placeholder="Image"
                        className="mt-2 px-0.5 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70 hidden"
                     />
                  </label>
               </div>
            </div>
            <div className="col-span-9">
               {images.map((image) => (
                  <div key={image.public_id} className="float-right h-36 relative">
                     <div className="absolute top-3 right-3">
                        <img
                           className="cursor-pointer"
                           src="https://img.icons8.com/windows/30/000000/macos-close.png"
                           onClick={() => handleImageRemove(image.public_id)}
                        />
                     </div>
                     <img src={image.url} alt={image.public_id} className="h-full" />
                  </div>
               ))}
            </div>
         </div>
         {profileUpdateForm}
      </div>
   );
};

export default Profile;
