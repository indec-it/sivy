# Sivy

The survey sincronization server for MongoDB.

## Installation

    npm install @indec/sivy

## Environment variables

  * NODE_ENV
  * PORT
  * MONGODB_URI
  * RECEIVE_ONLY
  * AUTH_CLIENT_ID
  * AUTH_CLIENT_SECRET
  * GRANT_TYPE
  * AUTH_ENDPOINT

## Handlers

  * receiveSurveys(surveys, syncLog)
  * preSaveSurvey(surveyAddress, syncLog)
  * getSurveys(surveyAddresses, syncLog)
  * preSaveSyncLog(syncLog)
