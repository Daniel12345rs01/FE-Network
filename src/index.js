const VinciClient = require('./Structures/VinciClient');
const config = require('../config.json');
const client = new VinciClient(config);
client.start();