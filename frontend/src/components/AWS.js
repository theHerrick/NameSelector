import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";

function AWS() {
  const { instance, accounts } = useMsal();
  const [awsMembers, setAwsMembers] = useState([]);

  useEffect(() => {
    const fetchAwsMembers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}names?teamName=AWS`,
          {
            headers: {
              Authorization: `Bearer ${await instance
                .acquireTokenSilent({
                  account: accounts[0],
                })
                .then((response) => response.accessToken)}`,
            },
          }
        );
        const data = await response.json();
        setAwsMembers(data);
      } catch (error) {
        console.error("Error fetching AWS team data:", error);
      }
    };

    fetchAwsMembers();
  }, [instance, accounts]);

  return (
    <div className="container mt-4">
      <h1>AWS Team Members</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {awsMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.firstName}</td>
              <td>{member.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AWS;
