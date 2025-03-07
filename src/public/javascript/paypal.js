window.paypal
  .Buttons({
    style: {
      shape: "pill",
      layout: "horizontal",
      color: "blue",
      label: "paypal",
    },

    async createOrder() {
      try {
        console.log('Creating PayPal order - Start');

        // Get user email from the window.moduleData object
        const moduleData = window.moduleData || {};
        console.log('Module data:', moduleData);
        const userEmail = moduleData.userEmail || '';

        if (!userEmail) {
          console.error('User email is missing');
          throw new Error('User email is required for payment processing');
        }

        console.log('Fetching user data for email:', userEmail);

        // Fetch user data from the server using email
        const userDataResponse = await fetch(`/api/users/payment-data?email=${encodeURIComponent(userEmail)}`);

        if (!userDataResponse.ok) {
          throw new Error(`Failed to fetch user data: ${userDataResponse.status} ${userDataResponse.statusText}`);
        }

        const userData = await userDataResponse.json();
        console.log('User data received:', userData);

        // Extract module information from the server response
        const moduleNumber = userData.moduleNumber;
        const programType = userData.programType || '';
        const userId = userData._id;

        console.log('Order details:', {
          moduleNumber,
          programType,
          userId
        });

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: {
              moduleNumber: moduleNumber,
              programType: programType,
              userId: userId
            },
          }),
        });

        console.log('API Response status:', response.status);

        // Check if response is OK before trying to parse JSON
        if (!response.ok) {
          const text = await response.text();
          console.error('Error response:', text);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const orderData = await response.json();
        console.log('Order data received:', orderData);

        if (orderData.id) {
          console.log('Order created successfully with ID:', orderData.id);
          return orderData.id;
        }

        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        console.error('Order creation failed:', errorMessage);
        throw new Error(errorMessage);
      } catch (error) {
        console.error('Order creation error:', error);
        console.error('Error stack:', error.stack);
        window.location.assign("/payment-error?message=" + encodeURIComponent(error.message));
      }
    },

    async onApprove(data, actions) {
      try {
        const response = await fetch(
          `/api/orders/${data.orderID}/capture`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const orderData = await response.json();
        const errorDetail = orderData?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          return actions.restart();
        } else if (errorDetail) {
          throw new Error(
            `${errorDetail.description} (${orderData.debug_id})`
          );
        } else if (!orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } else {
          // Successful transaction - redirect to profile page
          window.location.assign("/profile?payment_success=true");
        }
      } catch (error) {
        console.error(error);
        window.location.assign("/payment-error?message=" + encodeURIComponent(error.message));
      }
    },

    onError: (err) => {
      // redirect to error page
      window.location.assign("/payment-error?message=" + encodeURIComponent(err.message || "Unknown error"));
    },

    onCancel: (data) => {
      // Return to home page
      window.location.assign("/");
    },
  })
  .render("#paypal-button-container");