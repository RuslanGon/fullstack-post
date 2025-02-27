import express from 'express'

const app = express()

app.get('/', (req, res) => {
res.send('Hello word')
})

app.listen(4444, () => {
    try {
        console.log('Server start is ok');
    } catch (error) {
        console.log('error server');
    }
})