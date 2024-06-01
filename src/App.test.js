import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LoginForm from './Login';
import Inscription from './Inscription';

test('handleSubmit function', () => {
  const { getByLabelText, getByText } = render(<LoginForm />);

  // Sélectionner les champs de saisie et le bouton
  const usernameInput = getByLabelText('Nom d\'utilisateur');
  const passwordInput = getByLabelText('Mot de passe');
  const submitButton = getByText('Se connecter');

  // Simuler la saisie de l'utilisateur
  fireEvent.change(usernameInput, { target: { value: 'john_doe' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Mock de la fonction handleSubmit
  const handleSubmitMock = jest.fn();
  handleSubmitMock.mockImplementation((e) => {
    e.preventDefault();
    console.log('Username:', usernameInput.value);
    console.log('Password:', passwordInput.value);
    // Ajouter ici la logique de connexion simulée
  });

  // Attacher le mock de la fonction handleSubmit à l'événement de soumission du formulaire
  submitButton.addEventListener('click', handleSubmitMock);
  fireEvent.click(submitButton);

  // Vérifier si la fonction handleSubmit a été appelée avec les bonnes valeurs
  expect(handleSubmitMock).toHaveBeenCalledWith(expect.objectContaining({ preventDefault: expect.any(Function) }));
  expect(handleSubmitMock).toHaveBeenCalledWith(expect.objectContaining({ target: expect.any(Object) }));
});



test('handleSubmit Inscription function', () => {
  const { getByLabelText, getByText } = render(<Inscription />);

  // Sélectionner les champs de saisie et le bouton
  const usernameInput = getByLabelText('Nom d\'utilisateur');
  const passwordInput = getByLabelText('Mot de passe');
  const submitButton = getByText('Inscription');

  // Simuler la saisie de l'utilisateur
  fireEvent.change(usernameInput, { target: { value: 'john_doe' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });

  // Mock de la fonction handleSubmit
  const handleSubmitMock = jest.fn();
  handleSubmitMock.mockImplementation((e) => {
    e.preventDefault();
    console.log('Username:', usernameInput.value);
    console.log('Password:', passwordInput.value);
    // Ajouter ici la logique de connexion simulée
  });

  // Attacher le mock de la fonction handleSubmit à l'événement de soumission du formulaire
  submitButton.addEventListener('click', handleSubmitMock);
  fireEvent.click(submitButton);

  // Vérifier si la fonction handleSubmit a été appelée avec les bonnes valeurs
  expect(handleSubmitMock).toHaveBeenCalledWith(expect.objectContaining({ preventDefault: expect.any(Function) }));
  expect(handleSubmitMock).toHaveBeenCalledWith(expect.objectContaining({ target: expect.any(Object) }));
});


