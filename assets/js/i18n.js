// Every visible string, in Spanish and English.
// Templates use {name} holes filled by t(key, vars).

export const STRINGS = {
  es: {
    'meta.title': 'El Gordo, la probabilidad',
    'meta.desc': 'Las probabilidades de la Lotería de Navidad, dibujadas a una escala que se siente.',
    'brand': 'El Gordo, la probabilidad',
    'skip': 'Saltar al contenido',
    'lang.label': 'Idioma',

    'hero.kicker': 'Sorteo de Navidad · 22 de diciembre de 2026',
    'hero.title': '100.000 bolas dentro. Sale una.',
    'hero.lead': 'Escribe tu número, o pide uno al azar, y mira dónde cae entre todos los demás.',
    'hero.input': 'Tu número',
    'hero.inputHint': 'Cinco cifras, del 00000 al 99999',
    'hero.random': 'Otro número al azar',
    'hero.drum': 'El bombo dibujado como una jaula de alambre llena de bolas. Una, la del número {n}, está en naranja.',
    'hero.drawn': 'bolas ya sorteadas',

    'pos.title': 'Dónde está tu número',
    'pos.lead': 'Cada punto de este rectángulo es un número: 400 por fila, 250 filas. Cada franja agrupa 10.000 números. El tuyo está en la cruz.',
    'pos.where': 'Fila {row}, columna {col}.',
    'pos.copies': 'De tu número hay {copies} décimos repartidos por España: {series} series de 10. Si sale, lo pueden celebrar hasta {copies} décimos.',
    'pos.grid': 'Rectángulo de 100.000 puntos con una cruz en el número {n}, fila {row}, columna {col}.',
    'pos.near': 'Tus vecinos',
    'pos.nearNote': 'Ninguno tiene más ni menos opciones que el tuyo. Todos, exactamente 1 entre 100.000.',

    'scale.title': 'La probabilidad, a escala',
    'scale.lead': 'Cada cosa de este dibujo es un número. Hay 100.000. Elige una escala y un premio.',
    'scale.pick': 'Escala',
    'scale.prize': 'Premio',
    'scale.arroz': 'Arroz',
    'scale.estadio': 'Estadio',
    'scale.acera': 'Acera',
    'scale.ciudad': 'Ciudad',
    'prize.gordo': 'El Gordo',
    'prize.pedrea': 'Pedrea',
    'prize.reintegro': 'Reintegro',
    'scale.you': 'tú',
    'scale.lupa': 'Lupa sobre tu número',
    'scale.sim': 'Sorteo simulado al cargar la página. No es el real, ni lo predice.',
    'scale.bigger': 'Los premiados están dibujados más grandes de lo que les toca, para que se vean.',

    'arroz.unit': 'granos',
    'arroz.fact': '100.000 granos de arroz pesan unos {kg} kg.',
    'arroz.gordo': 'Vuelca {kg} kg de arroz en la encimera y saca un grano con los ojos cerrados. Esa es tu probabilidad de que salga tu número.',
    'arroz.pedrea': '1.794 granos azules entre {kg} kg: unos {g} gramos. Ni un puñado.',
    'arroz.reintegro': 'Uno de cada diez granos, y siempre los que acaban en la misma cifra que el Gordo. Recuperas tus 20 euros, nada más.',

    'estadio.unit': 'localidades',
    'estadio.fact': 'El Camp Nou terminado tendrá más de {seats} localidades.',
    'estadio.gordo': 'Casi un Camp Nou lleno y una sola localidad premiada. Desde la tuya ni la verías.',
    'estadio.pedrea': '1.794 localidades sueltas por todo el estadio. Menos del 2 % del público.',
    'estadio.reintegro': 'Una de cada diez localidades recupera la entrada. Las otras nueve, no.',

    'acera.unit': 'baldosas',
    'acera.fact': '100.000 baldosas de 20 × 20 cm hacen una acera de 2 metros de ancho y {km} km de largo. Aquí va doblada en veinte tramos de 100 metros.',
    'acera.gordo': 'Una baldosa en {km} km de acera. Te toca caminarla entera mirando al suelo.',
    'acera.pedrea': '1.794 baldosas sueltas, una cada metro y pico. Pisarías una sin enterarte.',
    'acera.reintegro': 'Una baldosa de cada diez, en fila, siempre las mismas: las que terminan como el Gordo.',

    'ciudad.unit': 'personas',
    'ciudad.fact': '{city} pasó de 100.000 habitantes el 1 de enero de 2025.',
    'ciudad.gordo': 'Toda la gente de {city}, y solo una persona premiada. Probablemente no la conoces.',
    'ciudad.pedrea': '1.794 personas en toda la ciudad. Una por cada 56 vecinos.',
    'ciudad.reintegro': 'Una de cada diez personas recupera lo que pagó. El resto vuelve a casa como salió.',

    'sum.title': 'Las cuentas de un décimo',
    'sum.any': 'tienen algún premio, contando el reintegro',
    'sum.more': 'ganan más de los 20 euros que costaron',
    'sum.ev': 'vale de media un décimo de 20 euros, antes de impuestos',
    'sum.note': 'De cada 20 euros, el sorteo devuelve de media 14 en premios. Y esos 14 cuentan los décimos que nadie compró, así que lo que vuelve a la gente es menos.',

    'soon.title': 'Próximamente',
    'soon.list': 'Qué es más probable que el Gordo · El dinero: premios, impuestos y lo que vuelve · La historia del sorteo',

    'honest.title': 'Para que quede claro',
    'honest.text': 'Esto va de entender el azar, no de animarte a jugar. Ningún número tiene más opciones que otro, no hay números que "tocan" ni estrategias. La lotería devuelve menos de lo que recauda.',
    'help.text': 'Si el juego te preocupa a ti o a alguien cercano, hay ayuda gratuita.',
    'help.official': 'Jugar Bien, portal oficial de la DGOJ',
    'help.phone': 'FEJAR: {phone}, gratuito, anónimo y confidencial',

    'foot.credits': 'Créditos y fuentes',
    'foot.kofi': 'Invítame a un café',
    'foot.privacy': 'Sin anuncios, sin cookies, sin rastreo.',
    'foot.by': 'Un experimento de lessane.es',
    'foot.home': 'Volver al inicio',

    'cred.title': 'Créditos y fuentes',
    'cred.lead': 'Cada cifra de esta web sale de una de estas fuentes. Si encuentras un error, dímelo y lo corrijo.',
    'cred.sources': 'Fuentes',
    'cred.method': 'Cómo se calcula',
    'cred.methodText': 'La probabilidad de cada premio es el número de números premiados entre 100.000. El porcentaje de números con algún premio sale de simular 2.000 sorteos con la tabla de premios, porque algunos números cobran varios premios a la vez. El valor medio de un décimo es la suma de todos los premios por décimo dividida entre 100.000. La acera supone 2 metros de ancho; eso es nuestro, no de la fuente.',
    'cred.fonts': 'Tipografías',
    'cred.fontsText': 'Bricolage Grotesque, Schibsted Grotesk y Spline Sans Mono, con licencia SIL Open Font License 1.1, servidas desde esta misma web.',
    'cred.drawings': 'Dibujos',
    'cred.drawingsText': 'Todos los dibujos e iconos son nuestros, hechos en vectores. No hay fotos ni imágenes de televisión.',
    'cred.none': 'No usamos cookies, analítica ni anuncios. La web no guarda nada en tu navegador.',
  },

  en: {
    'meta.title': 'El Gordo, the odds',
    'meta.desc': 'The odds of Spain\'s Christmas lottery, drawn at a scale you can feel.',
    'brand': 'El Gordo, the odds',
    'skip': 'Skip to content',
    'lang.label': 'Language',

    'hero.kicker': 'Christmas draw · 22 December 2026',
    'hero.title': '100,000 balls inside. One comes out.',
    'hero.lead': 'Type your number, or ask for a random one, and see where it lands among all the others.',
    'hero.input': 'Your number',
    'hero.inputHint': 'Five digits, from 00000 to 99999',
    'hero.random': 'Another random number',
    'hero.drum': 'The drum drawn as a wire cage full of balls. One, the ball for number {n}, is orange.',
    'hero.drawn': 'balls already drawn',

    'pos.title': 'Where your number sits',
    'pos.lead': 'Every dot in this rectangle is one number: 400 per row, 250 rows. Each band holds 10,000 numbers. Yours is under the cross.',
    'pos.where': 'Row {row}, column {col}.',
    'pos.copies': 'There are {copies} décimos of your number around Spain: {series} series of 10. If it wins, up to {copies} tickets can celebrate.',
    'pos.grid': 'Rectangle of 100,000 dots with a cross on number {n}, row {row}, column {col}.',
    'pos.near': 'Your neighbours',
    'pos.nearNote': 'None has a better or worse chance than yours. All of them, exactly 1 in 100,000.',

    'scale.title': 'The odds, at scale',
    'scale.lead': 'Every item in this drawing is one number. There are 100,000. Pick a scale and a prize.',
    'scale.pick': 'Scale',
    'scale.prize': 'Prize',
    'scale.arroz': 'Rice',
    'scale.estadio': 'Stadium',
    'scale.acera': 'Street',
    'scale.ciudad': 'City',
    'prize.gordo': 'El Gordo',
    'prize.pedrea': 'Pedrea',
    'prize.reintegro': 'Refund',
    'scale.you': 'you',
    'scale.lupa': 'Magnifier on your number',
    'scale.sim': 'Draw simulated when the page loads. It is not the real one and does not predict it.',
    'scale.bigger': 'Winners are drawn larger than their true size so you can see them.',

    'arroz.unit': 'grains',
    'arroz.fact': '100,000 grains of rice weigh about {kg} kg.',
    'arroz.gordo': 'Tip {kg} kg of rice onto the counter and pick one grain with your eyes shut. That is your chance of your number winning.',
    'arroz.pedrea': '1,794 blue grains in {kg} kg: about {g} grams. Not even a handful.',
    'arroz.reintegro': 'One grain in ten, always the ones ending in the same digit as El Gordo. You get your 20 euros back, nothing more.',

    'estadio.unit': 'seats',
    'estadio.fact': 'The finished Camp Nou will hold more than {seats} people.',
    'estadio.gordo': 'An almost full Camp Nou and a single winning seat. From yours you would not even see it.',
    'estadio.pedrea': '1,794 seats scattered round the whole stadium. Under 2 % of the crowd.',
    'estadio.reintegro': 'One seat in ten gets the ticket price back. The other nine do not.',

    'acera.unit': 'tiles',
    'acera.fact': '100,000 paving tiles of 20 × 20 cm make a pavement 2 metres wide and {km} km long. Here it is folded into twenty stretches of 100 metres.',
    'acera.gordo': 'One tile in {km} km of pavement. You get to walk all of it looking at the ground.',
    'acera.pedrea': '1,794 tiles scattered about, one every metre or so. You could step on one and never know.',
    'acera.reintegro': 'One tile in ten, lined up, always the same ones: those ending like El Gordo.',

    'ciudad.unit': 'people',
    'ciudad.fact': '{city} passed 100,000 residents on 1 January 2025.',
    'ciudad.gordo': 'Everyone in {city}, and a single winner. You probably do not know them.',
    'ciudad.pedrea': '1,794 people across the whole city. One in every 56 residents.',
    'ciudad.reintegro': 'One person in ten gets back what they paid. Everyone else goes home as they left.',

    'sum.title': 'The maths of one décimo',
    'sum.any': 'win some prize, counting the refund',
    'sum.more': 'win more than the 20 euros they cost',
    'sum.ev': 'is what a 20 euro décimo is worth on average, before tax',
    'sum.note': 'For every 20 euros, the draw pays back 14 on average in prizes. And those 14 include tickets nobody bought, so what reaches people is less.',

    'soon.title': 'Coming soon',
    'soon.list': 'What is more likely than El Gordo · The money: prizes, tax and what comes back · The history of the draw',

    'honest.title': 'To be clear',
    'honest.text': 'This is about understanding chance, not about getting you to play. No number has a better chance than another, no number is "due" and there are no strategies. The lottery pays back less than it takes in.',
    'help.text': 'If gambling worries you or someone close to you, free help is available.',
    'help.official': 'Jugar Bien, the official DGOJ portal',
    'help.phone': 'FEJAR: {phone}, free, anonymous and confidential',

    'foot.credits': 'Credits and sources',
    'foot.kofi': 'Buy me a coffee',
    'foot.privacy': 'No ads, no cookies, no tracking.',
    'foot.by': 'An experiment from lessane.es',
    'foot.home': 'Back to the start',

    'cred.title': 'Credits and sources',
    'cred.lead': 'Every figure on this site comes from one of these sources. If you spot a mistake, tell me and I will fix it.',
    'cred.sources': 'Sources',
    'cred.method': 'How it is worked out',
    'cred.methodText': 'Each prize\'s chance is the count of winning numbers out of 100,000. The share of numbers with any prize comes from simulating 2,000 draws with the prize table, because some numbers collect several prizes at once. The average value of a décimo is the sum of every prize per décimo divided by 100,000. The pavement assumes it is 2 metres wide; that is ours, not the source\'s.',
    'cred.fonts': 'Typefaces',
    'cred.fontsText': 'Bricolage Grotesque, Schibsted Grotesk and Spline Sans Mono, under the SIL Open Font License 1.1, served from this site.',
    'cred.drawings': 'Drawings',
    'cred.drawingsText': 'Every drawing and icon is our own, made as vectors. There are no photos and no TV footage.',
    'cred.none': 'We use no cookies, no analytics and no ads. The site stores nothing in your browser.',
  },
};

const fmtCache = {};
export const fmt = (lang, n, opts = {}) => {
  const key = lang + JSON.stringify(opts);
  fmtCache[key] ||= new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', { useGrouping: 'always', ...opts });
  return fmtCache[key].format(n);
};

export function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'es' || q === 'en') return q;
  return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : (navigator.language ? 'en' : 'es');
}

export function makeT(lang) {
  const table = STRINGS[lang];
  return (key, vars = {}) => {
    let s = table[key] ?? STRINGS.es[key] ?? key;
    for (const [k, v] of Object.entries(vars)) s = s.replaceAll('{' + k + '}', v);
    return s;
  };
}

// Fill every [data-i18n] element, and [data-i18n-attr="attr:key"] attributes.
export function applyStatic(t, lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, t(key));
    });
  });
  document.title = t(document.body.dataset.titleKey || 'meta.title');
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
}

export function wireLangButtons(onChange) {
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    const lang = b.dataset.lang;
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    onChange(lang);
  }));
}
