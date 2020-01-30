const express = require('express');
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerConfigGenerator = require('./swagger/swaggerConfigGenerator')
const swaggerMiddleware = require('./swagger/swaggerMiddleware')
const helmet = require('helmet')

const createApplication = async () => {
  // Create global app objects
  const app = express();
  app.use(helmet())
  app.use(cors())

  // use swagger-Ui-express for your app documentation endpoint
  const swaggerConfig = await swaggerConfigGenerator()
  app.use(await swaggerMiddleware(swaggerConfig))

  // Your Routes start here

  // Your Routes end here

  app.use((err, req, res, next) => {
    if (err) {
      res.json({
        message: err.message,
        stack: err.stack
      })
    } else {
      next()
    }
  })

  app.use((req, res) => {
    res.json({error: 'requested route not found'})
  })
  // finally, let's start our server...
  const server = app.listen(process.env.PORT || 4000, () => {
    // eslint-disable-next-line no-console
    console.log(`'Listening on port '${server.address().port}`);
  });
}

createApplication()