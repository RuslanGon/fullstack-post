import User from '../models/User.js'
import {validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const register = async (req, res) => {
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
  }
export const login = async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
  
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден!" });
      }
  
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user._doc.passwordHash
      );
      if (!isValidPass) {
        return res.status(400).json({ message: "Неверный логин или пароль!" });
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
      res.status(500).json({message: 'Не удалось авторизоваться!'});
    }
  }
  export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' }); // Добавлен return
        }

        const { passwordHash, ...userdata } = user._doc;
        res.json(userdata);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Нет доступа' });
    }
};
