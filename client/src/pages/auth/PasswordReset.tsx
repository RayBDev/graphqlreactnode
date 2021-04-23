import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import passwordValidation from '../../helpers/passwordValidation';
import { useMutation, gql } from '@apollo/client';
import AuthForm from '../../components/forms/AuthForm';

const USER_CREATE = gql`
   mutation {
      userCreate {
         username
         email
      }
   }
`;

const PasswordReset = (): React.ReactElement => {
   const { dispatch } = useContext(AuthContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [userCreate] = useMutation(USER_CREATE);

   // Type set for password validators
   type PasswordValidators = {
      [key: string]: boolean;
   };
   // State setup for password validators
   const [passwordValidators, setPasswordValidators] = useState<PasswordValidators>({
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      isLongEnough: false,
   });

   const history = useHistory();

   // Set email in state using local storage if user is using the same browser or set to blank if not
   useEffect(() => {
      setEmail(window.localStorage.getItem('emailForPasswordReset') || '');
   }, [history]);

   // Validate the password each time user types a character
   const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValidators(passwordValidation(e.target.value));
      setPassword(e.target.value);
   };

   // Loop through the password validators in state and if any of them are false then make password invalid
   let isPasswordValid = false;
   for (const key in passwordValidators) {
      if (passwordValidators[key] === false) {
         isPasswordValid = false;
         break;
      } else {
         isPasswordValid = true;
      }
   }

   const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // Field validation in case user manually enables submit button
      if (!email || !password || !isPasswordValid) {
         toast.error('A valid email and password is required');
         return setLoading(false);
      }

      // Check if the email link is valid and toast an error plus redirect if it isn't valid
      if (auth.isSignInWithEmailLink(window.location.href)) {
         try {
            // Sign in the user with their email and email link
            await auth.signInWithEmailLink(email, window.location.href);

            // Remove local storage email
            window.localStorage.removeItem('emailForPasswordReset');
            // Get current logged in user and update their password
            const user = auth.currentUser;
            await user?.updatePassword(password);

            // Sign the user into the app by dispatching token and email. No reason to make them sign in again manually with new password.
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

            // In case this is the user's first login, make api request to save/update user in mongodb
            await userCreate();

            // Let user know all went well
            toast.success('Your password has been changed successfully! Redirecting you to your profile page.');

            // Redirect user to their profile page
            setTimeout(() => {
               history.push('/profile');
            }, 5000);
         } catch (error) {
            // Set loading to false to enable all fields again and provide appropriate errors
            setLoading(false);
            if (error.code === 'auth/expired-action-code') {
               toast.error('Your email link has expired. Please try resetting your password again. Redirecting...');
               setTimeout(() => {
                  history.push('/password/forgot');
               }, 5000);
            } else if (error.code === 'auth/invalid-email') {
               toast.error('Please enter a valid email address.');
            } else {
               toast.error('Password reset error:', error.message);
            }
         }
      } else {
         // The email link used is not valid due to alteration so throw error and redirect to login
         toast.error(
            'Your email link is invalid or has expired. Please try resetting your password again. Redirecting...',
         );
         setTimeout(() => {
            history.push('/login');
         }, 5000);
      }
   };

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Reset Your Password</h4>}
         <AuthForm
            email={email}
            onEmailChange={onEmailChange}
            showEmailField={true}
            password={password}
            onPasswordChange={onPasswordChange}
            showPasswordField={true}
            passwordValidators={passwordValidators}
            isPasswordValid={isPasswordValid}
            showPasswordValidation={true}
            loading={loading}
            handleSubmit={handleSubmit}
         />
      </div>
   );
};

export default PasswordReset;
