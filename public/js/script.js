const $altura = document.getElementById('altID');
const $latitud = document.getElementById('latID');
const $tipo = document.getElementById('tipoID');
const $form = document.getElementById('formID');
let r0, r1, rk;

$form.addEventListener('submit', (e) => {
  e.preventDefault();
  setRR();
  data = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      latitud: parseInt($latitud.value),
      altura: parseInt($altura.value),
      r0,
      r1,
      rk
    })
  };

  generateData(data);
});

async function generateData(data) {
  const response = await fetch('/getSolarData', data);
  const responseData = await response.json();

  createCSV(responseData.csvData);
}

function createCSV(data) {
  let arrCSV = [];
  for (let x in data) {
    arrCSV.push(data[x].join(','));
  }

  downloadCSV(arrCSV.join('\n'));
}

function downloadCSV(data) {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'download.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function setRR() {
  let x = $tipo.value;
  if (x == 1) {
    r0 = 0.95;
    r1 = 0.98;
    rk = 1.02;
  } else if (x == 2) {
    r0 = 0.97;
    r1 = 0.99;
    rk = 1.02;
  } else if (x == 3) {
    r0 = 0.99;
    r1 = 0.99;
    rk = 1.01;
  } else {
    r0 = 1.03;
    r1 = 1.01;
    rk = 1.0;
  }
}
