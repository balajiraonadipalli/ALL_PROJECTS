
import React, { useState, type CSSProperties } from 'react';
import axios from 'axios';

const CreateUserForm = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 10) errors.push('Password must be at least 10 characters long');
    if (password.length > 24) errors.push('Password must be at most 24 characters long');
    if (/\s/.test(password)) errors.push('Password cannot contain spaces');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setValidationErrors([]);

    const errors = validatePassword(password);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.post('https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup', { username, password }, {
        headers: { Authorization: 'Bearer YOUR_AUTH_TOKEN' }
      });

      if (response.status === 200) {
        onSuccess();
      }
    } catch (err) {
      if (err.response?.status) {
        switch (err.response.status) {
          case 401:
          case 403:
            setError('Not authenticated to access this resource.');
            break;
          case 500:
            setError('Something went wrong, please try again.');
            break;
          default:
            setError('Sorry, the entered password is not allowed, please try a different one.');
        }
      } else {
        setError('Something went wrong, please try again.');
      }
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        <label style={formLabel} htmlFor="username">Username</label>
        <input style={formInput} type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label style={formLabel} htmlFor="password">Password</label>
        <input style={formInput} type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {validationErrors.length > 0 && (
          <ul>
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        {error && <p>{error}</p>}

        <button style={formButton} type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUserForm;

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};
