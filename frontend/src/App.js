import React, { useState, useEffect, useRef } from 'react';
import { Table, Form } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineCheck } from 'react-icons/ai';
import './styles.css'; // Import your CSS file
import NavBar from './components/NavBar';

const NAMES_API_URL = 'https://nameselectorfa.azurewebsites.net/api/names/';
const TEAMS_API_URL = 'https://nameselectorfa.azurewebsites.net/api/teams/';

function App() {
  const [data, setData] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Set the initial team name to the first entry in the list
  const initialTeamName = teamNames.length > 0 ? teamNames[0].teamName : '';

  const [newItem, setNewItem] = useState({
    id: '',
    firstName: '',
    email: '',
    teamName: initialTeamName,
  });

  const firstNameInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch(NAMES_API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTeamNames = async () => {
      try {
        const response = await fetch(TEAMS_API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setTeamNames(jsonData);
      } catch (error) {
        console.error('Error fetching team names:', error);
      }
    };

    fetchTeamNames();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${NAMES_API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleInputChange = (e, field) => {
    setNewItem({
      ...newItem,
      [field]: e.target.value,
    });
  };

  const handleAddItem = async () => {
    setFormSubmitted(true);

    if (!newItem.firstName || !newItem.email || !newItem.teamName) {
      return;
    }

    try {
      const response = await fetch(NAMES_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      fetchData();

      setNewItem({
        id: '',
        firstName: '',
        email: '',
        teamName: initialTeamName, // Reset to the default team name
      });

      firstNameInputRef.current.focus();

      setFormSubmitted(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  return (
    <div>
     <NavBar />
      <div className="container mt-4">
        <h1>Names</h1>

        {/* Dropdown list for team names */}
        <Form.Group>
          <Form.Label>Select Team:</Form.Label>
          <Form.Control
            as="select"
            value={newItem.teamName}
            onChange={(e) => handleInputChange(e, 'teamName')}
          >
            {teamNames.map((team) => (
              <option key={team.id} value={team.teamName}>
                {team.teamName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Email</th>
              <th>Team Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.firstName}</td>
                <td>{item.email}</td>
                <td>{item.teamName}</td>
                <td>
                  <AiOutlineDelete
                    onClick={() => handleDelete(item.id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                </td>
              </tr>
            ))}
            {/* New row for adding items */}
            <tr>
              <td>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  value={newItem.firstName}
                  onChange={(e) => handleInputChange(e, 'firstName')}
                  onKeyDown={handleKeyDown}
                  ref={firstNameInputRef}
                  className={formSubmitted && !newItem.firstName ? 'incomplete-cell' : ''}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={newItem.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  onKeyDown={handleKeyDown}
                  className={formSubmitted && !newItem.email ? 'incomplete-cell' : ''}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  placeholder="Team Name"
                  value={newItem.teamName}
                  onChange={(e) => handleInputChange(e, 'teamName')}
                  onKeyDown={handleKeyDown}
                  className={formSubmitted && !newItem.teamName ? 'incomplete-cell' : ''}
                />
              </td>
              <td>
                <AiOutlineCheck
                  onClick={handleAddItem}
                  style={{ cursor: 'pointer', color: 'green' }}
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
