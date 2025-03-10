import express from 'express'
import mongoose from 'mongoose'
import { loginValidation, registerValidation } from './validation/auth.js';
import checkAuth from './utils/checkAuth.js'
import { getMe, login, register } from './controllers/userController.js';
import {createPost, deletePost, getAll, getOne, updatePost} from './controllers/postController.js'
import multer from 'multer';
// import { postCreateValidation } from './validation/post.js';

mongoose.connect('mongodb+srv://post:post@cluster0.lc6ql.mongodb.net/postbase?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('DB is ok');
}).catch(() => {console.log("DB is error");})

const app = express()

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Для загрузки постов с помощью multer
app.post("/upload", 
// checkAuth,
 upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Авторизация
app.post("/auth/login",loginValidation, login );

// Регистрация
app.post("/auth/register", registerValidation, register);

// Иформация о себе (о токене)
app.get('/auth/me', 
// checkAuth, 
getMe)

// Создание статьи
app.post('/posts',
//  checkAuth,
  createPost)

// Получение всех статьй
app.get('/posts', 
// checkAuth,
 getAll)

// Одна статья по id
app.get('/posts/:id', 
// checkAuth,
 getOne)

// Удаление статьи
app.delete('/posts/:id', 
// checkAuth, 
deletePost)

// Обновление статьи
app.patch('/posts/:id',
//  checkAuth,
  updatePost)

app.listen(4444, () => {
  try {
    console.log("Server start is ok");
  } catch (error) {
    console.log("error server");
  }
});