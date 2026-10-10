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
  await command('Network.setCacheDisabled', {cacheDisabled:true});
  await command('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await command('Page.navigate',{url:'http://localhost:3000/routes'});
  await waitFor("document.querySelectorAll('a.driver-card').length===8");
  await delay(1200);
  await evaluate("document.querySelector('a.driver-card').click()");
  await waitFor("location.pathname==='/drivers/zhaxi' && document.querySelectorAll('.driver-gallery').length===2");
  await delay(1500);
  await check('two galleries with four thumbnails each',"document.querySelectorAll('.driver-gallery-thumbnails button').length===8");
  await check('route and daily prices present',"document.querySelectorAll('.driver-route-row').length===4 && document.querySelector('.driver-daily-amount').textContent.includes('800')");
  await check('contact section present',"document.querySelectorAll('.driver-contact-grid > div').length===2");
  for (let i=0;i<2;i++) {
    const before=await evaluate(`document.querySelectorAll('.driver-gallery-main img')[${i}].getAttribute('src')`);
    await evaluate(`document.querySelectorAll('.driver-gallery')[${i}].querySelectorAll('button')[1].click()`);
    await waitFor(`document.querySelectorAll('.driver-gallery')[${i}].querySelectorAll('button')[1].getAttribute('aria-pressed')==='true'`);
    await check('gallery '+i+' switches main photo',`document.querySelectorAll('.driver-gallery-main img')[${i}].getAttribute('src')!==${JSON.stringify(before)}`);
    await evaluate(`document.querySelectorAll('.driver-gallery')[${i}].querySelector('button').click()`);
  }
  await waitFor("[...document.querySelectorAll('.driver-gallery img')].every(i=>i.complete&&i.naturalWidth>0)");
  await check('desktop no overflow','document.documentElement.scrollWidth<=innerWidth');
  await writeFile(`${artifactDir}/driver-detail-desktop.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await delay(500);
  await check('mobile no overflow','document.documentElement.scrollWidth<=innerWidth');
  await check('mobile galleries stack',"getComputedStyle(document.querySelector('.driver-photo-columns')).gridTemplateColumns.split(' ').length===1");
  await writeFile(`${artifactDir}/driver-detail-mobile.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
  await evaluate("document.querySelector('.driver-contact-section').scrollIntoView()");
  await delay(500);
  await writeFile(`${artifactDir}/driver-detail-mobile-prices.png`,Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
  if(errors.length) throw new Error(errors.join(', '));
  console.log(JSON.stringify({results}));
} finally {
  await command('Emulation.setEmulatedMedia', { features: [] });
  await command('Emulation.setDeviceMetricsOverride', { width: 0, height: 0, deviceScaleFactor: 0, mobile: false });
  await command('Emulation.setPageScaleFactor', { pageScaleFactor: 1 });
  await command('Page.navigate', { url: 'http://localhost:3000/drivers/zhaxi' });
  socket.close();
}
