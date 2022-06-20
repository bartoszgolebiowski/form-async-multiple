import React from "react";
import api from "../api";
import Form from "./Form";
import { SelectProvider } from "./useSelect";

const FormContainer = () => (
  <SelectProvider getOptionsForRoot={api.getUsers}>
    <Form />
  </SelectProvider>
);

export default FormContainer;
