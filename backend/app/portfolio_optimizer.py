import numpy as np
import pandas as pd
from scipy.optimize import minimize
import yfinance as yf
from datetime import datetime, timedelta

class PortfolioOptimizer:
    
    def __init__(self, symbols, period='1y'):
        self.symbols = symbols
        self.period = period
        self.returns = None
        self.cov_matrix = None
        
    def fetch_data(self):
        data = {}
        for symbol in self.symbols:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=self.period)
            if not hist.empty:
                data[symbol] = hist['Close']
        
        if not data:
            return False
            
        df = pd.DataFrame(data)
        self.returns = df.pct_change().dropna()
        self.cov_matrix = self.returns.cov()
        return True
    
    def portfolio_performance(self, weights):
        returns = np.sum(self.returns.mean() * weights) * 252
        std = np.sqrt(np.dot(weights.T, np.dot(self.cov_matrix * 252, weights)))
        return returns, std
    
    def negative_sharpe(self, weights, risk_free_rate=0.02):
        p_returns, p_std = self.portfolio_performance(weights)
        return -(p_returns - risk_free_rate) / p_std
    
    def optimize_portfolio(self, risk_free_rate=0.02):
        if self.returns is None:
            return None
        
        num_assets = len(self.symbols)
        constraints = {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}
        bounds = tuple((0, 1) for _ in range(num_assets))
        initial_guess = num_assets * [1. / num_assets]
        
        result = minimize(
            self.negative_sharpe,
            initial_guess,
            args=(risk_free_rate,),
            method='SLSQP',
            bounds=bounds,
            constraints=constraints
        )
        
        if not result.success:
            return None
        
        optimal_weights = result.x
        returns, std = self.portfolio_performance(optimal_weights)
        sharpe = (returns - risk_free_rate) / std
        
        allocations = {
            symbol: round(weight * 100, 2)
            for symbol, weight in zip(self.symbols, optimal_weights)
        }
        
        return {
            'allocations': allocations,
            'expected_return': round(returns * 100, 2),
            'volatility': round(std * 100, 2),
            'sharpe_ratio': round(sharpe, 2)
        }
    
    def efficient_frontier(self, num_portfolios=100):
        if self.returns is None:
            return None
        
        results = []
        num_assets = len(self.symbols)
        
        for _ in range(num_portfolios):
            weights = np.random.random(num_assets)
            weights /= np.sum(weights)
            
            returns, std = self.portfolio_performance(weights)
            results.append({
                'return': round(returns * 100, 2),
                'volatility': round(std * 100, 2),
                'sharpe': round((returns - 0.02) / std, 2)
            })
        
        return results
