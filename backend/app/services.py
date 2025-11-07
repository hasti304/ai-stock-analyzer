import yfinance as yf
from datetime import datetime, timedelta
from . import db
from .models import Stock, StockPrice

class StockDataService:
    
    @staticmethod
    def fetch_stock_data(symbol, period='1mo'):
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            hist = ticker.history(period=period)
            
            stock = Stock.query.filter_by(symbol=symbol.upper()).first()
            if not stock:
                stock = Stock(
                    symbol=symbol.upper(),
                    name=info.get('longName', symbol),
                    sector=info.get('sector', 'Unknown')
                )
                db.session.add(stock)
                db.session.commit()
            
            for date, row in hist.iterrows():
                existing_price = StockPrice.query.filter_by(
                    stock_id=stock.id,
                    date=date.date()
                ).first()
                
                if not existing_price:
                    price = StockPrice(
                        stock_id=stock.id,
                        date=date.date(),
                        open_price=row['Open'],
                        high_price=row['High'],
                        low_price=row['Low'],
                        close_price=row['Close'],
                        volume=row['Volume']
                    )
                    db.session.add(price)
            
            db.session.commit()
            return {'success': True, 'stock': stock.to_dict()}
            
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'error': str(e)}
    
    @staticmethod
    def get_stock_prices(symbol, limit=30):
        stock = Stock.query.filter_by(symbol=symbol.upper()).first()
        if not stock:
            return None
        
        prices = StockPrice.query.filter_by(stock_id=stock.id)\
            .order_by(StockPrice.date.desc())\
            .limit(limit)\
            .all()
        
        return {
            'stock': stock.to_dict(),
            'prices': [p.to_dict() for p in prices]
        }
