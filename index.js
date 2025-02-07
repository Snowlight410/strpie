// server.js

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')("sk_test_51Qpjfs09NrK5z855T2MU4aCV6ini7wBW8d4w5t5FvA3L6HYye6YlyGE4ZCTEyolGG8yoQ2DxaEKvWchWEA5jB8yN00G8iNlUlj")
// Initialize Express app
const app = express();

// Configure CORS
app.use(cors());

// Configure body parsers
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/payment-sheet', async (req, res) => {
    // Use an existing Customer ID if this is a returning customer.
    const amount = req.body.amount
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-06-20'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_test_51PxhFnRxcRbVVWzwO10YJopg9LklgRH8db7TutQR8HuCX7LFDRHUCOUmrYNkSD83VxiybF7SspXECZ2Sc4BRyfcS00XtIlchkV'
    });
  });
  


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
