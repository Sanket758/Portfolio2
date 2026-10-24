/**
 * One-off: renders public/og.png (1200×630) — the social card the OG/Twitter
 * meta in index.html points at. Run with the dev server up:
 *   node probe-og.mjs
 */
import { chromium } from '@playwright/test'

const ORIGIN = 'http://localhost:3000'

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face{font-family:'Inter';src:url('${ORIGIN}/fonts/inter-latin-400.woff2') format('woff2');font-weight:400;font-display:block}
  @font-face{font-family:'Inter';src:url('${ORIGIN}/fonts/inter-latin-500.woff2') format('woff2');font-weight:500;font-display:block}
  @font-face{font-family:'Inter';src:url('${ORIGIN}/fonts/inter-latin-600.woff2') format('woff2');font-weight:600;font-display:block}
  @font-face{font-family:'JetBrains Mono';src:url('${ORIGIN}/fonts/jetbrains-mono-latin-400.woff2') format('woff2');font-weight:400;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#090D16;color:#F9FAFB;font-family:'Inter',sans-serif;
       display:flex;flex-direction:column;justify-content:space-between;padding:56px 64px;position:relative;overflow:hidden}
  body::before{content:"";position:absolute;inset:0;
       background-image:linear-gradient(rgba(249,250,251,.05) 1px,transparent 1px),
                        linear-gradient(90deg,rgba(249,250,251,.05) 1px,transparent 1px);
       background-size:48px 48px;pointer-events:none}
  .row{display:flex;justify-content:space-between;align-items:center;position:relative}
  .eyebrow{font-family:'JetBrains Mono',monospace;font-size:14px;letter-spacing:.22em;color:#06B6D4;text-transform:uppercase}
  .tag{font-family:'JetBrains Mono',monospace;font-size:13px;letter-spacing:.16em;color:#7E8795;text-transform:uppercase}
  h1{font-size:88px;line-height:1;letter-spacing:-.035em;font-weight:600;position:relative}
  .role{margin-top:18px;font-size:27px;color:#9CA3AF;letter-spacing:-.01em;position:relative}
  .facts{display:grid;grid-template-columns:1fr 1fr 1fr 1.25fr;border-top:1px solid rgba(249,250,251,.14);
         margin-top:44px;position:relative}
  .fact{padding:18px 22px 0 0;border-right:1px solid rgba(249,250,251,.09)}
  .fact:last-child{border-right:0}
  .k{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.18em;color:#7E8795;text-transform:uppercase}
  .v{margin-top:8px;font-size:18px;color:#F9FAFB;font-weight:500;white-space:nowrap}
  .v em{font-style:normal;color:#10B981}
  .foot{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.16em;color:#7E8795;text-transform:uppercase;
        display:flex;justify-content:space-between;border-top:1px solid rgba(249,250,251,.14);padding-top:18px;position:relative}
  .dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#10B981;margin-right:9px}
</style></head>
<body>
  <div class="row">
    <span class="eyebrow">01 · LAB / INGEST</span>
    <span class="tag">SANKET GADGE · BERLIN</span>
  </div>
  <div>
    <h1>Sanket Gadge</h1>
    <p class="role">Computer Vision, AI &amp; Python Engineer — production detection pipelines</p>
    <div class="facts">
      <div class="fact"><div class="k">Status</div><div class="v"><em>Available now</em> · 40 h/week</div></div>
      <div class="fact"><div class="k">Permit</div><div class="v">18-month post-study</div></div>
      <div class="fact"><div class="k">Languages</div><div class="v">German B1 · English</div></div>
      <div class="fact"><div class="k">Evidence</div><div class="v">95% precision · 500+ SKUs</div></div>
    </div>
  </div>
  <div class="foot">
    <span><span class="dot"></span>MSc AI, Class of 2026</span>
    <span>GROUND TRUTH · GT-758</span>
  </div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(ORIGIN, { waitUntil: 'domcontentloaded' }) // establish the origin for font loads
await page.setContent(html, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)
await page.screenshot({ path: 'public/og.png' })
await browser.close()
console.log('wrote public/og.png')
