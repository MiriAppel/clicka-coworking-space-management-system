// import express from 'express';
// import { translationController } from '../controllers/translation.controller';

<<<<<<< HEAD
const translationRouter = express.Router();
translationRouter.post('/', translationController.createTranslation);
// translationRouter.get('/', translationController.getAll);
translationRouter.get('/lang/:lang', translationController.getByLang);
translationRouter.get('/key/:key', translationController.getByKey);
// translationRouter.post('/', translationController.create);
translationRouter.post('/', translationController.createTranslation);
// translationRouter.patch('/:id', translationController.update);
// translationRouter.delete('/:id', translationController.remove);
=======
// const translationRouter = express.Router();
// translationRouter.post('/', translationController.createTranslation);
// translationRouter.get('/', translationController.getAll);
// translationRouter.get('/lang/:lang', translationController.getByLang);
// translationRouter.get('/key/:key', translationController.getByKey);
// // translationRouter.post('/', translationController.create);
// translationRouter.patch('/:id', translationController.update);
// translationRouter.delete('/:id', translationController.remove);
// translationRouter.get('/:id', translationController.getById);

>>>>>>> 4ccc242f90df99768a8ff390e8c2656c338be64b

// export default translationRouter;
