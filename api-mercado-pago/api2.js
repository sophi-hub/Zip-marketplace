// Step 1: Import the parts of the module you want to use
const { MercadoPagoConfig, Preference } = require('mercadopago');

// O resto do seu código continua igual
;


// Step 2: Initialize the client object
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-5593607796954557-092821-c64b7b86bb2f21f48268017986839bb2-2009674095', options: { timeout: 5000, idempotencyKey: 'abc' } });

// Step 3: Initialize the API object
const preference = new Preference(client);

// Step 4: Create the request object
const body = {
    items: [
        {
          id: '1234',
          title: 'Dummy Title',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 10,
        },
      ],
      back_urls: {
        success: 'http://localhost:3000/',
        failure: 'http://localhost:3000/',
        pending: 'http://localhost:3000/',
      },
      auto_return: 'all',
};

// Step 5: Create request options object - Optional
const requestOptions = {
	idempotencyKey: '<IDEMPOTENCY_KEY>',
};

// Step 6: Make the request
preference.create({ body, requestOptions }).then(console.log).catch(console.log);