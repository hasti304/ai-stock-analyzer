from .ml.model_utils import StockPredictor
from .models import Stock

class MLService:
    
    @staticmethod
    def train_and_predict(symbol, periods=30):
        stock = Stock.query.filter_by(symbol=symbol.upper()).first()
        if not stock:
            return {'success': False, 'error': 'Stock not found'}
        
        predictor = StockPredictor(symbol)
        
        df = predictor.prepare_data(stock.id)
        if df is None:
            return {'success': False, 'error': 'No price data available'}
        
        train_result = predictor.train(df)
        if not train_result['success']:
            return train_result
        
        metrics = predictor.evaluate(df)
        
        predict_result = predictor.predict(periods)
        if not predict_result['success']:
            return predict_result
        
        return {
            'success': True,
            'stock': stock.to_dict(),
            'metrics': metrics,
            'predictions': predict_result['predictions']
        }
