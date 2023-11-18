// src/handlers/addNameHandler.js
const addNameHandler = async (selectedTeam, newName, fetchNames) => {
    try {
      await fetch(`${process.env.REACT_APP_API_ENDPOINT}names`, {
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
      fetchNames();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };
  
  export default addNameHandler;
  