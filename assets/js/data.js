// Every figure the page shows lives here, next to the id of its source.
// Sources are listed in SOURCES and rendered on creditos.html.

export const SORTEO = {
  year: 2026,
  date: '2026-12-22',
  numbers: 100000,          // 00000 to 99999 · src: telesuerte, wikipedia
  series: 205,              // src: telesuerte
  decimoPrice: 20,          // euros · src: navarro
  decimosPerNumber: 2050,   // 205 series x 10 decimos · src: eldolar
  emission: 4100e6,         // euros · src: telesuerte
  prizePool: 2870e6,        // euros, 70 % of the emission · src: navarro
  poolShare: 0.70,
};

// Prize table per series of 100,000 billetes, paid per decimo (series / 10).
// src: wikipedia (2025 table, same per-series structure as 2026), chirri, eldolar
export const PRIZES = [
  { id: 'gordo',   count: 1,    perDecimo: 400000 },
  { id: 'segundo', count: 1,    perDecimo: 125000 },
  { id: 'tercero', count: 1,    perDecimo: 50000 },
  { id: 'cuarto',  count: 2,    perDecimo: 20000 },
  { id: 'quinto',  count: 8,    perDecimo: 6000 },
  { id: 'pedrea',  count: 1794, perDecimo: 100 },
  { id: 'aprox1',  count: 2,    perDecimo: 2000 },
  { id: 'aprox2',  count: 2,    perDecimo: 1250 },
  { id: 'aprox3',  count: 2,    perDecimo: 960 },
  { id: 'centenas', count: 99 * 5, perDecimo: 100 },
  { id: 'dosCifras', count: 999 * 3, perDecimo: 100 },
  { id: 'reintegro', count: 9999, perDecimo: 20 },
];

// The three prize families the page draws, one colour each.
export const FAMILIES = {
  gordo:     { count: 1,    color: 'gordo' },
  pedrea:    { count: 1794, color: 'pedrea' },
  reintegro: { count: 9999, color: 'reintegro' },
};

// From tests/odds.test.mjs (2,000 simulated draws with the table above).
// Numbers with any prize, and numbers that win more than they cost.
export const SIMULATED = {
  anyPrize: 0.138,      // about 13.8 % · tests/odds.test.mjs
  moreThanPrice: 0.052, // about 5.2 % (counts 100 euro + reintegro wins) · tests/odds.test.mjs
  friends: { nothing: 86, back: 9, more: 5 }, // of 100 decimos, rounded to 100
  friendsMedian: 720,   // typical total for 100 decimos (euros)
  friendsMean: 1400,    // average total = 100 x expectedValue()
  groupGordoOdds: 1000, // a group of 100 numbers holds the Gordo 1 time in 1000
};

// Tax: gravamen especial, 20 % over the first 40,000 euros of each decimo.
// src: aedaf, deia
export const TAX = { exempt: 40000, rate: 0.20 };
export const netPrize = (gross) => gross <= TAX.exempt ? gross : gross - (gross - TAX.exempt) * TAX.rate;

// Average gross value of one decimo, from the prize table.
export const expectedValue = () =>
  PRIZES.reduce((s, p) => s + p.count * p.perDecimo, 0) / SORTEO.numbers;

// Human scales. Each one maps the 100,000 numbers to 100,000 things.
export const SCALES = {
  arroz: {
    gramsPer1000: 21,                 // milled medium-grain rice · src: uspto
    get totalKg() { return SORTEO.numbers * this.gramsPer1000 / 1000 / 1000; }, // 2.1
  },
};

export const HELP = {
  official: 'https://www.jugarbien.es/',   // DGOJ safe gambling portal · src: consumo
  fejarPhone: '900 200 225',               // FEJAR, free and confidential · src: cridj
  rgiaj: 'https://www.ordenacionjuego.es/participantes-juego/juego-seguro', // src: selae-footer
};

export const KOFI = 'https://ko-fi.com/lessane';

export const SOURCES = [
  { id: 'telesuerte', title: 'Así es el décimo de la Lotería de Navidad 2026', who: 'TeleSuerte', url: 'https://blog.telesuerte.es/asi-es-el-decimo-de-la-loteria-de-navidad-2026-imagen-premios-y-como-encontrar-tu-numero/' },
  { id: 'navarro', title: '¿Cuántos números tiene la Lotería de Navidad 2026?', who: 'Lotería Navarro', url: 'https://www.loterianavarroalicante.es/blog/cuantos-numeros-tiene-loteria-navidad-2026.htm' },
  { id: 'eldolar', title: '¿Cuántas series hay en la Lotería de Navidad?', who: 'Loterías El Dólar', url: 'https://www.loteriaseldolar.es/blog/cuantas-series-hay-en-la-loteria-de-navidad.htm' },
  { id: 'chirri', title: 'Lotería de Navidad 2026: fechas, precio y premios', who: 'Loterías Chirri', url: 'https://loteriaschirri.com/loteria-de-navidad-2026-fechas-precio-premios/' },
  { id: 'wikipedia', title: 'Spanish Christmas Lottery', who: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Spanish_Christmas_Lottery' },
  { id: 'aedaf', title: 'Fiscalidad de los premios de la Lotería de Navidad', who: 'AEDAF', url: 'https://www.aedaf.es/es/documentos/descarga/75326/fiscalidad-premios-loteria-de-navidad-2025' },
  { id: 'deia', title: 'Tributación de los premios del Sorteo de Navidad', who: 'Deia, con datos de la Agencia Tributaria', url: 'https://www.deia.eus/loteria-de-navidad/2025/12/22/premios-sorteo-loteria-navidad-premio-10500737.html' },
  { id: 'ventas', title: 'Ventas del Sorteo de Navidad 2025', who: 'Noticias de Navarra, con datos de SELAE', url: 'https://www.noticiasdenavarra.com/loteria-de-navidad/2025/12/22/cobrar-premios-sorteo-loteria-navidad-sorteo-10500909.html' },
  { id: 'uspto', title: 'Rice cultivar M-210 (peso de 1.000 granos de arroz blanco)', who: 'USPTO', url: 'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10624292' },
  { id: 'consumo', title: 'Juego responsable y juego seguro', who: 'Consumo Responde', url: 'https://www.consumoresponde.es/node/255087' },
  { id: 'cridj', title: 'Juego patológico: dónde recibir ayuda', who: 'Comunidad de Madrid, CRIDJ', url: 'https://Comunidad.madrid/sites/default/files/doc/juventud/cridj-juego_patologico.pdf' },
  { id: 'selae-footer', title: 'Enlaces de juego seguro', who: 'Loterías y Apuestas del Estado', url: 'https://www.loteriasyapuestas.es/es/paginas-informativas/loteria-de-navidad-2014' },
];
