const getUsers = () =>
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((res: any) =>
      res.map((user: any) => ({
        value: user.id,
        label: user.name + user.id,
        level: 0,
        parent: null,
      }))
    );

const getPosts = (userIds: string[]) =>
  userIds.length > 0
    ? Promise.all(userIds.map(getPost)).then((posts) => posts.flat())
    : Promise.resolve([]);

const getPost = (userId: string) =>
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
    .then((res) => res.json())
    .then((res: any) =>
      res.map((post: any) => ({
        value: post.id,
        label: post.title + userId,
        level: 1,
        parent: Number(userId),
      }))
    );

const getComments = (postIds: string[]) =>
  postIds.length > 0
    ? Promise.all(postIds.map(getComment)).then((comments) => comments.flat())
    : Promise.resolve([]);

const getComment = (postId: string) =>
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then((res) => res.json())
    .then((res: any) =>
      res.map((comment: any) => ({
        value: comment.id,
        label: comment.name + postId,
        level: 2,
        parent: Number(postId),
      }))
    );

const api = {
  getUsers,
  getPosts,
  getComments,
};

export default api;
