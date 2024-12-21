import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditNames from "./components/EditNames";
import AWS from "./components/AWS";
import Azure from "./components/Azure";
import { SignInButton } from "./components/SignInButton";

function App() {
  return (
    <div>
      <AuthenticatedTemplate>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AWS />} />
            <Route path="/aws" element={<AWS />} />
            <Route path="/azure" element={<Azure />} />
            <Route path="/editnames" element={<EditNames />} />
          </Routes>
        </BrowserRouter>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <SignInButton />
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
