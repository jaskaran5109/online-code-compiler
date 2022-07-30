const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const { generateFile } = require("./generateFile");
const {
  executePy,
  executeC,
  executeJs,
  executeJava,
} = require("./executeProgFiles");
const Job = require("./models/Job");

const app = express();

const PORT = 8000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "./frontend/build")));


app.get("/status", async (req, res, next) => {
  const jobId = req.query.id;
  if (jobId === undefined) {
    return res.status(400).json({
      success: false,
      error: "Missing Id Parameter",
    });
  }
  try {
    const job = await Job.findById(jobId);
    if (job === undefined) {
      return res.status(404).json({
        success: false,
        error: "Invalid ID",
      });
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: JSON.stringify(err),
    });
  }
});

app.post("/run", async (req, res, next) => {
  const { language = "py", code, input = 123 } = req.body;
  if (code === undefined) {
    return res.status(400).json({
      success: false,
      error: "Empty Code Body",
    });
  }
  let job;
  try {
    const filepath = await generateFile(language, code);
    job = await new Job({
      language,
      filepath,
    }).save();
    const jobId = job["_id"];
    res.status(201).json({
      success: true,
      jobId,
    });
    job["startedAt"] = new Date();
    let output = "";
    if (language === "py") {
      output = await executePy(filepath, input);
    } else if (language === "c") {
      output = await executeC(filepath);
    } else if (language === "js") {
      output = await executeJs(filepath);
    } else if (language === "java") {
      output = await executeJava(filepath);
    }
    job["completedAt"] = new Date();
    job["status"] = "success";
    job["output"] = output;

    await job.save();
    // return res.json({ filepath, output });
  } catch (err) {
    job["completedAt"] = new Date();
    job["status"] = "error";
    job["output"] = JSON.stringify(err);
    await job.save();
    console.log(err);
  }
});

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"))
})
mongoose
  .connect("mongodb+srv://admin:OdeaqpXdxYBFB9p1@compilerapp.hht5bhb.mongodb.net/compilerApp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .then((data) => {
    console.log(`Mongodb connected with server`);
  });
