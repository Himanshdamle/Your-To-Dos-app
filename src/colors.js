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
