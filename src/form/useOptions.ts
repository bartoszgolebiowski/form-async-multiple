import { useEffect } from "react";
import { Options, removeDuplicate } from "./store";
import useSelectContext from "./useSelect";

const useOptions = (
  level: number,
  getOptions?: (ids: string[]) => Promise<Options>
) => {
  const { findOptionsForParents, findValuesString, invoke, setO, setV } =
    useSelectContext();

  const value = findValuesString(level);
  const valueStableRef = value.join(",");
  const parentIds =
    level > 0 ? findValuesString(level - 1).map(Number) : "root";

  useEffect(() => {
    if (getOptions) {
      const appendOptions = (options: Options) =>
        setO((o) => removeDuplicate(o.concat(options)));
      getOptions(value).then(appendOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStableRef]);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setV(invoke(level)(value));
  };

  return {
    value,
    options: findOptionsForParents(parentIds)(level),
    onChange,
  } as const;
};

export default useOptions;
