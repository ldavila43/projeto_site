import express, { Request, Response} from 'express';

const router = express.Router();

router.post("/login", (req, res) => {
    const respostaForm = JSON.stringify(req.body)
})


export default router;