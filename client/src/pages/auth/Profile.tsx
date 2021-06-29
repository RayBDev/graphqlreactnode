import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';

import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';
import UserProfile from '../../components/forms/UserProfile';
import FileUpload from '../../components/FileUpload';

const Profile = (): React.ReactElement => {
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

   return (
      <div className="container">
         {loading ? <h4 className="text-red-500 mb-10">Loading...</h4> : <h4 className="mb-10">Profile</h4>}

         <FileUpload setLoading={setLoading} userUpdate={userUpdate} images={values.images} />

         <UserProfile {...values} loading={loading} handleChange={handleChange} handleSubmit={handleSubmit} />
      </div>
   );
};

export default Profile;
