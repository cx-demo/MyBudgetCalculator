// Budget Calculator Application

// Data storage
let incomes = [];
let expenses = [];

// DOM Elements
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const remainingBudgetEl = document.getElementById('remaining-budget');
const balanceSummaryEl = document.querySelector('.balance-summary');

const incomeDescriptionEl = document.getElementById('income-description');
const incomeAmountEl = document.getElementById('income-amount');
const addIncomeBtn = document.getElementById('add-income-btn');
const incomeListEl = document.getElementById('income-list');

const expenseDescriptionEl = document.getElementById('expense-description');
const expenseAmountEl = document.getElementById('expense-amount');
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseListEl = document.getElementById('expense-list');

// Validation error message
const VALIDATION_ERROR_MESSAGE = 'Please enter a valid description and amount.';

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Calculate totals
function calculateTotals() {
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remainingBudget = totalIncome - totalExpense;

    totalIncomeEl.textContent = formatCurrency(totalIncome);
    totalExpensesEl.textContent = formatCurrency(totalExpense);
    remainingBudgetEl.textContent = formatCurrency(remainingBudget);

    // Update balance color based on positive/negative
    balanceSummaryEl.classList.remove('balance-positive', 'balance-negative');
    if (remainingBudget > 0) {
        balanceSummaryEl.classList.add('balance-positive');
    } else if (remainingBudget < 0) {
        balanceSummaryEl.classList.add('balance-negative');
    }
}

// Render income list
function renderIncomeList() {
    incomeListEl.innerHTML = '';
    incomes.forEach(income => {
        const li = document.createElement('li');
        li.className = 'income-item';
        li.innerHTML = `
            <div class="item-info">
                <span class="item-description">${escapeHtml(income.description)}</span>
                <span class="item-amount">${formatCurrency(income.amount)}</span>
            </div>
            <button class="delete-btn" data-id="${income.id}" data-type="income">&times;</button>
        `;
        incomeListEl.appendChild(li);
    });
}

// Render expense list
function renderExpenseList() {
    expenseListEl.innerHTML = '';
    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div class="item-info">
                <span class="item-description">${escapeHtml(expense.description)}</span>
                <span class="item-amount">${formatCurrency(expense.amount)}</span>
            </div>
            <button class="delete-btn" data-id="${expense.id}" data-type="expense">&times;</button>
        `;
        expenseListEl.appendChild(li);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add income
function addIncome() {
    const description = incomeDescriptionEl.value.trim();
    const amount = parseFloat(incomeAmountEl.value);

    if (!description || isNaN(amount) || amount <= 0) {
        alert(VALIDATION_ERROR_MESSAGE);
        return;
    }

    incomes.push({
        id: generateId(),
        description: description,
        amount: amount
    });

    incomeDescriptionEl.value = '';
    incomeAmountEl.value = '';

    renderIncomeList();
    calculateTotals();
    saveToLocalStorage();
}

// Add expense
function addExpense() {
    const description = expenseDescriptionEl.value.trim();
    const amount = parseFloat(expenseAmountEl.value);

    if (!description || isNaN(amount) || amount <= 0) {
        alert(VALIDATION_ERROR_MESSAGE);
        return;
    }

    expenses.push({
        id: generateId(),
        description: description,
        amount: amount
    });

    expenseDescriptionEl.value = '';
    expenseAmountEl.value = '';

    renderExpenseList();
    calculateTotals();
    saveToLocalStorage();
}

// Delete item
function deleteItem(id, type) {
    if (type === 'income') {
        incomes = incomes.filter(item => item.id !== id);
        renderIncomeList();
    } else {
        expenses = expenses.filter(item => item.id !== id);
        renderExpenseList();
    }
    calculateTotals();
    saveToLocalStorage();
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('budgetIncomes', JSON.stringify(incomes));
    localStorage.setItem('budgetExpenses', JSON.stringify(expenses));
}

// Load from localStorage
function loadFromLocalStorage() {
    const savedIncomes = localStorage.getItem('budgetIncomes');
    const savedExpenses = localStorage.getItem('budgetExpenses');

    try {
        if (savedIncomes) {
            incomes = JSON.parse(savedIncomes);
        }
        if (savedExpenses) {
            expenses = JSON.parse(savedExpenses);
        }
    } catch (e) {
        // If parsing fails, reset to empty arrays
        incomes = [];
        expenses = [];
        localStorage.removeItem('budgetIncomes');
        localStorage.removeItem('budgetExpenses');
    }

    renderIncomeList();
    renderExpenseList();
    calculateTotals();
}

// Event Listeners
addIncomeBtn.addEventListener('click', addIncome);
addExpenseBtn.addEventListener('click', addExpense);

// Handle delete button clicks using event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        const type = e.target.dataset.type;
        deleteItem(id, type);
    }
});

// Handle Enter key for inputs
incomeAmountEl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addIncome();
    }
});

expenseAmountEl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addExpense();
    }
});

// Initialize
loadFromLocalStorage();
