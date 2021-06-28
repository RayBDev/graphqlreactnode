/// <reference types="react-scripts" />
declare namespace NodeJS {
   interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PUBLIC_URL: string;
      REACT_APP_GRAPHQL_ENDPOINT: string;
      REACT_APP_CONFIRMATION_EMAIL_REDIRECT: string;
      REACT_APP_PASSWORD_RESET_EMAIL_REDIRECT: string;
      REACT_APP_REST_ENDPOINT: string;
      REACT_APP_APIKEY: string;
      REACT_APP_AUTHDOMAIN: string;
      REACT_APP_PROJECTID: string;
      REACT_APP_STORAGEBUCKET: string;
      REACT_APP_APPID: string;
      REACT_APP_MEASUREMENTID: string;
   }
}
