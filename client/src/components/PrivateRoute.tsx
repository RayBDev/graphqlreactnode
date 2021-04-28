import React, { useContext, useEffect, useState } from 'react';
import { Route, Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { auth } from '../firebase';

const PrivateRoute = ({ ...rest }): React.ReactElement => {
   const { state } = useContext(AuthContext);
   const [userHasPasswordEnabledLogin, setUserHasPasswordEnabledLogin] = useState(false);

   const history = useHistory();

   // Check if there's a user otherwise push them to login page
   useEffect(() => {
      state.user?.token || history.push('/login');
   }, [state.user?.token]);

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

   return (
      <div className="container mt-24">
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">{navLinks}</div>
            <div className="col-span-9">
               <Route {...rest} />
            </div>
         </div>
      </div>
   );
};

export default PrivateRoute;
