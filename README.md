# prime-work-brand-icons

Prime Work 品牌图标库。为站点导航等场景提供第三方与公司自有品牌 logo，统一 `24×24` viewBox、单色 `fill="currentColor"` 的 SVG path，命名约定 `si:<slug>`。

## 安装

```bash
npm install prime-work-brand-icons
```

## 用法

```ts
import { brandIcons, type BrandIconSlug } from "prime-work-brand-icons";

// 取单个图标的 path，渲染为 24×24 单色 svg
const icon = brandIcons.github; // { slug, title, path, hex, source, attribution }

const slug: BrandIconSlug = "github";
```

在主项目 `Icon` 组件中按 `si:<slug>` 分支渲染：

```tsx
function BrandIcon({ slug }: { slug: BrandIconSlug }) {
  const icon = brandIcons[slug];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
```

## 图标命名

- 对外 slug 采用简洁、可读的命名，如 `github`、`chrome`、`nodejs`、`vue`、`aliyun`。
- 部分 slug 与 simple-icons 内部 slug 不同（如 `chrome → googlechrome`、`vue → vuedotjs`），已在生成脚本中维护映射。

## 数据来源与商标归属

- 图标 path 数据提取自 [simple-icons](https://github.com/simple-icons/simple-icons)（[CC0-1.0](https://creativecommons.org/publicdomain/zero/1.0/)）。
- 各品牌 logo 归其各自权利人所有，仅作展示用途，不代表任何背书。
- 新增图标：编辑 `scripts/export-icons.mjs` 的 `ICON_SELECTION` 映射后运行 `npm run export:icons`，再 `npm run build`。

## 开发

```bash
npm install
npm run export:icons   # 从 simple-icons 重新生成 src/icons.ts
npm run build          # tsup 输出 dist/ 下的 ESM + CJS + d.ts
```
