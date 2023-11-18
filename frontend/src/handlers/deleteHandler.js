// src/handlers/deleteHandler.js
const deleteHandler = async (id, fetchNames) => {
    try {
      await fetch(`${process.env.REACT_APP_API_ENDPOINT}names?id=${id}`, {
        method: 'DELETE',
      });
      fetchNames();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  
  export default deleteHandler;
  