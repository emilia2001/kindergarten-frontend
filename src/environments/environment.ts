// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  endpoins: {
    api: 'http://localhost:8080',
    login: '/login',
    register: '/register',
    teacher: '/teacher',
    group: '/group',
    children: '/children',
    attendance: '/attendance',
    announcement: '/announcement',
    payment: '/payment',
    get: '/get',
    add: '/add',
    update: '/update',
    delete: '/delete',
    all: '/all',
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
