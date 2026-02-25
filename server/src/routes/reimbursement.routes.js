import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import upload from "../middleware/upload.js";
import { createReimbursement, uploadReceipts } from "../controllers/reimbursement.controller.js";

const router = Router();

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

export default router;
