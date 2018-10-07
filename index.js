const logger = require('./src/helpers/logger');
const app = require('./src');
const {NODE_ENV, PORT} = process.env;

app.listen(PORT, () => logger.info(`Started at port ${PORT} in ${NODE_ENV} environment...`));
