// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteModal from './NoteModal';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all notes for the logged-in user
  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { 'x-auth-token': token }
      });
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openModal = (note = null) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleNoteSubmit = async (noteData) => {
    try {
      if (editingNote) {
        // Update note
        const res = await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, noteData, {
          headers: { 'x-auth-token': token }
        });
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editingNote._id ? res.data : note
          )
        );
      } else {
        // Create note
        const res = await axios.post('http://localhost:5000/api/notes', noteData, {
          headers: { 'x-auth-token': token }
        });
        setNotes((prevNotes) => [res.data, ...prevNotes]);
      }
      closeModal();
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { 'x-auth-token': token }
      });
      // Use functional updater to remove the deleted note
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Notes</h1>
        <button className="form-button" onClick={() => openModal()}>
          New Note
        </button>
      </div>
      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <div className="note-actions">
              <button className="form-button small-button" onClick={() => openModal(note)}>
                Edit
              </button>
              <button
                className="form-button small-button delete-button"
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <NoteModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleNoteSubmit}
        initialData={editingNote}
      />
    </div>
  );
};

export default Dashboard;
