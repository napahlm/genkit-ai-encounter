/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    // add any other env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }