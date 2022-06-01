import React from "react";
import useOptions from "./useOptions";

type Props = ReturnType<typeof useOptions> & { name: string; label: string };

const Select: React.FC<Props> = (props) => {
  const { label, options, ...rest } = props;
  return (
    <p>
      <label htmlFor={props.name}>
        {props.label}
        <select multiple {...rest}>
          {options.map((element) => (
            <option key={element.value} value={element.value}>
              {element.label}
            </option>
          ))}
        </select>
      </label>
    </p>
  );
};

export default Select;
