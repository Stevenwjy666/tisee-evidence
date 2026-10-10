import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const edgePath = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = Number(process.env.CDP_PORT || 9333);
const width = Number(process.env.CAPTURE_WIDTH || 1440);
const height = Number(process.env.CAPTURE_HEIGHT || 900);
const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error("Usage: node scripts/cdp-capture.mjs <url> [url...]");
  process.exit(1);
}

const runId = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = path.resolve("artifacts", "captures", runId);
await mkdir(outDir, { recursive: true });

const browser = spawn(
  edgePath,
  [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(tmpdir(), `codex-edge-cdp-${runId}`)}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--window-size=${width},${height}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

async function waitForCdp() {
  for (let index = 0; index < 80; index += 1) {
    try {
      return await getJson(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await delay(250);
    }
  }
  throw new Error("Edge DevTools endpoint did not start.");
}

class CdpClient {
  constructor(socketUrl) {
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.socket = new WebSocket(socketUrl);
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(message.error.message));
        } else {
          resolve(message.result);
        }
        return;
      }
      if (message.method) {
        this.events.push(message);
      }
    });
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) {
      return;
    }
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  command(method, params = {}) {
    const id = (this.id += 1);
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
  }

  close() {
    this.socket.close();
  }
}

function safeName(url) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function captureUrl(url) {
  const tab = await getJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  });
  const client = new CdpClient(tab.webSocketDebuggerUrl);
  await client.open();
  await client.command("Page.enable");
  await client.command("Runtime.enable");
  await client.command("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.command("Page.navigate", { url });
  await delay(url.includes("airbnb.cn") ? 9000 : 2500);
  await client.command("Runtime.evaluate", {
    expression: `(() => {
      const candidates = [
        ...document.querySelectorAll("button, [role='button'], a"),
      ];
      const closeControl = candidates.find((node) => {
        const label = [
          node.getAttribute("aria-label"),
          node.getAttribute("title"),
          node.textContent,
        ].filter(Boolean).join(" ").trim();
        return /关闭|close/i.test(label);
      });
      closeControl?.click();
    })()`,
  });
  await delay(700);
  await client.command("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" });
  await delay(500);

  const summary = await client.command("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const box = (selector) => {
        const node = document.querySelector(selector);
        if (!node) return null;
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      };
      const text = (selector) => [...document.querySelectorAll(selector)].slice(0, 12).map((node) => node.textContent.trim()).filter(Boolean);
      return {
        url: location.href,
        title: document.title,
        innerWidth,
        innerHeight,
        bodyWidth: document.body.scrollWidth,
        header: box("header, .site-header"),
        search: box("[role=search], .search-zone"),
        searchPill: box("[data-testid='structured-search-input-search-button'], .search-pill"),
        main: box("main, #site-content"),
        tabs: text("[role='tab'], .search-tab"),
        headings: text("main h2, #site-content h2"),
        cards: document.querySelectorAll("[data-testid='card-container'], .travel-card").length,
      };
    })()`,
  });
  const screenshot = await client.command("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });

  const base = safeName(url);
  const pngPath = path.join(outDir, `${base}.png`);
  const jsonPath = path.join(outDir, `${base}.json`);
  await writeFile(pngPath, Buffer.from(screenshot.data, "base64"));
  await writeFile(jsonPath, JSON.stringify(summary.result.value, null, 2));
  client.close();
  return { url, pngPath, jsonPath, summary: summary.result.value };
}

try {
  await waitForCdp();
  const results = [];
  for (const url of urls) {
    results.push(await captureUrl(url));
  }
  console.log(JSON.stringify({ outDir, results }, null, 2));
} finally {
  browser.kill();
}
