// server.js
require('dotenv').config();
const express = require('express');
const identifyRoutes = require('./routes/identifyRoutes')
const cors = require('cors');



const app = express();

app.use(express.json());
app.use(cors());
app.use('/', identifyRoutes)

app.get('/', (req, res) => {
  res.send('Bitespeed Identity Reconciliation API');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
