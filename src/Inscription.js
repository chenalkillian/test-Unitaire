// LoginForm.js

import React, { useState } from 'react';
import './Login.css'; // Assurez-vous d'avoir un fichier LoginForm.css pour les styles
import axios from 'axios';




function InscriptionForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Effectuer la requête Axios vers votre API de connexion
      const response = await axios.post('http://localhost:8000/signup', {
        email: username,
        password: password
      });

      // Vérifier la réponse de l'API et effectuer la redirection si la connexion est réussie
      if (response.status === 201) {
        // Redirection vers une page de succès ou autre
        window.location.href = '/Accueil';
      } else {
        // Afficher un message d'erreur si la réponse de l'API indique un problème de connexion
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch (error) {
      // Gérer les erreurs éventuelles de la requête Axios
      setError('Une erreur s\'est produite. Veuillez réessayer plus tard.');
      console.error('Erreur lors de la connexion :', error);
    }
  };

  return (
    <div className="login-container">
             
             <label className='title'>Veuiller vous inscrire</label>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='title2' htmlFor="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit">Inscription</button>
      </form>
    </div>
  );
}

export default InscriptionForm;
