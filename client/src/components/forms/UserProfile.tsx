import React from 'react';

type Props = {
   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
   handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
   username: string;
   name: string;
   email: string;
   about: string;
   loading: boolean;
};

const UserProfile = ({
   handleSubmit,
   handleChange,
   username,
   name,
   email,
   about,
   loading,
}: Props): React.ReactElement => {
   return (
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
};

export default UserProfile;
