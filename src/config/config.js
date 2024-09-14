const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').default('development').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().description('JWT secret key'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    APP_SENDGRID_KEY: Joi.string().description('sendgrid key for emails'),
    CLIENT_URL: Joi.string().description('client url'),
    CLIENT_LOGO: Joi.string().description('client logo'),
    SKIP_EMAILS: Joi.boolean().default(false),
    OPEN_AI_URL: Joi.string(),
    OPEN_AI_KEY: Joi.string(),
    OPEN_AI_HOST: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  mailEnv: envVars.MAIL_ENV,
  port: envVars.PORT,
  clientURL: envVars.CLIENT_URL,
  serverURL: envVars.SERVER_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationMinutes: envVars.JWT_REFRESH_EXPIRATION_MINUTES,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  otp: {
    otpExpirationMinutes: envVars.OTP_EXPIRATION_MINUTES,
  },
  email: {
    sendgridKey: envVars.APP_SENDGRID_KEY,
    from: envVars.EMAIL_FROM,
    name: envVars.EMAIL_NAME,
    applicationDeveloper: [
      'pragati.kesarwani@unthinkable.co',
      'akshay.singh1@daffodilsw.com',
    ],
  },
  skippedOptions: { skipEmails: envVars.SKIP_EMAILS, skipNotifications: envVars.SKIP_NOTIFICATIONS , skipSMSs: envVars.SKIPS_SMS},
  open_ai: {
    url: envVars.OPEN_AI_URL,
    key: envVars.OPEN_AI_KEY,
    host: envVars.OPEN_AI_HOST,
  },
  staticPath: envVars.STATIC_PATH || 'temp',
  socketURL: envVars.SOCKET_URL,
  socket: envVars.SOCKET,
  whitelistedURL: envVars.WHITELISTED_URL ? envVars.WHITELISTED_URL.split(',') : [envVars.CLIENT_URL],
};
