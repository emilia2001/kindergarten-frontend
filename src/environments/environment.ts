// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoints: {
    api: 'http://localhost:8080',
    login: '/login',
    register: '/register',
    teacher: '/teacher',
    group: '/group',
    children: '/children',
    attendance: '/attendance',
    announcement: '/announcement',
    payment: '/payment',
    registrationRequest: '/registration-request',
    extensionRequest: '/extension-request',
    get: '/get',
    add: '/add',
    update: '/update',
    delete: '/delete',
    all: '/all',
    spots: '/spots',
    charge: '/charge',
    chargeByAdmin: '/charge-by-admin',
    paymentConfirmation: '/payment-confirmation',
    nextId: '/next-id',
    admin: '/admin',
    sendEmail: '/send-email',
    updateByParent: '/update-by-parent',
    updateByAdmin: '/update-by-admin',
  },
  web: {
    client_id: "820913190664-fbfch7ja0c8v88pqv0utku5p7gm3qabn.apps.googleusercontent.com",
    project_id: "kindergarten-385320",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    redirect_uris: [
      "http://localhost:4020",
      "http://localhost:8080"
    ]
  },
  firebaseConfig: {
    apiKey: "AIzaSyCIsH-U5K-0L8ucxuBsPXIviOeKxjQK5w0",
    authDomain: "kindergarten-management-3ca8d.firebaseapp.com",
    projectId: "kindergarten-management-3ca8d",
    storageBucket: "kindergarten-management-3ca8d.appspot.com",
    messagingSenderId: "709837940411",
    appId: "1:709837940411:web:c9a45686acfd1c9d972b9e"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
