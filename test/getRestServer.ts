/* @ts-ignore */
import cors from 'cors';
/* @ts-ignore */
import express from 'express';
/* @ts-ignore */
import supertest from 'supertest';
/* @ts-ignore */
import compression from 'compression';
import getRoutes from '../src/routes';

const getServer = (usersDB: any) => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/users', getRoutes(usersDB));

  app.use(compression());

  return app;
};

export default (usersDB: any) => supertest(getServer(usersDB));
