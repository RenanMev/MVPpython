import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Pedido {
  id: number;
  cliente: string;
  endereco: string;
  produto: string;
  status: string;
}

export const Home: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pedidoAtual, setPedidoAtual] = useState<Pedido | null>(null);
  const [novoPedido, setNovoPedido] = useState({ cliente: '', endereco: '', produto: '', status: 'A caminho' });
  const navigate = useNavigate();



  useEffect(() => {
    axios.get('http://localhost:5000/pedidos')
      .then(response => setPedidos(response.data))
      .catch(error => console.error('Erro ao buscar pedidos:', error));
  }, []);

  const handleOpenDialog = (pedido?: Pedido) => {
    if (pedido) {
      setNovoPedido(pedido);
      setPedidoAtual(pedido);
      setIsEditing(true);
    } else {
      setNovoPedido({ cliente: '', endereco: '', produto: '', status: 'A caminho' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPedidoAtual(null);
  };

  const handleLogout = () => {
    navigate("/")
    localStorage.removeItem('accessToken');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovoPedido({ ...novoPedido, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && pedidoAtual) {
      axios.put(`http://localhost:5000/pedidos/${pedidoAtual.id}`, novoPedido)
        .then(response => {
          setPedidos(pedidos.map(pedido => (pedido.id === pedidoAtual.id ? response.data : pedido)));
          handleCloseDialog();
        })
        .catch(error => console.error('Erro ao atualizar pedido:', error));
    } else {
      axios.post('http://localhost:5000/pedidos', novoPedido)
        .then(response => {
          setPedidos([...pedidos, response.data]);
          handleCloseDialog();
        })
        .catch(error => console.error('Erro ao criar pedido:', error));
    }
  };

  const handleDelete = (pedidoId: number) => {
    axios.delete(`http://localhost:5000/pedidos/${pedidoId}`)
      .then(() => {
        setPedidos(pedidos.filter(pedido => pedido.id !== pedidoId));
      })
      .catch(error => console.error('Erro ao deletar pedido:', error));
  };

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} min-h-screen`}>
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6 text-center`}>
            Gestão de Pedidos de Lanches
          </h1>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded p-2"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-all"
            onClick={() => handleOpenDialog()}
          >
            + Novo Pedido
          </button>
        </div>
        <div className={`shadow rounded-lg p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
            Pedidos Atuais
          </h2>
          <ul>
            {pedidos.map((pedido) => (
              <li key={pedido.id} className={`border-b last:border-none p-4 flex justify-between items-center ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <div>
                  <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    {pedido.cliente}
                  </span> -{' '}
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pedido.endereco}
                  </span> -{' '}
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {pedido.produto}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${pedido.status === 'Entregue' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {pedido.status}
                  </span>
                  <button className={`text-blue-600 hover:text-blue-800 ${isDarkMode ? 'text-blue-400' : ''}`} onClick={() => handleOpenDialog(pedido)}>Editar</button>
                  <button className={`text-red-600 hover:text-red-800 ${isDarkMode ? 'text-red-400' : ''}`} onClick={() => handleDelete(pedido.id)}>Deletar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
          <button onClick={handleLogout} className='bg-red-600 rounded-md p-2 text-white mt-4'>
            Logout
          </button>
        {openDialog && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className={`p-8 rounded-lg shadow-lg max-w-md w-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                {isEditing ? 'Editar Pedido' : 'Novo Pedido'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Cliente:</label>
                  <input
                    type="text"
                    name="cliente"
                    value={novoPedido.cliente}
                    onChange={handleChange}
                    className={`border ${isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300'} rounded p-2 w-full`}
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Endereço:</label>
                  <input
                    type="text"
                    name="endereco"
                    value={novoPedido.endereco}
                    onChange={handleChange}
                    className={`border ${isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300'} rounded p-2 w-full`}
                    placeholder="Endereço de entrega"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Produto:</label>
                  <input
                    type="text"
                    name="produto"
                    value={novoPedido.produto}
                    onChange={handleChange}
                    className={`border ${isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300'} rounded p-2 w-full`}
                    placeholder="Produto a ser entregue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Status:</label>
                  <select
                    name="status"
                    value={novoPedido.status}
                    onChange={handleChange}
                    className={`border ${isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300'} rounded p-2 w-full`}
                  >
                    <option value="A caminho">A caminho</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ${isDarkMode ? 'bg-gray-700' : ''}`}
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${isDarkMode ? 'bg-blue-500' : ''}`}
                  >
                    {isEditing ? 'Salvar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
