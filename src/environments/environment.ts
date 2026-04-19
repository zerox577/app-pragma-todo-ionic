// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDCDGUyVfeVePXAstQEZFrHCNBYiFit954",
    authDomain: "app-pragma-todo-ionic.firebaseapp.com",
    projectId: "app-pragma-todo-ionic",
    storageBucket: "app-pragma-todo-ionic.firebasestorage.app",
    messagingSenderId: "795374967621",
    appId: "1:795374967621:web:d0a96e5b26bab0af9e7c2c",
    measurementId: "G-N273NFPET3"
  },
  remoteConfig: {
    minimumFetchIntervalMillis: 0,
    fetchTimeoutMillis: 10000,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
