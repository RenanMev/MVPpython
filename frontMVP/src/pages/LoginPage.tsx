import React, { useState } from 'react';
import { LoginForm } from '@/components/login-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/login", { email, password })
      .then(() => {
        localStorage.setItem('accessToken', "true");
        setTimeout(() => {
          navigate("/home");
        }, 500);
      }).catch((error) => {
        console.error("Login failed:", error);
      });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center`}>
      <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} />
    </div>
  );
};
