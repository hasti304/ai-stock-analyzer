# 🤖 AI-Powered Stock Market Analyzer

A full-stack web application that leverages machine learning to predict stock prices and optimize investment portfolios using Modern Portfolio Theory.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)
![Flask](https://img.shields.io/badge/Flask-3.0+-000000.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📊 Features

### Stock Price Prediction
- **ML-Powered Forecasting**: Uses Facebook Prophet for time-series prediction
- **7-Day Price Predictions**: Generates forecasts with confidence intervals
- **Model Accuracy Metrics**: Displays MAE (Mean Absolute Error) and RMSE (Root Mean Squared Error)
- **Interactive Visualizations**: Line charts showing predicted prices, upper/lower bounds

### Portfolio Optimizer
- **Multi-Stock Analysis**: Analyze and optimize portfolios with 2+ stocks
- **Modern Portfolio Theory**: Calculates optimal asset allocation
- **Risk-Return Analysis**: Computes expected return, volatility, and Sharpe ratio
- **Efficient Frontier**: Visualizes risk-return tradeoffs across portfolio combinations

### Real-Time Data
- Fetches live stock data from Yahoo Finance
- Supports any publicly traded stock symbol
- Historical data storage in SQLite database

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask (Python)
- **ML Library**: Prophet (Time-series forecasting)
- **Optimization**: SciPy, CVXPY
- **Database**: SQLAlchemy (SQLite)
- **Data Source**: yfinance (Yahoo Finance API)
- **WebSocket**: Flask-SocketIO (for future real-time updates)

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **State Management**: React Hooks

### DevOps
- **Version Control**: Git + GitHub
- **Package Management**: pip (Python), npm (Node.js)

## 📁 Project Structure

ai-stock-analyzer/
├── backend/
│ ├── app/
│ │ ├── init.py # Flask app initialization
│ │ ├── models.py # Database models (Stock, StockPrice)
│ │ ├── services.py # Stock data fetching service
│ │ ├── ml_service.py # ML prediction service
│ │ ├── portfolio_optimizer.py # Portfolio optimization logic
│ │ ├── api/
│ │ │ └── endpoints.py # REST API routes
│ │ └── ml/
│ │ └── model_utils.py # ML model utilities
│ ├── run.py # Application entry point
│ ├── requirements.txt # Python dependencies
│ └── venv/ # Virtual environment
├── frontend/
│ ├── src/
│ │ ├── App.jsx # Main React component
│ │ ├── components/
│ │ │ └── PortfolioOptimizer.jsx
│ │ └── services/
│ │ └── api.js # API service layer
│ ├── package.json # Node dependencies
│ └── vite.config.js # Vite configuration
├── .gitignore
└── README.md


## 🚀 Getting Started

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- Git

### Installation

#### 1. Clone the Repository
git clone https://github.com/hasti304/ai-stock-analyzer.git
cd ai-stock-analyzer


#### 2. Set Up Backend

**Navigate to backend folder:**
cd backend


**Create virtual environment:**
python -m venv venv


**Activate virtual environment:**
- Windows: `.\venv\Scripts\Activate`
- macOS/Linux: `source venv/bin/activate`

**Install dependencies:**
pip install -r requirements.txt


**Create `.env` file in project root:**
FLASK_APP=backend/app
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-this
DATABASE_URL=sqlite:///stock_analyzer.db


#### 3. Set Up Frontend

**Navigate to frontend folder:**
cd ../frontend


**Install dependencies:**
npm install


### Running the Application

**Terminal 1 - Start Backend:**
cd backend
.\venv\Scripts\Activate # Windows
python run.py

Backend runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
cd frontend
npm run dev

text
Frontend runs on: `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173`

## 📖 API Documentation

### Base URL
http://localhost:5000/api

text

### Endpoints

#### Health Check
GET /health

text

#### Fetch Stock Data
POST /stocks/fetch
Content-Type: application/json

{
"symbol": "AAPL",
"period": "1mo"
}

text

#### Get All Stocks
GET /stocks

text

#### Get Stock Prices
GET /stocks/{symbol}/prices?limit=30

text

#### Predict Stock Price
GET /stocks/{symbol}/predict?periods=7

text

#### Optimize Portfolio
POST /portfolio/optimize
Content-Type: application/json

{
"symbols": ["AAPL", "GOOGL", "MSFT", "TSLA"],
"period": "1y"
}

text

## 🎯 Usage Examples

### 1. Predict Stock Price
1. Click "Price Prediction" tab
2. Enter stock symbol (e.g., AAPL, GOOGL, TSLA)
3. Click "Analyze & Predict"
4. View 7-day forecast with confidence intervals

### 2. Optimize Portfolio
1. Click "Portfolio Optimizer" tab
2. Add stock symbols (minimum 2)
3. Click "Optimize Portfolio"
4. View optimal allocation percentages and metrics

## 🧠 How It Works

### Stock Price Prediction
1. Fetches historical stock data using yfinance
2. Trains a Prophet model on closing prices
3. Generates 7-day forecast with upper/lower bounds
4. Evaluates model accuracy using MAE and RMSE

### Portfolio Optimization
1. Downloads 1-year historical data for all stocks
2. Calculates daily returns and covariance matrix
3. Uses SciPy's optimization to maximize Sharpe ratio
4. Generates efficient frontier by testing random allocations
5. Returns optimal weights that balance risk and return

## 📈 Future Enhancements

- [ ] User authentication and saved portfolios
- [ ] Real-time WebSocket price updates
- [ ] Historical price comparison charts
- [ ] Backtesting portfolio strategies
- [ ] Docker containerization
- [ ] PostgreSQL database
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Cloud deployment (AWS/Heroku)
- [ ] Mobile responsive design improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hasti Panchal**
- GitHub: [@hastipanchal](https://github.com/hastipanchal)
- LinkedIn: [Hasti Panchal](https://linkedin.com/in/hasti-panchal)

## 🙏 Acknowledgments

- [Facebook Prophet](https://facebook.github.io/prophet/) for time-series forecasting
- [yfinance](https://github.com/ranaroussi/yfinance) for stock market data
- [Material-UI](https://mui.com/) for React components
- [Recharts](https://recharts.org/) for data visualization

---

⭐ If you found this project helpful, please give it a star!