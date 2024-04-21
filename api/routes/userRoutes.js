import express from "express"
import { test, updateUserProfile, changeUserPassword, deleteUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUserProfile);
router.post('/changePassword/:id', verifyToken, changeUserPassword);
router.delete('/delete/:id', verifyToken, deleteUser);




export default router