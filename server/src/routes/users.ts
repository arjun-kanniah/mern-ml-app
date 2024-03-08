import {Router, Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {IUser, UserModel} from '../models/users';
import {UserErrors} from '../errors';
import {RequestWithUser, UserPayload} from '../types';

const router = Router();

export const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // To handle "Bearer TOKEN_STRING"
        jwt.verify(token, 'zBJfsFNWjE', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user as UserPayload; // Cast the user object to the correct type
            next();
        });
    } 
    else {
        return res.sendStatus(401);
    }
};

router.post('/register', async (req: Request, res: Response) => {
    const {firstname, lastname, email, password} = req.body;
    try{
        const user = await UserModel.findOne({ email: email });

        if (user) {
            return res.status(400).json({type: UserErrors.EMAIL_ALREADY_EXISTS})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({firstname, lastname, email, password: hashedPassword});
        await newUser.save()

        res.json({message: "User Registered Successfully"});
    }
    catch(err) {
        res.status(500).json({type: err});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try{
        const user: IUser = await UserModel.findOne({ email: email });
        if(!user) {
            return res.status(400).json({type: UserErrors.NO_USER_FOUND});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({type: UserErrors.WRONG_CREDENTIALS});
        }

        const token = jwt.sign({id: user._id}, 'zBJfsFNWjE');
        res.json({token, userID: user._id, firstname: user.firstname});
    }
    catch(err) {
        res.status(500).json({type: err});
    }
});

export {router as userRouter};