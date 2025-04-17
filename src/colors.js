// // colors.js or inside tailwind.config.js > theme > extend > colors

// const colors = {
//   background: "#0F0F0F", // main background
//   card: "#1A1A1A", // card / section background

//   accent: {
//     green: "#2CB67D", // Create
//     blue: "#5C82FF", // Update
//     yellow: "#F4D35E", // Read
//     red: "#FF6B6B", // Delete
//   },

//   text: {
//     default: "#FFFFFF", // white text
//     muted: "#9CA3AF", // gray-400
//   },

//   border: {
//     light: "rgba(255, 255, 255, 0.2)", // border-white/20
//   },

//   input: "#1A1A1A", // same as card bg
// };

// module.exports = colors;

function generateRandomDate() {
  const start = new Date();
  const end = new Date();
  end.setFullYear(end.getFullYear() + 1); // future 1 year

  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);
  return randomDate.toISOString().split("T")[0]; // YYYY-MM-DD
}

function generateRandomTime() {
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function generatePriority(date) {
  const now = new Date();
  const due = new Date(date);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return Math.random() < 0.6 ? "urgent" : "high";
  if (diffDays <= 30) return Math.random() < 0.5 ? "high" : "medium";
  if (diffDays <= 90) return Math.random() < 0.5 ? "medium" : "low";
  return "low";
}

function generateTodos(count = 1000) {
  const headings = [
    "Submit assignment",
    "Doctor appointment",
    "Grocery shopping",
    "Team meeting",
    "Project deadline",
    "Vacation planning",
    "Car service",
    "Renew domain",
    "Pay bills",
    "Birthday reminder",
    "Code review",
    "Client call",
  ];

  const descriptions = [
    "Complete and upload the work.",
    "Attend the scheduled checkup.",
    "Buy essentials from the list.",
    "Discuss project updates and timelines.",
    "Prepare project for final submission.",
    "Plan route and tickets for trip.",
    "Book appointment at the service center.",
    "Renew website hosting and domain.",
    "Pay utility bills before the due date.",
    "Buy gift and plan celebration.",
    "Peer review the codebase for improvements.",
    "Confirm client requirements.",
  ];

  return Array.from({ length: count }, (_, index) => {
    const date = generateRandomDate();
    return {
      heading: headings[Math.floor(Math.random() * headings.length)],
      description:
        descriptions[Math.floor(Math.random() * descriptions.length)],
      date,
      time: generateRandomTime(),
      priority: generatePriority(date),
      id: (index + 1).toString(),
    };
  });
}

const largeTodoList = generateTodos(10);

function getDateRange(date) {
  const today = new Date().toISOString().split("T")[0];
  const [year, month, day] = date.split("-").map((number) => number);
  const [currYear, currMonth, currDay] = today
    .split("-")
    .map((number) => number);

  let [diffYear, diffMonth, diffDay] = [
    year - currYear,
    month - currMonth,
    day - currDay,
  ];

  if (diffYear < 0 || month < currMonth || day < currDay)
    return "delete this todo. out of date";

  if (diffDay < 0 || diffMonth) diffDay += 30;
  if (diffMonth < 0 || diffYear) diffMonth += 12;

  const isOverMonth = diffMonth >= 1 && diffMonth <= 11;

  if (diffDay <= 28 && !isOverMonth) {
    if (diffDay === 0) return "Due this day.";

    for (let i = 1; i <= 4; i++) {
      if (i == 1) {
        if (diffDay / (7 * i) <= 1) return "due this week";
      } else {
        if (diffDay / (7 * i) <= 1) return `due over ${i} weeks`;
      }
    }
  }

  if (isOverMonth) {
    return `due over ${diffMonth} months`;
  }

  return `over a year`; // lastly if its over a year
}

console.log(getDateRange("2025-03-15"));

function groupTodosWithDate(todoList) {
  const result = todoList.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) {
      acc[date] = [curr];
    } else {
      acc[date].push(curr);
    }
    return acc;
  }, {});
  const keysNdValues = {
    keys: Object.keys(result),
    values: Object.values(result),
  };

  const range = keysNdValues.keys.map((date) => getDateRange(date));

  console.log(range);
  const nlp = range.reduce((acc, curr, index) => {
    const todo = keysNdValues.values[index];
    if (!acc[curr]) {
      acc[curr] = [...todo];
    } else {
      acc[curr].push(...todo);
    }
    return acc;
  }, {});

  // return nlp;
}

// console.log(groupTodosWithDate(largeTodoList));
