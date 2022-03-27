import { useEffect, useState } from "react";
import constate from "constate";
import { Options, selectServiceFactory, Values } from "./store";

type Props = {
  getOptions: () => Promise<Options>;
};

const useSelect = ({ getOptions }: Props) => {
  const [v, setV] = useState<Values>([]);
  const [o, setO] = useState<Options>([]);

  const { findOptionsForParents, findValuesString, invoke } =
    selectServiceFactory(v, o);

  useEffect(() => {
    getOptions().then(setO);
  }, [getOptions, setO]);

  return {
    findOptionsForParents,
    findValuesString,
    invoke,
    setV,
    setO,
  } as const;
};

export const [SelectProvider, useSelectContext] = constate(useSelect);
export default useSelectContext;
