-- Query 1: Filtered SELECT - Get all expenses for a specific user
-- Returns all expense transactions for user with id = 1
SELECT 
    t.id,
    t.amount,
    t.description,
    t.transaction_date,
    c.name as category_name,
    a.name as account_name
FROM transactions t
JOIN accounts a ON t.account_id = a.id
JOIN categories c ON t.category_id = c.id
WHERE a.user_id = 1 AND t.type = 'expense'
ORDER BY t.transaction_date DESC;

-- Query 2: Filtered SELECT with date range
-- Get transactions between specific dates
SELECT * FROM transactions
WHERE transaction_date BETWEEN '2026-07-01' AND '2026-07-15'
ORDER BY transaction_date;

-- Query 3: JOIN - Get user with all their accounts and total balance
SELECT 
    u.id,
    u.name,
    u.email,
    a.id as account_id,
    a.name as account_name,
    a.type,
    a.balance
FROM users u
LEFT JOIN accounts a ON u.id = a.user_id
WHERE u.id = 1;

-- Query 4: GROUP BY aggregation - Total income and expenses per user
SELECT 
    u.id,
    u.name,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN t.type = 'income' THEN t.amount 
             WHEN t.type = 'expense' THEN -t.amount ELSE 0 END) as net_balance
FROM users u
JOIN accounts a ON u.id = a.user_id
JOIN transactions t ON a.id = t.account_id
GROUP BY u.id, u.name
ORDER BY net_balance DESC;

-- Query 5: GROUP BY - Monthly spending by category
SELECT 
    c.name as category_name,
    EXTRACT(MONTH FROM t.transaction_date) as month,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_spent
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name, EXTRACT(MONTH FROM t.transaction_date)
ORDER BY month, total_spent DESC;

-- Query 6: Advanced technique - Subquery to find users with above-average balance
SELECT 
    u.id,
    u.name,
    SUM(a.balance) as total_balance
FROM users u
JOIN accounts a ON u.id = a.user_id
GROUP BY u.id, u.name
HAVING SUM(a.balance) > (
    SELECT AVG(total_bal)
    FROM (
        SELECT SUM(balance) as total_bal
        FROM accounts
        GROUP BY user_id
    ) as user_totals
);

-- Query 7: Advanced technique - CTE to get top spending categories per user
WITH user_expenses AS (
    SELECT 
        u.id as user_id,
        u.name,
        c.name as category_name,
        SUM(t.amount) as total_spent
    FROM users u
    JOIN accounts a ON u.id = a.user_id
    JOIN transactions t ON a.id = t.account_id
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
    GROUP BY u.id, u.name, c.name
)
SELECT * FROM user_expenses
WHERE (user_id, total_spent) IN (
    SELECT user_id, MAX(total_spent)
    FROM user_expenses
    GROUP BY user_id
);

-- Query 8: LEFT JOIN to find categories with zero transactions
SELECT 
    c.id,
    c.name,
    c.type,
    COUNT(t.id) as transaction_count
FROM categories c
LEFT JOIN transactions t ON c.id = t.category_id
GROUP BY c.id, c.name, c.type
HAVING COUNT(t.id) = 0;

-- Query 9: Window function - Running balance per account
SELECT 
    a.name as account_name,
    t.transaction_date,
    t.description,
    t.amount,
    t.type,
    SUM(CASE WHEN t.type = 'income' THEN t.amount 
             WHEN t.type = 'expense' THEN -t.amount 
             ELSE 0 END) OVER (
        PARTITION BY a.id 
        ORDER BY t.transaction_date, t.id
    ) as running_balance
FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE a.user_id = 1
ORDER BY t.transaction_date, t.id;

-- Query 10: Aggregation with HAVING - Find users with more than 10 transactions
SELECT 
    u.id,
    u.name,
    COUNT(t.id) as transaction_count,
    SUM(t.amount) as total_amount
FROM users u
JOIN accounts a ON u.id = a.user_id
JOIN transactions t ON a.id = t.account_id
GROUP BY u.id, u.name
HAVING COUNT(t.id) > 10;