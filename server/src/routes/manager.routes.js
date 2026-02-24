import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import { getMyTeam } from "../controllers/manager.controller.js";

const router = Router();

router.get("/users", authenticate, authorize("manager"), getMyTeam);

export default router;
