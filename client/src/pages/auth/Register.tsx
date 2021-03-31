import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

import passwordValidation from './passwordValidation';

const Register = (): React.ReactElement => {
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

   // Capture the user password and run it through the imported validator function. It will return the same object shape as the passwordValidators state we created.
   const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValidators(passwordValidation(e.target.value));
      setPassword(e.target.value);
   };

   // Loop through the passwordValidators state and set it to false if any of the validators are false. Also break out of the loop if any are false.
   let isPasswordValid = false;
   for (const key in passwordValidators) {
      if (passwordValidators[key] === false) {
         isPasswordValid = false;
         break;
      } else {
         isPasswordValid = true;
      }
   }

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // Falsy blank check for email/password fields as well as password validation check
      if (!email || !password) {
         toast.error('Email and password is required');
         return setLoading(false);
      } else if (!isPasswordValid) {
         toast.error('Password does not meet the complexity requirements');
         setPassword('');
         setPasswordValidators(passwordValidation(''));
         return setLoading(false);
      }
      // Redirection config for the verification email
      const actionCodeSettings = {
         url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
         handleCodeInApp: true,
      };
      try {
         // Create account in Firebase
         await auth.createUserWithEmailAndPassword(email, password);
         // User is auto signed in so send them a verification email with the redirection URL
         await auth.currentUser?.sendEmailVerification(actionCodeSettings);
         // Display toast message that they need to check their email
         toast.success(`Email has been sent to ${email}. Click the link in your email to complete your registration.`);
         // Sign the user out
         await auth.signOut();
      } catch (error) {
         // Catch some specific errors when user submits their email and password
         if (error.code === 'auth/email-already-in-use') {
            toast.error('An account already exists with this email. Try logging in or resetting your password.');
         } else if (error.code === 'auth/invalid-email') {
            toast.error(`${email} is not a valid email. Please re-enter your email.`);
         } else {
            toast.error(error.message);
         }
      }
      setEmail('');
      setPassword('');
      setPasswordValidators(passwordValidation(''));
      setLoading(false);
   };

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Register</h4>}
         <form onSubmit={handleSubmit} className="mt-5">
            {/*Email input that's connected to its own piece of onChange state and is disabled when loading state is true */}
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
                  placeholder="Enter Email"
                  disabled={loading}
               />
            </div>
            {/*Password input that's connected to its own piece of onChange state and is disabled when loading state is true */}
            <div className="mb-3">
               <label htmlFor="password" className="text-primary-300">
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
            {/*Password requirements display so user knows which requirements they still need to hit. The validators is read from state.*/}
            <div className="mb-3">
               <h5 className="font-bold text-base text-primary-300 mb-2">Password Requirements</h5>
               <ul>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators.hasLowercase ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one lowercase letter
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators.hasUppercase ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one uppercase letter
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators.hasNumber ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one number
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators.hasSpecialChar ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one special character
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators.isLongEnough ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     Between 8 and 32 characters long
                  </li>
               </ul>
            </div>
            {/*Submit button that is only enabled once the email and password have been filled in, loading state is false and the password meets complexity requirements*/}
            <button className="btn btn-primary" disabled={!email || loading || !password || !isPasswordValid}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default Register;
