import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const CompleteRegistration = (): React.ReactElement => {
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);

   const history = useHistory();

   useEffect(() => {
      // make api request to save/update user in mongodb
      try {
         // set Loading to false
         setLoading(false);
         // send the user to the login page in 5 seconds
         setTimeout(() => {
            history.push('/login');
         }, 5000);
      } catch (error) {
         setError(true);
      }
   }, []);

   return (
      <div className="container p-5 mt-24">
         {error ? (
            <>
               <h4 className="text-red-500">There was a problem confirming your email</h4>
               <p>
                  Click <a href="/">here</a> to log in instead.
               </p>
            </>
         ) : loading ? (
            <h4 className="text-red-500">Confirming your email and creating your account...</h4>
         ) : (
            <>
               <h4>Your email has been confirmed!</h4>
               <p>
                  Redirecting you to login page in 5 seconds or click <a href="/">here</a> to log in now.
               </p>
            </>
         )}
      </div>
   );
};

export default CompleteRegistration;
