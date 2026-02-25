import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
import {
    createReimbursement,
    uploadReceipts,
    getMyReimbursements,
    getTeamReimbursements,
    getUserReimbursements,
    approveReimbursement,
    rejectReimbursement,
    markReimbursementPaid,
    deleteReimbursement
} from "../controllers/reimbursement.controller.js";

const router = Router();

router.get("/my", authenticate, authorize("employee", "manager"), getMyReimbursements);
router.get("/team", authenticate, authorize("manager"), getTeamReimbursements);
router.get("/user/:userId", authenticate, authorize("manager"), getUserReimbursements);
router.post(
    "/",
    authenticate,
    authorize("employee", "manager"),
    upload.array("receipts", 5),
    createReimbursement
);
router.patch(
    "/:reimbursementId/receipts",
    authenticate,
    authorize("employee", "manager"),
    upload.array("receipts", 5),
    uploadReceipts
);
router.patch("/:reimbursementId/approve", authenticate, authorize("manager"), approveReimbursement);
router.patch("/:reimbursementId/reject", authenticate, authorize("manager"), rejectReimbursement);
router.patch("/:reimbursementId/paid", authenticate, authorize("manager"), markReimbursementPaid);
router.delete(
    "/:reimbursementId",
    authenticate,
    authorize("employee", "manager"),
    deleteReimbursement
);

export default router;
