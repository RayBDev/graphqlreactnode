import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';

const Profile = (): React.ReactElement => {
   // State for storing form values
   const [values, setValues] = useState({
      username: '',
      name: '',
      email: '',
      about: '',
      images: [],
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
   const [userUpdate] = useMutation(USER_UPDATE, {
      onCompleted: () => {
         toast.success('Profile updated');
      },
      onError: (error) => {
         toast.error(`There was an error updating your profile. Error: ${error}`);
      },
   });

   // Destructure the state values for easy use in the form JSX
   const { username, name, email, about } = values;

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // Execute the mutation using the state values as the expected "input". "Input" is predefined by the mutation setup in the backend
      userUpdate({ variables: { input: values } });
      setLoading(false);
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      setValues({ ...values, [e.target.name]: e.target.value });
   };

   const handleImageChange = () => {
      //
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
            <label className="text-primary-300">Image</label>
            <input
               type="file"
               accept="image/*"
               onChange={handleImageChange}
               placeholder="Image"
               className="mt-2 block px-0.5 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
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
         <h4>Profile</h4>
         {profileUpdateForm}
      </div>
   );
};

export default Profile;
