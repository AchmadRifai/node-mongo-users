const express = require('express'), mid = require('../mid/auth'), svc = require('../svc/auth'), config = require('../config/config')

const router = express.Router()

router.post('/login', (req, res, next) => mid.login(req, next).catch(e => config.error404(e, res)),
    (req, res) => svc.login(req, res).catch(e => config.error500(e, res)))
router.post('/register', (req, res, next) => mid.register(req, next).catch(e => config.error404(e, res)),
    (req, res) => svc.register(req, res).catch(e => config.error500(e, res)))
router.get('/logout', (req, res, next) => mid.user(req).catch(e => config.error404(e, res)).then(next),
    (req, res) => svc.logout(req, res).catch(e => config.error500(e, res)))
router.get('/iam', (req, res, next) => mid.user(req).catch(e => config.error404(e, res)).then(next),
    (req, res) => svc.user(req, res).catch(e => config.error500(e, res)))
router.post('/users', (req, res, next) => mid.pagination(req).catch(e => config.error404(e, res)).then(next),
    (req, res) => svc.users(req, res).catch(e => config.error500(e, res)))

module.exports = router