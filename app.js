function calculate9HoleSD(ag, cr, slope, pcc) {
  return (113 / slope) * (ag - cr) + 0.5 * pcc;
}

function calculateESD(ag, cr, slope, pcc) {
  return (113 / slope) * (ag - cr) + 1.197 + 0.5 * pcc;
}

function calculateHI(rounds) {
  const finalised = rounds.filter(r => r.finalised);
  const last20 = finalised.slice(-20);
  if (last20.length < 8) return "Insufficient data";
  const best8 = last20.map(r => r.sd_combined).sort((a, b) => a - b).slice(0, 8);
  const avg = best8.reduce((a, b) => a + b, 0) / 8;
  return avg.toFixed(1);
}

function saveRounds(rounds) {
  localStorage.setItem("golfRounds", JSON.stringify(rounds));
}

function loadRounds() {
  return JSON.parse(localStorage.getItem("golfRounds") || "[]");
}

function renderTable(rounds) {
  const tbody = document.querySelector("#round-table tbody");
  tbody.innerHTML = "";
  rounds.forEach((r, i) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${r.date}</td>
      <td>${r.course}</td>
      <td>${r.ag}</td>
      <td>${r.cr}</td>
      <td>${r.slope}</td>
      <td>${r.pcc}</td>
      <td>${r.sd_combined.toFixed(1)}</td>
      <td>${r.holes}</td>
      <td><button onclick="editRound(${i})">Edit</button></td>
    `;
  });
  document.getElementById("handicap-index").textContent = calculateHI(rounds);
}

function editRound(index) {
  const rounds = loadRounds();
  const r = rounds[index];
  const newPcc = parseFloat(prompt("New PCC value", r.pcc));
  if (!isNaN(newPcc)) {
    r.pcc = newPcc;
    if (r.holes === 18) {
      r.sd_combined = (113 / r.slope) * (r.ag - r.cr) + r.pcc;
    } else {
      r.sd_actual = calculate9HoleSD(r.ag, r.cr, r.slope, r.pcc);
      r.sd_estimated = calculateESD(r.ag, r.cr, r.slope, r.pcc);
      r.sd_combined = r.sd_actual + r.sd_estimated;
    }
    r.finalised = true;
    saveRounds(rounds);
    renderTable(rounds);
  }
}

document.getElementById("round-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const rounds = loadRounds();
  const holes = parseInt(document.getElementById("holes").value);

  const r = {
    date: document.getElementById("date").value,
    course: document.getElementById("course").value,
    tee: document.getElementById("tee").value,
    holes: holes,
    ag: parseFloat(document.getElementById("ag").value),
    cr: parseFloat(document.getElementById("cr").value),
    slope: parseInt(document.getElementById("slope").value),
    pcc: parseFloat(document.getElementById("pcc").value),
    finalised: holes === 18
  };

  if (holes === 18) {
    r.sd_combined = (113 / r.slope) * (r.ag - r.cr) + r.pcc;
  } else {
    r.sd_actual = calculate9HoleSD(r.ag, r.cr, r.slope, r.pcc);
    r.sd_estimated = calculateESD(r.ag, r.cr, r.slope, r.pcc);
    r.sd_combined = r.sd_actual + r.sd_estimated;
  }

  rounds.push(r);
  saveRounds(rounds);
  renderTable(rounds);
  this.reset();
});

renderTable(loadRounds());
