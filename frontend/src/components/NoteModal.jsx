// frontend/src/components/NoteModal.jsx
import React, { useState, useEffect } from 'react';

const NoteModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPublic: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        isPublic: initialData.isPublic || false
      });
    } else {
      setFormData({
        title: '',
        content: '',
        isPublic: false
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'Edit Note' : 'Create Note'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Note Title"
            required
            className="form-input"
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Note Content"
            required
            className="form-input"
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            Public Note
          </label>
          <div className="modal-buttons">
            <button type="submit" className="form-button">Save</button>
            <button type="button" onClick={onClose} className="form-button cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
