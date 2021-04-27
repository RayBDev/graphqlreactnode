import React from 'react';
import { Link } from 'react-router-dom';

interface RequiredProps {
   /** Loading state boolean */
   loading: boolean;
   /** Form submission handler */
   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
   /** Show Forgot Password link so users can reset their password? Default = false*/
   showForgotPassword?: boolean;
}

type ConditionalEmailProps =
   | {
        /** User's email address from state */
        email?: undefined;
        /** Email Field Change Event Handler */
        onEmailChange?: undefined;
        /** Is the Email field required? */
        showEmailField?: never;
     }
   | {
        /** User's email address from state */
        email: string;
        /** Email Field Change Event Handler */
        onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        /** Is the Email field required? */
        showEmailField?: true;
     };

type ConditionalPasswordProps =
   | {
        /** User's password from state */
        password?: undefined;
        /** Password Field Change Event Handler */
        onPasswordChange?: undefined;
        /** Is the Password field required? */
        showPasswordField?: never;
     }
   | {
        /** User's Password from state */
        password: string;
        /** Password Field Change Event Handler */
        onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        /** Is the Password field required? */
        showPasswordField?: true;
     };

type ConditionalPasswordValidationProps =
   | {
        /** Confirmation password from state that's evaluated against the new password entered. */
        confirmPassword?: undefined;
        /** Confirmation Password Field Change Event Handler */
        onConfirmPasswordChange?: undefined;
        /** Password validation object stored in state containing booleans for every password validator */
        passwordValidators?: undefined;
        /** Is the password field validation required? */
        isPasswordValid?: undefined;
        /** Is password validation required? */
        showPasswordValidation?: never;
     }
   | {
        /** Confirmation password from state that's evaluated against the new password entered. */
        confirmPassword: string;
        /** Confirmation Password Field Change Event Handler */
        onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        /** Password validation object stored in state containing booleans for every password validator */
        passwordValidators: {
           [key: string]: boolean;
        };
        /** Is the password field validation required? */
        isPasswordValid: boolean;
        /** Is password validation required? */
        showPasswordValidation?: true;
     };

type ConditionalOldPasswordProps =
   | {
        /** User's Old Password from state */
        oldPassword?: undefined;
        /** OldPassword Field Change Event Handler */
        onOldPasswordChange?: undefined;
        /** Is the OldPassword field required? */
        showOldPasswordField?: never;
     }
   | {
        /** User's Old Password from state */
        oldPassword: string;
        /** Old Password Field Change Event Handler */
        onOldPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        /** Is the Old Password field required? */
        showOldPasswordField?: true;
     };

type Props = RequiredProps &
   ConditionalEmailProps &
   ConditionalPasswordProps &
   ConditionalPasswordValidationProps &
   ConditionalOldPasswordProps;

const AuthForm = ({
   email,
   onEmailChange,
   showEmailField,
   password,
   onPasswordChange,
   passwordValidators,
   isPasswordValid,
   showPasswordField,
   showPasswordValidation,
   confirmPassword,
   onConfirmPasswordChange,
   loading,
   handleSubmit,
   showForgotPassword = false,
   oldPassword,
   onOldPasswordChange,
   showOldPasswordField,
}: Props): JSX.Element => {
   return (
      <form onSubmit={handleSubmit} className="mt-5">
         {/*Email input that's connected to its own piece of onChange state and is disabled when loading state is true */}
         {showEmailField && (
            <div className="mb-3">
               <label htmlFor="email" className="text-primary-300">
                  Email Address
               </label>
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={onEmailChange}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
                  placeholder="Enter Email"
                  disabled={loading || window.localStorage.getItem('emailForPasswordReset') ? true : false}
               />
            </div>
         )}
         {/*Old Password input that's connected to its own piece of onChange state and is disabled when loading state is true */}
         {showOldPasswordField && (
            <div className="mb-3">
               <label htmlFor="oldPassword" className="text-red-500">
                  Old Password
               </label>
               <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={onOldPasswordChange}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
                  placeholder="Enter Old Password"
                  disabled={loading}
               />
            </div>
         )}
         {/*Password input that's connected to its own piece of onChange state and is disabled when loading state is true */}
         {showPasswordField && (
            <div className="mb-3">
               <label htmlFor="password" className="text-primary-300">
                  {showPasswordValidation ? 'New Password' : 'Password'}
               </label>
               <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={onPasswordChange}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
                  placeholder={showPasswordValidation ? 'Enter New Password' : 'Enter Password'}
                  disabled={loading}
               />
            </div>
         )}
         {/*Confirm the new password to help user avoid errors. This field is connected to its own piece of onChange state and is disabled when loading state is true.*/}
         {showPasswordValidation && (
            <div className="mb-3">
               <label htmlFor="confirmPassword" className="text-primary-300">
                  Confirm New Password
               </label>
               <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={onConfirmPasswordChange}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300 disabled:bg-gray-100 disabled:opacity-70"
                  placeholder="Re-Enter New Password"
                  disabled={loading}
               />
            </div>
         )}
         {/*Password requirements display so user knows which requirements they still need to hit. The validators is read from state.*/}
         {showPasswordValidation && (
            <div className="mb-3">
               <h5 className="font-bold text-base text-primary-300 mb-2">Password Requirements</h5>
               <ul>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators?.hasLowercase ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one lowercase letter
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators?.hasUppercase ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one uppercase letter
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators?.hasNumber ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one number
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators?.hasSpecialChar ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     At least one special character
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators?.isLongEnough ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     Between 8 and 32 characters long
                  </li>
                  <li>
                     <span className="inline-block w-5">
                        {passwordValidators?.passwordsMatch ? <span className="text-green-600">✓</span> : '•'}
                     </span>
                     New password matches confirm password
                  </li>
               </ul>
            </div>
         )}
         {/*Forgot password link to help users reset their password*/}
         {showForgotPassword && (
            <Link className="text-red-400 block hover:underline hover:text-red-600 text-xs mb-4" to="/password/forgot">
               Forgot Password?
            </Link>
         )}
         {/*Submit button that is only enabled once the email and password have been filled in, loading state is false and the password meets complexity requirements*/}
         <button
            className="btn btn-primary"
            disabled={
               showEmailField
                  ? !email
                  : false || loading || showPasswordField
                  ? !password
                  : false || showPasswordValidation
                  ? !isPasswordValid || !confirmPassword
                  : false
            }
         >
            Submit
         </button>
      </form>
   );
};

export default AuthForm;
