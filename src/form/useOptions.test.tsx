/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable testing-library/render-result-naming-convention */

import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import useOptions from "./useOptions";
import { SelectProvider } from "./useSelect";

const getUsers = () =>
  Promise.resolve([
    { level: 0, value: 1, parent: null, label: "user1" },
    { level: 0, value: 2, parent: null, label: "user2" },
  ]);

const getPosts = (ids: string[]) =>
  Promise.resolve([
    { level: 1, value: 11, parent: 1, label: "post1" },
    { level: 1, value: 12, parent: 1, label: "post2" },
    { level: 1, value: 13, parent: 1, label: "post3" },
    { level: 1, value: 14, parent: 2, label: "post4" },
    { level: 1, value: 15, parent: 2, label: "post5" },
  ]);

const getComments = (ids: string[]) =>
  Promise.resolve([
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
  ]);

const onChangeEventMock = (value: string) =>
  ({ target: { value } } as React.ChangeEvent<HTMLSelectElement>);

describe("useOptions", () => {
  it("should invoke getUsers from SelectProvider to fill up initial options", async () => {
    const Wrapper: React.FC = (props) => (
      <SelectProvider {...props} getOptions={getUsers}></SelectProvider>
    );
    const { result: resultUser, waitFor } = renderHook(
      () => useOptions(0, getPosts),
      {
        wrapper: Wrapper,
      }
    );

    await waitFor(() =>
      expect(resultUser.current.options).toEqual([
        {
          label: "user1",
          level: 0,
          parent: null,
          value: 1,
        },
        {
          label: "user2",
          level: 0,
          parent: null,
          value: 2,
        },
      ])
    );
    expect(resultUser.current.value).toEqual([]);
  });

  it("should set correctly option values", async () => {
    const Wrapper: React.FC = (props) => (
      <SelectProvider {...props} getOptions={getUsers}></SelectProvider>
    );

    const useCombinedHook = () => {
      const user = useOptions(0, getPosts);
      const post = useOptions(1, getComments);
      const comment = useOptions(2);

      return {
        user,
        post,
        comment,
      };
    };

    const { result, waitFor, waitForValueToChange } = renderHook(
      useCombinedHook,
      {
        wrapper: Wrapper,
      }
    );

    //user
    await waitFor(() =>
      expect(result.current.user.options).toEqual([
        { level: 0, value: 1, parent: null, label: "user1" },
        { level: 0, value: 2, parent: null, label: "user2" },
      ])
    );
    act(() => {
      result.current.user.onChange(onChangeEventMock("1"));
    });
    await waitForValueToChange(() => result.current.user.value);
    await waitFor(() => expect(result.current.user.value).toEqual(["1"]));
    act(() => {
      result.current.user.onChange(onChangeEventMock("2"));
    });
    await waitForValueToChange(() => result.current.user.value);
    await waitFor(() => expect(result.current.user.value).toEqual(["1", "2"]));
    //post
    await waitFor(() =>
      expect(result.current.post.options).toEqual([
        { level: 1, value: 11, parent: 1, label: "post1" },
        { level: 1, value: 12, parent: 1, label: "post2" },
        { level: 1, value: 13, parent: 1, label: "post3" },
        { level: 1, value: 14, parent: 2, label: "post4" },
        { level: 1, value: 15, parent: 2, label: "post5" },
      ])
    );
    act(() => {
      result.current.post.onChange(onChangeEventMock("11"));
    });
    await waitForValueToChange(() => result.current.post.value);
    await waitFor(() => expect(result.current.post.value).toEqual(["11"]));

    //comment
    await waitFor(() =>
      expect(result.current.comment.options).toEqual([
        { level: 2, value: 21, parent: 11, label: "comment1" },
        { level: 2, value: 26, parent: 11, label: "comment6" },
        { level: 2, value: 211, parent: 11, label: "comment11" },
        { level: 2, value: 212, parent: 11, label: "comment12" },
      ])
    );
    act(() => {
      result.current.comment.onChange(onChangeEventMock("21"));
    });
    await waitFor(() => expect(result.current.comment.value).toEqual(["21"]));
  });

  it("should unset correctly option values", async () => {
    const Wrapper: React.FC = (props) => (
      <SelectProvider {...props} getOptions={getUsers}></SelectProvider>
    );

    const useCombinedHook = () => {
      const user = useOptions(0, getPosts);
      const post = useOptions(1, getComments);
      const comment = useOptions(2);

      return {
        user,
        post,
        comment,
      };
    };

    const { result, waitFor, waitForValueToChange } = renderHook(
      useCombinedHook,
      {
        wrapper: Wrapper,
      }
    );

    //user
    await waitFor(() =>
      expect(result.current.user.options).toEqual([
        { level: 0, value: 1, parent: null, label: "user1" },
        { level: 0, value: 2, parent: null, label: "user2" },
      ])
    );
    act(() => {
      result.current.user.onChange(onChangeEventMock("1"));
    });
    await waitForValueToChange(() => result.current.user.value);
    await waitFor(() => expect(result.current.user.value).toEqual(["1"]));
    act(() => {
      result.current.user.onChange(onChangeEventMock("2"));
    });
    await waitForValueToChange(() => result.current.user.value);
    await waitFor(() => expect(result.current.user.value).toEqual(["1", "2"]));
    //post
    await waitFor(() =>
      expect(result.current.post.options).toEqual([
        { level: 1, value: 11, parent: 1, label: "post1" },
        { level: 1, value: 12, parent: 1, label: "post2" },
        { level: 1, value: 13, parent: 1, label: "post3" },
        { level: 1, value: 14, parent: 2, label: "post4" },
        { level: 1, value: 15, parent: 2, label: "post5" },
      ])
    );
    act(() => {
      result.current.post.onChange(onChangeEventMock("11"));
    });
    await waitForValueToChange(() => result.current.post.value);
    await waitFor(() => expect(result.current.post.value).toEqual(["11"]));

    //comment
    await waitFor(() =>
      expect(result.current.comment.options).toEqual([
        { level: 2, value: 21, parent: 11, label: "comment1" },
        { level: 2, value: 26, parent: 11, label: "comment6" },
        { level: 2, value: 211, parent: 11, label: "comment11" },
        { level: 2, value: 212, parent: 11, label: "comment12" },
      ])
    );
    act(() => {
      result.current.comment.onChange(onChangeEventMock("21"));
    });
    await waitFor(() => expect(result.current.comment.value).toEqual(["21"]));

    //user
    act(() => {
      result.current.user.onChange(onChangeEventMock("1"));
    });
    await waitForValueToChange(() => result.current.user.value);
    await waitFor(() => expect(result.current.user.value).toEqual(["2"]));
    await waitFor(() => expect(result.current.post.value).toEqual([]));
    await waitFor(() => expect(result.current.comment.value).toEqual([]));
  });
});
