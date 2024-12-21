export const msalConfig = {
  auth: {
    clientId: "df937ce7-b3e7-4cf0-b357-472d9f2b88fa",
    authority:
      "https://login.microsoftonline.com/2a3a7925-0941-4f65-a806-bbb581592374",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};
