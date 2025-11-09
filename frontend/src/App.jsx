import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { stockAPI } from './services/api';

function App() {
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [metrics, setMetrics] = useState(null);

  const handleFetchAndPredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await stockAPI.fetchStockData(symbol, '3mo');
      
      const predictResult = await stockAPI.predictStock(symbol, 7);
      
      if (predictResult.success) {
        setStockData(predictResult.stock);
        setPredictions(predictResult.predictions);
        setMetrics(predictResult.metrics);
      } else {
        setError(predictResult.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = predictions ? predictions.map(pred => ({
    date: new Date(pred.ds).toLocaleDateString(),
    predicted: pred.yhat.toFixed(2),
    lower: pred.yhat_lower.toFixed(2),
    upper: pred.yhat_upper.toFixed(2)
  })) : [];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">
            🤖 AI-Powered Stock Market Analyzer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Stock Price Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Enter a stock symbol to fetch data and generate ML predictions
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Stock Symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL, GOOGL, MSFT"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleFetchAndPredict}
                  disabled={loading || !symbol}
                  size="large"
                >
                  {loading ? <CircularProgress size={24} /> : 'Analyze & Predict'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {stockData && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Stock Info
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Symbol:</strong> {stockData.symbol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Name:</strong> {stockData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Sector:</strong> {stockData.sector}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {metrics && (
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Model Accuracy
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>MAE:</strong> ${metrics.mae}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>RMSE:</strong> ${metrics.rmse}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Lower values indicate better accuracy
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {predictions && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      7-Day Price Predictions
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="predicted" stroke="#8884d8" strokeWidth={2} name="Predicted Price" />
                        <Line type="monotone" dataKey="lower" stroke="#82ca9d" strokeDasharray="3 3" name="Lower Bound" />
                        <Line type="monotone" dataKey="upper" stroke="#ffc658" strokeDasharray="3 3" name="Upper Bound" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default App;
