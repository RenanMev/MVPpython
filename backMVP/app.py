from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:dW5#Tz8r3L!9Qz1V@localhost/pedidos_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

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

class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email
        }

class UsuarioService:
    @staticmethod
    def registrar_usuario(email, password):
        if Usuario.query.filter_by(email=email).first():
            return {'message': 'Usuário já existe'}, 400
        
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = Usuario(email=email, password_hash=password_hash)
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'Usuário registrado com sucesso'}, 201

    @staticmethod
    def login_usuario(email, password):
        user = Usuario.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password_hash, password):
            return {'message': 'Login bem-sucedido'}, 200
        else:
            return {'message': 'Credenciais inválidas'}, 401

class PedidoService:
    @staticmethod
    def criar_pedido(cliente, endereco, produto, status):
        novo_pedido = Pedido(cliente=cliente, endereco=endereco, produto=produto, status=status)
        db.session.add(novo_pedido)
        db.session.commit()
        return novo_pedido.to_dict(), 201

    @staticmethod
    def atualizar_pedido(pedido_id, data):
        pedido = Pedido.query.get(pedido_id)
        if pedido is None:
            return {'message': 'Pedido não encontrado'}, 404
        
        pedido.cliente = data.get('cliente', pedido.cliente)
        pedido.endereco = data.get('endereco', pedido.endereco)
        pedido.produto = data.get('produto', pedido.produto)
        pedido.status = data.get('status', pedido.status)
        db.session.commit()
        return pedido.to_dict(), 200

    @staticmethod
    def deletar_pedido(pedido_id):
        pedido = Pedido.query.get(pedido_id)
        if pedido is None:
            return {'message': 'Pedido não encontrado'}, 404
        
        db.session.delete(pedido)
        db.session.commit()
        return {'message': 'Pedido deletado com sucesso'}, 200

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    return UsuarioService.registrar_usuario(data['email'], data['password'])

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    return UsuarioService.login_usuario(data['email'], data['password'])

@app.route('/pedidos', methods=['GET'])
def get_pedidos():
    pedidos = Pedido.query.all()
    return jsonify([pedido.to_dict() for pedido in pedidos])

@app.route('/pedidos', methods=['POST'])
def create_pedido():
    novo_pedido = request.json
    return PedidoService.criar_pedido(novo_pedido['cliente'], novo_pedido['endereco'], novo_pedido['produto'], novo_pedido['status'])

@app.route('/pedidos/<int:pedido_id>', methods=['PUT'])
def update_pedido(pedido_id):
    data = request.json
    return PedidoService.atualizar_pedido(pedido_id, data)

@app.route('/pedidos/<int:pedido_id>', methods=['DELETE'])
def delete_pedido(pedido_id):
    return PedidoService.deletar_pedido(pedido_id)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
