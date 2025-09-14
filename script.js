const webAppURL = "https://script.google.com/macros/s/AKfycbwb1KBexljEhOgk8kperSO6Bbd-KL2zA7R4zAvc4Mqcov2d8diPfXaFF568qkGf4M2s_A/exec"; // Replace with your deployed Apps Script URL

document.getElementById("entryForm").addEventListener("submit", function(e){
  e.preventDefault();

  const type = document.getElementById("typeSelect").value;
  const date = document.getElementById("date").value || new Date().toISOString().slice(0,10);
  const notes = document.getElementById("notes").value;

  const data = { Type: type, Date: date, Notes: notes };

  if(type === "Income") {
    data.SareeName = document.getElementById("sareeName").value;
    data.SoldTo = document.getElementById("soldTo").value;
    data.PurchasePrice = Number(document.getElementById("purchasePrice").value);
    data.SalePrice = Number(document.getElementById("salePrice").value);

    const fileInput = document.getElementById("photoFile");
    if(fileInput.files.length > 0){
      const reader = new FileReader();
      reader.onload = function(){
        const base64Data = reader.result.split(",")[1];
        if(base64Data) {
          data.PhotoBase64 = base64Data;
          data.PhotoName = fileInput.files[0].name;
        }
        postData(data);
      }
      reader.readAsDataURL(fileInput.files[0]);
      return;
    }
  } else {
    data.ExpenseDescription = document.getElementById("expenseDescription").value;
    data.ExpenseAmount = Number(document.getElementById("expenseAmount").value);
  }

  postData(data);
});

function postData(data){
  fetch(webAppURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(res => {
    alert("Entry added!");
    document.getElementById("entryForm").reset();
    loadEntries();
  })
  .catch(err => alert("Error: " + err.message));
}

function loadEntries(){
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

document.addEventListener("DOMContentLoaded", loadEntries);
