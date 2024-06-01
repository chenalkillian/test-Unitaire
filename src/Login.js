import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { Route } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Requesting CSRF token...');
      const csrfResponse = await axios.get('http://localhost:8000/csrf-token', { withCredentials: true });
      const csrfToken = csrfResponse.data.csrf_token;
      console.log('CSRF token received:', csrfToken);

      console.log('Sending login request...');
      const response = await axios.post('http://localhost:8000/login', {
        email: email,
        password: password,
        _csrf_token: csrfToken
      }, { withCredentials: true });

      console.log('Login response:', response);

      if (response.status === 200) {
     
        sessionStorage.setItem('Role',JSON.stringify(response.data.role));
        
        window.location.href = '/Accueil';

      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        setError(error.response.data.error || 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('Aucune réponse du serveur. Veuillez vérifier votre connexion.');
      } else {
        console.error('Error message:', error.message);
        setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      }
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
      <div className="login-container">
        <label className='title'>Bienvenue</label>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='title2' htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div className="form-group">
            <label className='title2' htmlFor="password">Mot de passe</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Se connecter</button>
        </form>
      </div>
  );
}

export default LoginForm;
