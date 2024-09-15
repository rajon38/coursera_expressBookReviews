const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const authMiddleware = require('./router/authMiddleware.js');  // JWT middleware

const app = express();

app.use(express.json());

// Use session for customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Use the JWT middleware to protect routes under /customer/auth/*
app.use("/customer/auth/*", authMiddleware);

// Set up customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
