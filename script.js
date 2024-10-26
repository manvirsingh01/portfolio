const headers = document.querySelectorAll(".heading"); // Select all elements with the class "heading"
const hiddenDivs = document.querySelectorAll(".element"); // Select all elements with the class "element"

// Loop through each header and hiddenDiv, assuming they match one-to-one
headers.forEach((header, index) => {
    const hiddenDiv = hiddenDivs[index]; // Match each header with a corresponding hiddenDiv

    header.addEventListener("mouseover", function () {
        hiddenDiv.style.display = "block"; // Show the corresponding div on hover
    });

    header.addEventListener("mouseout", function () {
        hiddenDiv.style.display = "none"; // Hide the corresponding div when no longer hovering
    });
});
