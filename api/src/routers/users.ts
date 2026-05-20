import express, { Request, Response} from 'express';

const router = express.Router();

router
    .route("/:id")
    .get((req, res) => {
        const id = req.params.id;
        res.send(`Get user ${id}`);
    })
    .put((req, res) => {
        res.send(`test`);
    })
    .delete((req, res) => {
        res.send(`test`);
    })


export default router;