// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';

function App() {
  // States to store teams data and selected team
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  // State to store names data for the selected team
  const [names, setNames] = useState([]);
  // State to store input values for the new row
  const [newName, setNewName] = useState({
    firstName: '',
    email: '',
  });

  // Function to fetch names data for the selected team
  const fetchNames = useCallback(async () => {
    if (selectedTeam) {
      try {
        const response = await fetch(
          `https://nameselectorfa.azurewebsites.net/api/names?teamName=${selectedTeam}`
        );
        const data = await response.json();
        // Update the state with the fetched names data
        setNames(data);
      } catch (error) {
        console.error('Error fetching names data:', error);
      }
    }
  }, [selectedTeam]);

  useEffect(() => {
    // Function to fetch teams data from the API
    const fetchTeams = async () => {
      try {
        const response = await fetch('https://nameselectorfa.azurewebsites.net/api/teams');
        const data = await response.json();
        // Update the state with the fetched teams data
        setTeams(data);

        // Initialize selectedTeam with the first teamName
        if (data.length > 0) {
          setSelectedTeam(data[0].teamName);
        }
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    // Call the fetchTeams function
    fetchTeams();
  }, []);

  useEffect(() => {
    // Only fetch names if selectedTeam is not an empty string
    if (selectedTeam !== '') {
      // Call the fetchNames function
      fetchNames();
    }
  }, [selectedTeam, fetchNames]);

  const handleDelete = async (id) => {
    try {
      // Send DELETE request to delete the row with the specified id
      await fetch(`https://nameselectorfa.azurewebsites.net/api/names?id=${id}`, {
        method: 'DELETE',
      });

      // After deletion, refresh the table data
      fetchNames();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Send POST request to add a new row with the specified data
      await fetch(`https://nameselectorfa.azurewebsites.net/api/names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: selectedTeam,
          firstName: newName.firstName,
          email: newName.email,
        }),
      });

      // After submission, refresh the table data
      fetchNames();
      // Clear input fields
      setNewName({
        firstName: '',
        email: '',
      });
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div>
      <NavBar />

      <div className="container mt-4">
        <h1>Edit Names</h1>

        {/* Dropdown menu */}
        <select
          className="form-select mt-2"
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          {/* Map through the teams and create options for the dropdown */}
          {teams.map((team) => (
            <option key={team.teamId} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>

        {/* Display names in a table */}
        <table className="table mt-4">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Email</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Map through the names and create rows for the table */}
            {names.map((name) => (
              <tr key={name.id}>
                <td>{name.firstName}</td>
                <td>{name.email}</td>
                <td>
                  {/* Delete icon with onClick handler */}
                  <span
                    style={{ cursor: 'pointer', color: 'red' }}
                    onClick={() => handleDelete(name.id)}
                  >
                    &#x274C;
                  </span>
                </td>
              </tr>
            ))}
            {/* New row for adding a name */}
            <tr>
              <td>
                <input
                  type="text"
                  value={newName.firstName}
                  onChange={(e) => setNewName({ ...newName, firstName: e.target.value })}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newName.email}
                  onChange={(e) => setNewName({ ...newName, email: e.target.value })}
                />
              </td>
              <td>
                {/* Submit icon with onClick handler */}
                <span
                  style={{ cursor: 'pointer', color: 'green' }}
                  onClick={() => handleSubmit()}
                >
                  &#x2713;
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
