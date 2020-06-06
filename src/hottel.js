// getSolarData(19.8, 0.03, 0.95, 0.98, 1.02, 1, 1, 1, 0);

function getSolarData(latitud, Altura, r0, r1, rk, area, eff, panels, lossFactor) {
  let data = yearHottel(latitud, Altura, r0, r1, rk, area, eff, panels, lossFactor);
  let finalData = [yearArr()];

  for (let y in data[0]) {
    let arr = [];
    arr.push(data[0][y][0]);
    for (x of data) {
      arr.push(x[y][1]);
    }
    finalData.push(arr);
  }

  return finalData;
  // console.dir(finalData, { maxArrayLength: null });
}

function yearHottel(latitud, Altura, r0, r1, rk, area, eff, panels, lossFactor) {
  let DAILYARR = [];
  for (let DIA = 1; DIA <= 365; DIA++) {
    DAILYARR.push(hottelModel(latitud, Altura, r0, r1, rk, DIA, area, eff, panels, lossFactor));
  }

  return DAILYARR;
}

// hottelModel(19.85, 0.03, 0.95, 0.98, 1.02, 150);

function hottelModel(latitud, Altura, r0, r1, rk, DIA, area, eff, panels, lossFactor) {
  let HOURLYARR = [];
  const a0 = r0 * (0.4237 - 0.00821 * Math.pow(6 - Altura, 2));
  const a1 = r1 * (0.5055 - 0.00595 * Math.pow(6.5 - Altura, 2));
  const k = rk * (0.2711 - 0.01858 * Math.pow(2.5 - Altura, 2));

  const declinacionSolar = 23.45 * Math.sin((2 * Math.PI * (284 + DIA)) / 365);

  // const WS = Math.acos(
  //   Math.tan(toRadians(latitud)) * Math.tan(toRadians(declinacionSolar)) * -1
  // );

  const WS = Math.PI;

  const rateOfChange = toRadians(15 / 4);
  let WSchanging = WS * -1;
  const Gon = 1367 * (1 + 0.033 * Math.cos(((2 * Math.PI) / 365) * DIA));

  while (WSchanging <= WS) {
    HOURLYARR.push(getNextRow(WSchanging, latitud, declinacionSolar, a0, a1, k, Gon, area, eff, panels, lossFactor));
    WSchanging += rateOfChange;
  }

  HOURLYARR = HOURLYARR.slice(0, -1);

  return HOURLYARR;
}

function getNextRow(WS, latitud, declinacionSolar, a0, a1, k, Gon, area, eff, panels, lossFactor) {
  const thetaZ =
    Math.sin(toRadians(latitud)) * Math.sin(toRadians(declinacionSolar)) +
    Math.cos(toRadians(latitud)) * Math.cos(toRadians(declinacionSolar)) * Math.cos(WS);

  const tb = a0 + a1 * Math.pow(Math.E, (k * -1) / thetaZ);
  const td = 0.271 - 0.2939 * tb;
  const Gcb = tb * Gon * thetaZ;
  const Gcd = td * Gon * thetaZ;
  const Gc = Gcb + Gcd;
  let Production;

  if (Gc <= 0) {
    Production = 0;
  } else {
    Production = (Gc * area * eff * panels * (1 - lossFactor)) / 1000000;
  }

  return [WS, Production];
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function yearArr() {
  var date = new Date(2019, 0, 1);
  var end = new Date(date);
  end.setFullYear(end.getFullYear() + 1);
  var array = [];
  while (date < end) {
    let x = date.toDateString().slice(4, -5);
    array.push(x);
    date.setDate(date.getDate() + 1);
  }
  array.unshift('Time');
  return array;
}

module.exports = getSolarData;
