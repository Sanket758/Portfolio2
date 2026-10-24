/* ============================================================
   GROUND TRUTH — js/scenes.js  (M2 · agent B)
   3 scene painters for the inference bench: shelf / quadruped / apriltag.

   Contract:
     window.SCENES = {
       names: ['shelf','quadruped','apriltag'],
       meta:  { shelf, quadruped, apriltag },
       paint(name, ctx, W, H, state),   // draws on an ALREADY-SCALED 2D ctx
       stats(name, state)               // { drawn, suppressed } after conf+NMS
     };
     state = { conf, view: 'raw'|'seg'|'embed',
               layers: { boxes:bool, seg:bool, nms:bool },
               t: ms, progress: 0..1, rm: bool }

   Rules honored here:
   - every geometry literal is PRECOMPUTED and embedded below; the module
     never calls Math.random. Only Math.sin/cos (sway / wobble) run at paint.
   - coordinates are normalized 0..1 and multiplied by W/H inside paint.
   - nothing is drawn outside [0,0,W,H].
   - every text sits on a small dark back-plate (see plate()).
   - FLAT fills only: no gradients, no glow, no neon anywhere in this file.

   Palette mirrored verbatim from parts/styles/tokens.css:
     --bg #090D16 · --card #111827 · --card2 #0D1420
     --ink #F9FAFB · --dim #9CA3AF · --faint #6B7280
     --cyan #06B6D4 · --emerald #10B981 · --amber #F59E0B · --red #EF4444
   desaturated scene variants: #0E7490 · #047857 · #B45309

   View semantics (one rule for all scenes):
   - 'raw'   = capture only, no detections/annotations (shelf hides the strip)
   - 'seg'   = segmentation + detection pass (masks/boxes/labels per layers)
   - 'embed' = retrieval readout. Shelf: product area becomes a 2-D embedding
       scatter + FAISS strip (layers.boxes gates the cluster boxes).
       Quadruped / apriltag: retrieval is SKU-only, so 'embed' renders the
       same annotation pass as 'seg'.
   layers.boxes / layers.seg / layers.nms are shelf layers; the other two
   scenes ignore them.  Ghosts ("nms dup") render when layers.nms AND
   layers.boxes are on — they are boxes, so the box toggle governs them.

   stats(name, state):
   - shelf: drawn = conf-passing non-suppressed detections;
            suppressed = conf-passing NMS duplicates when layers.nms is true.
   - quadruped: the 26 schema keypoints are always emitted (confidence only
     grades their color), so drawn = 26.
   - apriltag: the tag decodes at conf 0.97, so drawn = 1 for conf <= 0.95.
   ============================================================ */

  /* ---------------- palette (mirrors tokens.css, see header) ---------------- */
  var BG = '#090D16', CARD = '#111827', CARD2 = '#0D1420';
  var INK = '#F9FAFB', DIM = '#9CA3AF', FAINT = '#6B7280';
  var CYAN = '#06B6D4', EMER = '#10B981', AMBER = '#F59E0B', RED = '#EF4444';
  var LINE = 'rgba(249,250,251,0.09)';
  var FRAME = 'rgba(249,250,251,0.10)';
  var BOARD = 'rgba(249,250,251,0.12)';
  var BOARD2 = 'rgba(249,250,251,0.05)';
  var PLATE_BG = 'rgba(9,13,22,0.88)';
  var PLATE_LINE = 'rgba(249,250,251,0.10)';

  var FF = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
  var F7 = '7px ' + FF, F8 = '8px ' + FF, F9 = '9px ' + FF, F10 = '10px ' + FF;

  /* ---------------- helpers (no per-call allocation) ---------------- */
  function rr(ctx, x, y, w, h, r) {           /* rounded-rect path */
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* small dark back-plate + mono text. align: 'left'|'right'; clamps to canvas */
  function plate(ctx, W, x, y, text, fs, tcol, align) {
    ctx.font = fs === 7 ? F7 : fs === 8 ? F8 : fs === 9 ? F9 : F10;
    var w = Math.ceil(ctx.measureText(text).width) + 8;
    var h = fs + 5;
    if (align === 'right') x -= w;
    if (x + w > W - 2) x = W - 2 - w;
    if (x < 2) x = 2;
    ctx.fillStyle = PLATE_BG;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = PLATE_LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    ctx.fillStyle = tcol || INK;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + 4, y + h / 2 + 0.5);
    return w;
  }

  function dot(ctx, cx, cy, r, col, alpha) {  /* flat filled circle */
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function starPath(ctx, cx, cy, r) {         /* 5-point star, deterministic */
    var i, a, rad, x, y;
    ctx.beginPath();
    for (i = 0; i < 10; i++) {
      a = -Math.PI / 2 + i * Math.PI / 5;
      rad = (i % 2 === 0) ? r : r * 0.44;
      x = cx + Math.cos(a) * rad;
      y = cy + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  /* quadratic bezier, one axis */
  function bz(u, p0, c, p1) {
    var v = 1 - u;
    return v * v * p0 + 2 * v * u * c + u * u * p1;
  }

  /* ================================================================
     SCENE 'shelf' — retail shelf capture, frame #1847 (illustrative).
     Products: 4 rows × 8 generic SKUs, category codes only (no brands).
     ================================================================ */
  var SH_CATS = ['shampoo', 'lotion', 'soap', 'oral care', 'hair color', 'detergent'];
  var SH_CODES = ['SH', 'LO', 'SO', 'OC', 'HC', 'DT'];
  var SH_COLORS = ['#06B6D4', '#F59E0B', '#10B981', '#0E7490', '#047857', '#B45309'];

  /* carcass geometry (normalized) */
  var SH_X0 = 0.035, SH_Y0 = 0.078, SH_X1 = 0.965, SH_Y1 = 0.792;
  var SH_IX0 = 0.044, SH_IX1 = 0.956, SH_IY0 = 0.086, SH_IY1 = 0.786;
  var SH_ROWS = [0.261, 0.436, 0.611, 0.786];   /* board bottoms, top row first */

  /* ---- generated literals (deterministic; regenerate: /tmp/opencode/f18-gen.cjs) ---- */

  var SH_PRODUCTS = [
    [0.0625,0.1499,0.0813,0.1051,0], [0.1694,0.1524,0.0866,0.1026,0], [0.2849,0.1543,0.0878,0.1007,0], [0.4041,0.1493,0.0818,0.1057,0],
    [0.5164,0.1488,0.0851,0.1062,0], [0.625,0.1499,0.0853,0.1051,0], [0.7472,0.1575,0.0783,0.0975,0], [0.8636,0.1543,0.0782,0.1007,0],
    [0.063,0.3389,0.0748,0.0911,1], [0.1707,0.3361,0.0819,0.0939,1], [0.2934,0.3331,0.0743,0.0969,1], [0.4079,0.3316,0.074,0.0984,1],
    [0.5208,0.3397,0.0756,0.0903,2], [0.6347,0.342,0.0703,0.088,2], [0.7491,0.3391,0.0743,0.0909,2], [0.8663,0.341,0.0705,0.089,2],
    [0.0588,0.5172,0.0914,0.0878,3], [0.1731,0.5226,0.0863,0.0824,3], [0.2824,0.518,0.0881,0.087,3], [0.4063,0.5164,0.0806,0.0886,3],
    [0.5212,0.5091,0.0711,0.0959,4], [0.6379,0.5143,0.0738,0.0907,4], [0.7456,0.5093,0.0748,0.0957,4], [0.859,0.51,0.0747,0.095,4],
    [0.0507,0.6595,0.0992,0.1205,5], [0.1652,0.6542,0.1061,0.1258,5], [0.2847,0.6517,0.0964,0.1283,5], [0.3955,0.6549,0.0986,0.1251,5],
    [0.5044,0.6603,0.1012,0.1197,5], [0.6192,0.6593,0.1022,0.1207,5], [0.7331,0.6538,0.1065,0.1262,5], [0.842,0.6598,0.1072,0.1202,5]
  ]; /* [x, y, w, h, catIdx] × 32 */

  var SH_DET = [
    [0.0618,0.1453,0.0836,0.1079,0.94,"shampoo","#06B6D4"], [0.1685,0.1515,0.0934,0.1061,0.88,"shampoo","#06B6D4"], [0.2841,0.1504,0.0871,0.1034,0.72,"shampoo","#06B6D4"],
    [0.4045,0.1475,0.0888,0.1104,0.91,"shampoo","#06B6D4"], [0.5151,0.1468,0.0852,0.1104,0.55,"shampoo","#06B6D4"], [0.7422,0.1573,0.0813,0.1016,0.83,"shampoo","#06B6D4"],
    [0.8619,0.1536,0.0774,0.1059,0.67,"shampoo","#06B6D4"], [0.8669,0.1576,0.082,0.1112,0.44,"shampoo","#06B6D4"], [0.0623,0.3396,0.0784,0.0949,0.89,"lotion","#F59E0B"],
    [0.1697,0.3357,0.0877,0.0995,0.46,"lotion","#F59E0B"], [0.2898,0.3322,0.0757,0.1028,0.79,"lotion","#F59E0B"], [0.4087,0.328,0.0784,0.1003,0.93,"lotion","#F59E0B"],
    [0.5216,0.3374,0.0797,0.0907,0.34,"soap","#10B981"], [0.6332,0.3391,0.0752,0.0891,0.86,"soap","#10B981"], [0.6382,0.3431,0.0797,0.0936,0.58,"soap","#10B981"],
    [0.8629,0.3385,0.0745,0.0895,0.22,"soap","#10B981"], [0.0553,0.5162,0.0916,0.091,0.9,"oral care","#0E7490"], [0.1729,0.5187,0.0932,0.0834,0.75,"oral care","#0E7490"],
    [0.2787,0.5133,0.0934,0.0909,0.66,"oral care","#0E7490"], [0.4059,0.5166,0.0872,0.0918,0.27,"oral care","#0E7490"], [0.5177,0.5072,0.075,0.0983,0.92,"hair color","#047857"],
    [0.5227,0.5112,0.0795,0.1032,0.63,"hair color","#047857"], [0.7407,0.5096,0.0771,0.0991,0.48,"hair color","#047857"], [0.0478,0.6572,0.0995,0.1247,0.87,"detergent","#B45309"],
    [0.1654,0.6507,0.1083,0.1261,0.61,"detergent","#B45309"], [0.2808,0.6493,0.0994,0.1284,0.18,"detergent","#B45309"], [0.3955,0.6525,0.1048,0.128,0.97,"detergent","#B45309"],
    [0.4005,0.6565,0.1111,0.1344,0.71,"detergent","#B45309"], [0.7313,0.6525,0.1088,0.1319,0.52,"detergent","#B45309"], [0.8374,0.6594,0.1137,0.1227,0.77,"detergent","#B45309"]
  ]; /* [x, y, w, h, conf, label, color] × 30 */

  var SH_GHOSTS = [7, 14, 21, 27]; /* det[] indices suppressed by NMS (duplicates) */

  /* embedding scatter: 5 clusters (one per SKU category; the bulk detergent
     row is not indexed in this demo) + query point + top-5 k-NN links */
  var EM_POINTS = [
    [0.2554,0.3063,0], [0.2028,0.3024,0], [0.1602,0.3101,0], [0.2403,0.2801,0],
    [0.2573,0.2722,0], [0.2604,0.2902,0], [0.2443,0.2981,0], [0.1641,0.2528,0],
    [0.4318,0.2019,1], [0.3852,0.1719,1], [0.3751,0.1903,1], [0.387,0.2229,1],
    [0.6523,0.3485,2], [0.5454,0.4009,2], [0.6111,0.3471,2], [0.5867,0.3998,2],
    [0.2638,0.5598,3], [0.353,0.6022,3], [0.3586,0.5684,3], [0.346,0.5556,3],
    [0.7709,0.573,4], [0.7776,0.5744,4], [0.8287,0.5877,4], [0.7744,0.5981,4]
  ]; /* [x, y, clusterIdx] × 24 */

  var EM_QUERY = [0.53, 0.475];
  var EM_KNN = [
    [13,0.94], [18,0.91], [20,0.88], [11,0.84], [0,0.79]
  ]; /* [pointIdx, sim] — top-5 nearest SKUs, sims 0.94/0.91/0.88/0.84/0.79 */

  /* per-kNN sim-plate offset [dx, dy] px — hand-placed to clear cluster chrome */
  var EM_KOFF = [
    12, -16, 12, -16, 12, -16, 12, -30, 12, -16
  ];

  var EM_COUNT = [8, 4, 4, 4, 4];  /* points per cluster, same order as SH_CATS */

  function shelfIsGhost(i) {
    return i === SH_GHOSTS[0] || i === SH_GHOSTS[1] || i === SH_GHOSTS[2] || i === SH_GHOSTS[3];
  }

  function shelfCarcass(ctx, W, H) {
    ctx.fillStyle = CARD2;
    ctx.fillRect(SH_IX0 * W, SH_IY0 * H, (SH_IX1 - SH_IX0) * W, (SH_IY1 - SH_IY0) * H);
    ctx.strokeStyle = FRAME;
    ctx.lineWidth = 1;
    ctx.strokeRect(SH_X0 * W + 0.5, SH_Y0 * H + 0.5,
      (SH_X1 - SH_X0) * W - 1, (SH_Y1 - SH_Y0) * H - 1);
    /* side walls + 4 boards (board + soft lip) */
    ctx.strokeStyle = FRAME;
    ctx.beginPath();
    ctx.moveTo(SH_IX0 * W + 0.5, SH_IY0 * H); ctx.lineTo(SH_IX0 * W + 0.5, SH_IY1 * H);
    ctx.moveTo(SH_IX1 * W - 0.5, SH_IY0 * H); ctx.lineTo(SH_IX1 * W - 0.5, SH_IY1 * H);
    ctx.stroke();
    var i, by;
    for (i = 0; i < 4; i++) {
      by = SH_ROWS[i] * H;
      ctx.strokeStyle = BOARD; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(SH_IX0 * W, by); ctx.lineTo(SH_IX1 * W, by); ctx.stroke();
      ctx.strokeStyle = BOARD2; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(SH_IX0 * W, by + 3.5); ctx.lineTo(SH_IX1 * W, by + 3.5); ctx.stroke();
    }
  }

  /* raw product look: flat accent at low alpha + dark label strip + code */
  function shelfProducts(ctx, W, H) {
    var i, p, x, y, w, h, sh;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (i = 0; i < SH_PRODUCTS.length; i++) {
      p = SH_PRODUCTS[i];
      x = p[0] * W; y = p[1] * H; w = p[2] * W; h = p[3] * H;
      ctx.globalAlpha = 0.66;
      ctx.fillStyle = SH_COLORS[p[4]];
      rr(ctx, x, y, w, h, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
      sh = Math.max(8, h * 0.22);
      ctx.fillStyle = 'rgba(9,13,22,0.62)';
      rr(ctx, x + 1, y + h - sh - 1, w - 2, sh, 2);
      ctx.fill();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = DIM;
      ctx.font = F7;
      ctx.fillText(SH_CODES[p[4]], x + w / 2, y + h - sh / 2 + 0.5);
      ctx.globalAlpha = 1;
    }
  }

  /* seg masks: flat fill + 1px outline, drawn over the products */
  function shelfMasks(ctx, W, H) {
    var i, p, x, y, w, h;
    for (i = 0; i < SH_PRODUCTS.length; i++) {
      p = SH_PRODUCTS[i];
      x = p[0] * W; y = p[1] * H; w = p[2] * W; h = p[3] * H;
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = SH_COLORS[p[4]];
      rr(ctx, x, y, w, h, 3);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(249,250,251,0.30)';
      ctx.lineWidth = 1;
      rr(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 3);
      ctx.stroke();
    }
  }

  /* NMS ghosts: dashed, low alpha, tiny 'dup' plate inside the box */
  function shelfGhosts(ctx, W, H, conf) {
    var i, d, x, y, w, h;
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    for (i = 0; i < SH_GHOSTS.length; i++) {
      d = SH_DET[SH_GHOSTS[i]];
      if (d[4] < conf) continue;
      x = d[0] * W; y = d[1] * H; w = d[2] * W; h = d[3] * H;
      ctx.globalAlpha = 0.38;
      ctx.strokeStyle = d[6];
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.globalAlpha = 0.65;
      plate(ctx, W, x + 3, y + h - 15, 'dup', 8, DIM, 'left');
      ctx.globalAlpha = 1;
    }
    ctx.setLineDash([]);
  }

  /* detection boxes + 'label conf' plates, staggered in two tiers */
  function shelfBoxes(ctx, W, H, conf) {
    var i, d, x, y, w, h, py;
    ctx.lineWidth = 1;
    for (i = 0; i < SH_DET.length; i++) {
      if (shelfIsGhost(i)) continue;
      d = SH_DET[i];
      if (d[4] < conf) continue;
      x = d[0] * W; y = d[1] * H; w = d[2] * W; h = d[3] * H;
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = d[6];
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.globalAlpha = 1;
      py = y - 15 - (i % 2) * 14;
      if (py < 2) py = y + 2;
      plate(ctx, W, x, py, d[5] + ' ' + d[4].toFixed(2), 10, INK, 'left');
    }
  }

  /* FAISS retrieval strip — seg + embed views only */
  function shelfStrip(ctx, W, H) {
    var x, y, w, h, i, k, col;
    /* panel = the dark back-plate for every text inside */
    x = SH_X0 * W; y = 0.815 * H; w = (SH_X1 - SH_X0) * W; h = 0.160 * H;
    ctx.fillStyle = CARD2;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    /* query chip */
    x = 0.047 * W; y = 0.828 * H; w = 0.128 * W; h = 0.134 * H;
    ctx.fillStyle = CYAN;
    rr(ctx, x, y, w, h, 3);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = F10;
    ctx.fillStyle = '#0A1018';
    ctx.fillText('query \u2605', x + w / 2, y + h * 0.34);
    ctx.font = F7;
    ctx.fillStyle = 'rgba(10,16,24,0.78)';
    ctx.fillText('FAISS top-5', x + w / 2, y + h * 0.72);

    /* 5 nearest SKU cells */
    for (i = 0; i < 5; i++) {
      k = EM_KNN[i];
      col = SH_COLORS[EM_POINTS[k[0]][2]];
      x = (0.187 + i * 0.1548) * W; y = 0.828 * H; w = 0.1468 * W; h = 0.134 * H;
      ctx.fillStyle = CARD;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = LINE;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = col;
      rr(ctx, x + 7, y + 14, 16, 26, 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.textAlign = 'left';
      ctx.font = F8;
      ctx.fillStyle = DIM;
      ctx.fillText(SH_CATS[EM_POINTS[k[0]][2]], x + 29, y + 17);
      ctx.font = F10;
      ctx.fillStyle = INK;
      ctx.fillText(k[1].toFixed(2), x + 29, y + 39);
    }
  }

  /* embed view: scatter replaces the product area */
  function shelfEmbed(ctx, W, H, layers) {
    var i, k, p, x, y, col, cx, cy, px, py;
    var qx = EM_QUERY[0] * W, qy = EM_QUERY[1] * H;
    var gx, gy;

    /* panel */
    x = SH_IX0 * W; y = SH_IY0 * H;
    ctx.fillStyle = BG;
    ctx.fillRect(x, y, (SH_IX1 - SH_IX0) * W, (SH_IY1 - SH_IY0) * H);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, (SH_IX1 - SH_IX0) * W - 1, (SH_IY1 - SH_IY0) * H - 1);
    /* faint 1-D ticks grid */
    ctx.strokeStyle = 'rgba(249,250,251,0.05)';
    ctx.beginPath();
    for (gy = 0.186; gy < 0.78; gy += 0.1) {
      ctx.moveTo(SH_IX0 * W, gy * H + 0.5);
      ctx.lineTo(SH_IX1 * W, gy * H + 0.5);
    }
    for (gx = 0.144; gx < 0.96; gx += 0.1) {
      ctx.moveTo(gx * W + 0.5, SH_IY0 * H);
      ctx.lineTo(gx * W + 0.5, SH_IY1 * H);
    }
    ctx.stroke();

    /* k-NN links, then points, then rings + sim plates */
    ctx.strokeStyle = 'rgba(6,182,212,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (i = 0; i < EM_KNN.length; i++) {
      p = EM_POINTS[EM_KNN[i][0]];
      ctx.moveTo(qx, qy);
      ctx.lineTo(p[0] * W, p[1] * H);
    }
    ctx.stroke();

    for (i = 0; i < EM_POINTS.length; i++) {
      p = EM_POINTS[i];
      dot(ctx, p[0] * W, p[1] * H, 3, SH_COLORS[p[2]], 0.85);
    }

    ctx.lineWidth = 1;
    for (i = 0; i < EM_KNN.length; i++) {
      k = EM_KNN[i];
      p = EM_POINTS[k[0]];
      px = p[0] * W; py = p[1] * H;
      ctx.strokeStyle = SH_COLORS[p[2]];
      ctx.beginPath();
      ctx.arc(px, py, 6.5, 0, Math.PI * 2);
      ctx.stroke();
      plate(ctx, W, px + EM_KOFF[i * 2], py + EM_KOFF[i * 2 + 1], k[1].toFixed(2), 8, INK, 'left');
    }

    /* cluster boxes (layers.boxes) + labels */
    for (i = 0; i < 5; i++) {
      var minx = 9, miny = 9, maxx = -9, maxy = -9, n = 0;
      for (k = 0; k < EM_POINTS.length; k++) {
        if (EM_POINTS[k][2] !== i) continue;
        cx = EM_POINTS[k][0]; cy = EM_POINTS[k][1]; n++;
        if (cx < minx) minx = cx;
        if (cx > maxx) maxx = cx;
        if (cy < miny) miny = cy;
        if (cy > maxy) maxy = cy;
      }
      x = (minx - 0.014) * W; y = (miny - 0.026) * H;
      var bw = (maxx - minx + 0.028) * W, bh = (maxy - miny + 0.052) * H;
      if (layers.boxes) {
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = SH_COLORS[i];
        ctx.strokeRect(x + 0.5, y + 0.5, bw - 1, bh - 1);
        ctx.globalAlpha = 1;
      }
      plate(ctx, W, x, y + bh + 2, SH_CATS[i] + ' \u00b7 n=' + EM_COUNT[i], 8, SH_COLORS[i], 'left');
    }

    /* query star on top */
    ctx.fillStyle = INK;
    starPath(ctx, qx, qy, 7);
    ctx.fill();
    plate(ctx, W, qx + 10, qy - 19, 'query', 8, INK, 'left');

    /* captions — every glyph on a plate (panel + these) */
    plate(ctx, W, SH_IX0 * W + 8, SH_IY0 * H + 8, 'PCA 2-D \u00b7 DINOv3 embeddings \u00b7 illustrative', 8, DIM, 'left');
    plate(ctx, W, SH_IX1 * W - 8, SH_IY1 * H - 20, 'dim 1 \u2191 \u00b7 dim 0 \u2192', 8, DIM, 'right');
  }

  function paintShelf(ctx, W, H, view, layers, conf) {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    shelfCarcass(ctx, W, H);

    if (view === 'embed') {
      shelfEmbed(ctx, W, H, layers);
    } else {
      shelfProducts(ctx, W, H);
      if (view === 'seg') {
        if (layers.seg) shelfMasks(ctx, W, H);
        if (layers.boxes && layers.nms) shelfGhosts(ctx, W, H, conf);
        if (layers.boxes) shelfBoxes(ctx, W, H, conf);
      }
    }
    if (view !== 'raw') shelfStrip(ctx, W, H);
    plate(ctx, W, 0.018 * W, 0.018 * H, 'FRAME #1847 \u00b7 illustrative', 10, INK, 'left');
  }

  /* ================================================================
     SCENE 'quadruped' — side-view pose wireframe, 26 keypoints.
     Schema (index · name), anatomically ordered:
       0 noseTip · 1 muzzle · 2 eyeNear · 3 eyeFar · 4 earNear · 5 earFar
       6 headTop · 7 neck · 8 withers · 9 midBack · 10 hip
       11 tailBase · 12 tailMid · 13 tailTip
       14 shoulderFrontNear · 15 carpusFrontNear · 16 hoofFrontNear
       17 shoulderFrontFar · 18 carpusFrontFar · 19 hoofFrontFar
       20 hipJointNear · 21 hockNear · 22 hoofHindNear
       23 hipJointFar · 24 hockFar · 25 hoofHindFar
     = head/ears/eyes/muzzle (7) + neck (1) + withers/back/hip (3)
       + tail base/mid/tip (3) + 4 legs × 3 joints (12)  = 26.
     ================================================================ */
  var KPX = [
    0.085, 0.128, 0.163, 0.176, 0.178, 0.196, 0.150, 0.240, 0.285, 0.480,
    0.650, 0.705, 0.760, 0.790, 0.315, 0.305, 0.300, 0.362, 0.360, 0.365,
    0.645, 0.610, 0.630, 0.695, 0.665, 0.685
  ];
  var KPY = [
    0.335, 0.352, 0.300, 0.292, 0.243, 0.232, 0.245, 0.330, 0.400, 0.372,
    0.380, 0.400, 0.475, 0.560, 0.515, 0.660, 0.848, 0.510, 0.655, 0.848,
    0.520, 0.675, 0.848, 0.515, 0.670, 0.848
  ];
  var KP_CONF = [
    0.97, 0.93, 0.96, 0.74, 0.90, 0.66, 0.88, 0.82, 0.91, 0.94,
    0.89, 0.80, 0.58, 0.41, 0.92, 0.87, 0.83, 0.62, 0.55, 0.47,
    0.90, 0.84, 0.79, 0.59, 0.52, 0.44
  ];
  var KPBONES = [
    [0, 1], [1, 2], [2, 3], [4, 5], [4, 6], [5, 6], [6, 7], [1, 7], [7, 8],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13],
    [8, 14], [14, 15], [15, 16], [8, 17], [17, 18], [18, 19],
    [10, 20], [20, 21], [21, 22], [10, 23], [23, 24], [24, 25]
  ]; /* index pairs — 26 bones over the 26 keypoints */

  /* label plate offsets [dx, dy] px per keypoint (crowd control):
     far-side + tail joints label below-right, everything else above-right */
  var KPL_OFF = [
    5, -13, 5, -13, 5, -13, 5, 4,        /* 0-3  nose muzzle eyes */
    5, -13, 16, -13, 5, -13, 5, -13,     /* 4-7  ears pushed right, headTop, neck */
    5, -13, 5, -13, 5, -13, 5, -13,      /* 8-11 spine */
    5, 4, 5, 4, 5, -13, 5, -13,          /* 12-15 tail, shFrontNear */
    5, -13, 5, 4, 5, 4, 5, 4,            /* 16-19 hoofNear, frontFar leg */
    5, -13, 5, -13, 5, -13, 5, 4,        /* 20-23 hindNear, hipFar */
    5, 4, 5, 4                           /* 24-25 hindFar */
  ];

  /* idle-sway phase per leg joint 14..25 (radians) */
  var SWAY = [0.0, 0.6, 1.2, 1.9, 2.5, 3.1, 3.8, 4.4, 5.0, 5.7, 6.3, 6.9];

  /* joint color bands: emerald >= .75, amber >= .45, else desaturated amber */
  var KP_COL = [];
  (function () {
    var i;
    for (i = 0; i < 26; i++) {
      KP_COL.push(KP_CONF[i] >= 0.75 ? EMER : KP_CONF[i] >= 0.45 ? AMBER : '#B45309');
    }
  })();

  var _A = [0, 0], _B = [0, 0]; /* scratch points — reused, no GC churn */

  function kpXY(out, i, W, H, t, rm) {
    var x = KPX[i] * W, y = KPY[i] * H;
    if (!rm && i >= 14) { /* gentle idle sway on the 12 leg joints only */
      var ph = SWAY[i - 14];
      x += Math.sin(t * 0.0011 + ph) * 2.2;
      y += Math.sin(t * 0.00055 + ph * 0.8 + 1.3) * 1.3;
    }
    out[0] = x;
    out[1] = y;
  }

  function paintQuadruped(ctx, W, H, view, t, rm) {
    var i, b, x, y;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    /* capture corner brackets + ground baseline + hoof contact ticks */
    ctx.strokeStyle = 'rgba(249,250,251,0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (i = 0; i < 4; i++) {
      x = i % 2 === 0 ? 10 : W - 10;
      y = i < 2 ? 10 : H - 10;
      var sx = i % 2 === 0 ? 1 : -1, sy = i < 2 ? 1 : -1;
      ctx.moveTo(x, y); ctx.lineTo(x + 12 * sx, y);
      ctx.moveTo(x, y); ctx.lineTo(x, y + 12 * sy);
    }
    ctx.moveTo(0.05 * W, 0.858 * H + 0.5); ctx.lineTo(0.95 * W, 0.858 * H + 0.5);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(249,250,251,0.10)';
    ctx.beginPath();
    for (i = 0; i < 4; i++) {
      x = KPX[16 + (i === 1 ? 3 : i === 2 ? 6 : i === 3 ? 9 : 0)] * W;
      ctx.moveTo(x, 0.858 * H);
      ctx.lineTo(x, 0.858 * H + 4);
    }
    ctx.stroke();

    /* bones: 2px, one path */
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(249,250,251,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (i = 0; i < KPBONES.length; i++) {
      b = KPBONES[i];
      kpXY(_A, b[0], W, H, t, rm);
      kpXY(_B, b[1], W, H, t, rm);
      ctx.moveTo(_A[0], _A[1]);
      ctx.lineTo(_B[0], _B[1]);
    }
    ctx.stroke();

    /* joints: 4px dots (r = 2), flat fill banded by confidence */
    for (i = 0; i < 26; i++) {
      kpXY(_A, i, W, H, t, rm);
      dot(ctx, _A[0], _A[1], 2, KP_COL[i], 1);
    }

    /* numbered labels (seg/embed) — tiny plates */
    if (view !== 'raw') {
      for (i = 0; i < 26; i++) {
        kpXY(_A, i, W, H, t, rm);
        plate(ctx, W, _A[0] + KPL_OFF[i * 2], _A[1] + KPL_OFF[i * 2 + 1],
          String(i + 1), 9, INK, 'left');
      }
    }

    plate(ctx, W, 0.018 * W, H - 26, '26 KP \u00b7 YOLOv8n-pose stack \u00b7 synthetic wireframe', 10, INK, 'left');
  }

  /* ================================================================
     SCENE 'apriltag' — top-down aerial landing sim (illustrative).
     Generic 6×6 tag pattern (arbitrary — NOT any real tag family).
     ================================================================ */
  var TAG6 = [
    '100110', '011001', '110101',
    '001011', '101000', '010110'
  ];
  var TAG_BLACK = '#0A0F16';
  /* descent guide: quadratic bezier P0 -> C -> P1 (pad centre) */
  var AD_P0 = [0.80, 0.14], AD_C = [0.67, 0.31], AD_P1 = [0.50, 0.52];

  function adU(state) { /* single source of truth for rm freeze */
    var p = typeof state.progress === 'number' ? state.progress : 1;
    p = Math.min(1, Math.max(0, p));
    return state.rm ? 0.6 : p;
  }

  function adAxes(ctx, W, ox, oy, dx, dy, col, label, lx, ly) {
    var ex = ox + dx, ey = oy + dy;
    var a = Math.atan2(dy, dx);
    ctx.strokeStyle = col;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ex, ey); ctx.lineTo(ex - 6 * Math.cos(a - 0.42), ey - 6 * Math.sin(a - 0.42));
    ctx.moveTo(ex, ey); ctx.lineTo(ex - 6 * Math.cos(a + 0.42), ey - 6 * Math.sin(a + 0.42));
    ctx.stroke();
    plate(ctx, W, ex + lx, ey + ly, label, 8, col, 'left');
  }

  function paintApriltag(ctx, W, H, view, t, rm, state) {
    var i, x, y, u, sc, rot;
    var cx = 0.5 * W, cy = 0.52 * H;
    var R = Math.min(W, H) * 0.30;
    var side = R * 0.72;
    var tx = cx - side / 2, ty = cy - side / 2;
    var cell = (side - 8) / 6;

    u = adU(state);

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    /* ground grid + fiducial ticks */
    ctx.strokeStyle = 'rgba(249,250,251,0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (i = 1; i < 10; i++) {
      ctx.moveTo((i / 10) * W + 0.5, 0); ctx.lineTo((i / 10) * W + 0.5, H);
      ctx.moveTo(0, (i / 10) * H + 0.5); ctx.lineTo(W, (i / 10) * H + 0.5);
    }
    ctx.stroke();
    ctx.strokeStyle = 'rgba(249,250,251,0.20)';
    ctx.beginPath();
    var gx, gy;
    for (i = 0; i < 4; i++) {
      gx = (i % 2 === 0 ? 0.06 : 0.94) * W;
      gy = (i < 2 ? 0.07 : 0.93) * H;
      ctx.moveTo(gx - 6, gy); ctx.lineTo(gx + 6, gy);
      ctx.moveTo(gx, gy - 6); ctx.lineTo(gx, gy + 6);
    }
    ctx.stroke();

    /* landing pad: surface, outer ring (emerald once locked), inner ring,
       N/E/S/W alignment ticks */
    ctx.fillStyle = CARD2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = u > 0.75 ? EMER : FAINT;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(249,250,251,0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.74, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(249,250,251,0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - R - 13); ctx.lineTo(cx, cy - R - 5);
    ctx.moveTo(cx, cy + R + 5); ctx.lineTo(cx, cy + R + 13);
    ctx.moveTo(cx - R - 13, cy); ctx.lineTo(cx - R - 5, cy);
    ctx.moveTo(cx + R + 5, cy); ctx.lineTo(cx + R + 13, cy);
    ctx.stroke();

    /* tag: dark backing = black border, then 6×6 cells over the white field */
    ctx.fillStyle = TAG_BLACK;
    ctx.fillRect(tx, ty, side, side);
    ctx.fillStyle = INK;
    ctx.fillRect(tx + 4, ty + 4, side - 8, side - 8);
    ctx.fillStyle = TAG_BLACK;
    var r6, c6;
    for (r6 = 0; r6 < 6; r6++) {
      for (c6 = 0; c6 < 6; c6++) {
        if (TAG6[r6].charAt(c6) === '1') {
          ctx.fillRect(tx + 4 + c6 * cell, ty + 4 + r6 * cell, cell, cell);
        }
      }
    }

    /* annotated overlays: seg / embed only (raw = clean capture) */
    if (view !== 'raw') {
      var bm = 13;
      ctx.strokeStyle = CYAN;
      ctx.lineWidth = 1;
      ctx.strokeRect(tx - bm + 0.5, ty - bm + 0.5, side + bm * 2 - 1, side + bm * 2 - 1);
      plate(ctx, W, tx - bm, ty - bm - 15, 'APRILTAG \u00b7 0.97', 9, INK, 'left');

      /* pose-axes gizmo from the tag centre */
      adAxes(ctx, W, cx, cy, side / 2 + 24, 0, EMER, 'X', 5, -7);
      adAxes(ctx, W, cx, cy, 0, side / 2 + 24, AMBER, 'Y', 5, -7);
      adAxes(ctx, W, cx, cy, -(side / 2 + 32) * 0.707, -(side / 2 + 32) * 0.707, RED, 'Z', -31, -3);

      /* readout plates */
      plate(ctx, W, (0.965 * W), 0.022 * H, '\u0394 0.08 m', 10, INK, 'right');
      plate(ctx, W, (0.965 * W), 0.062 * H, '98 ms', 10, INK, 'right');
      plate(ctx, W, (0.965 * W), 0.100 * H, '\u2264 10 cm \u00b7 < 100 ms', 8, DIM, 'right');
    }

    /* descent guide (hidden while frozen via reduced motion) */
    if (!rm) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(249,250,251,0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (i = 0; i <= 22; i++) {
        x = bz(i / 22, AD_P0[0], AD_C[0], AD_P1[0]) * W;
        y = bz(i / 22, AD_P0[1], AD_C[1], AD_P1[1]) * H;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      for (i = 0; i < 4; i++) {
        x = bz(i / 4, AD_P0[0], AD_C[0], AD_P1[0]) * W;
        y = bz(i / 4, AD_P0[1], AD_C[1], AD_P1[1]) * H;
        ctx.fillStyle = 'rgba(249,250,251,0.28)';
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
    }

    /* drone: top-down quad, scale grows as it approaches, gentle wobble */
    x = bz(u, AD_P0[0], AD_C[0], AD_P1[0]) * W;
    y = bz(u, AD_P0[1], AD_C[1], AD_P1[1]) * H;
    if (!rm) {
      x += Math.sin(t * 0.0013) * 2.5;
      y += Math.cos(t * 0.0017) * 1.5;
    }
    sc = 0.6 + 0.55 * u;
    rot = rm ? 0 : Math.sin(t * 0.0009) * 0.08;

    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 6, 16 * sc, 10 * sc, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(sc, sc);
    ctx.strokeStyle = 'rgba(249,250,251,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-11, -11); ctx.lineTo(-3, -3);
    ctx.moveTo(11, -11); ctx.lineTo(3, -3);
    ctx.moveTo(-11, 11); ctx.lineTo(-3, 3);
    ctx.moveTo(11, 11); ctx.lineTo(3, 3);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(249,250,251,0.45)';
    ctx.beginPath();
    ctx.arc(-15.6, -15.6, 8, 0, Math.PI * 2);
    ctx.arc(15.6, -15.6, 8, 0, Math.PI * 2);
    ctx.arc(-15.6, 15.6, 8, 0, Math.PI * 2);
    ctx.arc(15.6, 15.6, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = DIM;
    ctx.beginPath();
    ctx.arc(-15.6, -15.6, 1.6, 0, Math.PI * 2);
    ctx.arc(15.6, -15.6, 1.6, 0, Math.PI * 2);
    ctx.arc(-15.6, 15.6, 1.6, 0, Math.PI * 2);
    ctx.arc(15.6, 15.6, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1B2534';
    ctx.strokeStyle = 'rgba(249,250,251,0.55)';
    ctx.lineWidth = 1;
    rr(ctx, -9, -9, 18, 18, 3);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-3, -12); ctx.lineTo(0, -15); ctx.lineTo(3, -12);
    ctx.stroke();
    ctx.restore();

    plate(ctx, W, 0.018 * W, H - 26, 'SIM \u00b7 illustrative', 10, INK, 'left');
  }

  /* ================================================================
     public contract
     ================================================================ */
  export const SCENES = {
    names: ['shelf', 'quadruped', 'apriltag'],

    meta: {
      shelf: {
        label: 'Retail shelf \u2014 frame #1847',
        illustrative: true,
        products: SH_PRODUCTS.length,
        categories: SH_CATS.length,
        detections: SH_DET.length,
        nmsDuplicates: SH_GHOSTS.length,
        confRange: [0.18, 0.97],
        retrieval: 'FAISS top-5 \u00b7 sims 0.94/0.91/0.88/0.84/0.79'
      },
      quadruped: {
        label: 'Quadruped pose \u2014 26 keypoints',
        keypoints: 26,
        bones: KPBONES.length,
        schema: 'custom 26-kp quadruped schema \u00b7 YOLOv8n-pose',
        synthetic: true
      },
      apriltag: {
        label: 'Aerial AprilTag landing',
        illustrative: true,
        tag: '6\u00d76 cell \u00b7 generic pattern',
        metrics: '\u2264 10 cm \u00b7 < 100 ms',
        readouts: ['\u0394 0.08 m', '98 ms']
      }
    },

    /* draws on an already-scaled 2D context; W/H are the logical size */
    paint: function (name, ctx, W, H, state) {
      if (!ctx || !W || !H) return;
      var st = state || {};
      var view = st.view === 'raw' || st.view === 'embed' ? st.view : 'seg';
      var layers = st.layers || {};
      var conf = typeof st.conf === 'number' ? st.conf : 0.5;
      if (conf < 0.10) conf = 0.10;
      if (conf > 0.95) conf = 0.95;
      var t = typeof st.t === 'number' ? st.t : 0;
      var rm = !!st.rm;

      ctx.save();
      ctx.lineJoin = 'miter';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      if (name === 'quadruped') paintQuadruped(ctx, W, H, view, t, rm);
      else if (name === 'apriltag') paintApriltag(ctx, W, H, view, t, rm, st);
      else if (name === 'shelf') paintShelf(ctx, W, H, view, layers, conf);
      else { ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); } /* unknown id */
      ctx.restore();
    },

    /* post conf + NMS counts (for bench telemetry and tests) */
    stats: function (name, state) {
      var st = state || {};
      var conf = typeof st.conf === 'number' ? st.conf : 0.5;
      if (name === 'quadruped') return { drawn: 26, suppressed: 0 };
      if (name === 'apriltag') return { drawn: conf <= 0.95 ? 1 : 0, suppressed: 0 };
      var nms = !!(st.layers && st.layers.nms);
      var drawn = 0, suppressed = 0, i;
      for (i = 0; i < SH_DET.length; i++) {
        if (SH_DET[i][4] < conf) continue;
        if (shelfIsGhost(i)) { if (nms) suppressed++; }
        else drawn++;
      }
      return { drawn: drawn, suppressed: suppressed };
    }
  };
