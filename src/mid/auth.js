const express = require('express'), config = require('../config/config'), mongo = require('mongodb')

const login = async (req = express.request, next) => {
    if (req.body) throw new Error('Body not found')
    const { username, password } = req.body
    if (!username || !password) throw new Error('username and password is required')
    next()
}

const register = async (req = express.request, next) => {
    if (req.body) throw new Error('Body not found')
    const { username, password, name } = req.body
    if (!username || !password || !name) throw new Error('username, password and name is required')
    next()
}

const user = async (req = express.request) => {
    let auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) throw new Error('Authorization must be required')
    auth = auth.replace('Bearer ', '')
    const jwt = config.decrypt(auth)
    await config.dbConnection(async db => {
        const users = await db.collection('users').find({ _id: new mongo.ObjectId(jwt.sub) }).toArray()
        if (users.length == 0) throw new Error('User not found')
    })
}

const pagination = async (req = express.request) => {
    await user(req)
    if (req.body) throw new Error('Body not found')
    const { page, size, where } = req.body
    if (!page || !size || !where) throw new Error('page, size, and where must be required')
    if (page <= 0 || size <= 0) throw new Error('page and size must be positive')
}

module.exports = { login, register, user, pagination }