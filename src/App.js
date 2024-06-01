import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header"
import Login from "./Login";
import React, { useState } from 'react';

import AdminDashboard from "./components/AdminDashboard"
import PageAccueil from "./components/pageaccueil";
import InscriptionForm from "./Inscription";
import MyCalendar from "../src/components/Calendar"
export default function App() {
const [log, setLog] = useState(false);


  return (
    <BrowserRouter>
      <Routes>

      <Route path='/' element={<Header />}>

      <Route path="Admin/*" element={<AdminDashboard />} />
      <Route path="Accueil" element={<PageAccueil />} />
      <Route path="Login" element={<Login />} />
      <Route path="Inscription" element={<InscriptionForm />} />
      <Route path="MyCalendar" element={<MyCalendar />} />


      </Route>
        </Routes>
    </BrowserRouter>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);