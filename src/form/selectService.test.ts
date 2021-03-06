import {
  Options,
  removeDuplicate,
  selectServiceImpl,
  Values,
} from "./selectService";

const V: Values = [
  { level: 0, value: 1, parent: null },
  { level: 1, value: 11, parent: 1 },
  { level: 1, value: 12, parent: 1 },
  { level: 2, value: 21, parent: 11 },
  { level: 2, value: 22, parent: 11 },
  { level: 2, value: 212, parent: 12 },
];

const O: Options = [
  { level: 0, value: 1, parent: null, label: "user1" },
  { level: 0, value: 2, parent: null, label: "user2" },
  { level: 1, value: 11, parent: 1, label: "post1" },
  { level: 1, value: 12, parent: 1, label: "post2" },
  { level: 1, value: 13, parent: 1, label: "post3" },
  { level: 1, value: 14, parent: 2, label: "post4" },
  { level: 1, value: 15, parent: 2, label: "post5" },
  { level: 2, value: 21, parent: 11, label: "comment1" },
  { level: 2, value: 22, parent: 12, label: "comment2" },
  { level: 2, value: 23, parent: 13, label: "comment3" },
  { level: 2, value: 24, parent: 14, label: "comment4" },
  { level: 2, value: 25, parent: 15, label: "comment5" },
  { level: 2, value: 26, parent: 11, label: "comment6" },
  { level: 2, value: 27, parent: 12, label: "comment7" },
  { level: 2, value: 28, parent: 13, label: "comment8" },
  { level: 2, value: 29, parent: 14, label: "comment9" },
  { level: 2, value: 210, parent: 15, label: "comment10" },
  { level: 2, value: 211, parent: 11, label: "comment11" },
  { level: 2, value: 212, parent: 11, label: "comment12" },
];

describe("selectService functionallity", () => {
  it("should add new value", () => {
    expect(selectServiceImpl([], O)(0)(1)).toEqual([
      {
        level: 0,
        value: 1,
        parent: null,
      },
    ]);
  });
  it("should remove value", () => {
    expect(
      selectServiceImpl(
        [
          {
            level: 0,
            value: 1,
            parent: null,
          },
        ],
        O
      )(0)(1)
    ).toEqual([]);
  });

  it("should remove value and all children 1", () => {
    expect(selectServiceImpl(V, O)(0)(1)).toEqual([]);
  });
  it("should remove value and all children 2", () => {
    expect(selectServiceImpl(V, O)(1)(11)).toEqual([
      {
        level: 0,
        parent: null,
        value: 1,
      },
      {
        level: 1,
        parent: 1,
        value: 12,
      },
      {
        level: 2,
        parent: 12,
        value: 212,
      },
    ]);
  });
  it("should remove value and all children 3", () => {
    expect(selectServiceImpl(V, O)(1)(12)).toEqual([
      {
        level: 0,
        parent: null,
        value: 1,
      },
      {
        level: 1,
        parent: 1,
        value: 11,
      },
      {
        level: 2,
        parent: 11,
        value: 21,
      },
      {
        level: 2,
        parent: 11,
        value: 22,
      },
    ]);
  });

  it("should remove duplicates", () => {
    expect(removeDuplicate(O)).toEqual(O);
  });

  it("should remove duplicates 2", () => {
    expect(removeDuplicate([...O, ...O, ...O, ...O])).toEqual(O);
  });

});
