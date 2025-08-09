const { writeFileSync } = require("fs");
const { resolve } = require("path");
require("dotenv").config();

const envDevFile = `
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}'
  }
};
`;

const envProdFile = `
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}'
  }
};
`;

// Scrive il file per sviluppo
writeFileSync(resolve("./src/environments/environment.ts"), envDevFile);

// Scrive il file per produzione
writeFileSync(resolve("./src/environments/environment.prod.ts"), envProdFile);

console.log("✅ Environments aggiornati con variabili da .env");
