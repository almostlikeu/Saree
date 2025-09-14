const webAppURL = "https://script.google.com/macros/s/AKfycby2EpEnKWR8GmWGJhp1K_y6NhITtLMUHUo3z76CSGf8BYxOjHWpLhZKagwPiSFMSCSedQ/exec";

document.getElementById("entryForm").addEventListener("submit", function(e){
  e.preventDefault(); // prevent normal form submission
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
