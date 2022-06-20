import { useEffect } from "react";
import { Options, removeDuplicate } from "./selectService";
import useSelectContext from "./useSelect";

/**
 * Custom hook used for creating properties for select component.
 * @param level positive integer, where 0 is the first select component.
 * @param getOptionsForNextLevel Promise based function that returns options for next select component.
 * @returns Object where:  
 * values which represents the selected values,  
 * options which represents the options for next select component  
 * onChange which represents the function to change the value of the select component. 
 */
const useOptions = (
  level: number,
  getOptionsForNextLevel?: (ids: string[]) => Promise<Options>
) => {
  const { findOptionsForParents, findValuesForLevelAsStrings, invoke, setOptions, setValue } =
    useSelectContext();

  const value = findValuesForLevelAsStrings(level);
  const valueStableRef = value.join(",");
  const parentIds =
    level > 0 ? findValuesForLevelAsStrings(level - 1).map(Number) : "root";
  const options = findOptionsForParents(parentIds)(level);

  useEffect(() => {
    if (getOptionsForNextLevel) {
      const appendOptions = (options: Options) =>
        setOptions((prev) => removeDuplicate(prev.concat(options)));
      getOptionsForNextLevel(value).then(appendOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStableRef]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setValue(invoke(level)(value));
  };

  return {
    value,
    options,
    onChange,
  } as const;
};

export default useOptions;
