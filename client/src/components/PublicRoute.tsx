import React, { useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const PublicRoute = ({ ...rest }): React.ReactElement => {
   const { state } = useContext(AuthContext);
   const history = useHistory();

   useEffect(() => {
      if (state.user?.token) history.push('/profile');
   }, [state.user?.token]);
   return <Route {...rest} />;
};

export default PublicRoute;
