import React from 'react';
import { useQuery } from '@apollo/client';
import { PUBLIC_PROFILE } from '../graphql/queries';
import { useParams } from 'react-router-dom';
import UserCard from '../components/UserCard';

const SingleUser = (): React.ReactElement => {
   type UserParams = {
      username: string;
   };
   const { username } = useParams<UserParams>();
   const { loading, data } = useQuery(PUBLIC_PROFILE, {
      variables: { username },
   });

   if (loading) return <p className="p-5">Loading...</p>;

   return (
      <div className="container p-4 mt-24">
         <UserCard user={data.publicProfile} />
      </div>
   );
};

export default SingleUser;
