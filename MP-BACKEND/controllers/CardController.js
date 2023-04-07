import db from '../db.js';

export const getAll = async (req, res) => {
  try {
    const cards = await db.getCards();
    res.json(cards);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить карточки',
    });
  }
};

export const create = async (req, res) => {
  try {
    const result = await db.newCard({ ...req.body });
    res.json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать карточку',
    });
  }
};

export const update = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.updateCard({ neededId, ...req.body });
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить карточку',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.removeCard(neededId);
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить карточку',
    });
  }
};

export const updateplace = async (req, res) => {
  try {
    const result = await db.dragDropCard({ ...req.body });
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Карточка не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось переместить карточку',
    });
  }
};
