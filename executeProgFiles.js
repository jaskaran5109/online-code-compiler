const { exec, spawnSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const executePy = (filepath, input) => {
  return new Promise((resolve, reject) => {
    exec(
      `python ${filepath}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};
const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}`);

  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

const executeJs = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`node ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

const executeJava = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`javac ${filepath} && java ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};
module.exports = {
  executePy,
  executeC,
  executeJs,
  executeJava,
};
