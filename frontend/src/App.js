// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useMsal } from '@azure/msal-react';
import NavBar from './components/NavBar';
import TeamDropdown from './components/TeamDropdown';
import NameTable from './components/NameTable';
import deleteHandler from './handlers/deleteHandler';
import addNameHandler from './handlers/addNameHandler';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { SignInButton } from './components/SignInButton';

function App() {
  const { instance, accounts } = useMsal();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [names, setNames] = useState([]);

  const fetchNames = useCallback(async () => {
    if (selectedTeam) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}names?teamName=${selectedTeam}`,
          {
            headers: {
              Authorization: `Bearer ${await instance.acquireTokenSilent({
                account: accounts[0], // assuming there is only one account
              }).then(response => response.accessToken)}`,
            },
          }
        );

        const data = await response.json();
        setNames(data);
      } catch (error) {
        console.error('Error fetching names data:', error);
      }
    }
  }, [selectedTeam, instance, accounts]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}teams`, {
          headers: {
            Authorization: `Bearer ${await instance.acquireTokenSilent({
              account: accounts[0], // assuming there is only one account
            }).then(response => response.accessToken)}`,
          },
        });

        const data = await response.json();
        setTeams(data);
        if (data.length > 0) {
          setSelectedTeam(data[0].teamName);
        }
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    fetchTeams();

    if (selectedTeam !== '') {
      fetchNames();
    }
  }, [instance, accounts, selectedTeam, fetchNames]);

  const handleDelete = async (id) => {
    deleteHandler(id, async () => {
      if (selectedTeam !== '') {
        await fetchNames();
      }
    });
  };

  const handleAddName = async (newName) => {
    addNameHandler(selectedTeam, newName, async () => {
      if (selectedTeam !== '') {
        await fetchNames();
      }
    });
  };

  return (
    <div>
      <AuthenticatedTemplate>
        <NavBar />
        <div className="container mt-4">
          <h1>Edit Names</h1>
          <TeamDropdown
            teams={teams}
            selectedTeam={selectedTeam}
            onChange={setSelectedTeam}
          />
          <NameTable names={names} onDelete={handleDelete} onAdd={handleAddName} />
        </div>
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <SignInButton />
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
