import React from "react";
import useOptions from "./useOptions";

type Props = ReturnType<typeof useOptions> & { name: string; label: string };

const Select: React.FC<Props> = (props) => {
  return (
    <p>
      <label htmlFor={props.name}>
        {props.label}
        <select
          multiple
          id={props.name}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
        >
          {props.options.map((element) => (
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
