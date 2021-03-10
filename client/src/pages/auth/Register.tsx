import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

const Register = (): React.ReactElement => {
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      const config = {
         url: `${process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT}`,
         handleCodeInApp: true,
      };
      try {
         await auth.sendSignInLinkToEmail(email, config);
         // show toast notification to user about email sent
         window.localStorage.setItem('emailForRegistration', email);
         toast.success(`Email has been sent to ${email}. Click the link in your email to complete your registration.`);
      } catch (error) {
         // show toast notification to user about incorrect email formatting
         if (error.code === 'auth/invalid-email')
            toast.error(`${email} is not a valid email. Please re-enter your email.`);
      }

      // clear email and loading state
      setEmail('');
      setLoading(false);
   };
   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Register</h4>}
         <form onSubmit={handleSubmit} className="mt-5">
            <div>
               <label htmlFor="email" className="text-primary-300">
                  Email Address
               </label>
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300"
                  placeholder="Enter Email"
                  disabled={loading}
               />
            </div>
            <button className="btn btn-primary mt-3" disabled={!email || loading}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default Register;
