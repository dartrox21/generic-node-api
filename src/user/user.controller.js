const router = require('express').Router();
const UserService = require('./UserService');
const User = require('./User.model');
const { cleanModel, setFilters, preAuthorize } = require('../middlewares/util.middlewares');
const { asyncWrapper } = require('../utils/util.functions');
const ROLES = require('../role/Role.enum');

const cleanMiddleware = cleanModel(User.schema.paths);
const FILTERS = ['id', 'email', 'name', 'lastName'];

router.post('/user',
    [preAuthorize(ROLES.SUPER_ADMIN), cleanMiddleware],
    asyncWrapper(UserService.create));

router.get('/user/all',
    [preAuthorize(ROLES.SUPER_ADMIN, ROLES.SUPERVISOR), setFilters(FILTERS)], 
    asyncWrapper(UserService.getAll)
);

router.get('/user',
    [preAuthorize(ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.USER), setFilters(FILTERS)],
    asyncWrapper(UserService.getAllPageable));

router.get('/user/:id',
    [preAuthorize(ROLES.SUPERVISOR, ROLES.USER)],
    asyncWrapper(UserService.getById));

router.delete('/user/:id',
    [preAuthorize(ROLES.SUPER_ADMIN)],
    asyncWrapper(UserService.delete));

router.put('/user/:id',
    [preAuthorize(ROLES.SUPER_ADMIN, ROLES.SUPERVISOR, ROLES.USER), cleanMiddleware],
    asyncWrapper(UserService.update));

module.exports = router;
