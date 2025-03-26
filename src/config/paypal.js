const {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} = require("@paypal/paypal-server-sdk");
const User = require('../models/User');

// Initialize PayPal client
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: process.env.PAYPAL_MODE === 'sandbox' ? Environment.Sandbox : Environment.Production,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart) => {
  try {
    const { moduleNumber, programType, userId } = cart;

    // Define price configuration similar to Stripe
    const PRICE_CONFIG = {
      1: {
        PC: 150, // $500
        TDE: 1000 // $1000
      },
      2: 500, // $500
      3: 500 // $500
    };

    // Determine the order amount based on module and program type
    let amount;
    const moduleNum = parseInt(moduleNumber);

    if (!PRICE_CONFIG[moduleNum]) {
      throw new Error(`Invalid module number: ${moduleNum}`);
    }

    if (moduleNum === 1) {
      if (!programType || !PRICE_CONFIG[moduleNum][programType]) {
        throw new Error(`Invalid program type for module 1: ${programType}`);
      }
      amount = PRICE_CONFIG[moduleNum][programType];
    } else {
      amount = PRICE_CONFIG[moduleNum];
    }

    // Get user info if userId is provided
    let userInfo = { firstName: 'Customer', lastName: '' };
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        userInfo = {
          firstName: user.firstName,
          lastName: user.lastName
        };
      }
    }

    const collect = {
      body: {
        intent: "CAPTURE",
        purchaseUnits: [{
          amount: {
            currencyCode: "USD",
            value: amount.toString()
          },
          description: `Registration for ${userInfo.firstName} ${userInfo.lastName}`,
          customId: userId || '',
          invoiceId: `TLV-${Date.now()}-${moduleNum}`
        }],
        applicationContext: {
          brandName: "The Leadership Voice",
          shippingPreference: "NO_SHIPPING"
        }
      },
      prefer: "return=representation"
    };

    const { body, ...httpResponse } = await ordersController.ordersCreate(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  try {
    const collect = {
      id: orderID,
      prefer: "return=representation"
    };

    const { body, ...httpResponse } = await ordersController.ordersCapture(collect);
    const jsonResponse = JSON.parse(body);

    // Update user payment status if userId is in the order
    try {
      const customId = jsonResponse.purchase_units[0].custom_id;
      if (customId) {
        await User.findByIdAndUpdate(
          customId,
          {
            paymentStatus: 'completed',
            paymentMethod: 'paypal',
            paymentReference: orderID
          },
          { new: true }
        );
      }
    } catch (userUpdateError) {
      console.error("Error updating user payment status:", userUpdateError);
      // Continue with the response even if user update fails
    }

    return {
      jsonResponse,
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

module.exports = {
  createOrder,
  captureOrder
};
