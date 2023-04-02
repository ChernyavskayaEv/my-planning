import db from '../db.js';

export const getAll = async (req, res) => {
  try {
    const columns = await db.getColumns();
    res.json(columns);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить колонки',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.getOneColumn(neededId);
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Колонка не найдена',
      });
    }
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить колонку',
    });
  }
};

export const create = async (req, res) => {
  try {
    const result = await db.newColumn({ ...req.body });
    res.json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать колонку',
    });
  }
};

export const update = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.updateColumn({ neededId, ...req.body });
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Колонка не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить колонку',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.removeColumn(neededId);
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Колонка не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить колонку',
    });
  }
};
