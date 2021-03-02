/// <reference types="react-scripts" />
declare namespace NodeJS {
   interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PUBLIC_URL: string;
      REACT_APP_GRAPHQL_ENDPOINT: string;
      REACT_APP_CONFIRMATION_EMAIL_REDIRECT: string;
   }
}
