import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import {
    createLeave,
    approveLeave,
    rejectLeave,
    cancelLeave,
    getMyLeaves,
    getTeamLeaves,
    getUserLeaves,
    deleteLeave
} from "../controllers/leave.controller.js";

const router = Router();

router.get("/my", authenticate, authorize("employee", "manager"), getMyLeaves);
router.get("/team", authenticate, authorize("manager"), getTeamLeaves);
router.get("/user/:userId", authenticate, authorize("manager"), getUserLeaves);
router.post("/", authenticate, authorize("employee", "manager"), createLeave);
router.patch("/:leaveId/approve", authenticate, authorize("manager"), approveLeave);
router.patch("/:leaveId/reject", authenticate, authorize("manager"), rejectLeave);
router.patch("/:leaveId/cancel", authenticate, authorize("admin"), cancelLeave);
router.delete("/:leaveId", authenticate, authorize("employee", "manager"), deleteLeave);

export default router;
