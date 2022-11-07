const express = require('express')

const PORT = process.env.PORT || 8000;
const app = express()

app.use(require('prerender-node').set('prerenderToken', 'mkoIkY6v3bxSw7XSkwoQ'));


app.listen(PORT, () => {
    console.log('server is running at ' + PORT)
})
