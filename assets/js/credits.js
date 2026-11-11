import { S, pickLang, applyText } from './strings.js';
import { SOURCES } from './data.js';

let lang = pickLang();

function draw() {
  applyText(lang);
  const list = document.getElementById('sources');
  list.textContent = '';
  for (const s of SOURCES) {
    const li = document.createElement('li');
    li.id = s.id;
    const a = document.createElement('a');
    a.href = s.url; a.rel = 'noopener';
    const title = document.createElement('span'); title.textContent = s.title;
    const who = document.createElement('small'); who.textContent = s.who;
    a.append(title, who);
    li.append(a);
    list.append(li);
  }
  for (const id of ['home', 'back']) {
    const el = document.getElementById(id);
    if (el) el.href = './?lang=' + lang;
  }
}

document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => { lang = b.dataset.lang; draw(); }));
draw();
