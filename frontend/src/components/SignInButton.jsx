import React from "react";
import { useMsal } from "@azure/msal-react"
import { loginRequest } from "../authConfig";
import Button from 'react-bootstrap/Button';

export const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch((e) => {
                console.log(e);
            });
        }
    };
    return (
        <>
        <Button variant="primary" onClick={() => handleLogin("popup")}>Log In</Button>
        </>
    );
};