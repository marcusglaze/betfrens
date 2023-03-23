const express = require('express')
const path = require('path')

const app = express()

// For testing with react native app -- can't release on app store?
app.use('/apple-app-site-association', express.static(path.join(__dirname, 'apple-app-site-association')))
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.port || 3000

app.listen(PORT)
