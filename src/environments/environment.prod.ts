import { Config } from './config.interface';

export const environment: Config = {
  production: true,
  apiEndpoints: {
    product: 'https://xttbns1ws7.execute-api.us-east-1.amazonaws.com/prod',
    order: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
    import: 'https://b2jhx6fctd.execute-api.us-east-1.amazonaws.com/prod',
    bff: 'https://xttbns1ws7.execute-api.us-east-1.amazonaws.com/prod',
    cart: 'https://.execute-api.eu-west-1.amazonaws.com/dev',
  },
  apiEndpointsEnabled: {
    product: false,
    order: false,
    import: true,
    bff: false,
    cart: false,
  },
};
