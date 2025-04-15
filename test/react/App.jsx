import React, { useState } from "react";
import message from "message.js";

export const ChildComponent = (count, name, message, posts, data) => {
  return (
    <div>
      My name is {name} with {count} years of age. {message}
      <ul>
        {posts.map((post) => {
          <li key={post.id}>{post?.title}</li>;
        })}
      </ul>
      <div>{JSON.stringify(data)}</div>
    </div>
  );
};

const App = ({prop1}) => {
  const [count, setCount] = useState(4);
  const [theme, setTheme] = useState("dark");
  const [filteredDate, setFilteredDate] = useState(new Date());

  const user = {
    name: "John Doe",
    age: 30,
  };

  let { name } = user;
  const data = [
    {
      id: 1,
      title: "First Post",
      content: "This is the first post",
      createdAt: new Date(2022, 1, 1),
    },
    {
      id: 2,
      title: "Second Post",
      content: "This is the second post",
      createdAt: new Date(2022, 1, 2),
    },
  ];

  const posts = useMemo(() => {
    // filter data here
    return posts.filter((post) => post.createdAt > filteredDate);
  }, [posts, filteredDate]);

  const className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-2 px-4 rounded-full shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105";

  return (
    <div>
      <h1>Hello, World</h1>
      <p>Welcome, {name}!</p>
      <ChildComponent ::count ::name message="Main message" />
    </div>
  );
};

export default App;
