const GenericService = require('../generics/GenericService');
const Role = require('./Role.model');

class RoleSevice extends GenericService {
    constructor() {
        super(Role);
    }
}

module.exports = new RoleSevice();