export const SESSION = {
  user: {
    id: "user_12345",
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
};

export const SIDEBAR_LINKS = [
  {
    imgURL: "/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const QUESTIONS: Question[] = [
  {
    _id: "q1",
    title: "How to center a div in CSS?",
    content:
      "I've tried using `margin: auto` but my div still won't center horizontally and vertically. What's the most reliable way to center elements in modern CSS?",
    tags: [
      { _id: "t1", name: "css", questions: 1200 },
      { _id: "t2", name: "html", questions: 800 },
    ],
    author: {
      _id: "u1",
      name: "Jane Doe",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    createdAt: new Date("2025-08-01T09:15:00Z"),
    upvotes: 24,
    downvotes: 2,
    answers: 3,
    views: 180,
  },
  {
    _id: "q2",
    title:
      "What is the difference between `let`, `const`, and `var` in JavaScript?",
    content:
      "I see a lot of code using `let` and `const` instead of `var`. Can someone explain the main differences and when to use each?",
    tags: [
      { _id: "t3", name: "javascript", questions: 2500 },
      { _id: "t4", name: "es6", questions: 900 },
    ],
    author: {
      _id: "u2",
      name: "John Smith",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    createdAt: new Date("2025-08-03T12:30:00Z"),
    upvotes: 52,
    downvotes: 1,
    answers: 5,
    views: 420,
  },
  {
    _id: "q3",
    title: "How do I optimize a SQL query with multiple joins?",
    content:
      "I have a query that joins 5 different tables and it's starting to get slow. What are some best practices for optimizing queries with many joins?",
    tags: [
      { _id: "t5", name: "sql", questions: 1700 },
      { _id: "t6", name: "database", questions: 600 },
    ],
    author: {
      _id: "u3",
      name: "Alice Johnson",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    createdAt: new Date("2025-08-05T08:45:00Z"),
    upvotes: 37,
    downvotes: 4,
    answers: 2,
    views: 310,
  },
  {
    _id: "q4",
    title: "What is the difference between REST and GraphQL?",
    content:
      "I often hear about GraphQL as an alternative to REST APIs. Can someone explain the main differences and when one might be preferred over the other?",
    tags: [
      { _id: "t7", name: "api", questions: 1200 },
      { _id: "t8", name: "graphql", questions: 500 },
    ],
    author: {
      _id: "u4",
      name: "Michael Lee",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    createdAt: new Date("2025-08-07T16:00:00Z"),
    upvotes: 64,
    downvotes: 3,
    answers: 6,
    views: 580,
  },
  {
    _id: "q5",
    title: "How to improve performance in a React application?",
    content:
      "My React app feels sluggish when rendering large lists. What are the most effective ways to improve performance, especially for rendering-heavy components?",
    tags: [
      { _id: "t9", name: "reactjs", questions: 2100 },
      { _id: "t10", name: "performance", questions: 400 },
    ],
    author: {
      _id: "u5",
      name: "Sarah Kim",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    createdAt: new Date("2025-08-10T10:20:00Z"),
    upvotes: 45,
    downvotes: 0,
    answers: 4,
    views: 350,
  },
];

export const TAGS: Tag[] = [
  {
    _id: "t1",
    name: "javascript",
    questions: 2500,
  },
  {
    _id: "t2",
    name: "reactjs",
    questions: 2100,
  },
  {
    _id: "t3",
    name: "css",
    questions: 1200,
  },
  {
    _id: "t4",
    name: "node.js",
    questions: 1500,
  },
  {
    _id: "t5",
    name: "graphql",
    questions: 500,
  },
];

export const HOMEPAGE_FILTERS = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommended", value: "recommended" },
];

export const ANSWER_FILTERS = [
  { name: "Newest", value: "latest" },
  { name: "Oldest", value: "oldest" },
  { name: "Popular", value: "popular" },
];

export const COLLECTION_FILTERS = [
  { name: "Oldest", value: "oldest" },
  { name: "Most Voted", value: "mostvoted" },
  { name: "Most Viewed", value: "mostviewed" },
  { name: "Most Recent", value: "mostrecent" },
  { name: "Most Answered", value: "mostanswered" },
];

export const TAG_FILTERS = [
  { name: "A-Z", value: "name" },
  { name: "Recent", value: "recent" },
  { name: "Oldest", value: "oldest" },
  { name: "Popular", value: "popular" },
];

export const USER_FILTERS = [
  { name: "Newest", value: "newest" },
  { name: "Oldest", value: "oldest" },
  { name: "Popular", value: "popular" },
];
