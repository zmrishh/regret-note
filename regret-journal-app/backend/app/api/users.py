from flask import jsonify, request
from app import db
from app.models import User
from app.api import bp
from app.api.errors import bad_request

@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return bad_request('must include username, email and password fields')
    if User.query.filter_by(username=data['username']).first():
        return bad_request('please use a different username')
    if User.query.filter_by(email=data['email']).first():
        return bad_request('please use a different email address')
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    
    response = jsonify(user.to_dict())
    response.status_code = 201
    return response

@bp.route('/users/<int:id>/entries', methods=['GET'])
def get_user_entries(id):
    user = User.query.get_or_404(id)
    entries = user.entries.order_by(Entry.created_at.desc()).all()
    return jsonify([entry.to_dict() for entry in entries])
