import React from "react";
import api from "./api";
import FormContainer from "./form/FormContainer";

const App = () => {
  return <FormContainer getOptions={api.getUsers} />;
};

export default App;
