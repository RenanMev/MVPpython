from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

# Configurações do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:dW5#Tz8r3L!9Qz1V@localhost/pedidos_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelo para a tabela Pedidos
class Pedido(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cliente = db.Column(db.String(100), nullable=False)
    endereco = db.Column(db.String(255), nullable=False)
    produto = db.Column(db.String(100), nullable=False)
    status = db.Column(db.Enum('A caminho', 'Entregue'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'cliente': self.cliente,
            'endereco': self.endereco,
            'produto': self.produto,
            'status': self.status
        }

# Rota para obter todos os pedidos
@app.route('/pedidos', methods=['GET'])
def get_pedidos():
    pedidos = Pedido.query.all()
    return jsonify([pedido.to_dict() for pedido in pedidos])

# Rota para criar um novo pedido
@app.route('/pedidos', methods=['POST'])
def create_pedido():
    novo_pedido = request.json
    pedido = Pedido(
        cliente=novo_pedido['cliente'],
        endereco=novo_pedido['endereco'],
        produto=novo_pedido['produto'],
        status=novo_pedido['status']
    )
    db.session.add(pedido)
    db.session.commit()
    return jsonify(pedido.to_dict()), 201

# Rota para atualizar um pedido existente
@app.route('/pedidos/<int:pedido_id>', methods=['PUT'])
def update_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if pedido is None:
        return jsonify({'message': 'Pedido não encontrado'}), 404

    data = request.json
    pedido.cliente = data.get('cliente', pedido.cliente)
    pedido.endereco = data.get('endereco', pedido.endereco)
    pedido.produto = data.get('produto', pedido.produto)
    pedido.status = data.get('status', pedido.status)
    db.session.commit()
    return jsonify(pedido.to_dict())

# Rota para deletar um pedido
@app.route('/pedidos/<int:pedido_id>', methods=['DELETE'])
def delete_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if pedido is None:
        return jsonify({'message': 'Pedido não encontrado'}), 404

    db.session.delete(pedido)
    db.session.commit()
    return jsonify({'message': 'Pedido deletado com sucesso'})

if __name__ == '__main__':
    with app.app_context():  # Adiciona o contexto do aplicativo aqui
        db.create_all()  # Cria as tabelas no banco de dados
    app.run(debug=True)
