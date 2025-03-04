import '../loadEnvironment';

const isTest = process.env.NODE_ENV !== 'production';

export const totalumOptions = {
  apiKey: {
    'api-key': process.env.TOTALUM_API_KEY,
  },
};
