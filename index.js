import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://post:post@cluster0.lc6ql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('DB is ok');
}).catch(() => {console.log("DB is error");})

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
res.send('Hello word')
})

app.post('/auth/login', (req, res) => {
    console.log(req.body);
    const token = jwt.sign({
        email: req.body.email,
        fullName: 'userOla'
    }, 'secret123')
    res.json({success: true, token})
})

app.listen(4444, () => {
    try {
        console.log('Server start is ok');
    } catch (error) {
        console.log('error server');
    }
})