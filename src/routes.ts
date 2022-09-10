import { Router, Request, Response } from 'express';
import Database from '@brightsole/sleep-talk';
import { User } from './types';

export default (authDB: Database<User>) =>
  Router()
    // query for multiple items using `scan`
    .get('', async (req: Request, res: Response) => {
      const { query } = req;

      const usersList = await authDB.query(query as any);
      res.json(usersList);
    })

    // create a single item
    .post('', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const auth = await authDB.createItem(req.body, { hashKey });
      res.status(201).json(auth);
    })

    // get single item
    .get('/:id', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const auth = await authDB.getItem(req.params.id, { hashKey });
      res.json(auth);
    })

    // update single item
    .put('/:id', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const auth = await authDB.updateItem({ id: req.params.id, ...req.body }, { hashKey });
      res.json(auth);
    })

    // delete single item
    .delete('/:id', async (req: Request, res: Response) => {
      const hashKey = req.header('x-user-id') as any;

      const auth = await authDB.deleteItem(req.params.id, { hashKey });
      res.json(auth);
    });
