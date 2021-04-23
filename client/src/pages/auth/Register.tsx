import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';

import AuthForm from '../../components/forms/AuthForm';
import passwordValidation from '../../helpers/passwordValidation';

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

   const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
   };

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

export default Register;
