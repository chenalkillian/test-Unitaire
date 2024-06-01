import React, { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import "./Header.css"

function LOG(){
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fonction pour gérer la connexion et la déconnexion
  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn); // Inverse l'état de connexion
  };

  return isLoggedIn ? "Déconnexion" : "Connexion";
}

const Layout = () => {
  const log = LOG();
  const [adminLink, setAdminLink] = useState("/Accueil");

  useEffect(() => {
    // Vérifie le rôle de l'utilisateur lors du chargement initial
    const userRole = sessionStorage.getItem('Role');
    if (userRole === "ROLE_USER" || !userRole) {
      setAdminLink("/Accueil");
    } else {
      setAdminLink("/Admin/*");
    }
  }, []);

  // Définissez votre fonction test pour gérer la déconnexion
  const handleLogout = () => {
    sessionStorage.removeItem('Role');
    alert('Vous êtes déconnecter');
    window.location.href = '/Accueil';

  };

  return (
    <>
      <nav className="header-nav">
        <a href="/Accueil">Accueil</a>
        <a href="/Login">{log}</a>
        <a href="/Inscription">Inscription</a>
        <a href={adminLink}>Page Admin</a>
        <a className='logout' onClick={handleLogout}>Logout</a>

        <div className="animation start-home"></div>
      </nav>
      {/* Utilisez handleLogout comme fonction de rappel */}
      <Outlet />
    </>
  );
};

export default Layout;
