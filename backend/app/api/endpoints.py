from flask import Blueprint, jsonify, request
from ..services import StockDataService
from ..models import Stock

api_bp = Blueprint('api', __name__)

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'AI Stock Analyzer API is running'
    }), 200

@api_bp.route('/stocks', methods=['GET'])
def get_stocks():
    stocks = Stock.query.all()
    return jsonify({
        'stocks': [stock.to_dict() for stock in stocks]
    }), 200

@api_bp.route('/stocks/fetch', methods=['POST'])
def fetch_stock():
    data = request.get_json()
    symbol = data.get('symbol')
    period = data.get('period', '1mo')
    
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400
    
    result = StockDataService.fetch_stock_data(symbol, period)
    
    if result['success']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500

@api_bp.route('/stocks/<symbol>/prices', methods=['GET'])
def get_stock_prices(symbol):
    limit = request.args.get('limit', 30, type=int)
    result = StockDataService.get_stock_prices(symbol, limit)
    
    if result:
        return jsonify(result), 200
    else:
        return jsonify({'error': 'Stock not found'}), 404
