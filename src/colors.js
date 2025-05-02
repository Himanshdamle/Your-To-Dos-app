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
//     light: "rgba(255, 255, 255, 0.2)", // border-white/30
//   },

//   input: "#1A1A1A", // same as card bg
// };

// module.exports = colors;

const folderAndFiles = {
  "parent-study": {
    "child-of-study": {},
    "parent-ud": {
      "child-of-study": {},
    },
  },
};

function findParent(obj, targetKey, parent = null) {
  for (const key in obj) {
    if (key === targetKey) {
      return parent;
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const found = findParent(obj[key], targetKey, key);
      if (found) return key; // return the immediate parent
    }
  }
  return null; // not found
}

console.log(findParent(folderAndFiles, "child-of-study"));
