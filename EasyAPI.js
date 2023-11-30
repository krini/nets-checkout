/**
 * Easy API
 * https://tech.dibspayment.com/easy/api/paymentapi
 */
import moment from 'moment';

export default class EasyAPI {
  constructor() {
    // A redirect URL used to identify navigation
    // from Mia SDK interface to the application.
    //
    // Note: Pass the same `redirectURL` for
    // payment registration with Easy API and
    // when presenting Mia SDK following payment registration.
    this.redirectURL = 'https://127.0.0.1/redirect.php';

    // Cancellation URL passed to EASY and the SDK to indentify
    // user cancellation by using the "Go back" link rendered
    // in the checkout webview.
    // Note: Pass the same `cancelURL` for
    // payment registration with Easy API and
    // when presenting Mia SDK following payment registration.
    this.cancelURL = 'https://cancellation-identifier-url';

    // Default currency
    this.currency = 'SEK';

    this.secretKey = 'YOUR TEST SECRET KEY';
  }

  createPaymentWithRequestBody(requestBody, callback) {
    // EASY test environment is used for this demo
    const baseURL = 'https://test.api.dibspayment.eu/v1/';

    fetch(baseURL + '/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.secretKey,
      },
      body: requestBody,
    })
      //     .then(response => {
      //     console.log('response', response)
      //
      // })
      .then(response => response.json())
      .then(json => {
        callback(json);
      })
      .catch(error => {
        console.error(error);
      });
  }

  makeSubscriptionRequest(price) {
    const paymentRequest = this.makePaymentRequest(price);

    const utc = '+03:00'; // EEST timezone is used for the sample app
    const subscriptionEndDate =
      moment()
        .local()
        .utcOffset(utc)
        .add(3, 'years')
        .format('YYYY-MM-DDThh:mm:ss') + utc;

    paymentRequest.subscription = {
      endDate: subscriptionEndDate,
      interval: 0,
    };

    return paymentRequest;
  }

  // Returns the JSON request body required to create
  // payment with Easy API.
  makePaymentRequest(price) {
    const amount = price * 100; // cents to notes
    return {
      checkout: {
        termsUrl: 'http://localhost:8080/terms',
        cancelURL: this.cancelURL,
        returnURL: this.redirectURL,
        integrationType: 'HostedPaymentPage',
        merchantHandlesConsumerData: true,
      },
      order: {
        reference: 'MiaSDK-iOS',
        items: [
          {
            reference: 'MiaSDK-iOS',
            name: 'Lightning Cable',
            quantity: 1,
            unit: 'pcs',
            unitPrice: amount,
            grossTotalAmount: amount,
            netTotalAmount: amount,
          },
        ],
        amount: amount,
        currency: 'DKK',
      },
    };
  }
}
