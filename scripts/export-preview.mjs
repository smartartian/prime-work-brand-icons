// 从构建产物 brandIcons 生成自包含的静态图标画廊 preview/index.html。
// 运行：npm run export:preview（需先 npm run build）
// 用途：双击 preview/index.html 即可在浏览器查看、搜索、复制 si:<slug>。

import { brandIcons } from "../dist/index.mjs";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const icons = Object.values(brandIcons).map(({ slug, title, path, hex }) => ({
  slug,
  title,
  path,
  hex,
}));

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Prime Work 品牌图标库</title>
<style>
  :root {
    --brand: #00aaf3;
    --bg: #f5f7fa;
    --card: #ffffff;
    --text: #1f2733;
    --muted: #6b7684;
    --border: #e5e9f0;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
    background: var(--bg);
    color: var(--text);
  }
  header {
    padding: 28px 24px 16px;
    text-align: center;
  }
  header h1 { margin: 0 0 4px; font-size: 22px; }
  header p { margin: 0; color: var(--muted); font-size: 13px; }
  .search {
    display: flex;
    justify-content: center;
    margin: 16px 24px 20px;
  }
  .search input {
    width: min(420px, 100%);
    padding: 9px 14px;
    font-size: 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    background: var(--card);
  }
  .search input:focus { border-color: var(--brand); }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 0 24px 32px;
    max-width: 1080px;
    margin: 0 auto;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(31, 39, 51, .08);
    border-color: var(--brand);
  }
  .card svg { width: 36px; height: 36px; color: #333; transition: color .12s ease; }
  .card:hover svg { color: var(--hex, var(--brand)); }
  .card .slug { font-size: 12px; font-weight: 600; color: var(--text); }
  .card .title { font-size: 11px; color: var(--muted); }
  .empty { grid-column: 1 / -1; text-align: center; color: var(--muted); padding: 40px 0; }
  #toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%) translateY(20px);
    background: #1f2733;
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
  }
  #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>
<header>
  <h1>Prime Work 品牌图标库</h1>
  <p id="count"></p>
</header>
<div class="search"><input id="q" type="search" placeholder="搜索 slug 或品牌名" /></div>
<div class="grid" id="grid"></div>
<div id="toast"></div>
<script>
  const ICONS = __ICONS__;
  const grid = document.getElementById("grid");
  const countEl = document.getElementById("count");
  const toast = document.getElementById("toast");

  function render(list) {
    countEl.textContent = "共 " + list.length + " 个品牌图标，点击卡片复制 si:<slug>";
    if (!list.length) {
      grid.innerHTML = '<div class="empty">没有匹配的图标</div>';
      return;
    }
    grid.innerHTML = list.map((icon) => {
      const hex = icon.hex ? ("#" + icon.hex) : "var(--brand)";
      return '<div class="card" data-slug="' + icon.slug + '" style="--hex:' + hex + '" title="' + icon.title + '">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + icon.path + '"/></svg>' +
        '<span class="slug">si:' + icon.slug + '</span>' +
        '<span class="title">' + icon.title + '</span>' +
        '</div>';
    }).join("");
  }

  function copy(text) {
    const show = (msg) => {
      toast.textContent = msg;
      toast.classList.add("show");
      clearTimeout(show._t);
      show._t = setTimeout(() => toast.classList.remove("show"), 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => show("已复制 " + text), () => fallback());
    } else {
      fallback();
    }
    function fallback() {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); show("已复制 " + text); } catch (e) { show("复制失败，请手动复制"); }
      document.body.removeChild(ta);
    }
  }

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) copy(card.dataset.slug ? "si:" + card.dataset.slug : "");
  });

  document.getElementById("q").addEventListener("input", (e) => {
    const kw = e.target.value.trim().toLowerCase();
    render(kw ? ICONS.filter((i) => i.slug.includes(kw) || i.title.toLowerCase().includes(kw)) : ICONS);
  });

  render(ICONS);
</script>
</body>
</html>`;

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "../preview/index.html");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html.replace("__ICONS__", JSON.stringify(icons)), "utf8");
console.log(`已生成图标画廊（${icons.length} 个图标）→ ${outPath}`);
