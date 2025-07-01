export function middle() {
  function syncCurrentChanges() {
    const syncNow = document.querySelector("#snyc-now");
    const lastSyncedTime = document.querySelector("#last-synced-time");
    lastSyncedTime.innerText =
      localStorage.getItem("lastSyncedTime") || "Never Synced";

    syncNow.addEventListener("click", () => {
      location.reload();
      const timeNow = new Date();

      const timeString = timeNow.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      localStorage.setItem("lastSyncedTime", timeString);
    });
  }
  syncCurrentChanges();

  function greetUser() {
    const greetingEl = document.getElementById("greeting");
    const now = new Date();
    const hour = now.getHours();

    let greetingMessage = "Hello!"; // default

    if (hour >= 5 && hour < 12) {
      greetingMessage = "Good Morning ";
    } else if (hour >= 12 && hour < 17) {
      greetingMessage = "Good Afternoon ";
    } else if (hour >= 17 && hour < 21) {
      greetingMessage = "Good Evening ";
    } else {
      greetingMessage = "Good Night ";
    }

    greetingEl.textContent = greetingMessage;
  }
  greetUser();

  function getUserDetails() {
    function getUserName() {
      const userNameInput = document.querySelector("#user-name");

      const userName = localStorage.getItem("userName") || null;

      if (userName) {
        userNameInput.value = userName;
        document.querySelector("#psuedo-placeholder-user-name").style.display =
          "none";
      }

      userNameInput.addEventListener("input", () => {
        localStorage.setItem("userName", userNameInput.value);
      });
    }
    getUserName();

    function getUserPfp() {
      const selectPhotoBtn = document.querySelector("#select-user-photo");
      const fileInput = document.querySelector("#fileInput");
      let img = selectPhotoBtn.querySelector("img");

      // Load from localStorage (base64)
      img.src =
        localStorage.getItem("userPfp") ||
        "https://images.unsplash.com/photo-1745293459505-270666c2b1fe?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

      selectPhotoBtn.addEventListener("click", () => {
        fileInput.click();
      });

      fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64Image = e.target.result;
            localStorage.setItem("userPfp", base64Image);
            img.src = base64Image;
          };
          reader.readAsDataURL(file);
        }
      });
    }
    getUserPfp();
  }
  getUserDetails();
}
