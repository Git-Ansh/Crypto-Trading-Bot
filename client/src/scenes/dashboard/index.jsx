// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { LogoutButton } from "../../components";
import { PlayArrow, Stop, AddCircle } from "@mui/icons-material";
import axios from "axios";
import { tokens as themeTokens } from "../../theme";

// ------------------ COMPONENT: MarketDataTable ------------------
const MarketDataTable = () => {
  const [coins, setCoins] = useState([]);
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);

  useEffect(() => {
    let ws;
    let reconnectTimer;

    const fetchTopCoins = async () => {
      try {
        const response = await axios.get("https://api.coincap.io/v2/assets", {
          params: { limit: 10 },
          timeout: 10000,
        });
        const top10 = response.data.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          priceUsd: parseFloat(coin.priceUsd),
          changePercent24Hr: parseFloat(coin.changePercent24Hr),
        }));
        setCoins(top10);
        return top10;
      } catch (err) {
        console.error("Error fetching top coins:", err);
      }
    };

    const connectWebSocket = (topCoinIds) => {
      if (!topCoinIds || topCoinIds.length === 0) return;
      const assetsParam = topCoinIds.join(",");
      const wsUrl = `wss://ws.coincap.io/prices?assets=${assetsParam}`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        // WebSocket connection established
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setCoins((prevCoins) =>
            prevCoins.map((coin) => {
              if (data[coin.id]) {
                return { ...coin, priceUsd: parseFloat(data[coin.id]) };
              }
              return coin;
            })
          );
        } catch (err) {
          console.error("Error parsing websocket data:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      ws.onclose = (e) => {
        console.log("WebSocket closed. Reconnecting in 5s...", e);
        reconnectTimer = setTimeout(() => {
          connectWebSocket(topCoinIds);
        }, 5000);
      };
    };

    fetchTopCoins().then((topCoins) => {
      if (topCoins) {
        const topCoinIds = topCoins.map((coin) => coin.id);
        connectWebSocket(topCoinIds);
      }
    });

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  return (
    <Box>
      <Typography variant="h6" mb="10px" sx={{ color: colors.white }}>
        Top 10 Ranked Coins - Live Prices
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: colors.black, overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.white }}>Coin</TableCell>
              <TableCell sx={{ color: colors.white }}>Price (USD)</TableCell>
              <TableCell sx={{ color: colors.white }}>24h %</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coins.map((coin) => (
              <TableRow key={coin.id}>
                <TableCell
                  sx={{
                    color: colors.gray,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                    alt={coin.symbol}
                    style={{ width: "24px", height: "24px", marginRight: "8px" }}
                  />
                  {coin.name}
                </TableCell>
                <TableCell sx={{ color: colors.gray }}>
                  ${coin.priceUsd?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell
                  sx={{
                    color: coin.changePercent24Hr > 0 ? colors.accent : colors.metallic,
                  }}
                >
                  {coin.changePercent24Hr?.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// ------------------ COMPONENT: PositionsTable ------------------
const PositionsTable = ({ positions }) => {
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);

  return (
    <Box mt="20px">
      <Typography variant="h6" mb="10px" sx={{ color: colors.white }}>
        Current Holdings
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: colors.primary, overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.white }}>Symbol</TableCell>
              <TableCell sx={{ color: colors.white }}>Quantity</TableCell>
              <TableCell sx={{ color: colors.white }}>Value (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((pos) => (
              <TableRow key={pos.symbol}>
                <TableCell sx={{ color: colors.gray }}>{pos.symbol}</TableCell>
                <TableCell sx={{ color: colors.gray }}>{pos.quantity}</TableCell>
                <TableCell sx={{ color: colors.gray }}>
                  ${pos.currentValue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// ------------------ COMPONENT: TradeHistoryTable ------------------
const TradeHistoryTable = ({ trades }) => {
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);

  return (
    <Box>
      <Typography variant="h6" mb="10px" sx={{ color: colors.white }}>
        Recent Trades
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: colors.primary, overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: colors.white }}>Symbol</TableCell>
              <TableCell sx={{ color: colors.white }}>Side</TableCell>
              <TableCell sx={{ color: colors.white }}>Price</TableCell>
              <TableCell sx={{ color: colors.white }}>Quantity</TableCell>
              <TableCell sx={{ color: colors.white }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ color: colors.gray }}>{trade.symbol}</TableCell>
                <TableCell sx={{ color: colors.gray }}>{trade.side}</TableCell>
                <TableCell sx={{ color: colors.gray }}>
                  ${trade.price.toFixed(2)}
                </TableCell>
                <TableCell sx={{ color: colors.gray }}>{trade.quantity}</TableCell>
                <TableCell sx={{ color: colors.gray }}>
                  {new Date(trade.date).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// ------------------ COMPONENT: PaperTradeForm ------------------
const PaperTradeForm = ({ onPlaceTrade }) => {
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);
  const [symbol, setSymbol] = useState("BTC");
  const [side, setSide] = useState("BUY");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol || !price || !quantity) return;
    onPlaceTrade({
      symbol,
      side,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
    });
    setPrice("");
    setQuantity("");
  };

  return (
    <Box>
      <Typography variant="h6" mb="10px" sx={{ color: colors.white }}>
        Paper Trade Orders
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap="10px"
        flexWrap="wrap"
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: colors.white }}>Symbol</InputLabel>
          <Select
            value={symbol}
            label="Symbol"
            onChange={(e) => setSymbol(e.target.value)}
            sx={{ color: colors.white, borderColor: colors.white }}
          >
            <MenuItem value="BTC">BTC</MenuItem>
            <MenuItem value="ETH">ETH</MenuItem>
            <MenuItem value="XRP">XRP</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: colors.white }}>Side</InputLabel>
          <Select
            value={side}
            label="Side"
            onChange={(e) => setSide(e.target.value)}
            sx={{ color: colors.white }}
          >
            <MenuItem value="BUY">BUY</MenuItem>
            <MenuItem value="SELL">SELL</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ width: "120px" }}
        />
        <TextField
          variant="outlined"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ width: "120px" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          startIcon={<AddCircle />}
        >
          Place Trade
        </Button>
      </Box>
    </Box>
  );
};

// ------------------ COMPONENT: BotControls ------------------
const BotControls = ({ botStatus, onStart, onStop }) => {
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);
  return (
    <Box>
      <Typography variant="h6" mb="10px" sx={{ color: colors.white }}>
        Trading Bot Controls
      </Typography>
      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap="10px">
        <Button
          variant="contained"
          color="success"
          startIcon={<PlayArrow />}
          onClick={onStart}
          disabled={botStatus === "running"}
        >
          Start Bot
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Stop />}
          onClick={onStop}
          disabled={botStatus === "stopped"}
        >
          Stop Bot
        </Button>
      </Box>
      <Typography mt="10px" sx={{ color: colors.white }}>
        Status: {botStatus}
      </Typography>
    </Box>
  );
};

// ------------------ COMPONENT: StrategyConfigForm ------------------
const StrategyConfigForm = () => {
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);
  const [strategy, setStrategy] = useState("MeanReversion");
  const [risk, setRisk] = useState(1);

  const handleSave = () => {
    alert(`Strategy: ${strategy}, Risk: ${risk}%`);
  };

  return (
    <Box>
      <Typography variant="h6" mb="10px" sx={{ color: colors.white }}>
        Strategy Configuration
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap="10px"
        flexWrap="wrap"
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel sx={{ color: colors.white }}>Strategy</InputLabel>
          <Select
            value={strategy}
            label="Strategy"
            onChange={(e) => setStrategy(e.target.value)}
            sx={{ color: colors.white }}
          >
            <MenuItem value="MeanReversion">Mean Reversion</MenuItem>
            <MenuItem value="Momentum">Momentum</MenuItem>
            <MenuItem value="NeuralNet">Neural Net</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Risk %"
          type="number"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          sx={{ width: "120px" }}
        />
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

// ------------------ MAIN DASHBOARD ------------------
const Dashboard = () => {
  const theme = useTheme();
  const colors = themeTokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  // Use a smaller padding for mobile devices
  const padding = isMobile ? "10px" : "20px";

  const [botStatus, setBotStatus] = useState("stopped");
  const [trades, setTrades] = useState([]);
  const [positions, setPositions] = useState([
    { symbol: "BTC", quantity: 0.5, currentValue: 14000 },
    { symbol: "ETH", quantity: 2, currentValue: 4000 },
  ]);

  const handleLogout = () => {
    console.log("User logged out");
  };

  const handleStartBot = () => {
    setBotStatus("running");
  };
  const handleStopBot = () => {
    setBotStatus("stopped");
  };

  const handlePlaceTrade = (trade) => {
    const newTrade = { ...trade, date: new Date().toISOString() };
    setTrades((prev) => [newTrade, ...prev]);
    const existingPos = positions.find((p) => p.symbol === trade.symbol);
    if (!existingPos) {
      const newPos = {
        symbol: trade.symbol,
        quantity: trade.side === "BUY" ? trade.quantity : -trade.quantity,
        currentValue: trade.price * trade.quantity,
      };
      setPositions([...positions, newPos]);
    } else {
      const updatedPositions = positions.map((p) => {
        if (p.symbol === trade.symbol) {
          const updatedQty =
            trade.side === "BUY" ? p.quantity + trade.quantity : p.quantity - trade.quantity;
          return { ...p, quantity: updatedQty, currentValue: updatedQty * trade.price };
        }
        return p;
      });
      setPositions(updatedPositions);
    }
  };

  // For mobile devices, use a single column layout; otherwise adjust grid columns
  const gridTemplateColumns = isMobile
    ? "1fr"
    : isXlDevices
    ? "repeat(12, 1fr)"
    : isMdDevices
    ? "repeat(6, 1fr)"
    : "repeat(3, 1fr)";

  return (
    <Box p={padding} sx={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      {/* Fixed Logout Button always visible in the top-right corner */}
      <Box sx={{ position: "fixed", top: padding, right: padding, zIndex: 1000 }}>
        <LogoutButton onClick={handleLogout} />
      </Box>
      {/* Header */}
      <Box mb="20px">
        <Typography variant="h4" sx={{ color: colors.white }}>
          CRYPTO TRADING DASHBOARD
        </Typography>
      </Box>
      <Box display="grid" gridTemplateColumns={gridTemplateColumns} gridAutoRows="auto" gap="20px">
        {/* Left Column */}
        <Box
          gridColumn={isMobile ? "span 1" : isXlDevices ? "span 4" : isMdDevices ? "span 6" : "span 3"}
          sx={{
            backgroundColor: "#1a1a1a",
            p: padding,
            border: "1px solid #00bbff",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 207, 231, 0.1)",
            overflow: "hidden"
          }}
        >
          <MarketDataTable />
        </Box>
        {/* Bot Controls */}
        <Box
          gridColumn={isMobile ? "span 1" : isXlDevices ? "span 4" : isMdDevices ? "span 6" : "span 3"}
          sx={{
            backgroundColor: "#1a1a1a",
            p: padding,
            border: "1px solid #333333",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden"
          }}
        >
          <BotControls botStatus={botStatus} onStart={handleStartBot} onStop={handleStopBot} />
        </Box>
        {/* Strategy Config */}
        <Box
          gridColumn={isMobile ? "span 1" : isXlDevices ? "span 4" : isMdDevices ? "span 6" : "span 3"}
          sx={{
            backgroundColor: "#1a1a1a",
            p: padding,
            border: "1px solid #333333",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden"
          }}
        >
          <StrategyConfigForm />
        </Box>
        {/* Middle Column */}
        <Box
          gridColumn={isMobile ? "span 1" : isXlDevices ? "span 6" : isMdDevices ? "span 6" : "span 3"}
          sx={{
            backgroundColor: "#1a1a1a",
            p: padding,
            border: "1px solid #333333",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden"
          }}
        >
          <PaperTradeForm onPlaceTrade={handlePlaceTrade} />
          <Box mt="20px">
            <TradeHistoryTable trades={trades} />
          </Box>
        </Box>
        {/* Right Column */}
        <Box
          gridColumn={isMobile ? "span 1" : isXlDevices ? "span 6" : isMdDevices ? "span 6" : "span 3"}
          sx={{
            backgroundColor: "#1a1a1a",
            p: padding,
            border: "1px solid #333333",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            overflow: "hidden"
          }}
        >
          <PositionsTable positions={positions} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
