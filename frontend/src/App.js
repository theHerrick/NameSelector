// src/App.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';

function App() {
  // States to store teams data and selected team
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  // State to store names data for the selected team
  const [names, setNames] = useState([]);

  useEffect(() => {
    // Function to fetch teams data from the API
    const fetchTeams = async () => {
      try {
        const response = await fetch('https://nameselectorfa.azurewebsites.net/api/teams');
        const data = await response.json();
        // Update the state with the fetched teams data
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    // Call the fetchTeams function
    fetchTeams();
  }, []);

  useEffect(() => {
    // Function to fetch names data for the selected team
    const fetchNames = async () => {
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
    };

    // Call the fetchNames function
    fetchNames();
  }, [selectedTeam]);

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
            </tr>
          </thead>
          <tbody>
            {/* Map through the names and create rows for the table */}
            {names.map((name) => (
              <tr key={name.id}>
                <td>{name.firstName}</td>
                <td>{name.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
