import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ZAxis } from 'recharts';
import { stockAPI } from '../services/api';

function PortfolioOptimizer() {
  const [symbolInput, setSymbolInput] = useState('');
  const [symbols, setSymbols] = useState(['AAPL', 'GOOGL', 'MSFT']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const addSymbol = () => {
    const trimmed = symbolInput.trim().toUpperCase();
    if (trimmed && !symbols.includes(trimmed)) {
      setSymbols([...symbols, trimmed]);
      setSymbolInput('');
    }
  };

  const removeSymbol = (symbol) => {
    setSymbols(symbols.filter(s => s !== symbol));
  };

  const handleOptimize = async () => {
    if (symbols.length < 2) {
      setError('Add at least 2 stocks');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await stockAPI.optimizePortfolio(symbols, '1y');
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const chartData = result?.efficient_frontier || [];

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Portfolio Optimizer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add stocks and optimize your portfolio allocation
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Add Stock Symbol"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && addSymbol()}
                placeholder="e.g., AAPL"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={addSymbol}
                disabled={!symbolInput.trim()}
                size="large"
              >
                Add Stock
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            {symbols.map(symbol => (
              <Chip
                key={symbol}
                label={symbol}
                onDelete={() => removeSymbol(symbol)}
                sx={{ mr: 1, mb: 1 }}
                color="primary"
              />
            ))}
          </Box>

          <Button
            variant="contained"
            onClick={handleOptimize}
            disabled={loading || symbols.length < 2}
            size="large"
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Optimize Portfolio'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Optimal Allocation
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Stock</strong></TableCell>
                        <TableCell align="right"><strong>Allocation %</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(result.optimal_portfolio.allocations).map(([symbol, allocation]) => (
                        <TableRow key={symbol}>
                          <TableCell>{symbol}</TableCell>
                          <TableCell align="right">{allocation}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Metrics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Expected Annual Return:</strong> {result.optimal_portfolio.expected_return}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Volatility (Risk):</strong> {result.optimal_portfolio.volatility}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Sharpe Ratio:</strong> {result.optimal_portfolio.sharpe_ratio}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                    Higher Sharpe ratio = Better risk-adjusted returns
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Efficient Frontier
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="volatility" name="Volatility %" unit="%" />
                    <YAxis type="number" dataKey="return" name="Return %" unit="%" />
                    <ZAxis type="number" dataKey="sharpe" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Legend />
                    <Scatter name="Possible Portfolios" data={chartData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  Each dot represents a possible portfolio combination. Larger dots have higher Sharpe ratios.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default PortfolioOptimizer;
