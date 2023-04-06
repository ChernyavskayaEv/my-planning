import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({
    min: 5,
  }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({
    min: 5,
  }),
  body('fullName', 'Укажите имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const boardCreateValidation = [
  body('orderliness', 'Не должно быть пусто').notEmpty(),
  body('title', 'Введите название доски').isLength({ min: 3 }).isString(),
  body('background', 'Выберите фон доски').optional().isString(),
  body('active', 'Не должно быть пусто').isBoolean(),
];

export const columnCreateValidation = [
  body('orderliness', 'Не должно быть пусто').notEmpty(),
  body('title', 'Введите название колонки').isLength({ min: 3 }).isString(),
  body('board', 'Не должно быть пусто').notEmpty(),
];

export const cardCreateValidation = [
  body('orderliness', 'Не должно быть пусто').notEmpty(),
  body('title', 'Введите название карточки').isLength({ min: 5 }).isString(),
  body('description', 'Введите описание карточки').optional().isString(),
  body('headlist', 'Введите название чек-листа')
    .if(body('cardList').isArray({ min: 1 }))
    .notEmpty()
    .isString(),
  body('list', 'Заполните чек-лист').optional().isArray(),
  body('columnid', 'Не должно быть пусто').notEmpty(),
];
