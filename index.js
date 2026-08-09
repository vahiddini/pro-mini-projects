const jsonfile = require("jsonfile");
const simpleGit = require("simple-git");

const FILE_PATH = "./data.json";
const git = simpleGit();

const START_DATE = new Date("2023-01-11T03:00:00");
const END_DATE = new Date("2026-12-31T23:50:59");

const makeCommit = async (n) => {
  if (n === 0) {
    await git.push();
    return;
  }

  const progress = (200 - n) / 199;

  const start = START_DATE.getTime();
  const end = END_DATE.getTime();

  // Randomness around the chronological position
  const randomProgress =
    progress + (Math.random() - 0.5) * 0.05;

  const timestamp = start + (
    Math.max(0, Math.min(1, randomProgress)) *
    (end - start)
  );

  const date = new Date(timestamp);
  const DATE = date.toISOString();

  await jsonfile.writeFile(FILE_PATH, {
    date: DATE,
  });

  await git.add(FILE_PATH);

  await git.commit(`Update ${DATE}`, {
    "--date": DATE,
  });

  console.log(`${200 - n + 1}/200 → ${DATE}`);

  return makeCommit(n - 1);
};

makeCommit(200).catch(console.error);
