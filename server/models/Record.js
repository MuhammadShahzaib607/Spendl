import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['Income', 'Expense'], 
    required: true 
  },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const MonthSchema = new mongoose.Schema({
  monthName: { 
    type: String, 
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  },
  totalIncome: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 },
  transactions: [TransactionSchema]
});

const YearlyFinanceSchema = new mongoose.Schema({
  year: { 
    type: Number, 
    required: true, 
    unique: true
  },
  months: [MonthSchema],
  annualIncome: { type: Number, default: 0 },
  annualExpense: { type: Number, default: 0 }
}, { timestamps: true });

const YearlyFinance = mongoose.model('Record', YearlyFinanceSchema);

export default YearlyFinance;