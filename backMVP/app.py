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

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    if Usuario.query.filter_by(email=email).first():
        return jsonify({'message': 'Usuário já existe'}), 400

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = Usuario(email=email, password_hash=password_hash)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Usuário registrado com sucesso'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = Usuario.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login bem-sucedido'}), 200
    else:
        return jsonify({'message': 'Credenciais inválidas'}), 401

@app.route('/pedidos', methods=['GET'])
def get_pedidos():
    pedidos = Pedido.query.all()
    return jsonify([pedido.to_dict() for pedido in pedidos])

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

@app.route('/pedidos/<int:pedido_id>', methods=['DELETE'])
def delete_pedido(pedido_id):
    pedido = Pedido.query.get(pedido_id)
    if pedido is None:
        return jsonify({'message': 'Pedido não encontrado'}), 404

    db.session.delete(pedido)
    db.session.commit()
    return jsonify({'message': 'Pedido deletado com sucesso'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
