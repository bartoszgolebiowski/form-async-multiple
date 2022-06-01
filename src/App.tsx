import React from "react";
import api from "./api";
import FormContainer from "./form/FormContainer";

const App = () => {
  return <FormContainer getOptionsForRoot={api.getUsers} />;
};

export default App;
