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

// 公司自有 logo（手动维护）。path 为 24×24 单色数据，来源为团队自有 SVG。
// prime-work 由 assets/logo-blue.svg（2048×2048）按 24/2048 缩放、圆点转 path 并转单色得到。
const COMPANY_ICONS = [
  {
    slug: "prime-work",
    title: "Prime Work",
    path: "M16.0615,7.0127c-2.4693-1.9955-5.8985-1.9018-8.2686,0.1999-2.6371,2.3386-2.902,6.4459-0.5684,9.1,2.8589,3.2514,7.9579,2.8903,10.2648-0.7863,1.1999-1.9121,1.3507-4.5431,0.2198-6.5225-0.0847-0.1482-0.3257-0.5481-0.4532-0.6367-0.0954-0.0663-0.2966,0.0778-0.3278,0.1646-0.0286,0.0793,0.1218,0.2399,0.1673,0.3121,1.2374,1.957,0.9955,4.6-0.3916,6.4126-2.0987,2.7427-6.1687,3.0936-8.5068,0.4467-1.6352-1.8513-1.8261-4.6716-0.4864-6.7446,1.9339-2.9924,6.0991-3.4762,8.7075-1.0546,0.1035,0.096,0.228,0.2561,0.3339,0.3341,0.095,0.0702,0.1649,0.0403,0.2522-0.0289,0.1417-0.1125,0.0911-0.1547-0.0006-0.2695-0.2618-0.3282-0.6157-0.6632-0.9422-0.927Z M12.0652 10.58a1.4415 1.4415 0 1 0 0 2.883a1.4415 1.4415 0 1 0 0 -2.883Z",
    hex: "01a9f3",
    source: "company",
    attribution: "原初智性 Prime Work",
  },
];

const bySlug = {};
for (const value of Object.values(simpleIcons)) {
  if (value && value.slug) bySlug[value.slug] = value;
}

const ATTRIBUTION = "simple-icons (CC0-1.0)";

const thirdPartyEntries = Object.entries(ICON_SELECTION).map(([publicSlug, sourceSlug]) => {
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

const companyEntries = COMPANY_ICONS.map((icon) => ({ publicSlug: icon.slug, item: icon }));

const entries = [...thirdPartyEntries, ...companyEntries];

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
// 第三方图标 path 来源：simple-icons（CC0-1.0）；公司自有 logo 由 COMPANY_ICONS 手动维护。
// 各品牌 logo 归其各自权利人所有，仅作展示用途。
// 新增第三方图标：修改 ICON_SELECTION；新增/修改公司 logo：修改 COMPANY_ICONS 后运行 npm run export:icons。

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
