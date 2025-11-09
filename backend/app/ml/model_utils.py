import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
from ..models import StockPrice
import joblib
import os

class StockPredictor:
    
    def __init__(self, symbol):
        self.symbol = symbol
        self.model = None
        
    def prepare_data(self, stock_id, days=365):
        prices = StockPrice.query.filter_by(stock_id=stock_id)\
            .order_by(StockPrice.date.asc())\
            .limit(days)\
            .all()
        
        if not prices:
            return None
        
        df = pd.DataFrame([{
            'ds': p.date,
            'y': p.close_price
        } for p in prices])
        
        return df
    
    def train(self, df):
        if df is None or len(df) < 10:
            return {'success': False, 'error': 'Insufficient data for training'}
        
        self.model = Prophet(
            daily_seasonality=True,
            yearly_seasonality=True,
            weekly_seasonality=True
        )
        
        self.model.fit(df)
        
        return {'success': True, 'message': 'Model trained successfully'}
    
    def predict(self, periods=30):
        if self.model is None:
            return {'success': False, 'error': 'Model not trained'}
        
        future = self.model.make_future_dataframe(periods=periods)
        forecast = self.model.predict(future)
        
        predictions = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(periods)
        
        return {
            'success': True,
            'predictions': predictions.to_dict('records')
        }
    
    def evaluate(self, df):
        if self.model is None or df is None:
            return None
        
        forecast = self.model.predict(df)
        
        mae = mean_absolute_error(df['y'], forecast['yhat'])
        rmse = np.sqrt(mean_squared_error(df['y'], forecast['yhat']))
        
        return {
            'mae': round(mae, 2),
            'rmse': round(rmse, 2)
        }
    
    def save_model(self, filepath):
        if self.model:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            joblib.dump(self.model, filepath)
            return True
        return False
    
    def load_model(self, filepath):
        if os.path.exists(filepath):
            self.model = joblib.load(filepath)
            return True
        return False
