import React, { useState, useEffect } from 'react';
import UserForm from './UserForm';
import Denied from './Denied';
function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isHidden, setIsHidden] = useState(false);
  
    useEffect(() => { const userRole = sessionStorage.getItem('Role');
        if (userRole === "ROLE_USER" || !userRole) {
            setIsHidden(true);
        } else {
            setIsHidden(false);}
        fetch('http://localhost:8000/users')
            .then(response => response.json())
            .then(data => setUsers(data));
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/users/${id}`, { method: 'DELETE' })
            .then(() => setUsers(users.filter(user => user.id !== id)));
    };

    const handleSave = (user) => {
        setSelectedUserId(null);
        fetch('http://localhost:8000/users')
            .then(response => response.json())
            .then(data => setUsers(data));
    };
    if (isHidden) {
        return <div>Accès refusé</div>;
    }
    return (
        <div>
            <h2>Gestion des Utilisateurs</h2>
            <table className="table table-striped my-4">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Rôles</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.roles.join(', ')}</td>
                        <td>
                            <a className="btn btn-danger mx-2" onClick={() => handleDelete(user.id)}>Supprimer</a>
                            <a className="btn btn-primary" onClick={() => setSelectedUserId(user.id)}>Modifier</a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h3 className="text-center">{selectedUserId ? 'Modifier' : 'Ajouter'} un Utilisateur</h3>
            <UserForm userId={selectedUserId} onSave={handleSave} />
        </div>
    );
}

export default Users;
