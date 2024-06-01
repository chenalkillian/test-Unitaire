// src/components/AdminDashboard.js
import { Link, Route, Routes } from 'react-router-dom';
import Users from './Users';
import Events from './Events';
import Tickets from './Tickets';
import React, { useState, useEffect } from 'react';
import Denied from './Denied';

function AdminDashboard() {
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const userRole = sessionStorage.getItem('Role');
        if (userRole === "ROLE_USER" || !userRole) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
        }
    }, []);

    if (isHidden) {
        return <div><Denied/></div>;
    }

    return (
        <div className="container mt-5">
            <Link className="nav-link" to="/admin">
                <h1 className="mb-4">Admin Dashboard</h1>
            </Link>
            <nav className="mb-4">
                <ul className="nav nav-pills">
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/users">Gestion des Utilisateurs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/events">Gestion des Événements</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="users" element={<Users />} />
                <Route path="events" element={<Events />} />
                <Route path="tickets" element={<Tickets />} />
            </Routes>
        </div>
    );
}

export default AdminDashboard;
