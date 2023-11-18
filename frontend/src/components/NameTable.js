// src/components/NameTable.js
import React from 'react';
import AddNameRow from './AddNameRow';

const NameTable = ({ names, onDelete, onAdd }) => (
  <table className="table mt-4">
    <thead>
      <tr>
        <th>First Name</th>
        <th>Email</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      {names.map((name) => (
        <tr key={name.id}>
          <td>{name.firstName}</td>
          <td>{name.email}</td>
          <td>
            <span
              style={{ cursor: 'pointer', color: 'red' }}
              onClick={() => onDelete(name.id)}
            >
              &#x274C;
            </span>
          </td>
        </tr>
      ))}
      {/* Add the new name row as the last row */}
      <AddNameRow onAdd={onAdd} />
    </tbody>
  </table>
);

export default NameTable;
