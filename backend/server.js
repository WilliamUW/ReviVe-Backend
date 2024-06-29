require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const port = 3001;

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const VET_ID = "vechain"; // This is the slug for VeChain on CoinMarketCap

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
        params: {
          slug: VET_ID,
        },
      }
    );

    const data = response.data;
    const vechainData = data.data[Object.keys(data.data)[0]]; // Get the VET data
    const vet_price = vechainData.quote.USD.price;

    res.json({ vet_price });
  } catch (error) {
    console.error("Error fetching VET price:", error);
    res.status(500).json({ error: "Error fetching VET price" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
