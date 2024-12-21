import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useAccount,
  useMsal,
} from "@azure/msal-react";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import EditNames from "./components/EditNames";
import AWS from "./components/AWS";
import Azure from "./components/Azure";
import { SignInButton } from "./components/SignInButton";
import Unauthorized from "./components/Unauthorized"; // Unauthorized component

function ProtectedRoutes() {
  const { accounts } = useMsal(); // Get authenticated accounts from MSAL
  const account = accounts[0]; // Get the first account (if authenticated)
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(null);

  // Check if the user has the required role
  useEffect(() => {
    const checkRoles = async () => {
      if (account) {
        const roles = account.idTokenClaims?.roles || []; // Extract roles from the id token

        // Check if user has the Ns.Reader or Ns.Admin roles
        if (roles.includes("Ns.Reader") || roles.includes("Ns.Admin")) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          navigate("/unauthorized"); // Redirect to unauthorized page if no access
        }

        // Specifically check if the user has the Ns.Admin role for EditNames route
        if (roles.includes("Ns.Admin")) {
          setHasAdminAccess(true);
        } else {
          setHasAdminAccess(false);
        }
      }
    };

    checkRoles();
  }, [account, navigate]);

  if (hasAccess === null) {
    return <div>Loading...</div>; // Show loading state until roles are checked
  }

  if (hasAccess === false) {
    return <Unauthorized />; // Show Unauthorized if no access
  }

  return (
    <>
      <NavBar hasAdminAccess={hasAdminAccess} />{" "}
      {/* Pass the hasAdminAccess prop */}
      <Routes>
        <Route path="/" element={<AWS />} />
        <Route path="/aws" element={<AWS />} />
        <Route path="/azure" element={<Azure />} />
        {/* Render EditNames route only if the user has Ns.Admin role */}
        <Route
          path="/editnames"
          element={hasAdminAccess ? <EditNames /> : <Unauthorized />}
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthenticatedTemplate>
        <ProtectedRoutes />{" "}
        {/* Protected routes go inside the AuthenticatedTemplate */}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <SignInButton />
      </UnauthenticatedTemplate>
    </BrowserRouter>
  );
}

export default App;
