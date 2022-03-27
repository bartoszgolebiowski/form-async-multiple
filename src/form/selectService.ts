export type Values = SingleValue[];
export type Options = SingleOption[];

type SingleValue = { value: number; parent: number | null; level: number };

type SingleOption = {
  value: number;
  parent: number | null;
  level: number;
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

const selectors = (values: Values, options: Options) => {
  const findOptions = (level: number) => options.filter(isSameLevel(level));
  const findValues =
    (level: number) =>
    <T>(callback: (value: SingleValue) => T): T[] =>
      values.filter(isSameLevel(level)).map(callback);

  return {
    findOptions,
    findOptionsForParents: (parentIds: number[] | "root") => (level: number) =>
      parentIds === "root"
        ? findOptions(0)
        : findOptions(level).filter(isParentIncluded(parentIds)),
    findValues,
    findValuesString: (level: number) => findValues(level)(mapToString),
  };
};

export const selectServiceFactory = (values: Values, options: Options) => ({
  ...selectors(values, options),
  invoke: selectService(values, options),
});

export const selectService = (values: Values, options: Options) => {
  const { findOptions, findValues } = selectors(values, options);
  return (level: number) => {
    const collectAllValuesToDelete = (
      toDelete: SingleValue[],
      valueFromSelect: number
    ) => {
      const collectToDelete = (parentIdsToDelete: number[], level: number) => {
        if (parentIdsToDelete.length === 0) return;
        const valuesLevel = findValues(level)(mapToObject);
        const valuesToDelete = valuesLevel.filter(
          isParentIncluded(parentIdsToDelete)
        );
        toDelete.push(...valuesToDelete);
        collectToDelete(valuesToDelete.map(mapToValue), level + 1);
      };

      collectToDelete([valueFromSelect], level + 1);
      return toDelete;
    };

    return (valueSelect: number) => {
      const valueObj = values.find(sameLevelAndValue(level)(valueSelect));
      if (valueObj) {
        const elementsToDelete = collectAllValuesToDelete(
          [valueObj],
          valueSelect
        );
        const removeValuesPredicate = (value: SingleValue) =>
          !elementsToDelete.some(sameLevelAndValue(value.level)(value.value));

        return values.filter(removeValuesPredicate);
      } else {
        return [
          ...values,
          {
            level,
            value: valueSelect,
            parent:
              findOptions(level).find(isSameValue(valueSelect))?.parent ?? null,
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
