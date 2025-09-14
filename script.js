const webAppURL = "https://script.google.com/macros/s/AKfycbxyLqjJKC6vVMN7qKgPN1uQtJX128W1y3ASYJEBusVD7MjqrPQxpQg5d2hnc6N8i1-DoA/exec"; // Replace with your deployed Apps Script URL

// Handle form submission
document.getElementById("entryForm").addEventListener("submit", function(e){
  e.preventDefault(); // prevent default form submission

  const form = e.target;
  const formData = new FormData(form);

  fetch(webAppURL, {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(() => {
    alert("Entry added!");
    form.reset();
    loadEntries();
  })
  .catch(err => alert("Error: " + err.message));
});

// Load entries from Google Sheet
function loadEntries() {
  fetch(webAppURL + "?action=read")
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("entriesDiv");
      div.innerHTML = "";
      data.reverse().forEach(row => {
        const eDiv = document.createElement("div");
        eDiv.className = "entry";
        eDiv.textContent = `${row.Timestamp} | ${row.Type} | ${row.Date} | ${row.SareeName || ""} | ${row.SoldTo || ""} | ${row.PurchasePrice || ""} | ${row.SalePrice || ""} | ${row.Profit || row.ExpenseAmount || ""} | ${row.ExpenseDescription || ""} | ${row.Notes || ""}`;
        div.appendChild(eDiv);
      });
    });
}

// Load entries on page load
document.addEventListener("DOMContentLoaded", loadEntries);
