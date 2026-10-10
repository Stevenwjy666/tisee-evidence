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
  for (const kind of ['all', 'homes', 'routes', 'experiences', 'services']) {
    const bounds = await evaluate(`(() => { const r=document.querySelector('.search-tabs .petroglyph-${kind}').closest('button').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
    await delay(60);
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', ...bounds });
    await delay(60);
    await check(`${kind} animates on hover`, `(() => { const icon=document.querySelector('.search-tabs .petroglyph-${kind}'); return icon.getAnimations({subtree:true}).some(a=>a.playState==='running'); })()`);
    if (kind === 'routes' || kind === 'experiences') {
      const first = await evaluate(`getComputedStyle(document.querySelector('.search-tabs .petroglyph-${kind} .petroglyph-frames')).backgroundPositionX`);
      await delay(180);
      await check(`${kind} advances frames`, `getComputedStyle(document.querySelector('.search-tabs .petroglyph-${kind} .petroglyph-frames')).backgroundPositionX !== ${JSON.stringify(first)}`);
    }
    await delay(2800);
    await check(`${kind} returns to still`, `(() => { const i=document.querySelector('.search-tabs .petroglyph-${kind}'); return i.getAnimations({subtree:true}).every(a=>a.playState!=='running') && getComputedStyle(i.querySelector('img')).opacity==='1'; })()`);
  }
  await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
  await writeFile(`${artifactDir}/desktop.png`, Buffer.from((await command('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  for (const [kind, route] of [['homes','/homes'],['routes','/routes'],['experiences','/experiences'],['services','/services'],['all','/']]) {
    const point = await evaluate(`(() => { const r=document.querySelector('.search-tabs .petroglyph-${kind}').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
    await delay(80);
    await command('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
    await command('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
    await waitFor(`location.pathname===${JSON.stringify(route)} && document.querySelector('.search-tabs .petroglyph-${kind}').closest('button').getAttribute('aria-current')==='page'`);
    results.push(`${kind} navigates with one physical click on animated icon`);
  }
  await evaluate(`document.querySelector('input[aria-label="地点"]').focus()`);
  await check('destination search opens', `!!document.querySelector('.destination-popover')`);
  await evaluate(`document.querySelector('input[aria-label="地点"]').blur(); document.querySelector('.search-tabs button').click()`);
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await delay(800);
  await check('mobile has five visible categories', `getComputedStyle(document.querySelector('.mobile-category-tabs')).display==='flex' && document.querySelectorAll('.mobile-category-tabs button').length===5`);
  await check('mobile has no horizontal overflow', 'document.documentElement.scrollWidth <= innerWidth');
  await evaluate(`document.querySelector('.mobile-category-tabs .petroglyph-routes').closest('button').click()`);
  await waitFor(`location.pathname==='/routes'`);
  await delay(1200);
  await writeFile(`${artifactDir}/mobile.png`, Buffer.from((await command('Page.captureScreenshot', { format: 'png' })).data, 'base64'));
  results.push('mobile category navigates');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await evaluate(`document.querySelector('.mobile-category-tabs .petroglyph-experiences').closest('button').focus()`);
  await check('reduced motion disables animations', `document.querySelector('.mobile-category-tabs .petroglyph-experiences').getAnimations({subtree:true}).length===0`);
  if (errors.length) throw new Error(`Browser exceptions: ${errors.join(', ')}`);
  results.push('no browser exceptions');
  console.log(JSON.stringify({ results }, null, 2));
  await writeFile(`${artifactDir}/results.json`, JSON.stringify({ results }, null, 2));
} finally {
  await command('Emulation.setEmulatedMedia', { features: [] });
  await command('Emulation.setDeviceMetricsOverride', { width: 0, height: 0, deviceScaleFactor: 0, mobile: false });
  await command('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
  await command('Page.navigate', { url: 'http://localhost:3000/' });
  socket.close();
}
