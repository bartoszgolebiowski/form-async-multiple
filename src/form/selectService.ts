export type Values = SingleValue[];
export type Options = SingleOption[];

type SingleValue = { value: number; parent: number | null; level: number };

type SingleOption = SingleValue & {
  label: string;
};

const isSameLevel =
  (level: number) =>
    <T extends { level: number }>(element: T) =>
      element.level === level;

const isSameValue =
  (value: number) =>
    <T extends { value: number }>(element: T) =>
      element.value === value;

const isParentIncluded = (parentIds: number[]) => (value: SingleValue) =>
  parentIds.includes(value.parent!);

const sameLevelAndValue = <T extends { level: number; value: number }>(
  level: number
) => {
  const sameLevelPredicate = isSameLevel(level);
  return (value: number) => {
    const sameValuePredicate = isSameValue(value);
    return (element: T) =>
      sameValuePredicate(element) && sameLevelPredicate(element);
  };
};

const mapToObject = (value: SingleValue): SingleValue => value;
const mapToValue = <T extends { value: number }>(value: T) => value.value;
const mapToString = <T extends { value: number }>(value: T) =>
  String(value.value);

const ROOT_LEVEL = 0;

const selectors = (values: Values, options: Options) => {
  const findOptionsForLevel = (level: number) => options.filter(isSameLevel(level));
  const findValuesForLevel =
    (level: number) =>
      <T>(callback: (value: SingleValue) => T): T[] =>
        values.filter(isSameLevel(level)).map(callback);
  const findValuesForLevelAsStrings = (level: number) => findValuesForLevel(level)(mapToString)
  const findValuesForLevelAsNumbers = (level: number) => findValuesForLevel(level);

  const findOptionsForParents = (parentIds: number[] | "root") => (level: number) =>
    parentIds === "root"
      ? findOptionsForLevel(ROOT_LEVEL)
      : findOptionsForLevel(level).filter(isParentIncluded(parentIds))

  return {
    findOptionsForLevel,
    findOptionsForParents,
    findValuesForLevel,
    findValuesForLevelAsStrings,
    findValuesForLevelAsNumbers
  };
};

export const selectService = (values: Values, options: Options) => ({
  ...selectors(values, options),
  invoke: selectServiceImpl(values, options),
});

/**
 * Service used for manipulating values and options for select component  
 * @param values Values of all select components  
 * @param options Options of all select components  
 * @returns (level:number) => (value:number) =>   
 * where level is level of select component and value is value of select component
 */
export const selectServiceImpl = (values: Values, options: Options) => {
  const { findOptionsForLevel, findValuesForLevel } = selectors(values, options);
  return (level: number) => {
    const collectAllValuesToDelete = (
      toDelete: SingleValue[],
      value: number
    ) => {
      const collectToDelete = (parentIdsToDelete: number[], level: number) => {
        if (parentIdsToDelete.length === 0) return;
        const valuesLevel = findValuesForLevel(level)(mapToObject);
        const valuesToDelete = valuesLevel.filter(
          isParentIncluded(parentIdsToDelete)
        );
        toDelete.push(...valuesToDelete);
        collectToDelete(valuesToDelete.map(mapToValue), level + 1);
      };

      collectToDelete([value], level + 1);
      return toDelete;
    };

    return (value: number) => {
      const valueObj = values.find(sameLevelAndValue(level)(value));
      if (valueObj) {
        const elementsToDelete = collectAllValuesToDelete(
          [valueObj],
          value
        );
        const removeValuesPredicate = (value: SingleValue) =>
          !elementsToDelete.some(sameLevelAndValue(value.level)(value.value));

        return values.filter(removeValuesPredicate);
      } else {
        return [
          ...values,
          {
            level,
            value,
            parent:
              findOptionsForLevel(level).find(isSameValue(value))?.parent ?? null,
          },
        ];
      }
    };
  };
};

export const removeDuplicate = (options: Options) =>
  options.reduce((acc: Options, option: Options[number]) => {
    const value = option.value;
    const level = option.level;
    if (!acc.some(sameLevelAndValue(level)(value))) {
      acc.push(option);
    }
    return acc;
  }, []);
