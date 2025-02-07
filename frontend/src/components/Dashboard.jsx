// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteModal from './NoteModal';
import './Dashboard.css';
import { API_URL } from '../../src/config'; // Adjust path as needed

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all notes for the logged-in user
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notes`, {
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
        const res = await axios.put(
          `${API_URL}/api/notes/${editingNote._id}`,
          noteData,
          {
            headers: { 'x-auth-token': token }
          }
        );
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editingNote._id ? res.data : note
          )
        );
      } else {
        // Create note
        const res = await axios.post(`${API_URL}/api/notes`, noteData, {
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
      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Your Notes</h1>
        <button className="btn new-note-btn" onClick={() => openModal()}>
          + New Note
        </button>
      </header>
      <section className="notes-grid">
        {notes.map((note) => (
          <div key={note._id} className="note-card">
            <div className="note-content">
              <h2 className="note-title">{note.title}</h2>
              <p className="note-text">{note.content}</p>
              {note.images && note.images.length > 0 && (
                <div className="note-image">
                  <img src={note.images[0]} alt="Note" />
                </div>
              )}
              {note.createdAt && (
                <p className="note-date">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              )}
            </div>
            <div className="note-actions">
              <button className="btn edit-btn" onClick={() => openModal(note)}>
                Edit
              </button>
              <button className="btn delete-btn" onClick={() => deleteNote(note._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
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
