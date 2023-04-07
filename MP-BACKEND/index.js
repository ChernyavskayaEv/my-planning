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
} from './controllers/index.js';

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../MP-FRONTEND')));

app.get('/boards', BoardController.getAll);
app.post(
  '/boards',
  boardCreateValidation,
  handleValidationErrors,
  BoardController.create
);
app.delete('/boards/:id', BoardController.remove);
app.patch(
  '/boards/:id',
  boardCreateValidation,
  handleValidationErrors,
  BoardController.update
);
app.patch('/boards', BoardController.updateActive);

app.get('/columns', ColumnController.getAll);
app.post(
  '/columns',
  columnCreateValidation,
  handleValidationErrors,
  ColumnController.create
);
app.delete('/columns/:id', ColumnController.remove);
app.patch(
  '/columns/:id',
  columnCreateValidation,
  handleValidationErrors,
  ColumnController.update
);

app.get('/cards', CardController.getAll);
app.post(
  '/cards',
  cardCreateValidation,
  handleValidationErrors,
  CardController.create
);
app.delete('/cards/:id', CardController.remove);
app.patch(
  '/cards/:id',
  cardCreateValidation,
  handleValidationErrors,
  CardController.update
);
app.patch('/placeForCard/:id', CardController.updateplace);

app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK');
});
