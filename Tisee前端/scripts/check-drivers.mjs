import { mkdir, writeFile } from 'node:fs/promises';

const endpoint = process.env.EDGE_CDP_URL || 'http://127.0.0.1:9222';
const pages = await (await fetch(`${endpoint}/json/list`)).json();
const page = pages.find((tab) => tab.type === 'page' && /^http:\/\/localhost:3000(?:\/|$)/.test(tab.url));
if (!page) throw new Error('No confirmed local project page in Edge.');
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0;
const pending = new Map();
const errors = [];
socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.error) handler.reject(new Error(message.error.message)); else handler.resolve(message.result);
});
function command(method, params = {}) {
  return new Promise((resolve, reject) => { const next = ++id; pending.set(next, { resolve, reject }); socket.send(JSON.stringify({ id: next, method, params })); });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await delay(150); }
  console.log(await evaluate(`({url:location.href,width:innerWidth,icons:document.querySelectorAll('.petroglyph-icon').length,images:[...document.querySelectorAll('.search-tabs img')].map(i=>({src:i.currentSrc,complete:i.complete,width:i.naturalWidth})),text:document.body.innerText.slice(0,800)})`));
  throw new Error(`Timed out: ${expression}`);
}
const results = [];
async function check(label, expression) {
  if (!await evaluate(expression)) throw new Error(label);
  results.push(label);
}
const artifactDir = 'artifacts/petroglyph-check';
await mkdir(artifactDir, { recursive: true });
try {
  await command('Runtime.enable');
  await command('Page.enable');
  await command('Page.bringToFront');
  await command('Network.enable');
  await command('Network.setCacheDisabled', { cacheDisabled: true });
  await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await command('Page.navigate', { url: 'http://localhost:3000/' });
  await waitFor(`document.querySelectorAll('.search-tabs .petroglyph-icon').length === 5 && [...document.querySelectorAll('.search-tabs .petroglyph-still')].every(img => img.complete && img.naturalWidth > 0)`);
  await delay(1800);
  await check('desktop has no horizontal overflow', 'document.documentElement.scrollWidth <= innerWidth');
  await command('Page.navigate', { url: 'http://localhost:3000/routes' });
  await waitFor("document.querySelectorAll('.driver-card').length === 8");
  await evaluate("document.querySelector('.driver-section').scrollIntoView({block:'center'})");
  await waitFor("[...document.querySelectorAll('.driver-card img')].every(img=>img.complete && img.naturalWidth>0)");
  await check('eight drivers have names and scores', "[...document.querySelectorAll('.driver-card')].every(card=>card.querySelector('h3').textContent && card.querySelector('p').textContent.includes('4.'))");
  await check('driver section is a peer of route sections', "document.querySelector('.driver-section').parentElement.id==='site-content'");
  await check('desktop no overflow', 'document.documentElement.scrollWidth<=innerWidth');
  await delay(1800);
  await evaluate("document.querySelector('.driver-section .card-scroller').style.scrollBehavior='auto';document.querySelector('.driver-section .scroller-controls button:last-child').click()");
  await delay(2000);
  console.log(await evaluate("({width:document.querySelector('.driver-section .card-scroller').clientWidth,scrollWidth:document.querySelector('.driver-section .card-scroller').scrollWidth,left:document.querySelector('.driver-section .card-scroller').scrollLeft})")); await check('driver scroller moves', "document.querySelector('.driver-section .card-scroller').scrollLeft>0");
  await writeFile(`${artifactDir}/drivers-desktop.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await evaluate("document.querySelector('.driver-section').scrollIntoView({block:'start'});document.querySelector('.driver-section .card-scroller').scrollLeft=0");
  await delay(500);
  await check('mobile no overflow','document.documentElement.scrollWidth<=innerWidth');
  await writeFile(`${artifactDir}/drivers-mobile.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
  if(errors.length) throw new Error(errors.join(', '));
  console.log(JSON.stringify({results}));
} finally {
  await command('Emulation.setEmulatedMedia', { features: [] });
  await command('Emulation.setDeviceMetricsOverride', { width: 0, height: 0, deviceScaleFactor: 0, mobile: false });
  await command('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
  await command('Page.navigate', { url: 'http://localhost:3000/routes' });
  await waitFor("!!document.querySelector('.driver-section')");
  await evaluate("document.querySelector('.driver-section').scrollIntoView({block:'center'});document.querySelector('.driver-section .card-scroller').scrollLeft=0");
  socket.close();
}
