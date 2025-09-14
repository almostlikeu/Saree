const webAppURL = "https://script.google.com/macros/s/AKfycbxSlu2hGFby3IXjnjaLQBB8k89eJzzt5ETQpDdgqAk_Nc3c13eDU05VjEjSXZcX--8Jpw/exec";

function loadEntries() {
  fetch(webAppURL + "?action=read")
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("entriesDiv");
      div.innerHTML = "";
      data.reverse().forEach(row => {
        const eDiv = document.createElement("div");
        eDiv.className = "entry";

        // Display all fields except the image
        eDiv.textContent = `${row.Timestamp} | ${row.Type} | ${row.Date} | ${row.SareeName || ""} | ${row.SoldTo || ""} | ${row.PurchasePrice || ""} | ${row.SalePrice || ""} | ${row.Profit || row.ExpenseAmount || ""} | ${row.ExpenseDescription || ""} | ${row.Notes || ""}`;
        div.appendChild(eDiv);
      });
    });
}

// Load entries when page loads
document.addEventListener("DOMContentLoaded", loadEntries);
