import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import UserCard from '../components/UserCard';

function Users(): React.ReactElement {
   type Image = {
      url: string;
      public_id: string;
   };

   type AllUsers = {
      _id: string;
      username: string;
      name: string;
      email: string;
      images: [Image];
      about: string;
      createdAt: string;
      updatedAt: string;
   };

   type AllUserData = {
      /** allUsers received from gql server as an array */
      allUsers: AllUsers[];
   };

   const { data, loading } = useQuery<AllUserData>(GET_ALL_USERS);

   if (loading) return <p className="p-5">Loading...</p>;

   return (
      <div className="container p-4 mt-24">
         <div className="grid md:grid-cols-4 gap-16">
            {data && data.allUsers.map((user) => <UserCard user={user} key={user._id} />)}
         </div>
      </div>
   );
}

export default Users;
