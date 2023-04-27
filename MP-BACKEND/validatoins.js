import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body('name', 'Укажите имя').isLength({ min: 3 }),
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({
    min: 5,
  }),
];

export const boardCreateValidation = [
  body('orderliness', 'Не должно быть пусто').notEmpty(),
  body('title', 'Введите название доски').notEmpty().isString(),
  body('background', 'Выберите фон доски').optional().isString(),
  body('active', 'Не должно быть пусто').isBoolean(),
  body('userid', 'Не должно быть пусто').notEmpty(),
];

export const columnCreateValidation = [
  body('orderliness', 'Не должно быть пусто').notEmpty(),
  body('title', 'Введите название колонки').notEmpty().isString(),
  body('board', 'Не должно быть пусто').notEmpty(),
];

export const cardCreateValidation = [
  body('orderliness', 'Не должно быть пусто').notEmpty(),
  body('title', 'Введите название карточки').notEmpty().isString(),
  body('description', 'Введите описание карточки').optional().isString(),
  body('headlist', 'Введите название чек-листа')
    .if(body('cardList').isArray({ min: 1 }))
    .notEmpty()
    .isString(),
  body('list', 'Заполните чек-лист').optional().isArray(),
  body('columnid', 'Не должно быть пусто').notEmpty(),
];
