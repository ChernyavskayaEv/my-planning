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

export const cardCreateValidation = [
  body('cardId', 'Не должно быть пусто').notEmpty(),
  body('cardTitle', 'Введите заголовок карточки')
    .isLength({ min: 5 })
    .isString(),
  body('cardDescription', 'Введите описание карточки').optional().isString(),
  body('listTitle', 'Введите заголовок чек-листа')
    .if(body('cardList').isArray({ min: 1 }))
    .notEmpty()
    .isString(),
  body('cardList', 'Заполните чек-лист').optional().isArray(),
];
