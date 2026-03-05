import express from "express"
import {
    createNewYear,
    createNewMonth,
    createNewTransaction,
    editTransaction,
    deleteTransaction,
    getAllYears,
    getSingleYearDetails,
    getAllTransactionOfSpecMonth,
} from "../controllers/records.js"

const router = express.Router()

router.post('/year', createNewYear);
router.post('/month', createNewMonth);
router.post('/transaction', createNewTransaction);
router.put('/transaction/:transactionId', editTransaction);
router.delete('/transaction/:transactionId', deleteTransaction);
router.get('/years', getAllYears);
router.get('/year/:yearId', getSingleYearDetails);
router.get('/month/:yearId/:monthId', getAllTransactionOfSpecMonth);

export default router