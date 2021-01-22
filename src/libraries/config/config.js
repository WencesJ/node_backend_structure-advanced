// const dotenv = require('dotenv');

// dotenv.config({ path: './src/libraries/config/config.env' });

const { env } = process;


exports.database = {
    DB: env.DATABASE,
    LOCAL: env.DB_LOCAL,
}

exports.email = {
    FROM: env.EMAIL_FROM,
    USER: env.EMAIL_USERNAME,
    PASS: env.EMAIL_PASSWORD
}

exports.smtpEmail = {
    HOST: env.SMTP_EMAIL_HOST,
    PORT: env.SMTP_EMAIL_PORT,
    USER: env.SMTP_EMAIL_USER,
    PASS: env.SMTP_EMAIL_PASS,
}

exports.jwt = {
    SECRET: env.JWT_SECRET,
    EXPIRES: env.JWT_EXPIRES_IN,
    COOKIE_EXPIRES: env.JWT_COOKIE_EXPIRES
}

exports.session = {
    SECRET: env.SESSION_SECRET,
    NAME: env.SESSION_NAME,
    COOKIE_MAX_AGE: env.SESSION_COOKIE_MAX_AGE,
    STORE_SECRET: env.SESSION_STORE_SECRET,
    STORE_TTL: env.SESSION_STORE_TTL,
    ABSOLUTE_TIMEOUT: env.SESSION_ABSOLUTE_TIMEOUT
}

exports.env = {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    PROD: env.PROD
}
