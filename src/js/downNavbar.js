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
      const placeholderUserName = document.querySelector(
        "#psuedo-placeholder-user-name"
      );
      const userName = localStorage.getItem("userName");

      if (userName) {
        userNameInput.value = userName;
        placeholderUserName.style.display = "none";
      } else {
        userNameInput.value = "";
        placeholderUserName.style.display = "block";
      }

      userNameInput.addEventListener("input", () => {
        localStorage.setItem("userName", userNameInput.value);
      });
    }
    getUserName();

    function getUserPfp() {
      const selectPhotoBtn = document.querySelector("#select-user-photo");
      const img = selectPhotoBtn.querySelector("img");

      img.src =
        localStorage.getItem("userPfp") ||
        "https://images.unsplash.com/photo-1745293459505-270666c2b1fe?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      const fileInput = document.querySelector("#fileInput");

      selectPhotoBtn.addEventListener("click", () => {
        fileInput.click();
      });

      fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
          img = selectPhotoBtn.querySelector("img");

          const pfpURL = URL.createObjectURL(file);
          localStorage.setItem("userPfp", pfpURL);
          img.src = pfpURL;
        }
      });
    }
    getUserPfp();
  }
  getUserDetails();
}
