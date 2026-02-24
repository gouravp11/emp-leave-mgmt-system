import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { approveUser, getUsers } from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", authenticate, authorize("admin"), getUsers);
router.patch("/users/:userId/approve", authenticate, authorize("admin"), approveUser);

export default router;
