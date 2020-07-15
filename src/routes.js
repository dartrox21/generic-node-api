const express = require('express');
const app = express();

app.use(require('./auth/auth.controller'));
app.use(require('./user/user.controller'));
app.use(require('./role/role.controller'));

module.exports = app;
