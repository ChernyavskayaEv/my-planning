import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();

const config = {
  host: process.env['DB_HOST'],
  port: process.env['DB_PORT'],
  database: process.env['DB_NAME'],
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
};

const pool = new Pool(config);

export const getBoards = async () => {
  const sql = `SELECT * FROM table_boards tb`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const getOneBoard = async (neededId) => {
  const sql = `SELECT * FROM table_boards tb
  WHERE boardid = ${neededId};`;
  const { rowCount, rows } = await pool.query(sql);
  return { rowCount, rows };
};

export const newBoard = async ({ ...fields }) => {
  const params = Object.entries(fields).map(([k, v]) => v);
  const sql = `INSERT INTO table_boards tb ( boardId , boardTitle , boardBackground )
  VALUES ($1, $2, $3)
  RETURNING id;`;
  const { rows } = await pool.query(sql, params);
  return `br-${rows[0].id}`;
};

export const updateBoard = async ({ neededId, ...fields }) => {
  const params = [];
  const sql = `UPDATE table_boards tb 
  SET ${Object.entries(fields)
    .map(([k, v]) => `${k} = $${params.push(v)}`)
    .join(',')}
  WHERE boardid = ${neededId};`;
  const { rowCount, command } = await pool.query(sql, params);
  return { rowCount, command };
};

export const removeBoard = async (neededId) => {
  const sql = `DELETE FROM table_boards tb 
  WHERE boardid = ${neededId}`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export const getColumns = async () => {
  const sql = `SELECT * FROM table_columns`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const getOneColumn = async (neededId) => {
  const sql = `SELECT * FROM table_columns
  WHERE columnid = ${neededId};`;
  const { rowCount, rows } = await pool.query(sql);
  return { rowCount, rows };
};

export const newColumn = async ({ ...fields }) => {
  const params = Object.entries(fields).map(([k, v]) => v);
  const sql = `INSERT INTO table_columns ( columnId , columnTitle , boardDbId )
  VALUES ($1, $2, $3)
  RETURNING id;`;
  const { rows } = await pool.query(sql, params);
  return `cl-${rows[0].id}`;
};

export const updateColumn = async ({ neededId, ...fields }) => {
  const params = [];
  const sql = `UPDATE table_columns 
  SET ${Object.entries(fields)
    .map(([k, v]) => `${k} = $${params.push(v)}`)
    .join(',')}
  WHERE columnid = ${neededId};`;
  const { rowCount, command } = await pool.query(sql, params);
  return { rowCount, command };
};

export const removeColumn = async (neededId) => {
  const sql = `DELETE FROM table_columns 
  WHERE columnid = ${neededId}`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export const getCards = async () => {
  const sql = `SELECT * FROM table_cards`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const getOneCard = async (neededId) => {
  const sql = `SELECT * FROM table_cards
  WHERE cardid = ${neededId};`;
  const { rowCount, rows } = await pool.query(sql);
  return { rowCount, rows };
};

export const newCard = async ({ ...fields }) => {
  const params = Object.entries(fields).map(([k, v]) =>
    k == 'cardList' ? JSON.stringify(v) : v
  );
  const sql = `INSERT INTO table_cards (cardId, cardTitle, cardDescription, listTitle, cardList, columnDbId )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id;`;
  const { rows } = await pool.query(sql, params);
  return `cr-${rows[0].id}`;
};

export const updateCard = async ({ neededId, ...fields }) => {
  const params = [];
  const sql = `UPDATE table_cards tc 
  SET ${Object.entries(fields)
    .map(([k, v]) =>
      k == 'cardList'
        ? `${k} = $${params.push(JSON.stringify(v))}`
        : `${k} = $${params.push(v)}`
    )
    .join(',')}
  WHERE cardid = ${neededId};`;
  const { rowCount, command } = await pool.query(sql, params);
  return { rowCount, command };
};

export const removeCard = async (neededId) => {
  const sql = `DELETE FROM table_cards tc 
  WHERE cardId = ${neededId}`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export default {
  getBoards,
  getOneBoard,
  newBoard,
  updateBoard,
  removeBoard,
  getColumns,
  getOneColumn,
  newColumn,
  updateColumn,
  removeColumn,
  getCards,
  getOneCard,
  newCard,
  updateCard,
  removeCard,
};
