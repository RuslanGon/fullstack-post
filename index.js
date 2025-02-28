import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {validationResult} from 'express-validator'
import { registerValidation } from './validation/auth.js';
import User from './models/User.js';
import bcrypt from 'bcrypt'

mongoose.connect('mongodb+srv://post:post@cluster0.lc6ql.mongodb.net/postbase?retryWrites=true&w=majority&appName=Cluster0').then(() => {
    console.log('DB is ok');
}).catch(() => {console.log("DB is error");})

const app = express()
app.use(express.json())

app.post("/auth/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return req.status(404).json({ message: "Полльзователь не найден!" });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return req.status(404).json({ message: "Неверный логин или пароль!" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userdata } = user._doc;
    res.json({ ...userdata, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось фвторизоваться!'});
  }
});


app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь с таким email уже существует" });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign({
        _id: user._id
    }, 'secret123', {
        expiresIn: '30d'
    })

    const {passwordHash, ...userdata} = user._doc

    res.json({...userdata, token});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'не удалось зарегестрироваться'});
  }
});

app.listen(4444, () => {
  try {
    console.log("Server start is ok");
  } catch (error) {
    console.log("error server");
  }
});