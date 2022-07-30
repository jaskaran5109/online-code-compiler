import React from "react";
import Compiler from "./component/Compiler";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* <Routes> */}
        <Route path="/" component={Compiler} />
      {/* </Routes> */}
    </Router>
  );
}

export default App;
