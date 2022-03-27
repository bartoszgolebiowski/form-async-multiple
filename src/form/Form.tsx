import React from "react";
import api from "../api";
import Select from "./Select";
import useOptions from "./useOptions";

const Form = () => {
  const user = useOptions(0, api.getPosts);
  const post = useOptions(1, api.getComments);
  const comment = useOptions(2);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const json = JSON.stringify(Object.fromEntries(formData));
    alert(json);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select label="User" name="user" {...user} />
      <Select label="Post" name="post" {...post} />
      <Select label="Comment" name="comment" {...comment} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
