import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Table, Form } from 'react-bootstrap';
import { AiOutlineDelete, AiOutlineCheck } from 'react-icons/ai';
import './styles.css'; // Import your CSS file

const API_URL = 'https://nameselectorfa.azurewebsites.net/api/';

function App() {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState({
    id: '',
    firstName: '',
    email: '',
    teamName: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const firstNameInputRef = useRef(null); // Ref for the first name input field

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
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
  }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if needed
        },
        // Add any additional options like body or credentials if needed
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Refetch data to update the table
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
    // Set formSubmitted state to true when attempting to submit the form
    setFormSubmitted(true);

    // Check if any of the required fields are empty
    if (!newItem.firstName || !newItem.email || !newItem.teamName) {
      return; // Don't add an item if any of the required fields are empty
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      // Refetch data to update the table
      fetchData();
      // Clear the input fields after adding the item
      setNewItem({
        id: '',
        firstName: '',
        email: '',
        teamName: '',
      });

      // Focus on the first name input field after submit
      firstNameInputRef.current.focus();

      // Reset the formSubmitted state
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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Edit Names</Navbar.Brand>
      </Navbar>

      <div className="container mt-4">
        <h1>Names</h1>
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
