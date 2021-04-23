import React, { useContext, useEffect, useState } from 'react';
import { Route, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PrivateRoute = ({ ...rest }): React.ReactElement => {
   const { state } = useContext(AuthContext);
   const [user, setUser] = useState(false);

   useEffect(() => {
      state.user?.token ? setUser(true) : setUser(false);
   }, [state.user?.token]);

   const navLinks = (
      <aside>
         <ul>
            <li className="text-primary-400 font-bold mb-2">
               <Link to="/profile">Profile</Link>
            </li>
            <li className="text-primary-400 font-bold mb-2">
               <Link to="/password/update">Password</Link>
            </li>
            <li className="text-primary-400 font-bold mb-2">
               <Link to="/post/create">Post</Link>
            </li>
         </ul>
      </aside>
   );

   const renderContent = () => (
      <div className="container mt-24">
         <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">{navLinks}</div>
            <div className="col-span-9">
               <Route {...rest} />
            </div>
         </div>
      </div>
   );

   return user ? renderContent() : <h4>Loading...</h4>;
};

export default PrivateRoute;