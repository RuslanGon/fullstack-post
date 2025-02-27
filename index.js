import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {validationResult} from 'express-validator'
import { registerValidation } from './validation/auth.js';

mongoose.connect('mongodb+srv://post:post@cluster0.lc6ql.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('DB is ok');
}).catch(() => {console.log("DB is error");})

const app = express()
app.use(express.json())


app.post('/auth/register', registerValidation, (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
    return status(400).json(errors.array())
   }
   res.status({
    succses: true
   })
})

app.listen(4444, () => {
    try {
        console.log('Server start is ok');
    } catch (error) {
        console.log('error server');
    }
})