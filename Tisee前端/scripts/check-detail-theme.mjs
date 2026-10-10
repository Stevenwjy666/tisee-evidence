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
  await command('Runtime.enable'); await command('Page.enable'); await command('Page.bringToFront');
  await command('Network.enable'); await command('Network.setCacheDisabled',{cacheDisabled:true});
  for (const [path,selector] of [['/rooms/stay-0','.room-page'],['/rooms/route-0','.room-page'],['/guides/yangjin','.guide-page']]) {
    await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await command('Page.navigate',{url:'http://localhost:3000'+path});
    await waitFor(`!!document.querySelector('${selector}')`);
    await delay(1200);
    await check(path+' uses warm background',`getComputedStyle(document.querySelector('${selector}')).backgroundColor==='rgb(255, 253, 249)'`);
    await check(path+' desktop no overflow','document.documentElement.scrollWidth<=innerWidth');
    const name=path.replaceAll('/','-');
    await writeFile(`${artifactDir}/theme${name}-desktop.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
    await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await delay(400);
    await check(path+' mobile no overflow','document.documentElement.scrollWidth<=innerWidth');
    await writeFile(`${artifactDir}/theme${name}-mobile.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
  }
  if(errors.length) throw new Error(errors.join(', '));
  console.log(JSON.stringify({results}));
} finally {
  await command('Emulation.setEmulatedMedia', { features: [] });
  await command('Emulation.setDeviceMetricsOverride', { width: 0, height: 0, deviceScaleFactor: 0, mobile: false });
  await command('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
  await command('Page.navigate', { url: 'http://localhost:3000/guides/yangjin' });
  socket.close();
}
