import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';

const Login = (): React.ReactElement => {
   const { dispatch } = useContext(AuthContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   const history = useHistory();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      try {
         const result = await auth.signInWithEmailAndPassword(email, password);
         const { user } = result;
         const idTokenResult = await user?.getIdTokenResult();

         dispatch({
            type: 'LOGGED_IN_USER',
            payload: { user: { email: user?.email, token: idTokenResult?.token } },
         });

         // send user info to mongodb to either update/create
         history.push('/');
      } catch (error) {
         console.log('login error', error);
         toast.error(error.message);
         setLoading(false);
      }
   };

   const googleLogin = async () => {
      const result = await auth.signInWithPopup(googleAuthProvider);
      const { user } = result;
      const idTokenResult = await user?.getIdTokenResult();

      dispatch({
         type: 'LOGGED_IN_USER',
         payload: { user: { email: user?.email, token: idTokenResult?.token } },
      });

      // send user info to mongodb to either update/create
      history.push('/');
   };

   return (
      <div className="container p-5 mt-24">
         {loading ? <h4 className="text-red-500">Loading...</h4> : <h4>Login</h4>}
         <button className="btn btn-primary mt-5" onClick={googleLogin}>
            Login with google
         </button>
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
                  placeholder="Enter Email"
                  disabled={loading}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-300"
                  placeholder="Enter Password"
                  disabled={loading}
               />
            </div>
            <button className="btn btn-primary" disabled={!email || loading || !password}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default Login;
