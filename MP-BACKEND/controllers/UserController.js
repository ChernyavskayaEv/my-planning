import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import db from '../db.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = {
      full_name: req.body.name,
      email: req.body.email,
      password_hash: hash,
    };
    const user = await db.newUser({ ...doc });
    const { id, full_name } = user;
    const token = jwt.sign({ id }, 'secret123', { expiresIn: '30d' });
    res.json({ id, full_name, token });
  } catch (err) {
    console.log(err);
    if (err.code == 23505) {
      res.status(401).json({
        message: 'Такой пользователь уже существует',
      });
    }
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { user, isValidPass } = await db
      .findUser(req.body.email)
      .then((user) =>
        user
          ? bcrypt
              .compare(req.body.password, user.password_hash)
              .then((isValidPass) => ({ user, isValidPass }))
          : { user: null, isValidPass: null }
      );
    if (!user || !isValidPass) {
      return res.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }
    const { id, full_name } = user;
    const token = jwt.sign({ id }, 'secret123', { expiresIn: '30d' });
    res.json({ id, full_name, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await db.findMe(req.id);
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { email, password_hash, ...userData } = user;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
