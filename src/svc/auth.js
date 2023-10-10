const express = require('express'), config = require('../config/config'), dto = require('../utils/dto')

const login = async (req = express.request, res = express.response) => {
    const { username, password } = req.body
    const sandi = config.decrypting(password)
    await config.dbConnection(async db => {
        const users = await db.collection('users').find({ username, password: sandi }).toArray()
        if (0 == users.length) throw new Error('Username not found')
        const user = users[0]
        res.setHeader('Authorization', config.encrypt(user._id.toString(), 'global'))
    })
    res.send({ msg: 'Success' })
}

const register = async (req = express.request, res = express.response) => {
    const { username, password, name } = req.body
    const sandi = config.decrypting(password)
    await config.dbTransaction(async db => {
        const user = await db.collection('user').insertOne(dto.toModel({ username, password: sandi, name }))
        res.setHeader('Authorizarion', config.encrypt(user.insertedId.toString(), 'global'))
    })
    res.send({ msg: 'Success' })
}

const logout = async (_, res = express.response) => res.send({ msg: 'Success' })

const user = async (req = express.request, res = express.response) => {
    const auth = req.headers.authorization.replace('Bearer ', '')
    const jwt = config.decrypt(auth)
    await config.dbConnection(async db => {
        const users = await db.collection('users').find({ _id: new mongo.ObjectId(jwt.sub) }).toArray()
        if (users.length == 0) throw new Error('User not found')
        const user = users[0]
        res.setHeader('Authorization', config.encrypt(user._id.toString(), 'global'))
        res.send(dto.toDto(user))
    })
}

const users = async (req = express.request, res = express.response) => {
    const { page, size, where } = req.body
    const result = { page, size }
    let auth = req.headers.authorization
    auth = auth.replace('Bearer ', '')
    const jwt = config.decrypt(auth)
    await config.dbConnection(async db => {
        let ids = await db.collection('users').distinct('_id', dto.toModel(where))
        result.pageCount = Math.ceil(ids.length / size)
        ids = ids.slice((page - 1) * size, page * size)
        const datas = await db.collection('users').find({ _id: { $in: ids } }).toArray()
        res.data = datas.map(dto.toDto)
        res.setHeader('Authorization', config.encrypt(jwt.sub, 'global'))
        res.send(result)
    })
}

module.exports = { login, logout, register, user, users }