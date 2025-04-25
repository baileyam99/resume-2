const firebaseAdmin = require('firebase-admin');
const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');

// V2 ReCAPTCHA secret key
const secretKey = '6LcM7vIkAAAAAAqgJWR0_LQkBBHgiERmenquAWQh';

admin.initializeApp();

const verifyRecaptcha = async (token) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    console.error('Error verifying reCAPTCHA token:', error);
    return { success: false };
  }
};

// Cors options
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://10.0.0.47:3000',
    'https://www.alexbaileyresume.com',
  ],
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type', 'X-Firebase-AppCheck']
};

// Create the app instance
const app = require('express')();
const admin_tools = require('express')();

// Apply the CORS middleware to all routes in the app
app.use('*', cors(corsOptions));
admin_tools.use(cors(corsOptions));

const appCheckVerification = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    console.error('APP CHECK VERIFICATION: NO TOKEN');
    res.status(401).json({ error: 'Token was not found. Request failed with status code 401.' });;
    return next('Unauthorized');
  }

  try {
    await firebaseAdmin.appCheck().verifyToken(appCheckToken);
    return next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Request failed with status code 401.' });;
    return next('Unauthorized');
  }
}

// Define the HTTP cloud function
app.post('/verifyRecaptcha', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send({ error: 'Token is required' });
  }

  const response = await verifyRecaptcha(token);
  res.status(200).send(response);
});

// Export the app as a Firebase Cloud Function
exports.app = functions.https.onRequest(app);
