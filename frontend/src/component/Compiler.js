import React, { useEffect, useState } from "react";
import "../App.css";
import Loader from "react-js-loader";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar";
import axios from "axios";
import moment from "moment";

const Compiler = () => {
    const [language, setUserLang] = useState("");
  const [code, setUserCode] = useState("");
  const [useroutput, setUserOutput] = useState("");
  const [status, setstatus] = useState("");
  const [jobDetails, setjobDetails] = useState(null);
  const [userTheme, setUserTheme] = useState("vs-dark");
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (language === "py") setUserCode("print('hi')");
    else if (language === "c")
      setUserCode(`#include <stdio.h>\nint main()\n{
  printf("Hello World");
  return 0;
}
      `);
    else if (language === "java")
      setUserCode(`class Main
{
  public static void main(String[] args) {
      System.out.println("Hello World");
  }
}`);
    else if (language === "js") setUserCode(`console.log("Hello World")`);
  }, [language]);

  const options = {
    fontSize: fontSize,
  };
  const compile = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setstatus("");
      setUserOutput("");
      setjobDetails(null);
      const { data } = await axios.post("/run", payload);
      let intervalId;
      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "/status",
          {
            params: {
              id: data.jobId,
            },
          }
        );
        const { success, job, error } = dataRes;
        if (success) {
          const { status: jobStatus, output: jobOutput } = job;
        // console.log(job)

          setstatus(jobStatus);
          setjobDetails(job);
          if (jobStatus === "pending") {
            return;
          }
              setUserOutput(jobOutput);
          clearInterval(intervalId);
        } else {
          setstatus("Error : Please Retry");
          setUserOutput(error);
          clearInterval(intervalId);
        }
      }, 1000);
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr.split(`.${language}`)[1];
        setUserOutput("Line" + errMsg);
      } else {
        setUserOutput("Error Connecting to server");
      }
    }
  };
  const clearOutput = () => {
    setUserOutput("");
  };
  const renderTimeDetails = () => {
    if (!jobDetails) return "";
    let result = "";
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString();
    result += `Submitted at: ${submittedAt}`;
    if (!completedAt || !startedAt) return result;

    return result;
  };
  const executiontime=()=>{
    if (!jobDetails) return "";
    let result = "";
    let {completedAt, startedAt } = jobDetails;
    if (!completedAt || !startedAt) return result;

    const start = moment(startedAt);
    const end = moment(completedAt);
    const executiontime = end.diff(start, "seconds", true);
    result+=`Execution time: ${executiontime}s`;
    return result
  }
  // console.log(useroutput)

  return (
    <div className="App">
      <Navbar
        userLang={language}
        defaultValue={language}
        setUserLang={setUserLang}
        userTheme={userTheme}
        setUserTheme={setUserTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
        compile={compile}
        clearOutput={clearOutput}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="100%"
            width="60vw"
            theme={userTheme}
            language={language}
            defaultValue={code}
            value={code}
            onChange={(value) => {
              setUserCode(value);
            }}
          />
        </div>
        <div className="right-container">
          <h4 className="output-text">OUTPUT</h4>

          <div className="output-box">
            {status === "pending" ? (
              <div className={"item"}>
                <Loader
                  type="spinner-default"
                  bgColor={"#ffffff"}
                  title={"Loading..."}
                  color={"#FFFFFF"}
                  size={100}
                />
              </div>
            ) : (
              <p className="outputText">
                {useroutput && useroutput}
              </p>
            )}
          </div>
          <h4 className="job-text">JOB DETAILS</h4>
          <p className="outputtextArea">
            {status === "success" && renderTimeDetails()}
          </p>
          <p className="outputtextArea">
            {status === "success" && executiontime()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Compiler;
