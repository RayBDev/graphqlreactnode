import React from 'react';
import { Link } from 'react-router-dom';

type Image = {
   url: string;
   public_id: string;
};

type User = {
   _id: string;
   username: string;
   name: string;
   email: string;
   images: [Image];
   about: string;
   createdAt: string;
   updatedAt: string;
};

type Props = {
   user: User;
};

const UserCard = ({ user }: Props): React.ReactElement => {
   return (
      <div className="flex flex-col rounded shadow-md p-10">
         <div className="h-28 w-28 border border-gray-400 p-1 rounded mb-5 m-auto">
            <img src={user.images[0].url} alt={user.username} className="w-full" />
         </div>
         <Link to={`/user/${user.username}`}>
            <h4 className="mb-4 text-primary-300">@{user.username}</h4>
         </Link>
         <hr />
         <p className="my-5">{user.about}</p>
      </div>
   );
};

export default UserCard;
