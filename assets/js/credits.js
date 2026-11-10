import { SOURCES } from './data.js';
import { pickLang, makeT, applyStatic, wireLangButtons } from './i18n.js';

function draw(lang) {
  const t = makeT(lang);
  applyStatic(t, lang);
  const list = document.getElementById('sources');
  list.textContent = '';
  for (const s of SOURCES) {
    const li = document.createElement('li');
    li.id = s.id;
    const a = document.createElement('a');
    a.href = s.url; a.rel = 'noopener';
    const title = document.createElement('span');
    title.textContent = s.title;
    const who = document.createElement('small');
    who.textContent = s.who;
    a.append(title, who);
    li.append(a);
    list.append(li);
  }
  for (const id of ['home', 'back']) document.getElementById(id).href = `./?lang=${lang}`;
}

draw(pickLang());
wireLangButtons(draw);
