function exportBackup() {
  const data = localStorage.getItem("golfRounds");
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "golfRounds.json";
  a.click();
}

function importBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data)) {
        localStorage.setItem("golfRounds", JSON.stringify(data));
        renderTable(data);
      }
    } catch {
      alert("Invalid backup file");
    }
  };
  reader.readAsText(file);
}
