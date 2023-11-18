// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';
import TeamDropdown from './components/TeamDropdown';
import NameTable from './components/NameTable';
import deleteHandler from './handlers/deleteHandler';
import addNameHandler from './handlers/addNameHandler';

function App() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [names, setNames] = useState([]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}teams`);
      const data = await response.json();
      setTeams(data);
      if (data.length > 0) {
        setSelectedTeam(data[0].teamName);
      }
    } catch (error) {
      console.error('Error fetching teams data:', error);
    }
  };

  const fetchNames = useCallback(async () => {
    if (selectedTeam) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}names?teamName=${selectedTeam}`
        );
        const data = await response.json();
        setNames(data);
      } catch (error) {
        console.error('Error fetching names data:', error);
      }
    }
  }, [selectedTeam]);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedTeam !== '') {
      fetchNames();
    }
  }, [selectedTeam, fetchNames]);

  const handleDelete = async (id) => {
    deleteHandler(id, fetchNames);
  };

  const handleAddName = async (newName) => {
    addNameHandler(selectedTeam, newName, fetchNames);
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        <h1>Edit Names</h1>
        <TeamDropdown teams={teams} selectedTeam={selectedTeam} onChange={setSelectedTeam} />
        <NameTable names={names} onDelete={handleDelete} onAdd={handleAddName} />
      </div>
    </div>
  );
}

export default App;
