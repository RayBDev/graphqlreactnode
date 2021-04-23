import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
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

const Login = (): React.ReactElement => {
   const { dispatch } = useContext(AuthContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const history = useHistory();

   const [userCreate] = useMutation(USER_CREATE);

   const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
   };

   const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      // Prevent default submit button behavior
      e.preventDefault();
      // Set Loading state to true for UX
      setLoading(true);

      // Begin async try catch for signing in
      try {
         // Attempt to sign in with user provided email and password
         const userCredentials = await auth.signInWithEmailAndPassword(email, password);
         const { user } = userCredentials;

         // Check if user's email has been verified
         if (user?.emailVerified) {
            // Get the user ID token and dispatch it to the AuthContext reducer
            const idTokenResult = await user?.getIdTokenResult();

            dispatch({
               type: 'LOGGED_IN_USER',
               payload: { user: { email: user?.email, token: idTokenResult?.token } },
            });

            // send user info to mongodb to either update/create
            await userCreate();

            // If all is successful, send the user to the home page
            history.push('/profile');
         } else {
            // If user's email hasn't been verified, sign them out, show a toast error and set loading to false
            await auth.signOut();
            setEmail('');
            setPassword('');
            setLoading(false);
            toast.error('Please click the link in your email to verify your email address.');
         }
      } catch (error) {
         // If user credentials are wrong, toast an error and set loading to false
         if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password') {
            toast.error('Your email or password is incorrect. Please try again.');
         } else {
            toast.error('Your email was not found in our system. Please create an account on the Register page.');
         }
         setEmail('');
         setPassword('');
         setLoading(false);
      }
   };

   const googleLogin = async () => {
      try {
         const result = await auth.signInWithPopup(googleAuthProvider);
         const { user } = result;
         const idTokenResult = await user?.getIdTokenResult();

         dispatch({
            type: 'LOGGED_IN_USER',
            payload: { user: { email: user?.email, token: idTokenResult?.token } },
         });

         // send user info to mongodb to either update/create
         await userCreate();

         history.push('/profile');
      } catch (error) {
         toast.error('An error occurred with your Google login. Please try again.');
      }
   };

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Login</h4>}
         <button className="btn btn-warning mt-5" onClick={googleLogin}>
            Login with google
         </button>
         <AuthForm
            email={email}
            onEmailChange={onEmailChange}
            showEmailField={true}
            password={password}
            onPasswordChange={onPasswordChange}
            showPasswordField={true}
            showForgotPassword={true}
            loading={loading}
            handleSubmit={handleSubmit}
         />
      </div>
   );
};

export default Login;
