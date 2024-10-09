import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom'; 
import { Sun, Moon } from 'lucide-react';


export const Register: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não correspondem!');
      return;
    }
    console.log('Usuário registrado com', { email, password });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className={`p-8 rounded shadow-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Registrar</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Digite seu email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Digite sua senha"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium">Confirme a Senha:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Confirme sua senha"
            />
          </div>
          <div className="flex justify-between items-center flex-col gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full  px-4 py-2 rounded"
            >
              Registrar
            </button>
            <Link to="/" className="w-full"> 
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 w-full"
              >
                Ja tenho uma conta
              </button>
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded p-2"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
