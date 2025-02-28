import express from 'express'
import mongoose from 'mongoose'
import { loginValidation, registerValidation } from './validation/auth.js';
import checkAuth from './utils/checkAuth.js'
import { getMe, login, register } from './controllers/userController.js';
import {createPost} from './controllers/postController.js'
import { postCreateValidation } from './validation/post.js';

mongoose.connect('mongodb+srv://post:post@cluster0.lc6ql.mongodb.net/postbase?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('DB is ok');
}).catch(() => {console.log("DB is error");})

const app = express()
app.use(express.json())

// Авторизация
app.post("/auth/login",loginValidation, login );

// Регистрация
app.post("/auth/register", registerValidation, register);

// Иформация о себе (о токене)
app.get('/auth/me', checkAuth, getMe)

// Создание статьи
app.post('/posts', checkAuth, createPost)

// Одна статья по id
app.get('/posts/:id', createPost)

app.listen(4444, () => {
  try {
    console.log("Server start is ok");
  } catch (error) {
    console.log("error server");
  }
});