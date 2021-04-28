import React, { useState, useEffect } from 'react';
import { auth, emailAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';

import passwordValidation from '../../helpers/passwordValidation';
import AuthForm from '../../components/forms/AuthForm';

const PasswordUpdate = (): React.ReactElement => {
   const [oldPassword, setOldPassword] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [userHasPasswordEnabledLogin, setUserHasPasswordEnabledLogin] = useState(false);

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
      passwordsMatch: false,
   });

   // When component mounts, check if user has a password enabled login. This will be used to conditionally render the form fields.
   useEffect(() => {
      auth.currentUser?.providerData.forEach((loginProviderObject) => {
         if (loginProviderObject?.providerId === 'password') setUserHasPasswordEnabledLogin(true);
      });
   }, []);

   // OnChange handler for the old password field
   const onOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOldPassword(e.target.value);
   };

   // OnChange handler for the confirm password field
   const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
   };

   // Check whether the new password and confirm password fields match and set the state. This is check on component load and whenever confirm password changes.
   useEffect(() => {
      if (confirmPassword !== '' && password === confirmPassword) {
         setPasswordValidators((oldState) => {
            return { ...oldState, passwordsMatch: true };
         });
      } else {
         setPasswordValidators((oldState) => {
            return { ...oldState, passwordsMatch: false };
         });
      }
   }, [confirmPassword]);

   // Validate the password each time user types a character
   const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValidators(passwordValidation(e.target.value));
      setPassword(e.target.value);
   };

   // Loop through the password validators in state and if any of them are false then make password invalid. Used to block the form submission
   let isPasswordValid = false;
   for (const key in passwordValidators) {
      if (passwordValidators[key] === false) {
         isPasswordValid = false;
         break;
      } else {
         isPasswordValid = true;
      }
   }

   // Submit button handler
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // Field validation in case user manually enables submit button
      if (!oldPassword || !password || !confirmPassword || !isPasswordValid) {
         toast.error('Your old password, a new valid password and a confirm password is required');
         return setLoading(false);
      }
      try {
         // Get current logged in user
         const user = auth.currentUser;

         // If there is a current user (which there should be since this is a protected route)
         if (user?.email) {
            try {
               // Re-authenticate for security reasons using the old password
               const credential = emailAuthProvider.credential(user?.email, oldPassword);
               await user.reauthenticateWithCredential(credential);
            } catch (error) {
               // If the old password is incorrect then throw an error and reset the old password field
               toast.error('Your old password is incorrect. Please try again');
               setLoading(false);
               return setOldPassword('');
            }

            // User has been re-authenticated and we've checked password validity so now we can update their password with the new password
            await user?.updatePassword(password);

            // Reset the form and toast success
            setLoading(false);
            setOldPassword('');
            setPassword('');
            setConfirmPassword('');
            setPasswordValidators(passwordValidation(''));
            // Let user know all went well
            toast.success('Your password has been changed successfully!');
         }
      } catch (error) {
         // If there's a problem updating the password, set loading to false to enable all fields again and provide appropriate errors
         setLoading(false);
         setOldPassword('');
         setPassword('');
         setConfirmPassword('');
         setPasswordValidators(passwordValidation(''));
         toast.error('Password reset error:', error.message);
      }
   };

   return (
      <>
         {loading ? (
            <h4 className="text-red-500">Loading...</h4>
         ) : userHasPasswordEnabledLogin ? (
            <h4>Update Your Password</h4>
         ) : (
            <h4>Please change your Google account password instead</h4>
         )}
         {userHasPasswordEnabledLogin && (
            <AuthForm
               oldPassword={oldPassword}
               onOldPasswordChange={onOldPasswordChange}
               showOldPasswordField={true}
               password={password}
               onPasswordChange={onPasswordChange}
               showPasswordField={true}
               confirmPassword={confirmPassword}
               onConfirmPasswordChange={onConfirmPasswordChange}
               showPasswordValidation={true}
               passwordValidators={passwordValidators}
               isPasswordValid={isPasswordValid}
               loading={loading}
               handleSubmit={handleSubmit}
            />
         )}
      </>
   );
};

export default PasswordUpdate;
