export const msalConfig = {
    auth: {
        clientId: "a22b3d7b-7c3a-45e1-b6e9-7026675beb7a",
        authority: "https://login.microsoftonline.com/2a3a7925-0941-4f65-a806-bbb581592374",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
}

export const loginRequest = {
    scopes: ["User.Read.All"],
}