-- Insert users (3+ users)
INSERT INTO users (name, email, password, role) VALUES
('Alice Johnson', 'alice@example.com', 'hashed_password_1', 'user'),
('Bob Smith', 'bob@example.com', 'hashed_password_2', 'user'),
('Carol Williams', 'carol@example.com', 'hashed_password_3', 'admin');

-- Insert accounts (2+ per user = 6+ total)
INSERT INTO accounts (user_id, name, type, balance) VALUES
(1, 'Alice Checking', 'bank', 2500.00),
(1, 'Alice Savings', 'bank', 10000.00),
(1, 'Alice Cash', 'cash', 150.00),
(2, 'Bob Main Account', 'bank', 1800.50),
(2, 'Bob E-Wallet', 'e-wallet', 300.00),
(3, 'Carol Business', 'bank', 15000.00),
(3, 'Carol Personal', 'bank', 3200.75);

-- Insert categories (6+ mixed income/expense)
INSERT INTO categories (name, type) VALUES
('Salary', 'income'),
('Freelance', 'income'),
('Investments', 'income'),
('Groceries', 'expense'),
('Rent', 'expense'),
('Utilities', 'expense'),
('Entertainment', 'expense'),
('Transportation', 'expense'),
('Healthcare', 'expense');

-- Insert transactions (20+ with varied dates)
INSERT INTO transactions (account_id, category_id, type, amount, description, transaction_date) VALUES
(1, 1, 'income', 3500.00, 'Monthly salary', '2026-07-01'),
(1, 4, 'expense', 150.75, 'Weekly groceries', '2026-07-05'),
(1, 5, 'expense', 1200.00, 'July rent', '2026-07-01'),
(1, 6, 'expense', 85.50, 'Electric bill', '2026-07-10'),
(2, 1, 'income', 500.00, 'Interest payment', '2026-07-15'),
(3, 7, 'expense', 45.00, 'Movie night', '2026-07-12'),
(1, 8, 'expense', 60.00, 'Gas refill', '2026-07-08'),
(4, 1, 'income', 2800.00, 'Monthly salary', '2026-07-01'),
(4, 4, 'expense', 200.30, 'Grocery shopping', '2026-07-06'),
(5, 2, 'income', 750.00, 'Freelance project', '2026-07-14'),
(5, 9, 'expense', 120.00, 'Doctor visit', '2026-07-11'),
(6, 1, 'income', 5000.00, 'Business revenue', '2026-07-01'),
(6, 5, 'expense', 2000.00, 'Office rent', '2026-07-01'),
(7, 3, 'income', 1200.00, 'Dividend payment', '2026-07-20'),
(1, 7, 'expense', 95.00, 'Concert tickets', '2026-07-18'),
(4, 8, 'expense', 75.00, 'Uber rides', '2026-07-09'),
(2, 4, 'expense', 180.25, 'Organic groceries', '2026-07-13'),
(5, 6, 'expense', 95.75, 'Internet bill', '2026-07-05'),
(1, 2, 'income', 400.00, 'Side project', '2026-07-22'),
(3, 4, 'expense', 35.50, 'Coffee and snacks', '2026-07-15'),
(6, 8, 'expense', 150.00, 'Business travel', '2026-07-16'),
(7, 7, 'expense', 200.00, 'Theater show', '2026-07-19');