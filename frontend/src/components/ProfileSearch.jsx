// frontend/src/components/ProfileSearch.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './ProfileSearch.css';
import { API_URL } from '../../src/config'; // Adjust path as needed


const ProfileSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [publicNotes, setPublicNotes] = useState([]);
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);
  const [enteredPasskey, setEnteredPasskey] = useState('');
  const token = localStorage.getItem('token');

  // Function to search for users
  const searchUsers = async (searchQuery) => {
    if (!searchQuery) {
      setUsers([]);
      return;
    }
    try {
      const res = await axios.get(`https://social-notes.onrender.com/api/search/users?q=${searchQuery}`, {
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

  // Function to fetch public notes, with an optional passkey parameter
  const fetchPublicNotes = async (userId, passkey = '') => {
    try {
      const url = passkey
        ? `https://social-notes.onrender.com/api/search/notes/${userId}?passkey=${encodeURIComponent(passkey)}`
        : `https://social-notes.onrender.com/api/search/notes/${userId}`;
      const res = await axios.get(url, {
        headers: { 'x-auth-token': token }
      });
      setPublicNotes(res.data);
      setPasskeyModalOpen(false);
      setEnteredPasskey('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        if (err.response.data.msg === 'Passkey required') {
          // Open the passkey modal if not already open
          setPasskeyModalOpen(true);
        } else if (err.response.data.msg === 'Invalid passkey') {
          alert('Invalid passkey. Please try again.');
        }
      } else {
        console.error(err);
      }
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // Attempt to fetch notes without a passkey first
    fetchPublicNotes(user._id);
  };

  const goBack = () => {
    setSelectedUser(null);
    setPublicNotes([]);
    setPasskeyModalOpen(false);
    setEnteredPasskey('');
  };

  const submitPasskey = () => {
    if (selectedUser) {
      fetchPublicNotes(selectedUser._id, enteredPasskey);
    }
  };

  return (
    <div className="profile-search-container">
      {!selectedUser ? (
        <div className="search-section">
          <h1 className="search-header">Search Profiles</h1>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <div className="users-list">
            {users.map(user => (
              <div key={user._id} className="user-card">
                <div className="user-details">
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
                <button 
                  className="btn view-notes-btn" 
                  onClick={() => handleUserClick(user)}
                >
                  View Public Notes
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="notes-section">
          <button className="btn back-btn" onClick={goBack}>
            ← Back to Search
          </button>
          <h1 className="notes-header">Public Notes by {selectedUser.name}</h1>
          {publicNotes.length === 0 ? (
            <p className="no-notes">No public notes available for this user.</p>
          ) : (
            <div className="notes-grid">
              {publicNotes.map(note => (
                <div key={note._id} className="note-card">
                  <h2 className="note-title">{note.title}</h2>
                  <p className="note-content">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Passkey Modal */}
      {passkeyModalOpen && (
        <div className="passkey-modal-overlay">
          <div className="passkey-modal">
            <h2>Enter Passkey</h2>
            <input 
              type="password"
              placeholder="Enter passkey..."
              value={enteredPasskey}
              onChange={(e) => setEnteredPasskey(e.target.value)}
              className="passkey-input"
            />
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={submitPasskey}>
                Submit
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setPasskeyModalOpen(false);
                  setEnteredPasskey('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSearch;
