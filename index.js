const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const errorHandler = require("./middlerware/gobalErrorHandler");
const logger = require("./middlerware/logger");
const mainRouter = require("./router/mainRouter");
const notFoundRoute = require("./middlerware/notFoundRoute");
const app = express();
dotenv.config();
console.log(process.env.JWT_SECRET);
const { execSync } = require('child_process');
app.use(express.json());
mongoose
  .connect(process.env.MONGODB_CONNECT_STRING)
  .then(() => console.log("mongoose connect successfully"))
  .catch((e) => console.log(e));

app.use(logger);

app.get("/api", (req, res) => {
 
const totalCommits = 5;

// Starting date
let date = new Date();

// Function to format date as 'YYYY-MM-DD HH:MM:SS'
const formatDate = (date) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

for (let i = 1; i <= totalCommits; i++) {
  // Generate a commit message
  const message = `Auto commit #${i}`;
  
  // Increment date by 1 day for each commit
  date.setDate(date.getDate() + 1);

  // Format the date for Git
  const formattedDate = formatDate(date);

  try {
    // Stage all changes
    execSync('git add .');

    // Set the GIT_COMMITTER_DATE and GIT_AUTHOR_DATE and create the commit
    execSync(
      `GIT_COMMITTER_DATE="${formattedDate}" GIT_AUTHOR_DATE="${formattedDate}" git commit -m "${message}"`
    );

    console.log(`Created commit #${i} on ${formattedDate}`);
  } catch (error) {
    console.error(`Failed at commit #${i}:`, error.message);
    break;
  }
}

console.log(`Finished creating ${totalCommits} commits with different dates.`);
})

app.use(mainRouter);

app.use(notFoundRoute);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("server listening in 3000 port");
});
