import React, { useReducer, createContext, useEffect } from 'react';
import { auth } from '../firebase';

type ActionPayload = {
   /** The user email and token provided by the dispatched action's payload */
   user?: {
      name?: string;
      email?: string | null | undefined;
      token?: string | undefined;
   };
};

type Action = {
   /** The action type that tells the Reducer what action needs to be performed before returning the new state */
   type: 'LOGGED_IN_USER' | 'LOGGED_OUT_USER';
   /** The action payload that gives the Reducer the necessary data that it needs to incorporate to return the new state */
   payload: ActionPayload | null | undefined;
};

type State = {
   /** The user's email and token that lives in the state */
   user?: {
      name?: string;
      email?: string | null | undefined;
      token?: string | undefined;
   };
};

// reducer
const firebaseReducer = (state: State, action: Action): State => {
   switch (action.type) {
      case 'LOGGED_IN_USER':
         return { ...state, user: action.payload?.user };
      default:
         return state;
   }
};

// state
const initialState: State = {
   user: {
      email: '',
      token: '',
   },
};

type ContextType = {
   /** The global state provided by context */
   state: State;
   /** The dispatch method provided by context that will dispatch an action to update the global state */
   dispatch: React.Dispatch<Action>;
};

// create context
const AuthContext = createContext<ContextType>({
   state: initialState,
   dispatch: () => null,
});

type ComponentWithChildProps = React.PropsWithChildren<{ example?: string }>;

// context provider
const AuthProvider = ({ children }: ComponentWithChildProps): React.ReactElement => {
   const [state, dispatch] = useReducer(firebaseReducer, initialState);

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
         if (user) {
            const idTokenResult = await user?.getIdTokenResult();

            dispatch({
               type: 'LOGGED_IN_USER',
               payload: { user: { email: user.email, token: idTokenResult.token } },
            });
         } else {
            dispatch({
               type: 'LOGGED_IN_USER',
               payload: null,
            });
         }
      });
      // cleanup
      return () => unsubscribe();
   }, []);

   const value = { state, dispatch };
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// export
export { AuthContext, AuthProvider };
