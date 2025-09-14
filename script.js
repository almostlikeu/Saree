const webAppURL = "https://script.google.com/macros/s/AKfycbzWNclIiWHnRmgr1Q-ucerNr-o5o5t1fmx-QHDNu03iN8XEQbVJFFJh-1tYp1ISqPPttg/exec"; // replace with your deployed Apps Script URL

document.getElementById("entryForm").addEventListener("submit", function(e){
  e.preventDefault(); // prevent default submission

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

        let imageHTML = row.PhotoURL ? `<a href="${row.PhotoURL}" target="_blank">Image</a>` : "";

        eDiv.innerHTML = `
          ${row.Timestamp} | ${row.Type} | ${row.Date} | ${row.SareeName || ""} | ${row.SoldTo || ""} | ${row.PurchasePrice || ""} | ${row.SalePrice || ""} | ${row.Profit || row.ExpenseAmount || ""} | ${row.ExpenseDescription || ""} | ${imageHTML} | ${row.Notes || ""}
        `;
        div.appendChild(eDiv);
      });
    });
}

// Load entries on page load
document.addEventListener("DOMContentLoaded", loadEntries);
