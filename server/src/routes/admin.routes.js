import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { approveUser, getUsers, deleteUser } from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", authenticate, authorize("admin"), getUsers);
router.patch("/users/:userId/approve", authenticate, authorize("admin"), approveUser);
router.delete("/users/:userId", authenticate, authorize("admin"), deleteUser);

export default router;
