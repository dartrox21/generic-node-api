const router = require('express').Router();
const RoleService = require('./RoleService');
const { asyncWrapper } = require('../utils/util.functions');
const { preAuthorize } = require('../middlewares/util.middlewares');

const ROLE = require('./Role.enum');

router.get('/role/all', 
    [preAuthorize(ROLE.SUPER_ADMIN)],
    asyncWrapper(RoleService.getAll));

module.exports = router;
