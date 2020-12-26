// const dotenv = require('dotenv');

// dotenv.config({ path: './src/libraries/config/config.env' });


exports.database = {
    DB: process.env.DATABASE,
    LOCAL: process.env.DB_LOCAL,
}

exports.email = {
    FROM: process.env.EMAIL_FROM,
    USER: process.env.EMAIL_USERNAME,
    PASS: process.env.EMAIL_PASSWORD
}

exports.smtpEmail = {
    HOST: process.env.SMTP_EMAIL_HOST,
    PORT: process.env.SMTP_EMAIL_PORT,
    USER: process.env.SMTP_EMAIL_USER,
    PASS: process.env.SMTP_EMAIL_PASS,
}

exports.jwt = {
    SECRET: process.env.JWT_SECRET,
    EXPIRES: process.env.JWT_EXPIRES_IN,
    COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES
}

exports.session = {
    SECRET: process.env.SESSION_SECRET
}

exports.env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
}
