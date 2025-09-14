const webAppURL = "https://script.google.com/macros/s/AKfycbz6YGE1jFI4wnnOhSdLegs3dRfP9lN1i0KCz-K9-Mt_I57_QFC18RqkLYz1Yl5mGhPjGw/exec";

document.getElementById("typeSelect").addEventListener("change", function(){
  if(this.value==="Income"){
    document.getElementById("incomeFields").style.display="block";
    document.getElementById("expenseFields").style.display="none";
  } else {
    document.getElementById("incomeFields").style.display="none";
    document.getElementById("expenseFields").style.display="block";
  }
});

function submitEntry(){
  const type = document.getElementById("typeSelect").value;
  const date = document.getElementById("date").value || new Date().toISOString().slice(0,10);
  const notes = document.getElementById("notes").value;

  const data = { Type:type, Date:date, Notes:notes };

  if(type==="Income"){
    data.SareeName = document.getElementById("sareeName").value;
    data.SoldTo = document.getElementById("soldTo").value;
    data.PurchasePrice = Number(document.getElementById("purchasePrice").value);
    data.SalePrice = Number(document.getElementById("salePrice").value);

    const fileInput = document.getElementById("photoFile");
    if(fileInput.files.length>0){
      const reader = new FileReader();
      reader.onload = function(){
        data.PhotoBase64 = reader.result;
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
}

function postData(data){
  fetch(webAppURL, {
    method:"POST",
    body: JSON.stringify(data)
  }).then(res=>res.json()).then(res=>{
    alert("Entry added!");
    loadEntries();
  });
}

function loadEntries(){
  fetch(webAppURL).then(res=>res.json()).then(data=>{
    const div = document.getElementById("entriesDiv");
    div.innerHTML = "";
    data.reverse().forEach(row=>{
      const eDiv = document.createElement("div");
      eDiv.className = "entry";
      eDiv.innerHTML = `<strong>${row.Type}</strong> | ${row.Date} | ${row.Amount || row.Profit} | ${row.ExpenseDescription || row.SareeName || ""} | ${row.SoldTo || ""}`;
      if(row.PhotoURL) eDiv.innerHTML += `<br><img src="${row.PhotoURL}">`;
      if(row.Notes) eDiv.innerHTML += `<br>Notes: ${row.Notes}`;
      div.appendChild(eDiv);
    });
  });
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("typeSelect").dispatchEvent(new Event("change"));
  loadEntries();
});
  
