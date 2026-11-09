// 从 simple-icons（CC0-1.0）提取品牌图标 path，生成 src/icons.ts。
// 运行：npm run export:icons
// 新增图标：在 ICON_SELECTION 中追加「对外 slug → simple-icons slug」映射后重跑即可。

import * as simpleIcons from "simple-icons";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// 对外 slug → simple-icons 内部 slug
// 对外 slug 采用简洁、可读的命名，便于站点导航按域名匹配。
const ICON_SELECTION = {
  // 代码托管
  github: "github",
  gitlab: "gitlab",
  gitee: "gitee",
  // 设计
  figma: "figma",
  framer: "framer",
  sketch: "sketch",
  // 协作办公
  notion: "notion",
  slack: "slack",
  telegram: "telegram",
  discord: "discord",
  // 浏览器
  chrome: "googlechrome",
  firefox: "firefox",
  safari: "safari",
  // 云厂商
  aliyun: "alibabacloud",
  googlecloud: "googlecloud",
  // 容器 / 运维
  docker: "docker",
  kubernetes: "kubernetes",
  nginx: "nginx",
  jenkins: "jenkins",
  grafana: "grafana",
  prometheus: "prometheus",
  // 数据库
  mysql: "mysql",
  postgresql: "postgresql",
  redis: "redis",
  mongodb: "mongodb",
  // 语言 / 工具
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  go: "go",
  rust: "rust",
  java: "openjdk",
  nodejs: "nodedotjs",
  npm: "npm",
  vite: "vite",
  react: "react",
  vue: "vuedotjs",
};

// simple-icons 中暂无收录，后续通过公司自有或补充来源维护：
// feishu / dingtalk / wecom / tencentcloud / aws / azure / edge

const bySlug = {};
for (const value of Object.values(simpleIcons)) {
  if (value && value.slug) bySlug[value.slug] = value;
}

const ATTRIBUTION = "simple-icons (CC0-1.0)";

const entries = Object.entries(ICON_SELECTION).map(([publicSlug, sourceSlug]) => {
  const icon = bySlug[sourceSlug];
  if (!icon) {
    throw new Error(`simple-icons 中找不到 slug: ${sourceSlug}（对外 ${publicSlug}）`);
  }
  const item = {
    slug: publicSlug,
    title: icon.title,
    path: icon.path,
    hex: icon.hex,
    source: "third-party",
    attribution: ATTRIBUTION,
  };
  return { publicSlug, item };
});

const body = entries
  .map(({ publicSlug, item }) => {
    return `  ${JSON.stringify(publicSlug)}: {
    slug: ${JSON.stringify(item.slug)},
    title: ${JSON.stringify(item.title)},
    path: ${JSON.stringify(item.path)},
    hex: ${JSON.stringify(item.hex)},
    source: ${JSON.stringify(item.source)},
    attribution: ${JSON.stringify(item.attribution)},
  },`;
  })
  .join("\n");

const header = `// 本文件由 scripts/export-icons.mjs 自动生成，请勿手动编辑。
// 图标 path 来源：simple-icons（CC0-1.0）。各品牌 logo 归其各自权利人所有，仅作展示用途。
// 新增图标：修改 scripts/export-icons.mjs 的 ICON_SELECTION 后运行 npm run export:icons。

import type { BrandIcon } from "./types";

export const brandIcons = {
`;

const footer = `} as const satisfies Record<string, BrandIcon>;

export type BrandIconSlug = keyof typeof brandIcons;
`;

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), "../src/icons.ts");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, header + body + "\n" + footer, "utf8");
console.log(`已生成 ${entries.length} 个品牌图标 → ${outPath}`);
