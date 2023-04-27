import db from '../db.js';

export const getAll = async (req, res) => {
  try {
    const userid = req.params.user;
    const boards = await db.getBoards(userid);
    res.json(boards);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить доски',
    });
  }
};

export const updateActive = async (req, res) => {
  try {
    const neededId = req.body.id;
    const userid = req.body.userid;
    const result = await db.updateActiveBoard(userid, neededId);
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Доска не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить доску',
    });
  }
};

export const create = async (req, res) => {
  try {
    const result = await db.newBoard({ ...req.body });
    res.json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать доску',
    });
  }
};

export const update = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.updateBoard({ neededId, ...req.body });
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Доска не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить доску',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const neededId = req.params.id;
    const result = await db.removeBoard(neededId);
    if (result.rowCount == 0) {
      return res.status(404).json({
        message: 'Доска не найдена',
      });
    }
    res.json(result.command);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось удалить доску',
    });
  }
};
