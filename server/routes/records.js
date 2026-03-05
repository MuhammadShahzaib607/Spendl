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
    deleteYear,
    deleteMonth,
} from "../controllers/records.js"

const router = express.Router()

router.post('/year', createNewYear);    
router.delete('/year/:yearId', deleteYear);
router.post('/month', createNewMonth);
router.delete('/month/:yearId/:monthId', deleteMonth);
router.post('/transaction', createNewTransaction);
router.put('/transaction/:transactionId', editTransaction);
router.delete('/transaction/:transactionId', deleteTransaction);
router.get('/years', getAllYears);
router.get('/year/:yearId', getSingleYearDetails);
router.get('/month/:yearId/:monthId', getAllTransactionOfSpecMonth);

export default router