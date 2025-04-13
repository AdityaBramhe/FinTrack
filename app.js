document.addEventListener("DOMContentLoaded", () => {
    
    const addTransactionBtn = document.getElementById("add-transaction-btn");
    const transactionModal = document.getElementById("transaction-modal");
    const transactionForm = document.getElementById("transaction-form");
    const transactionTableBody = document.getElementById("transaction-table-body");
    const cancelTransactionBtn = document.getElementById("cancel-transaction");
    
    
    const savingsModal = document.getElementById("savings-modal");
    const savingsForm = document.getElementById("savings-form");
    const cancelSavingsBtn = document.getElementById("cancel-savings");
    const savingsGoalTitle = document.getElementById("savings-goal-title");
    const savingsGoalId = document.getElementById("savings-goal-id");
    const addSavingsBtns = document.querySelectorAll(".add-saving-btn");
    
    
    const totalBalanceEl = document.getElementById("total-balance");
    const monthlyIncomeEl = document.getElementById("monthly-income");
    const monthlyExpensesEl = document.getElementById("monthly-expenses");

    
    const progressBars = {
        "Food & Groceries": document.getElementById("food-progress"),
        "Housing": document.getElementById("housing-progress"),
        "Transportation": document.getElementById("transport-progress"),
        "Entertainment": document.getElementById("entertainment-progress"),
    };

    
    let totalBalance = 70000;
    let monthlyIncome = 100000;
    let monthlyExpenses = 30000;

    
    const budgetLimits = {
        "Food & Groceries": 6000,
        "Housing": 12000,
        "Transportation": 4000,
        "Entertainment": 3000,
    };
    
    
    const categoryTotals = {
        "Food & Groceries": 0,
        "Housing": 0,
        "Transportation": 0,
        "Entertainment": 0,
    };
    
    
    const savingsGoals = {
        "vacation": {
            name: "Vacation Fund",
            current: 0,
            target: 65000,
            targetDate: "December 2025",
            progressBar: document.getElementById("vacation-progress"),
            amountEl: document.getElementById("vacation-amount"),
            percentageEl: document.getElementById("vacation-percentage"),
            remainingEl: document.getElementById("vacation-remaining")
        },
        "emergency": {
            name: "Emergency Fund",
            current: 0,
            target: 150000,
            targetDate: "Ongoing",
            progressBar: document.getElementById("emergency-progress"),
            amountEl: document.getElementById("emergency-amount"),
            percentageEl: document.getElementById("emergency-percentage"),
            remainingEl: document.getElementById("emergency-remaining")
        },
        "car": {
            name: "New Car",
            current: 0,
            target: 650000,
            targetDate: "November 2026",
            progressBar: document.getElementById("car-progress"),
            amountEl: document.getElementById("car-amount"),
            percentageEl: document.getElementById("car-percentage"),
            remainingEl: document.getElementById("car-remaining")
        }
    };

    
    updateTotals();
    updateBudgetProgressBars();
    updateSavingsProgress();
    
    
    updateBudgetAmountDisplay();

    
    addTransactionBtn.addEventListener("click", () => {
        transactionModal.style.display = "flex";
        
        
        document.getElementById("transaction-date").valueAsDate = new Date();
    });

    
    cancelTransactionBtn.addEventListener("click", () => {
        transactionModal.style.display = "none";
        transactionForm.reset();
    });

    
    addSavingsBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const goalId = btn.getAttribute("data-goal");
            const goal = savingsGoals[goalId];
            
            savingsGoalTitle.textContent = goal.name;
            savingsGoalId.value = goalId;
            
            
            document.getElementById("savings-date").valueAsDate = new Date();
            
            savingsModal.style.display = "flex";
        });
    });

    
    cancelSavingsBtn.addEventListener("click", () => {
        savingsModal.style.display = "none";
        savingsForm.reset();
    });

    
    window.addEventListener("click", (event) => {
        if (event.target === transactionModal) {
            transactionModal.style.display = "none";
            transactionForm.reset();
        }
        if (event.target === savingsModal) {
            savingsModal.style.display = "none";
            savingsForm.reset();
        }
    });

    //  transaction
    transactionForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const date = document.getElementById("transaction-date").value;
        const description = document.getElementById("transaction-description").value;
        const category = document.getElementById("transaction-category").value;
        const amount = parseFloat(document.getElementById("transaction-amount").value);
        const type = document.querySelector('input[name="transaction-type"]:checked').value;

        if (!date || !description || !category || isNaN(amount) || amount <= 0 || !type) {
            alert("Please fill all the fields with valid values.");
            return;
        }

        // Add to table
        const row = document.createElement("tr");
        row.className = "transaction-item";
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td>${description}</td>
            <td>${category}</td>
            <td>Rs.${amount.toFixed(2)}</td>
            <td>${type === "income" ? "Income" : "Expense"}</td>
            <td><button class="delete-btn">❌</button></td>
        `;

        transactionTableBody.appendChild(row);

        // Update totals
        if (type === "income") {
            totalBalance += amount;
            monthlyIncome += amount;
        } else { 
            totalBalance -= amount;
            monthlyExpenses += amount;
            
            
            if (category in categoryTotals) {
                categoryTotals[category] += amount;
                console.log(`Updated ${category} total to: ${categoryTotals[category]}`);
            }
        }

        
        updateTotals();
        updateBudgetProgressBars();
        updateBudgetAmountDisplay();

        
        transactionModal.style.display = "none";
        transactionForm.reset();
    });
    
    // Savings Goal
    savingsForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const date = document.getElementById("savings-date").value;
        const description = document.getElementById("savings-description").value;
        const amount = parseFloat(document.getElementById("savings-amount").value);
        const goalId = document.getElementById("savings-goal-id").value;

        if (!date || !description || isNaN(amount) || amount <= 0) {
            alert("Please fill all the fields with valid values.");
            return;
        }

        const goal = savingsGoals[goalId];
        
        
        goal.current += amount;
        
        
        updateSavingsProgress();
        
        
        totalBalance -= amount;
        updateTotals();
        
        
        const row = document.createElement("tr");
        row.className = "transaction-item";
        row.innerHTML = `
            <td>${formatDate(date)}</td>
            <td>${description} (${goal.name})</td>
            <td>Savings</td>
            <td>Rs.${amount.toFixed(2)}</td>
            <td>Savings</td>
            <td><button class="delete-btn">❌</button></td>
        `;
        transactionTableBody.appendChild(row);

        
        savingsModal.style.display = "none";
        savingsForm.reset();
        
        
        alert(`Successfully added Rs.${amount.toFixed(2)} to your ${goal.name}!`);
    });

    // Deleting Transaction
    transactionTableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const row = event.target.closest("tr");
            const description = row.children[1].innerText;
            const amount = parseFloat(row.children[3].innerText.replace("Rs.", ""));
            const type = row.children[4].innerText;

            if (type === "Income") {
                totalBalance -= amount;
                monthlyIncome -= amount;
            } else if (type === "Expense") {
                totalBalance += amount;
                monthlyExpenses -= amount;
                
                
                const category = row.children[2].innerText;
                if (category in categoryTotals) {
                    categoryTotals[category] -= amount;
                    console.log(`Updated ${category} total to: ${categoryTotals[category]}`);
                }
            } else if (type === "Savings") {
                
                const descriptionText = description;
                
                
                for (const goalId in savingsGoals) {
                    const goal = savingsGoals[goalId];
                    if (descriptionText.includes(goal.name)) {
                        
                        totalBalance += amount;
                        goal.current -= amount;
                        break;
                    }
                }
            }

            
            updateTotals();
            updateBudgetProgressBars();
            updateBudgetAmountDisplay();
            updateSavingsProgress();
            
            
            row.remove();
        }
    });

    
    function updateTotals() {
        totalBalanceEl.innerText = `Rs.${totalBalance.toFixed(2)}`;
        monthlyIncomeEl.innerText = `Rs.${monthlyIncome.toFixed(2)}`;
        monthlyExpensesEl.innerText = `Rs.${monthlyExpenses.toFixed(2)}`;
    }
    
    
    function updateBudgetAmountDisplay() {
        const categories = ["Food & Groceries", "Housing", "Transportation", "Entertainment"];
        
        categories.forEach(category => {
            
            const categoryHeaders = document.querySelectorAll('.budget-category h3');
            
            categoryHeaders.forEach(header => {
                if (header.textContent.includes(category)) {
                    
                    const span = header.querySelector('span');
                    if (span) {
                        span.textContent = `Rs.${categoryTotals[category].toFixed(0)} / Rs.${budgetLimits[category]}`;
                    }
                    
                    
                    const parentCategory = header.closest('.budget-category');
                    if (parentCategory) {
                        const progressInfo = parentCategory.querySelector('.progress-info');
                        if (progressInfo) {
                            const remainingSpan = progressInfo.querySelectorAll('span')[1];
                            if (remainingSpan) {
                                const remaining = budgetLimits[category] - categoryTotals[category];
                                remainingSpan.textContent = `Rs.${remaining.toFixed(0)} remaining`;
                            }
                            
                            
                            const usedSpan = progressInfo.querySelectorAll('span')[0];
                            if (usedSpan) {
                                const percentage = (categoryTotals[category] / budgetLimits[category] * 100) || 0;
                                usedSpan.textContent = `${percentage.toFixed(0)}% used`;
                            }
                        }
                    }
                }
            });
        });
    }

    // Updation of The progress Bars
    function updateBudgetProgressBars() {
        for (const category in categoryTotals) {
            if (category in progressBars && progressBars[category]) {
                const spent = categoryTotals[category];
                const limit = budgetLimits[category];
                const percentage = Math.min((spent / limit) * 100, 100) || 0; // Ensure we don't get NaN
                
                
                progressBars[category].style.width = `${percentage}%`;
                
                
                if (percentage < 60) {
                    progressBars[category].style.backgroundColor = 'var(--success)';
                } else if (percentage < 80) {
                    progressBars[category].style.backgroundColor = 'var(--warning)';
                } else {
                    progressBars[category].style.backgroundColor = 'var(--danger)';
                }
            }
        }
    }
    
    // Updation of The Savings Goals
    function updateSavingsProgress() {
        for (const goalId in savingsGoals) {
            const goal = savingsGoals[goalId];
            
            
            const percentage = Math.min((goal.current / goal.target) * 100, 100) || 0;
            const remaining = goal.target - goal.current;
            
            
            goal.amountEl.innerText = `Rs.${goal.current.toLocaleString()} / Rs.${goal.target.toLocaleString()}`;
            goal.percentageEl.innerText = `${percentage.toFixed(0)}% saved`;
            goal.remainingEl.innerText = `Rs.${remaining.toLocaleString()} to go`;
            
            // Updation of The Progress Bars
            goal.progressBar.style.width = `${percentage}%`;
        }
    }

    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }
});