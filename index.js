import express from 'express'

const app = express()

app.get('/', (req, res) => {
res.send('Hello word')
})

app.post('/auth/login', (req, res) => {
    res.json({succes: true})
})

app.listen(4444, () => {
    try {
        console.log('Server start is ok');
    } catch (error) {
        console.log('error server');
    }
})