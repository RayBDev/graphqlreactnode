import React, { useContext, useEffect, useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { auth } from '../firebase';

const PrivateRoute = ({ ...rest }): React.ReactElement => {
   const { state } = useContext(AuthContext);
   const [userHasPasswordEnabledLogin, setUserHasPasswordEnabledLogin] = useState(false);
   const [count, setCount] = useState(5);

   const history = useHistory();

   // Check if there's a user otherwise push them to login page
   useEffect(() => {
      const interval = setInterval(() => {
         setCount((currentCount) => --currentCount);
      }, 1000);
      if (!state.user?.token && count === 0) history.push('/login');
      return () => clearInterval(interval);
   }, [state.user?.token, count]);

   // Check if the user has a password enabled login which will be used to conditionally render the Password link
   useEffect(() => {
      auth.currentUser?.providerData.forEach((loginProviderObject) => {
         if (loginProviderObject?.providerId === 'password') setUserHasPasswordEnabledLogin(true);
      });
   }, []);

   const navLinks = (
      <aside>
         <ul>
            <li className="text-primary-400 font-bold mb-2">
               <Link to="/profile">Profile</Link>
            </li>
            {userHasPasswordEnabledLogin && (
               <li className="text-primary-400 font-bold mb-2">
                  <Link to="/password/update">Password</Link>
               </li>
            )}
            <li className="text-primary-400 font-bold mb-2">
               <Link to="/post/create">Post</Link>
            </li>
         </ul>
      </aside>
   );

   const output = !state.user?.token ? (
      <p className="text-center p-5 font-bold">Checking Credentials: {count}</p>
   ) : (
      <div className="grid grid-cols-12 gap-4">
         <div className="col-span-3">{navLinks}</div>
         <div className="col-span-9">
            <Route {...rest} />
         </div>
      </div>
   );

   return <div className="container mt-24">{output}</div>;
};

export default PrivateRoute;
