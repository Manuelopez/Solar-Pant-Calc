const express = require('express');
const getSolarData = require('./hottel');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));
app.use(express.json());

app.post('/getSolarData', (req, res) => {
  const csvData = getSolarData(
    req.body.latitud,
    req.body.altura,
    req.body.r0,
    req.body.r1,
    req.body.rk,
    req.body.area,
    req.body.eff,
    req.body.panels,
    req.body.lost
  );
  res.send({ csvData });
});

app.listen(port, () => {
  console.log('running');
});
