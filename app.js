// SEARCH BAR SCRIPT START

const searchInputField = document.querySelector(".nav-search input");
const searchBtn = document.querySelector(".nav-search button");

searchInputField.addEventListener("keyup", function (event) {
  console.log("keyup event triggered", event.keyCode);
  if (event.keyCode === 13) {
    event.preventDefault();
    searchBtn.click();
  }
});

searchBtn.addEventListener("click", function () {
  console.log("click event triggered");
  const searchQuery = searchInputField.value;
  window.location.href = `https://www.google.com/search?q=${searchQuery}`;
});

//add keydown//
document.addEventListener("keydown", function (event) {
  if (event.target.tagName === "INPUT") return; // Do nothing if user is typing in an input field

  if (event.key === "/") {
    event.preventDefault();
    searchInputField.focus();
  }
});
// SEARCH BAR SCRIPT END

// RANDOM TEXT SCRIPT START

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let iterations = 0;

document.querySelectorAll("span").forEach((span) => {
  span.addEventListener("mouseover", (event) => {
    const value = event.target.dataset.value;
    const intervalId = setInterval(() => {
      event.target.innerText = value
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return value[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
      iterations++;
      if (iterations >= value.length * 30) clearInterval(intervalId);
    }, 50);

    event.target.addEventListener("mouseout", () => {
      clearInterval(intervalId);
      event.target.innerText = value;
      iterations = 0;
    });
  });
});
// RANDOM TEXT SCRIPT END

// OBJECT FOLLOWING MOUSE SCRIPT START

const blob = document.getElementById("blob");

document.body.onpointermove = (event) => {
  const { clientX, clientY } = event;
  blob.animate(
    {
      left: `${clientX}px`,
      top: `${clientY}px`,
    },
    { duration: 3000, fill: "forwards" }
  );
};
// OBJECT FOLLOWING MOUSE SCRIPT END

// TIME SCRIPT START
const timeH2 = document.querySelector("h2");
const timeP = document.querySelector("p");

function updateTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  const formattedTime = `${hours}:${minutes}:${seconds}`;
  const formattedDate = currentDate
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");

  timeH2.textContent = formattedTime;
  timeP.textContent = formattedDate;
}

// Call updateTime function initially to display current date and time
updateTime();

// Update time every second
setInterval(updateTime, 1000);

//  TIME SCRIPT START  END
