// frontend/src/components/ProfileSearch.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';

const ProfileSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [publicNotes, setPublicNotes] = useState([]);
  const token = localStorage.getItem('token');

  // Function to search for users
  const searchUsers = async (searchQuery) => {
    if (!searchQuery) {
      setUsers([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/search/users?q=${searchQuery}`, {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const debouncedSearch = debounce(searchUsers, 500);

  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query]);

  // Fetch public notes for a selected user
  const fetchPublicNotes = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/search/notes/${userId}`, {
        headers: { 'x-auth-token': token }
      });
      setPublicNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchPublicNotes(user._id);
  };

  const goBack = () => {
    setSelectedUser(null);
    setPublicNotes([]);
  };

  return (
    <div className="dashboard-container">
      {!selectedUser ? (
        <>
          <h1>Search Profiles</h1>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            className="form-input search-input"
          />
          <div>
            {users.map(user => (
              <div 
                key={user._id} 
                style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}
              >
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <button 
                  className="form-button small-button" 
                  onClick={() => handleUserClick(user)}
                >
                  View Public Notes
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className="form-button" onClick={goBack}>Back to Search</button>
          <h1>Public Notes by {selectedUser.name}</h1>
          {publicNotes.length === 0 ? (
            <p>No public notes available for this user.</p>
          ) : (
            <div className="notes-grid">
              {publicNotes.map(note => (
                <div key={note._id} className="note-card">
                  <h2>{note.title}</h2>
                  <p>{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileSearch;
