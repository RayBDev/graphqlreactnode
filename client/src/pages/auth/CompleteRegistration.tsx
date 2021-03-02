import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';

const CompleteRegistration = (): React.ReactElement => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const history = useHistory();

   const useQuery = () => new URLSearchParams(useLocation().search);

   const query = useQuery();

   useEffect(() => {
      setEmail(query.get('email') || '');
   }, [history]);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // validation
      if (!email || !password) {
         toast.error('Email and password is required');
         return setLoading(false);
      }
      try {
         const result = await auth.signInWithEmailLink(email, window.location.href);
         if (result.user?.emailVerified) {
            // get current logged in user
            const user = auth.currentUser;
            await user?.updatePassword(password);

            // dispatch user with token and email
         }
      } catch (error) {
         console.log('register complete error', error.message);
         setLoading(false);
         toast.error(error.message);
      }
   };

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Register</h4>}
         <form onSubmit={handleSubmit} className="mt-5">
            <div className="mb-3">
               <label htmlFor="email">Email Address</label>
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
                  placeholder="Enter Email"
                  disabled
               />
            </div>
            <div className="mb-3">
               <label htmlFor="email">Password</label>
               <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300"
                  placeholder="Enter Password"
                  disabled={loading}
               />
            </div>
            <button className="btn btn-primary" disabled={!email || loading}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default CompleteRegistration;
