import React from "react";
import Select from "react-select";
import "./Navbar.css";
const Navbar = ({
  language,
  setUserLang,
  userTheme,
  setUserTheme,
  fontSize,
  setFontSize,
  compile,
  clearOutput,
}) => {
  const languages = [
    { value: "c", label: "C" },
    { value: "py", label: "Python" },
    { value: "java", label: "Java" },
    { value: "js", label: "JavaScript" },
  ];
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];

  return (
    <div className="navbar">
      <h1>Code Compiler</h1>
      <Select
        className="select-container"
        defaultValue={languages[1]}
        options={languages}
        value={language}
        onChange={(e) => {
          let response = window.confirm(
            "WARNING: Switching the language,will remove your current code. Do you wish to proceed?"
          );
          if (response) {
            setUserLang(e.value);
          }
        }}
        placeholder={language}
      />
      <Select
        className="select-container"
        defaultValue={themes[0]}
        options={themes}
        value={userTheme}
        onChange={(e) => {
          setUserTheme(e.value);
        }}
        placeholder={userTheme}
      />
      <label>Font Size</label>
      <input
        type="range"
        min="18"
        max="30"
        value={fontSize}
        step="2"
        onChange={(e) => {
          setFontSize(e.target.value);
        }}
      />
      <div className="buttons">
        <button className="run-btn" onClick={compile}>
          Run
        </button>
        <button className="run-btn" onClick={clearOutput}>
          Reset
        </button>
        
      </div>
    </div>
  );
};

export default Navbar;
