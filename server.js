require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const port = process.env.PORT || 3000;
const app = express();

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-49489147475058-052710-2347f40a5c8567710091311cfcbe7f3d-1829675971",
});

const preference = new Preference(client);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));
app.use(cors());

app.get("/", function (req, res) {
  res.send([
    {
      name: 'kevin',
      apellido: 'meichtry',
      id: 9839420734,
      localidad: 'Maria Teresa',
      age: 56
    }
  ])
});

app.post("/create_preference", (req, res) => {
  preference.create({
    body: {
      items: [
        {
          title: req.body.title,
          unit_price: Number(req.body.unit_price),
          quantity: Number(req.body.quantity),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        "success": "http://localhost:3000/feedback",
        "failure": "http://localhost:3000/feedback",
        "pending": "http://localhost:3000/feedback"
      },
      auto_return: "approved",
    },
  })
  .then(function (response) {
    res.json({
      id: response.id,
    });
  })
  .catch(function (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al crear la preferencia :("
    })
  });
});

app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

app.listen(port, () => {
  console.log("The server is now running on Port", port);
});
