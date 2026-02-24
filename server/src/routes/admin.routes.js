import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import {
    approveUser,
    getUsers,
    deleteUser,
    changeRole,
    assignManager
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/users", authenticate, authorize("admin"), getUsers);
router.patch("/users/:userId/approve", authenticate, authorize("admin"), approveUser);
router.patch("/users/:userId/role", authenticate, authorize("admin"), changeRole);
router.delete("/users/:userId", authenticate, authorize("admin"), deleteUser);
router.patch("/users/:userId/manager", authenticate, authorize("admin"), assignManager);

export default router;
