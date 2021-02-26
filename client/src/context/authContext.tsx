import React, { useReducer, createContext } from 'react';

type ActionPayload = {
   /** The user provided by the dispatched action's payload */
   user: string;
};

type Action = {
   /** The action type that tells the Reducer what action needs to be performed before returning the new state */
   type: 'LOGGED_IN_USER' | 'LOGGED_OUT_USER';
   /** The action payload that gives the Reducer the necessary data that it needs to incorporate to return the new state */
   payload: ActionPayload;
};

type State = {
   /** The user name that lives in the state */
   user: string;
};

// reducer
const firebaseReducer = (state: State, action: Action): State => {
   switch (action.type) {
      case 'LOGGED_IN_USER':
         return { ...state, user: action.payload.user };
      default:
         return state;
   }
};

// state
const initialState: State = {
   user: '',
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

   const value = { state, dispatch };
   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// export
export { AuthContext, AuthProvider };
