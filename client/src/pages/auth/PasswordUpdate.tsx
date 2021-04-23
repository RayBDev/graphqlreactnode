import React, { useState, useEffect } from 'react';
import { auth, emailAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';

import passwordValidation from '../../helpers/passwordValidation';

const PasswordUpdate = (): React.ReactElement => {
   const [oldPassword, setOldPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [userHasPasswordEnabledLogin, setUserHasPasswordEnabledLogin] = useState(false);

   useEffect(() => {
      auth.currentUser?.providerData.forEach((loginProviderObject) => {
         if (loginProviderObject?.providerId === 'password') setUserHasPasswordEnabledLogin(true);
      });
   }, []);

   const onOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setOldPassword(e.target.value);
   };

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

   // Validate the password each time user types a character
   const onNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordValidators(passwordValidation(e.target.value));
      setNewPassword(e.target.value);
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

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      // Field validation in case user manually enables submit button
      if (!oldPassword || !newPassword || !isPasswordValid) {
         toast.error('Your old password and a new valid password is required');
         return setLoading(false);
      }

      if (userHasPasswordEnabledLogin) {
         try {
            // Get current logged in user and update their password
            const user = auth.currentUser;

            if (user?.email) {
               try {
                  const credential = emailAuthProvider.credential(user?.email, oldPassword);
                  await user.reauthenticateWithCredential(credential);
               } catch (error) {
                  toast.error('Your old password is incorrect. Please try again');
                  setLoading(false);
                  return setOldPassword('');
               }

               await user?.updatePassword(newPassword);

               setLoading(false);
               setOldPassword('');
               setNewPassword('');
               // Let user know all went well
               toast.success('Your password has been changed successfully!');
            }
         } catch (error) {
            // Set loading to false to enable all fields again and provide appropriate errors
            setLoading(false);
            setOldPassword('');
            setNewPassword('');
            toast.error('Password reset error:', error.message);
         }
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
            <form onSubmit={handleSubmit} className="mt-5">
               <div className="mb-3">
                  <label htmlFor="email" className="text-primary-300">
                     Old Password
                  </label>
                  <input
                     id="password"
                     type="password"
                     value={oldPassword}
                     onChange={onOldPasswordChange}
                     className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300"
                     placeholder="Enter Old Password"
                     disabled={loading}
                  />
               </div>
               <div className="mb-3">
                  <label htmlFor="email" className="text-primary-300">
                     New Password
                  </label>
                  <input
                     id="password"
                     type="password"
                     value={newPassword}
                     onChange={onNewPasswordChange}
                     className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300"
                     placeholder="Enter New Password"
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
                        <span className="inline-block w-5">{passwordValidators.hasUppercase ? '✓' : '•'}</span>At least
                        one uppercase letter
                     </li>
                     <li>
                        <span className="inline-block w-5">{passwordValidators.hasNumber ? '✓' : '•'}</span>At least one
                        number
                     </li>
                     <li>
                        <span className="inline-block w-5">{passwordValidators.hasSpecialChar ? '✓' : '•'}</span>At
                        least one special character
                     </li>
                     <li>
                        <span className="inline-block w-5">{passwordValidators.isLongEnough ? '✓' : '•'}</span>Between 8
                        and 32 characters long
                     </li>
                  </ul>
               </div>
               <button
                  className="btn btn-primary"
                  disabled={loading || !oldPassword || !newPassword || !isPasswordValid}
               >
                  Submit
               </button>
            </form>
         )}
      </>
   );
};

export default PasswordUpdate;
