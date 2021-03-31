import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../firebase';
import { AuthContext } from '../context/authContext';

const Nav = (): React.ReactElement => {
   const { state, dispatch } = useContext(AuthContext);
   const [showMobileLinks, setShowMobileLinks] = useState(false);

   const history = useHistory();

   const { user } = state;

   const logout = () => {
      auth.signOut();
      dispatch({
         type: 'LOGGED_IN_USER',
         payload: null,
      });
      history.push('/login');
   };

   const toggleMobileLinks = () => {
      setShowMobileLinks((prevState) => !prevState);
   };
   return (
      <nav className="flex flex-wrap justify-between items-center p-5 w-full bg-gray-200 shadow-sm border-b fixed top-0">
         <img src="http://acmelogos.com/images/logo-1.svg" alt="ACME" width="120" />
         <div className="flex md:hidden">
            <button onClick={toggleMobileLinks}>
               <img
                  className={showMobileLinks ? 'hidden' : 'block'}
                  src="https://img.icons8.com/fluent-systems-regular/2x/menu-squared-2.png"
                  style={{ width: '40', height: '40' }}
               />
               <img
                  className={showMobileLinks ? 'block' : 'hidden'}
                  src="https://img.icons8.com/fluent-systems-regular/2x/close-window.png"
                  style={{ width: '40', height: '40' }}
               />
            </button>
         </div>
         <ul
            className={`transform-gpu transition-all md:transform-none md:flex items-center w-full md:w-auto font-bold ${
               showMobileLinks ? 'translate-y-0' : '-translate-y-56'
            }`}
         >
            {!user?.token && (
               <>
                  <li
                     className={`md:inline-block px-3 pb-3 pt-5 md:p-2 border-b-2 border-blue-900 md:border-none ${
                        showMobileLinks ? 'block' : 'hidden'
                     }`}
                  >
                     <Link to="/login" className="hover:text-blue-500">
                        Login
                     </Link>
                  </li>
                  <li
                     className={`md:inline-block p-3 md:p-2 border-b-2 border-blue-900 md:border-none ${
                        showMobileLinks ? 'block' : 'hidden'
                     }`}
                  >
                     <Link to="/register" className="hover:text-blue-500">
                        Register
                     </Link>
                  </li>
               </>
            )}
            {user?.token && (
               <li
                  className={`md:inline-block p-3 md:p-2 border-b-2 border-blue-900 md:border-none ${
                     showMobileLinks ? 'block' : 'hidden'
                  }`}
               >
                  <a href="/login" onClick={logout} className="hover:text-blue-500">
                     Logout
                  </a>
               </li>
            )}
         </ul>
         <div
            className={`transform md:transform-none transition-all w-full md:w-auto ${
               showMobileLinks ? 'translate-y-0' : '-translate-y-56'
            }`}
         >
            <div className={`md:block relative mt-4 md:mt-0 ${showMobileLinks ? '' : 'hidden'}`}>
               <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                     <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     ></path>
                  </svg>
               </span>

               <input
                  type="text"
                  className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring"
                  placeholder="Search"
               />
            </div>
         </div>
      </nav>
   );
};

export default Nav;
