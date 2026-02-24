import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import {
    createLeave,
    approveLeave,
    rejectLeave,
    getMyLeaves
} from "../controllers/leave.controller.js";

const router = Router();

router.get("/my", authenticate, authorize("employee", "manager"), getMyLeaves);
router.post("/", authenticate, authorize("employee", "manager"), createLeave);
router.patch("/:leaveId/approve", authenticate, authorize("manager"), approveLeave);
router.patch("/:leaveId/reject", authenticate, authorize("manager"), rejectLeave);

export default router;
