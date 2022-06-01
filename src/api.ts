export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}

interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

interface Geo {
  lat: string
  lng: string
}

interface Company {
  name: string
  catchPhrase: string
  bs: string
}


const getUsers = () =>
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((res: User[]) =>
      res.map((user) => ({
        value: user.id,
        label: user.name + user.id,
        level: 0,
        parent: null,
      }))
    );

export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

const getPosts = (userIds: string[]) =>
  userIds.length > 0
    ? Promise.all(userIds.map(getPost)).then((posts) => posts.flat())
    : Promise.resolve([]);

const getPost = (userId: string) =>
  fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
    .then((res) => res.json())
    .then((res: Post[]) =>
      res.map((post) => ({
        value: post.id,
        label: post.title + userId,
        level: 1,
        parent: Number(userId),
      }))
    );

export interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

const getComments = (postIds: string[]) =>
  postIds.length > 0
    ? Promise.all(postIds.map(getComment)).then((comments) => comments.flat())
    : Promise.resolve([]);

const getComment = (postId: string) =>
  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then((res) => res.json())
    .then((res: Comment[]) =>
      res.map((comment) => ({
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
