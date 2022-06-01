import React from "react";
import Form from "./Form";
import { Options } from "./selectService";
import { SelectProvider } from "./useSelect";

type Props = {
  getOptionsForRoot: () => Promise<Options>;
};

const FormContainer: React.FC<Props> = (props) => (
  <SelectProvider {...props}>
    <Form />
  </SelectProvider>
);

export default FormContainer;
