from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AI Stock Analyzer API is running'
    }), 200

@api_bp.route('/stocks', methods=['GET'])
def get_stocks():
    return jsonify({
        'stocks': [],
        'message': 'Stock list endpoint (to be implemented)'
    }), 200
