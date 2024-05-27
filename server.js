require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8080;
const app = express();
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({
  accessToken:
    "TEST-6613867413576383-050207-e9aa192b449a08d145705a23d7ad4f8f-491581869",
});

const preference = new Preference(client);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("../"));
app.use(cors());
app.get("/", function (req, res) {
  res.status(200).sendFile("../index.html");
});

app.post("/create_preference", (req, res) => {
  preference
    .create({
      body: {
        items: [
          {
            title: req.body.title,
				    unit_price: Number(req.body.unit_price),
				    quantity: Number(req.body.quantity),
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
        body: response,
      });
    })
    .catch(function (error) {
      console.log(error);
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