import YearlyFinance from "../models/Record.js";

export const createNewYear = async (req, res) => {
  try {
    const { year } = req.body;

    // 1. Validation: Check if year is provided
    if (!year) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid year (e.g., 2024)" 
      });
    }

    // 2. Check if the year already exists in the database
    const existingYear = await YearlyFinance.findOne({ year: Number(year) });
    if (existingYear) {
      return res.status(400).json({ 
        success: false, 
        message: `Year ${year} already exists.` 
      });
    }

    // 3. Create the document with empty arrays and zero totals
    const newYearEntry = new YearlyFinance({
      year: Number(year),
      months: [], // Starting with an empty array
      annualIncome: 0,
      annualExpense: 0
    });

    const savedYear = await newYearEntry.save();

    res.status(201).json({
      success: true,
      message: `Year ${year} initialized successfully`,
      data: savedYear
    });

  } catch (error) {
    console.error("Year Creation Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
}

export const createNewMonth = async (req, res) => {
  try {
    const { yearId, monthName } = req.body;

    // 1. Validation
    if (!yearId || !monthName) {
      return res.status(400).json({
        success: false,
        message: "Please provide yearId and monthName"
      });
    }

    // 2. Find the year and check if month already exists
    const yearDoc = await YearlyFinance.findById(yearId);

    if (!yearDoc) {
      return res.status(404).json({
        success: false,
        message: "Year record not found"
      });
    }

    // Check if the month is already in the array
    const monthExists = yearDoc.months.find(m => m.monthName === monthName);
    if (monthExists) {
      return res.status(400).json({
        success: false,
        message: `${monthName} already exists in Year ${yearDoc.year}`
      });
    }

    // 3. Push new month into the months array
    // Default values ke saath month push ho raha hai
    const newMonth = {
      monthName,
      transactions: [],
      totalIncome: 0,
      totalExpense: 0
    };

    yearDoc.months.push(newMonth);
    await yearDoc.save();

    res.status(201).json({
      success: true,
      message: `${monthName} added to ${yearDoc.year}`,
      data: yearDoc
    });

  } catch (error) {
    console.error("Month Creation Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
}

export const createNewTransaction = async (req, res) => {
  try {
    const { yearId, monthId, title, amount, type } = req.body;

    // 1. Validation
    if (!yearId || !monthId || !title || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (yearId, monthId, title, amount, type)"
      });
    }

    // 2. Find the year document
    const yearDoc = await YearlyFinance.findById(yearId);
    if (!yearDoc) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    // 3. Find the specific month inside that year
    const month = yearDoc.months.id(monthId); // Mongoose helper to find sub-doc by ID
    if (!month) {
      return res.status(404).json({ success: false, message: "Month not found" });
    }

    // 4. Create new transaction object
    const newTransaction = {
      title,
      amount: Number(amount),
      type,
    };

    // 5. Push transaction and Update Totals (Logic)
    month.transactions.push(newTransaction);

    // Update Month Totals
    if (type === 'income') {
      month.totalIncome += Number(amount);
      yearDoc.annualIncome += Number(amount);
    } else {
      month.totalExpense += Number(amount);
      yearDoc.annualExpense += Number(amount);
    }

    // 6. Save the document
    await yearDoc.save();

    res.status(201).json({
      success: true,
      message: "Transaction added and totals updated",
      data: month // Sirf updated month bhej rahe hain taake UI update ho jaye
    });

  } catch (error) {
    console.error("Transaction Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const editTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { yearId, monthId, title, amount, type, category } = req.body;

    // 1. Find the Year and Month
    const yearDoc = await YearlyFinance.findById(yearId);
    if (!yearDoc) return res.status(404).json({ success: false, message: "Year not found" });

    const month = yearDoc.months.id(monthId);
    if (!month) return res.status(404).json({ success: false, message: "Month not found" });

    // 2. Find the specific Transaction
    const transaction = month.transactions.id(transactionId);
    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

    // 3. REVERSE OLD TOTALS (Puraani values ko minus karein)
    if (transaction.type === 'income') {
      month.totalIncome -= transaction.amount;
      yearDoc.annualIncome -= transaction.amount;
    } else {
      month.totalExpense -= transaction.amount;
      yearDoc.annualExpense -= transaction.amount;
    }

    // 4. UPDATE WITH NEW DATA
    // Agar body mein value nahi hai toh purani hi rehne den (Flexible Update)
    transaction.title = title || transaction.title;
    transaction.amount = amount !== undefined ? Number(amount) : transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;

    // 5. APPLY NEW TOTALS (Nayi values ko add karein)
    if (transaction.type === 'income') {
      month.totalIncome += transaction.amount;
      yearDoc.annualIncome += transaction.amount;
    } else {
      month.totalExpense += transaction.amount;
      yearDoc.annualExpense += transaction.amount;
    }

    // 6. Save changes
    await yearDoc.save();

    res.status(200).json({
      success: true,
      message: "Transaction updated and totals recalculated",
      data: transaction
    });

  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { yearId, monthId } = req.body; // Inhe body se lenge taake search fast ho

    // 1. Find the Year document
    const yearDoc = await YearlyFinance.findById(yearId);
    if (!yearDoc) return res.status(404).json({ success: false, message: "Year not found" });

    // 2. Find the specific Month
    const month = yearDoc.months.id(monthId);
    if (!month) return res.status(404).json({ success: false, message: "Month not found" });

    // 3. Find the Transaction to get its amount and type before deleting
    const transaction = month.transactions.id(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction already deleted or not found" });
    }

    // 4. ADJUST TOTALS (Paisa wapas nikaalein)
    if (transaction.type === 'income') {
      month.totalIncome -= transaction.amount;
      yearDoc.annualIncome -= transaction.amount;
    } else {
      month.totalExpense -= transaction.amount;
      yearDoc.annualExpense -= transaction.amount;
    }

    // 5. REMOVE the transaction
    // Mongoose sub-document ko remove karne ka tarika
    transaction.deleteOne(); 

    // 6. Save changes
    await yearDoc.save();

    res.status(200).json({
      success: true,
      message: "Transaction deleted and totals adjusted",
      data: month // Updated month data bhej rahe hain taake UI refresh ho jaye
    });

  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getAllYears = async (req, res) => {
  try {
    const years = await YearlyFinance.find().select('-months.transactions').sort({ year: -1 });
    
    res.status(200).json({
      success: true,
      count: years.length,
      data: years
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getSingleYearDetails = async (req, res) => {
  try {
    const yearData = await YearlyFinance.findById(req.params.yearId).select('-months.transactions');
    
    if (!yearData) {
      return res.status(404).json({ success: false, message: "Year not found" });
    }

    res.status(200).json({
      success: true,
      data: yearData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const getAllTransactionOfSpecMonth = async (req, res) => {
  try {
    const yearDoc = await YearlyFinance.findById(req.params.yearId);
    if (!yearDoc) return res.status(404).json({ success: false, message: "Year not found" });

    const month = yearDoc.months.id(req.params.monthId);
    if (!month) return res.status(404).json({ success: false, message: "Month not found" });

    res.status(200).json({
      success: true,
      monthName: month.monthName,
      totalIncome: month.totalIncome,
      totalExpense: month.totalExpense,
      balance: month.totalIncome - month.totalExpense,
      data: month.transactions // Yahan sheet ka saara data milega
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
}