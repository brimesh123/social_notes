// frontend/src/components/NoteModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NoteModal.css';
import { API_URL } from '../../src/config'; // Adjust path as needed


const NoteModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: false,
    imageUrl: '' // We'll store the note photo URL here
  });
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        isPublic: initialData.isPublic || false,
        imageUrl:
          initialData.images && initialData.images.length > 0
            ? initialData.images[0]
            : ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        isPublic: false,
        imageUrl: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle file upload for note photo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('photo', file);
      const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Save the returned URL in formData.imageUrl
      setFormData((prev) => ({ ...prev, imageUrl: res.data.fileUrl }));
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare note data: if an image URL exists, add it as the first element in images array
    const noteData = {
      title: formData.title,
      content: formData.content,
      isPublic: formData.isPublic,
      images: formData.imageUrl ? [formData.imageUrl] : []
    };
    onSubmit(noteData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Note' : 'Create Note'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="note-title">Title</label>
            <input
              type="text"
              id="note-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter note title"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter note content"
              required
              className="form-textarea"
            ></textarea>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              Make this note public
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="note-image">Upload Note Photo</label>
            <input
              type="file"
              id="note-image"
              accept="image/*"
              onChange={handleFileChange}
              className="form-input"
            />
            {uploading && <p className="uploading-text">Uploading...</p>}
            {formData.imageUrl && (
              <div className="uploaded-image">
                <img src={formData.imageUrl} alt="Uploaded" />
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
