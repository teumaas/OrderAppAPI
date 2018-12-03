const moment = require('moment');

class APIError {

    constructor(message, code){
        this.message = message;
        this.code = code;
        this.datetime = moment().format("HH:mm:ss - MM-DD-YYYY");
    }
}

module.exports = APIError;