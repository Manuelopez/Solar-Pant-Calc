hottelModel(19.857551, 6, 0.95, 0.98, 1.02, 147.09);
function hottelModel(latitud, Altura, r0, r1, rk, DIA) {
  const a0 = r0 * (0.4237 - 0.00821 * Math.pow(6 - Altura, 2));
  const a1 = r1 * (0.5055 - 0.00595 * Math.pow(6.5 - Altura, 2));
  const k = rk * (0.2711 - 0.01858 * Math.pow(2.5 - Altura, 2));

  const declinacionSolar =
    23.45 * Math.sin(toRadians((2 * Math.PI * (284 + DIA)) / 365));

  const WS = Math.acos(
    Math.tan(toRadians(latitud)) * Math.tan(toRadians(declinacionSolar)) * -1
  );
  const rateOfChange = WS / 60;
  let WSchanging = WS * -1 + rateOfChange;

  const Gon =
    1367 * (1 + 0.033 * Math.cos(toRadians(((2 * Math.PI) / 365) * DIA)));

  while (WSchanging <= WS) {
    getNextRow(WSchanging, latitud, declinacionSolar, a0, a1, k, Gon);
    WSchanging += rateOfChange;
  }
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
  console.log(Gcd);
  return [thetaZ, tb, td, Gcb, Gcd, Gc];
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}
