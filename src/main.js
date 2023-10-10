const express = require('express'), { log } = require('./config/config'), fs = require('fs')

const app = express()
app.use(require('cors')({}))
app.use(require('helmet')())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

fs.readdirSync('src/routers').map(s => '/' + s.replace('.js', '')).forEach(s => app.use(s, require('./routers' + s)))
app.all('*', (_, res) => res.status(404).json({ msg: 'Not found' }))

app.listen(2101, () => log('Listening on http://localhost:2101/'))