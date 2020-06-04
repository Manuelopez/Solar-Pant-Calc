// 19.857551, 6, 0.95, 0.98, 1.02

function getSolarData(latitud, Altura, r0, r1, rk) {
  let data = yearHottel(latitud, Altura, r0, r1, rk);
  let finalData = [yearArr()];

  for (let y = 0; y < 300; y++) {
    let arr = [];
    for (x of data) {
      let str = '';
      if (x[y]) {
        str += `${x[y][0]}:  ${x[y][1]}`;
      } else {
        str += '000';
      }
      arr.push(str);
    }
    finalData.push(arr);
  }

  return finalData;
  // console.dir(finalData, { maxArrayLength: null });
}

function yearHottel(latitud, Altura, r0, r1, rk) {
  let DAILYARR = [];
  for (let dia = 1; dia <= 366; dia++) {
    DAILYARR.push(hottelModel(latitud, Altura, r0, r1, rk, dia));
  }

  return DAILYARR;
}

function hottelModel(latitud, Altura, r0, r1, rk, DIA) {
  let HOURLYARR = [];
  const a0 = r0 * (0.4237 - 0.00821 * Math.pow(6 - Altura, 2));
  const a1 = r1 * (0.5055 - 0.00595 * Math.pow(6.5 - Altura, 2));
  const k = rk * (0.2711 - 0.01858 * Math.pow(2.5 - Altura, 2));

  const declinacionSolar = 23.45 * Math.sin((2 * Math.PI * (284 + DIA)) / 365);

  const WS = Math.acos(
    Math.tan(toRadians(latitud)) * Math.tan(toRadians(declinacionSolar)) * -1
  );

  const rateOfChange = WS / 60;
  let WSchanging = WS * -1;
  const Gon = 1367 * (1 + 0.033 * Math.cos(((2 * Math.PI) / 365) * DIA));

  while (WSchanging <= WS) {
    WSchanging += rateOfChange;
    HOURLYARR.push(
      getNextRow(WSchanging, latitud, declinacionSolar, a0, a1, k, Gon)
    );
  }

  HOURLYARR = HOURLYARR.slice(0, -1);

  completeArr(WS, rateOfChange, HOURLYARR);

  return HOURLYARR;
}
function getNextRow(WS, latitud, declinacionSolar, a0, a1, k, Gon) {
  const thetaZ =
    Math.sin(toRadians(latitud)) * Math.sin(toRadians(declinacionSolar)) +
    Math.cos(toRadians(latitud)) *
      Math.cos(toRadians(declinacionSolar)) *
      Math.cos(WS);

  const tb = a0 + a1 * Math.pow(Math.E, (k * -1) / thetaZ);
  const td = 0.271 - 0.2939 * tb;
  const Gcb = tb * Gon * thetaZ;
  const Gcd = td * Gon * thetaZ;
  const Gc = Gcb + Gcd;
  return [WS, Gc];
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function completeArr(ws, rateOfChange, hourArr) {
  let pi = Math.PI + rateOfChange;
  let arr = [];
  while (ws <= pi) {
    arr.push([ws, 0]);
    ws += rateOfChange;
  }
  hourArr.push(...arr);
  arr.reverse();
  arr = arr.map((elem) => {
    return [elem[0] * -1, elem[1]];
  });
  hourArr.unshift(...arr);
}

function yearArr() {
  var date = new Date(2020, 0, 1);
  var end = new Date(date);
  end.setFullYear(end.getFullYear() + 1);
  var array = [];
  while (date < end) {
    let x = date.toDateString().slice(4, -5);
    array.push(x);
    date.setDate(date.getDate() + 1);
  }
  return array;
}

module.exports = getSolarData;
