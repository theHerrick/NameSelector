// src/components/AddNameRow.js
import React, { useState } from 'react';

const AddNameRow = ({ onAdd }) => {
  const [newName, setNewName] = useState({
    firstName: '',
    email: '',
  });

  const handleSubmit = () => {
    // Ensure onAdd is a function before calling it
    if (typeof onAdd === 'function') {
      onAdd(newName);
      // Clear input fields
      setNewName({ firstName: '', email: '' });
    }
  };

  return (
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
        <span style={{ cursor: 'pointer', color: 'green' }} onClick={handleSubmit}>
          &#x2713;
        </span>
      </td>
    </tr>
  );
};

export default AddNameRow;
