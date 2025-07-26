@echo off
setlocal

:: Create root folder (assume you're already inside cloned repo)
mkdir frontend
mkdir frontend\public
mkdir frontend\src
mkdir frontend\src\components
mkdir frontend\src\pages
mkdir frontend\src\services

:: Create placeholder frontend files
echo // React App Entry > frontend\src\App.jsx
echo // React Root Index > frontend\src\index.js
echo CMC_API_KEY=your_api_key_here > frontend\.env
echo {} > frontend\package.json
echo [build] > frontend\netlify.toml
echo command = "npm run build" >> frontend\netlify.toml
echo publish = "build" >> frontend\netlify.toml

:: Create backend
mkdir backend
mkdir backend\utils

echo // Fetch market data from CMC > backend\fetchMarketData.js
echo // Analyze data with LLM > backend\analyzeWithLLM.js

:: CoinMarketCap API wrapper
echo const fetch = require('node-fetch'); > backend\utils\coinmarketcap.js
echo module.exports = async function fetchTopCoins(limit = 10) { >> backend\utils\coinmarketcap.js
echo. >> backend\utils\coinmarketcap.js
echo   const apiKey = process.env.CMC_API_KEY; >> backend\utils\coinmarketcap.js
echo   const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}&convert=USD`; >> backend\utils\coinmarketcap.js
echo. >> backend\utils\coinmarketcap.js
echo   try { >> backend\utils\coinmarketcap.js
echo     const response = await fetch(url, { >> backend\utils\coinmarketcap.js
echo       headers: { >> backend\utils\coinmarketcap.js
echo         'X-CMC_PRO_API_KEY': apiKey, >> backend\utils\coinmarketcap.js
echo         'Accept': 'application/json' >> backend\utils\coinmarketcap.js
echo       } >> backend\utils\coinmarketcap.js
echo     }); >> backend\utils\coinmarketcap.js
echo. >> backend\utils\coinmarketcap.js
echo     if (!response.ok) throw new Error(`API error: ${response.status}`); >> backend\utils\coinmarketcap.js
echo     const json = await response.json(); >> backend\utils\coinmarketcap.js
echo     return json.data.map(coin => ({ >> backend\utils\coinmarketcap.js
echo       id: coin.id, name: coin.name, symbol: coin.symbol, >> backend\utils\coinmarketcap.js
echo       price: coin.quote.USD.price, market_cap: coin.quote.USD.market_cap, >> backend\utils\coinmarketcap.js
echo       volume: coin.quote.USD.volume_24h, percent_change_7d: coin.quote.USD.percent_change_7d >> backend\utils\coinmarketcap.js
echo     })); >> backend\utils\coinmarketcap.js
echo   } catch (error) { >> backend\utils\coinmarketcap.js
echo     console.error(\"Error:\", error); >> backend\utils\coinmarketcap.js
echo     return []; >> backend\utils\coinmarketcap.js
echo   } >> backend\utils\coinmarketcap.js
echo }; >> backend\utils\coinmarketcap.js


:: Create database folder and files
mkdir database
echo -- SQL schema for Supabase > database\schema.sql
echo // Supabase config setup > database\supabaseConfig.js

:: Create README
echo # Crypto Sentinel AI > README.md
echo AI-powered crypto monitoring tool using real-time market data and LLM recommendations. >> README.md

echo Project scaffold completed successfully!
pause
