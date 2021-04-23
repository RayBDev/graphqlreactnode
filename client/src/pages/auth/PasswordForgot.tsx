import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import AuthForm from '../../components/forms/AuthForm';

const PasswordForgot = (): React.ReactElement => {
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);

   const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      // Prevent default submit button behavior
      e.preventDefault();
      // Set Loading state to true for UX
      setLoading(true);

      // Redirection config for the password reset email
      const actionCodeSettings = {
         url: process.env.REACT_APP_PASSWORD_RESET_EMAIL_REDIRECT,
         handleCodeInApp: true,
      };

      try {
         // Send the sign in link to the user's email which will redirect them to the password/reset page when clicked
         await auth.sendSignInLinkToEmail(email, actionCodeSettings);
         // Set the user email in local storage for easy retrieval when they click the email link
         window.localStorage.setItem('emailForPasswordReset', email);
         // Tell user to check their email
         toast.success(`An email has been sent to ${email}. Please click the link to reset your password.`);
      } catch (error) {
         // Send errors based on email validity and also if server issues
         if (error.code === 'auth/invalid-email') {
            toast.error('Please enter a valid email address.');
         } else {
            toast.error('An error has occurred with your request. Please try again.');
         }
      }
      // Reset email and loading state
      setEmail('');
      setLoading(false);
   };

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Forgot Password</h4>}
         <AuthForm
            email={email}
            onEmailChange={onEmailChange}
            showEmailField={true}
            loading={loading}
            handleSubmit={handleSubmit}
         />
      </div>
   );
};

export default PasswordForgot;
