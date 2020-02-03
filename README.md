# Install
1. $ `yarn`
2. $ `yarn start` or start debugger in vscode
3. go to `localhost:4000/docs`

---

# Content
## 1. Swagger doc

We can still use our swagger 2.0 definitions for now, although swagger-jsdoc supports openapi 3.0, we can do the upgrade step by step

#### Folder structure
```
├── definitions
├── parameters   <--- for defining reusable parameters like objectId
│   ├── body
│   └── path
└── paths
    ├── apis
    └── cms
```

#### Referencing definitions
Should reference global definitions instead of file referencing in this context

before:
```
responses:
  "200":
    description: Success response
    schema:
      $ref: "./definitions/somedefintion.yaml"
```
now:
```
responses:
  "200":
    description: Success response
    schema:
      $ref: "#/definitions/somedefintion" <-- if your definition is correct, swagger-jsdoc will resolve the definition for you automatically without writing definition at the bottom of the same file
```

#### Consumming the yaml files
```
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  info: {
    title: 'REST API for my App',
    version: '1.0.0',
    description: 'This is the REST API for my product',
  },
  host: 'localhost:4000',
  basePath: '/api',
};

const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./swagger/docs/**/*.yaml'], <-- everything under this folder will be combined into the swagger json without losing reference
};
// initialize swagger-jsdoc
module.exports = swaggerJSDoc(options);
```

In swaggerConfigGenerator.js
```
const definition = require('.')

module.exports = async (extraMiddlewares = []) => {
  return {
    definition: definition,
    extraMiddlewares,
    controllers: path.join(__dirname, '..', 'controllers')
  }
}
```

## 2. Validations

Rely on `swagger-tools/middleware/swagger-validator`

For example:

definition:
`./swagger/docs/parameters/path/ObjectId.yaml`
```
parameters:
  ObjectId:
    name: id
    in: path
    description: object id
    required: true
    type: string
    pattern: '^[a-f\d]{24}$'   <--- define validation pattern
```

consumer:
`./swagger/docs/paths/apis/users.yaml`
```
paths:
  /users/{id}:
    x-swagger-router-controller: PetController
    get:
      tags:
        - User
      summary: get a user
      operationId: getUserById
      produces:
      - application/json
      parameters:
        - $ref: '#/parameters/ObjectId'  <-- reference the parameter
```

then handle the error in error handler instead of controller

## 3. Parsing request query based on definitions (optional)
In reality, swagger already did the parsing job for us, however it's a bit hard to access the valus inside the swagger object, we can use a middleware to extract the values

#### Middleware
`./swagger/middlewares/parseQuery.js`

#### Usage
```
/* with middleware */
const query = req.parsedQuery
const { page, pageSize } = query

/* without middleware */
const page = req.swagger.params.page.value
const pageSize = req.swagger.params.pageSize.value
```

## 4. Normalize reponse based on definitions
This middleware help to normalize the response object according to definitions like string to number, number to string, string boolean to boolean, etc, and remove excess attribute if not defined in response object

#### Middleware
`./swagger/middlewares/responseNormalizer.js`

Assume the response object looks like
```
{ 
  "id": "5e2b016b37f7805e2efc7d59",
  "name": "Hello Kitty",
  "species": "cat",
  "isSick": "false",
  "age": 1
}
```
after the middleware
```
{ 
  "id": "5e2b016b37f7805e2efc7d59",
  "name": "Hello Kitty",
  "species": "cat",
  "isSick": false,
}
```
Try this request 
(http://localhost:4000/api/pets/5e2b016b37f7805e2efc7d59)

