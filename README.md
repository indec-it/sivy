# Sivy  &middot; [![NPM version](https://img.shields.io/npm/v/@indec/sivy.svg)](https://www.npmjs.com/package/@indec/sivy) [![Build Status](https://travis-ci.org/indec-it/sivy.svg?branch=master)](https://travis-ci.org/indec-it/sivy) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/indec-it/sivy/blob/master/LICENSE)

The survey synchronization server for MongoDB.

## How to use

### Setup

Install it:

```bash
npm install @indec/sivy
```

> Sivy requires node@10.12

And add a script to your `package.json` like this:

```json
{
  "scripts": {
    "start": "sivy",
    "dev": "sivy dev"
  }
}
```

The `sivy dev` command enables the hot code reloading. No server restart is needed.

### Handlers

The file-system is the main API. Every `.js` file becomes a handler that gets automatically processed on every sync, and the container folder is when that handler is executed. The handlers support promise.

| Folder           | Input parameters                                                       |
|------------------|------------------------------------------------------------------------|
| `dumpSurveys`    | (surveyDump: `SurveyDump`, surveys: `Array<object>`)                   |
| `receiveSurveys` | (surveys: `Array<object>`, syncLog: `SyncLog`)                         |
| `preSaveSurvey`  | (surveyAddress: `SurveyAddress`, survey: `object`, syncLog: `SyncLog`) |
| `getSurveys`     | (surveyAddresses: `Array<SurveyAddress>`, syncLog: `SyncLog`)          |
| `preSaveSyncLog` | (syncLog: `SyncLog`)                                                   |

To log how many surveys we receive on a POST we can create a file into: `receiveSurveys/helloWorld.js` as the following:

```js
module.exports = surveys => console.log(`Received surveys: ${surveys.length}`);
```

### Model

By default the SurveyAddress has the following Mongoose's schema:

```js
{
    dwellings: [{type: Mixed}],
    user: {type: ObjectId, required: true},
    address: {type: ObjectId, ref: 'Address', required: true},
    surveyAddressState: {type: Number},
    state: {type: Number},
    valid: {type: Number}
}
```

You can strongly type the Dwelling's schema defining a `model/dwelling.js` as the following:

```js
module.exports = {
    order: {type: Number},
    dwellingCharacteristics: {
        ...
    }
};

```

Also, you can add additional attributes to the SurveyAddress's schema defining a `model/surveyAddress.js` as the following:

```js
module.exports = {
    visits: [{
        order: {type: Number, required: true},
        date: {type: Date, required: true},
        comments: {type:String}
    }]
};
``` 

### Environment variables

| Required   | Variable             | Description                             | Defaults to                 |
|------------|----------------------|-----------------------------------------|-----------------------------|
|            | `NODE_ENV`           | Defines the running environment         | `development`               |
|            | `PORT`               | Port where sivy will listen             | `3000`                      |
|            | `MONGODB_URI`        | Connection string to the MongoDB server | `mongodb://localhost:27017` |
|            | `RECEIVE_ONLY`       | True if Sivy works on receive_only mode | `false`                     |
| :bangbang: | `AUTH_CLIENT_SECRET` | The secret to validate the JWT.         |                             |
|            | `SURVEYS_COLLECTION` | The surveys collection name on MongoDB  | `surveyAddresses`           |
|            | `SURVEYS_HISTORY`    | Keeps a history of survey changes       | `true`                      |
|            | `SURVEYS_DUMP`       | Dumps every request to a collection     | `false`                     |
|            | `MORGAN_FORMAT`      | Log format used by Morgan package       | `dev` on `NODE_ENV=development`, `combined` on `NODE_ENV=production` |
|            | `DEBUG`              | Set to `sivy` to turn on debug logging. |                             |

### Authentication

Sivy expects an Authorization header on the HTTP request as the following:

```
Authorization: Bearer <jwt>
```

The JWT will be verified using the AUTH_CLIENT_SECRET defined in the environment variables and the [verify method](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) in the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) package.

## Debug

To turn on the Sivy `debug mode` just set the environment variable `DEBUG=sivy`.

## Production deployment

To deploy just run the `sivy` command:

```bash
sivy
```

For example, to deploy with `now` a package.json like follows is recommended:

```json
{
  "name": "my-sync",
  "dependencies": {
    "@indec/sivy": "latest"
  },
  "scripts": {
    "start": "sivy"
  }
}
```

Note: It’s your responsibility to set `NODE_ENV=production` manually!
