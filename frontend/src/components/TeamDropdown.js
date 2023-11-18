// src/components/TeamDropdown.js
import React from 'react';

const TeamDropdown = ({ teams, selectedTeam, onChange }) => (
  <select
    className="form-select mt-2"
    value={selectedTeam}
    onChange={(e) => onChange(e.target.value)}
  >
    {teams.map((team) => (
      <option key={team.teamId} value={team.teamName}>
        {team.teamName}
      </option>
    ))}
  </select>
);

export default TeamDropdown;
