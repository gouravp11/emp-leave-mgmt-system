import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { approveUser } from "../controllers/admin.controller.js";

const router = Router();

router.patch("/users/:userId/approve", authenticate, authorize("admin"), approveUser);

export default router;
