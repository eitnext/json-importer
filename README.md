 
# 📦 json-importer

A lightweight Node.js CLI tool to **import** and **delete** MongoDB collections (`users`, `tours`, `reviews`) from JSON files using Mongoose.

---

## 🚀 Features

* 📥 Import JSON files into MongoDB
* 🗑 Delete entire collections
* 🧭 Interactive CLI interface
* ⚡ Fast bulk insert with `insertMany`
* 🔌 Safe MongoDB connect/disconnect handling
* 🌱 Environment-based configuration with `dotenv`

---

## 📁 Project Structure

```bash
.
├── data/
│   ├── users.json
│   ├── tours.json
│   └── reviews.json
│
├── models/
│   ├── userModel.js
│   ├── tourModel.js
│   └── reviewModel.js
│
├── config.env
└── import.js
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/json-importer.git
cd json-importer
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

Required dependencies:

```bash
npm install mongoose dotenv
```

---

### 3️⃣ Configure Environment Variables

Create a `config.env` file in the root directory:

```env
DB_URL=mongodb://127.0.0.1:27017/your-database
```

---

## ▶️ Usage

Run the CLI:

```bash
node import.js
```

You’ll see:

```
~~~ Manage Collections ~~~

- 1 → help
- 2 → import data
- 3 → delete data
- 0 → exit
```

---

## 📥 Import Data

1. Select `2`
2. Choose:

   * `1` or `users`
   * `2` or `tours`
   * `3` or `reviews`

Example:

```
CLI> 2
Import>> users
```

✅ All documents from `data/users.json` will be inserted.

---

## 🗑 Delete Data

1. Select `3`
2. Choose the collection

Example:

```
CLI> 3
Delete>> tours
```

⚠️ This will delete **all documents** in the selected collection.

 
---

## 🛠 Tech Stack

* Node.js
* MongoDB
* Mongoose
* Dotenv
* Node.js Readline API

---

## 🔒 Safety Notes

* Double-check your `DB_URL` before running delete
* Always backup production databases
* Avoid running this tool directly on live production environments

---
 
## 📄 License

MIT License
 
