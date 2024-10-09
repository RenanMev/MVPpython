import React, { useState } from 'react';

// Simulação de dados de pedidos
interface Pedido {
  id: number;
  cliente: string;
  endereco: string;
  produto: string;
  status: string;
}

const pedidosIniciais: Pedido[] = [
  { id: 1, cliente: 'João', endereco: 'Rua A, 123', produto: 'Hambúrguer', status: 'A caminho' },
  { id: 2, cliente: 'Maria', endereco: 'Rua B, 456', produto: 'Pizza', status: 'Entregue' },
];

export const Home: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pedidoAtual, setPedidoAtual] = useState<Pedido | null>(null);
  const [novoPedido, setNovoPedido] = useState({ cliente: '', endereco: '', produto: '', status: 'A caminho' });

  const handleOpenDialog = (pedido?: Pedido) => {
    if (pedido) {
      setNovoPedido(pedido); // Preenche o form com os dados do pedido a ser editado
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNovoPedido({ ...novoPedido, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && pedidoAtual) {
      // Atualiza o pedido existente
      const pedidosAtualizados = pedidos.map(pedido =>
        pedido.id === pedidoAtual.id ? { ...pedidoAtual, ...novoPedido } : pedido
      );
      setPedidos(pedidosAtualizados);
    } else {
      // Adiciona um novo pedido
      const novoId = pedidos.length + 1;
      setPedidos([...pedidos, { id: novoId, ...novoPedido }]);
    }

    handleCloseDialog();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Gestão de Pedidos de Lanches</h1>

        {/* Botão para abrir o diálogo de novo pedido */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-all"
            onClick={() => handleOpenDialog()}
          >
            + Novo Pedido
          </button>
        </div>

        {/* Listagem de pedidos */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pedidos Atuais</h2>
          <ul>
            {pedidos.map((pedido) => (
              <li
                key={pedido.id}
                className="border-b last:border-none p-4 flex justify-between items-center"
              >
                <div>
                  <span className="font-bold text-lg text-gray-700">{pedido.cliente}</span> -{' '}
                  <span className="text-gray-600">{pedido.endereco}</span> -{' '}
                  <span className="text-gray-600">{pedido.produto}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      pedido.status === 'Entregue'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {pedido.status}
                  </span>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleOpenDialog(pedido)}
                  >
                    Editar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Dialog para registrar ou editar pedido */}
        {openDialog && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {isEditing ? 'Editar Pedido' : 'Novo Pedido'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
                  <input
                    type="text"
                    name="cliente"
                    value={novoPedido.cliente}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder="Nome do cliente"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço:</label>
                  <input
                    type="text"
                    name="endereco"
                    value={novoPedido.endereco}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder="Endereço de entrega"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Produto:</label>
                  <input
                    type="text"
                    name="produto"
                    value={novoPedido.produto}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                    placeholder="Produto a ser entregue"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                  <select
                    name="status"
                    value={novoPedido.status}
                    onChange={handleChange}
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    <option value="A caminho">A caminho</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    {isEditing ? 'Salvar Alterações' : 'Adicionar Pedido'}
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
