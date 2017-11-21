const dotenv = require('dotenv')

dotenv.config()

const config = {
  app: {
    env: process.env.APP_ENV || 'development',
    email: process.env.EMAIL_ALEGRA || '',
    token: process.env.TOKEN_ALEGRA || '',
    url_api: process.env.URL_API || '',
  },
}

module.exports = config
