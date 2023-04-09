const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

// For testing with react native app -- can't release on app store?
app.use('/apple-app-site-association', express.static(path.join(__dirname, 'apple-app-site-association')))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listen on the port ${PORT}...`)
})
