import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import path from 'path';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import {
  registerValidation,
  loginValidation,
  boardCreateValidation,
  columnCreateValidation,
  cardCreateValidation,
} from './validatoins.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import {
  BoardController,
  ColumnController,
  CardController,
  UserController,
} from './controllers/index.js';

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../MP-FRONTEND')));

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/boards', checkAuth, BoardController.getAll);
app.post(
  '/boards',
  checkAuth,
  boardCreateValidation,
  handleValidationErrors,
  BoardController.create
);
app.delete('/boards/:id', checkAuth, BoardController.remove);
app.patch(
  '/boards/:id',
  checkAuth,
  boardCreateValidation,
  handleValidationErrors,
  BoardController.update
);
app.patch('/boards', checkAuth, BoardController.updateActive);

app.get('/columns', checkAuth, ColumnController.getAll);
app.post(
  '/columns',
  checkAuth,
  columnCreateValidation,
  handleValidationErrors,
  ColumnController.create
);
app.delete('/columns/:id', checkAuth, ColumnController.remove);
app.patch(
  '/columns/:id',
  checkAuth,
  columnCreateValidation,
  handleValidationErrors,
  ColumnController.update
);

app.get('/cards', checkAuth, CardController.getAll);
app.post(
  '/cards',
  checkAuth,
  cardCreateValidation,
  handleValidationErrors,
  CardController.create
);
app.delete('/cards/:id', checkAuth, CardController.remove);
app.patch(
  '/cards/:id',
  checkAuth,
  cardCreateValidation,
  handleValidationErrors,
  CardController.update
);
app.patch('/placeForCard/:id', checkAuth, CardController.updateplace);

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK');
});
