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
  const sql = `SELECT * FROM table_boards
  ORDER BY orderliness;`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const newBoard = async ({ ...fields }) => {
  const params = Object.entries(fields).map(([k, v]) => v);
  const sql = `INSERT INTO table_boards ( orderliness , title , background , active )
  VALUES ($1, $2, $3, $4)
  RETURNING id;`;
  const { rows } = await pool.query(sql, params);
  return `br-${rows[0].id}`;
};

export const updateActiveBoard = async (neededId) => {
  const sql = `UPDATE  table_boards tb SET active = false WHERE active = true;
  UPDATE  table_boards tb SET active = true 
  WHERE id = ${neededId};`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export const updateBoard = async ({ neededId, ...fields }) => {
  const params = [];
  const sql = `UPDATE table_boards
  SET ${Object.entries(fields)
    .map(([k, v]) => `${k} = $${params.push(v)}`)
    .join(',')}
  WHERE id = ${neededId};`;
  const { rowCount, command } = await pool.query(sql, params);
  return { rowCount, command };
};

export const removeBoard = async (neededId) => {
  const sql = `
  UPDATE table_boards SET orderliness = orderliness-1
  WHERE orderliness > (SELECT orderliness FROM table_boards WHERE id = ${neededId});
  DELETE FROM table_boards
  WHERE id = ${neededId};`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export const getColumns = async () => {
  const sql = `SELECT * FROM table_columns tc
  ORDER BY board, orderliness;`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const newColumn = async ({ ...fields }) => {
  const params = Object.entries(fields).map(([k, v]) => v);
  const sql = `INSERT INTO table_columns ( orderliness , title , board )
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
  WHERE id = ${neededId};`;
  const { rowCount, command } = await pool.query(sql, params);
  return { rowCount, command };
};

export const removeColumn = async (neededId) => {
  const sql = `
  UPDATE table_columns SET orderliness = orderliness-1
  WHERE orderliness > (SELECT orderliness FROM table_columns WHERE id = ${neededId})
  AND board = (SELECT board FROM table_columns WHERE id = ${neededId});
  DELETE FROM table_columns 
  WHERE id = ${neededId}`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export const getCards = async () => {
  const sql = `SELECT * FROM table_cards
  ORDER BY columnid, orderliness;`;
  const { rows } = await pool.query(sql);
  return rows;
};

export const newCard = async ({ ...fields }) => {
  const params = Object.entries(fields).map(([k, v]) =>
    k == 'list' ? JSON.stringify(v) : v
  );
  const sql = `INSERT INTO table_cards (orderliness, title, description, headlist, list, columnid )
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
      k == 'list'
        ? `${k} = $${params.push(JSON.stringify(v))}`
        : `${k} = $${params.push(v)}`
    )
    .join(',')}
  WHERE id = ${neededId};`;
  const { rowCount, command } = await pool.query(sql, params);
  return { rowCount, command };
};

export const removeCard = async (neededId) => {
  const sql = `
  UPDATE table_cards SET orderliness = orderliness-1
  WHERE orderliness > (SELECT orderliness FROM table_cards WHERE id = ${neededId})
  AND columnid = (SELECT columnid FROM table_cards WHERE id = ${neededId});
  DELETE FROM table_cards 
  WHERE id = ${neededId}`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export const dragDropCard = async ({ id, newOrderliness, newColumnid }) => {
  const sql = `
  UPDATE table_cards SET orderliness = orderliness-1
  WHERE orderliness > (SELECT orderliness FROM table_cards WHERE id = ${id})
  AND columnid = (SELECT columnid FROM table_cards WHERE id = ${id});
  UPDATE table_cards SET orderliness = ${newOrderliness},
  columnid = ${newColumnid} WHERE id = ${id}`;
  const { rowCount, command } = await pool.query(sql);
  return { rowCount, command };
};

export default {
  getBoards,
  updateActiveBoard,
  newBoard,
  updateBoard,
  removeBoard,
  getColumns,
  newColumn,
  updateColumn,
  removeColumn,
  getCards,
  newCard,
  updateCard,
  removeCard,
  dragDropCard,
};
