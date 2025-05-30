import Fuse from "fuse.js";

const todoData = [
  {
    heading: "gdsd",
    description: "sdg",
    date: "2025-05-30",
    time: "15:32",
    priority: "high",
    tags: [],
    id: "e6a72572-ee8a-44dd-970d-78c376f54093",
  },
  {
    heading: "Task 2",
    description: "",
    date: "2025-05-30",
    time: "15:37",
    priority: "high",
    tags: ["Work", "Personal", "Study"],
    id: "c71617bf-c3b4-4001-8b48-8ec8bcbb0429",
  },
  {
    heading: "Task 2 taskinng",
    description: "",
    date: "2025-05-30",
    time: "15:38",
    priority: "medium",
    tags: ["Work", "GYM", "Health"],
    id: "908b0c8d-e94c-491d-a9c2-df76f2ff2b20",
  },
];

const options = {
  keys: ["heading"],
};

const fuse = new Fuse(todoData, options);
const result = fuse.search("ask 2");

console.log(result);
