declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    PORT: number;
    DATABASE_CLOUD: string;
    DATABASE: string;
    GOOGLE_APPLICATION_CREDENTIALS: string;
  }
}
