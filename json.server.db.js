module.exports = function() {
  "use strict";
  var faker = require("faker");
  var data = {
    users: [],
    posts: [
      {
        id: 1,
        title: "json-server",
        author: "typicode",
      },
    ],
    comments: [
      {
        id: 1,
        body: "some comment",
        postId: 1,
      },
    ],
    todos: [
      {
        id: 1,
        title: faker.hacker.verb(),
        completed: faker.random.boolean(),
      },
      {
        id: 2,
        title: faker.hacker.verb(),
        completed: faker.random.boolean(),
      },
    ],
  };
  // Create 1000 users
  for (var i = 0; i < 1000; i++) {
    data.users.push({ id: i, name: faker.name.findName() });
  }

  return data;
};
