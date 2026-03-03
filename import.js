const path = require('path');
require('dotenv').config({ path: path.resolve('../config.env') });

const mongoose = require('mongoose');
const { DB_URL: DB } = process.env;

const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');

const fs = require('fs/promises');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const DATA_PATH = path.resolve('data');
const userFile = path.join(DATA_PATH, 'users.json');
const tourFile = path.join(DATA_PATH, 'tours.json');
const reviewFile = path.join(DATA_PATH, 'reviews.json');

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

const modelSelector = (input) => {
  switch (input) {
    case '1':
    case 'users':
      return { Model: User, filePath: userFile };

    case '2':
    case 'tours':
      return { Model: Tour, filePath: tourFile };

    case '3':
    case 'reviews':
      return { Model: Review, filePath: reviewFile };

    case '0':
    case 'exit':
      return { exit: true };

    default:
      console.log('Unknown command:', input);
      return { bad: true };
  }
};

const importDATA = async (rl) => {
  console.log(`
    - "1" or "users"   → import users
    - "2" or "tours"   → import tours
    - "3" or "reviews" → import reviews
    - "0" or "exit"    → exit
  `);

  while (true) {
    const input = await rl.question('Import>> ');
    const response = modelSelector(input);

    if (response?.bad) continue;
    if (response?.exit) return;

    const { Model, filePath } = response;
    const docs = await readFile(filePath);

          for(const [i, doc] of docs.entries()){
        await Model.create(doc);
        console.log(`Document -- ${i + 1} created!`);
      };

    console.log(
      `${docs.length} ${path.basename(filePath, '.json')} imported successfully!`
    );

    return;
  }
};

const deleteDATA = async (rl) => {
  console.log(`
    - "1" or "users"   → delete users
    - "2" or "tours"   → delete tours
    - "3" or "reviews" → delete reviews
    - "0" or "exit"    → exit
  `);

  while (true) {
    const input = await rl.question('Delete>> ');
    const response = modelSelector(input);

    if (response?.bad) continue;
    if (response?.exit) return;

    const { Model, filePath } = response;

    await Model.deleteMany({});

    console.log(
      `All ${path.basename(filePath, '.json')} deleted successfully!`
    );

    return;
  }
};

(async () => {
  const commands = {
    '1': async () => {
      console.log(`
        Help:
        - 1 → help
        - 2 → import data
        - 3 → delete data
        - 0 → exit
      `);
    },
    '2': async (rl) => await importDATA(rl),
    '3': async (rl) => await deleteDATA(rl),
    '0': async () => ({ exit: true }),
    import: async (rl) => await importDATA(rl),
    delete: async (rl) => await deleteDATA(rl),
    exit: async () => ({ exit: true })
  };

  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    await mongoose.connect(DB);
    console.log('DB connected!');

    console.log(`
      ~~~ Manage Collections ~~~

      - 1 → help
      - 2 → import data
      - 3 → delete data
      - 0 → exit
    `);

    while (true) {
      const input = await rl.question('CLI> ');
      const action = commands[input];

      if (!action) {
        console.log('Unknown command:', input);
        continue;
      }

      const result = await action(rl);

      if (result?.exit) {
        console.log('Exiting...');
        break;
      }
    }
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  }
})();