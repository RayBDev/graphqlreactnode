import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import passwordValidation from './passwordValidation';

const CompleteRegistration = (): React.ReactElement => {
   const { dispatch } = useContext(AuthContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   type PasswordValidators = {
      [key: string]: boolean;
   };
   const [passwordValidators, setPasswordValidators] = useState<PasswordValidators>({
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isLongEnough: false,
   });

   const history = useHistory();

   useEffect(() => {
      setEmail(window.localStorage.getItem('emailForSignIn') || '');
   }, [history]);

   const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValidators(passwordValidation(e.target.value));
      setPassword(e.target.value);
   };

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
         if (result.user?.emailVerified && result.additionalUserInfo?.isNewUser) {
            // remove local storage email
            window.localStorage.removeItem('emailForRegistration');
            // get current logged in user
            const user = auth.currentUser;
            await user?.updatePassword(password);

            // dispatch user with token and email
            // then redirect
            const idTokenResult = await user?.getIdTokenResult();
            dispatch({
               type: 'LOGGED_IN_USER',
               payload: {
                  user: {
                     email: user?.email,
                     token: idTokenResult?.token,
                  },
               },
            });
            // make api request to save/update user in mongodb

            history.push('/');
         } else if (result.user?.emailVerified && !result.additionalUserInfo?.isNewUser) {
         }
      } catch (error) {
         console.log('register complete error', error.message);
         setLoading(false);
         toast.error(error.message);
      }
   };

   let isPasswordValid = false;
   for (const key in passwordValidators) {
      if (passwordValidators[key] === false) {
         isPasswordValid = false;
         break;
      } else {
         isPasswordValid = true;
      }
   }
   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Complete Your Registration</h4>}
         <form onSubmit={handleSubmit} className="mt-5">
            <div className="mb-3">
               <label htmlFor="email" className="text-primary-300">
                  Email Address
               </label>
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
                  placeholder="Re-Enter Email (new browser detected)"
                  disabled={window.localStorage.getItem('emailForRegistration') || loading ? true : false}
               />
            </div>
            <div className="mb-3">
               <label htmlFor="email" className="text-primary-300">
                  Password
               </label>
               <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={onPasswordChange}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300"
                  placeholder="Enter Password"
                  disabled={loading}
               />
            </div>
            <div className="mb-3">
               <h5 className="font-bold text-base text-primary-300 mb-2">Password Requirements</h5>
               <ul>
                  <li>
                     <span className="inline-block w-5">{passwordValidators.hasLowercase ? '✓' : '•'}</span>
                     At least one lowercase letter
                  </li>
                  <li>
                     <span className="inline-block w-5">{passwordValidators.hasUppercase ? '✓' : '•'}</span>At least one
                     uppercase letter
                  </li>
                  <li>
                     <span className="inline-block w-5">{passwordValidators.hasNumber ? '✓' : '•'}</span>At least one
                     number
                  </li>
                  <li>
                     <span className="inline-block w-5">{passwordValidators.hasSpecialChar ? '✓' : '•'}</span>At least
                     one special character
                  </li>
                  <li>
                     <span className="inline-block w-5">{passwordValidators.isLongEnough ? '✓' : '•'}</span>Between 8
                     and 32 characters long
                  </li>
               </ul>
            </div>
            <button className="btn btn-primary" disabled={!email || loading || !password || !isPasswordValid}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default CompleteRegistration;
