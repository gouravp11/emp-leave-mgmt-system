import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import {
    approveUser,
    getUsers,
    deleteUser,
    changeRole,
    assignManager,
    getMyTeam
} from "../controllers/user.controller.js";

const router = Router();

// Admin routes
router.get("/", authenticate, authorize("admin"), getUsers);
router.patch("/:userId/approve", authenticate, authorize("admin"), approveUser);
router.patch("/:userId/role", authenticate, authorize("admin"), changeRole);
router.delete("/:userId", authenticate, authorize("admin"), deleteUser);
router.patch("/:userId/manager", authenticate, authorize("admin"), assignManager);

// Manager routes
router.get("/team", authenticate, authorize("manager"), getMyTeam);

export default router;
