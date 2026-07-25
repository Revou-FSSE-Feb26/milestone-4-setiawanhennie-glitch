# FinTrack API

A personal finance/expense tracker backend API built with NestJS and PostgreSQL.

## Overview

FinTrack allows users to:
- Connect multiple accounts (cash, bank, e-wallet)
- Record transactions against accounts
- Categorize transactions as income or expense
- Track where their money goes

## Database Schema

See `docs/erd.png` for the entity-relationship diagram.

### Tables:
- **users**: User accounts with authentication
- **accounts**: Financial accounts (cash, bank, e-wallet)
- **categories**: Transaction categories (income/expense)
- **transactions**: Financial transactions linked to accounts and categories

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fintrack-api