from flask import jsonify, request
from app import db
from app.models import Entry
from app.api import bp
from app.api.errors import bad_request

@bp.route('/entries', methods=['GET'])
def get_entries():
    entries = Entry.query.order_by(Entry.created_at.desc()).all()
    return jsonify([entry.to_dict() for entry in entries])

@bp.route('/entries', methods=['POST'])
def create_entry():
    data = request.get_json() or {}
    if 'content' not in data:
        return bad_request('must include content')
    
    entry = Entry(
        content=data['content'],
        mood=data.get('mood'),
        intensity=data.get('intensity'),
        entry_type=data.get('entry_type', 'text'),
        user_id=data.get('user_id', 1),  # Default user for now
        is_anonymous=data.get('is_anonymous', False)
    )
    db.session.add(entry)
    db.session.commit()
    return jsonify(entry.to_dict()), 201

@bp.route('/entries/<int:id>', methods=['GET'])
def get_entry(id):
    entry = Entry.query.get_or_404(id)
    return jsonify(entry.to_dict())

@bp.route('/entries/<int:id>', methods=['PUT'])
def update_entry(id):
    entry = Entry.query.get_or_404(id)
    data = request.get_json() or {}
    
    if 'content' in data:
        entry.content = data['content']
    if 'mood' in data:
        entry.mood = data['mood']
    if 'intensity' in data:
        entry.intensity = data['intensity']
    if 'is_anonymous' in data:
        entry.is_anonymous = data['is_anonymous']
    
    db.session.commit()
    return jsonify(entry.to_dict())

@bp.route('/entries/<int:id>', methods=['DELETE'])
def delete_entry(id):
    entry = Entry.query.get_or_404(id)
    db.session.delete(entry)
    db.session.commit()
    return '', 204
