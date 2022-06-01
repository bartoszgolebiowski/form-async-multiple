import { useEffect, useState } from "react";
import constate from "constate";
import { Options, selectService, Values } from "./selectService";

type Props = {
  getOptionsForRoot: () => Promise<Options>;
};

const useSelect = ({ getOptionsForRoot }: Props) => {
  const [value, setValue] = useState<Values>([]);
  const [options, setOptions] = useState<Options>([]);

  const { findOptionsForParents, findValuesForLevelAsStrings, findValuesForLevelAsNumbers, invoke } =
    selectService(value, options);

  useEffect(() => {
    getOptionsForRoot().then(setOptions);
  }, [getOptionsForRoot, setOptions]);

  return {
    findOptionsForParents,
    findValuesForLevelAsStrings,
    findValuesForLevelAsNumbers,
    invoke,
    setValue,
    setOptions,
  } as const;
};

export const [SelectProvider, useSelectContext] = constate(useSelect);
export default useSelectContext;
