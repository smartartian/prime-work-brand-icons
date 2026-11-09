---
name: prime-work-brand-icons
description: 使用或维护 Prime Work 品牌图标库（prime-work-brand-icons npm 包）时的指南。当需要读取品牌图标数据（brandIcons / BrandIconSlug）、在主项目按 si:<slug> 渲染品牌 logo、新增或修改品牌图标、或理解该包目录结构与构建方式时使用。
---

# Prime Work 品牌图标库

独立的品牌图标 npm 包，为站点导航等场景提供第三方与公司自有品牌 logo。所有图标统一 `24×24` viewBox、单色 `fill="currentColor"`，命名约定 `si:<slug>`。

## 何时使用

- 主项目（prime-workbench）需要接入品牌图标（`Icon` 组件 `si:` 分支、`IconPicker` 品牌分组、域名匹配）。
- 需要新增/修改/删除某个品牌图标。
- 需要理解本包的数据模型、导出、构建产物。

## 数据模型与导出

包名 `prime-work-brand-icons`，入口导出：

```ts
import { brandIcons, type BrandIconSlug, type BrandIcon, type BrandIconSource } from "prime-work-brand-icons";
```

- `brandIcons`：`Record<BrandIconSlug, BrandIcon>`，key 即 slug（如 `github`、`chrome`、`vue`）。
- `BrandIcon`：`{ slug: string; title: string; path: string; hex?: string; source: "third-party" | "company"; attribution?: string }`。
- `path` 是 `24×24` 单色 SVG 的 path `d` 数据，直接放入 `<svg viewBox="0 0 24 24" fill="currentColor"><path d={...} /></svg>` 渲染。
- `BrandIconSlug` 是精确联合类型（`keyof typeof brandIcons`），编译期校验 slug 合法。

## 使用方式

渲染单个品牌图标：

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

主项目接入时，`Icon` 组件新增 `si:` 分支，`IconName` 扩展 `` `si:${BrandIconSlug}` ``。

## 已收录图标（36 个）

`github gitlab gitee figma framer sketch notion slack telegram discord chrome firefox safari aliyun googlecloud docker kubernetes nginx jenkins grafana prometheus mysql postgresql redis mongodb typescript javascript python go rust java nodejs npm vite react vue`

**simple-icons 未收录、暂缺**：`feishu dingtalk wecom tencentcloud aws azure edge`（需公司提供官方 logo SVG 或明确替代来源后补充）。

## 命名映射（对外 slug → simple-icons 内部 slug）

对外用简洁名，数据源 simple-icons 内部名不同，映射在生成脚本中维护：

| 对外 slug | simple-icons slug |
| --- | --- |
| chrome | googlechrome |
| aliyun | alibabacloud |
| nodejs | nodedotjs |
| vue | vuedotjs |
| java | openjdk |

其余 slug 与 simple-icons 一致。

## 新增 / 修改图标

1. 编辑 `scripts/export-icons.mjs` 的 `ICON_SELECTION` 映射（对外 slug → simple-icons slug）。
2. 运行 `npm run export:icons` 重新生成 `src/icons.ts`。
3. 运行 `npm run build` 生成 `dist/` 产物。
4. 更新 `CHANGELOG.md`；若涉及缺失品牌需同步补充来源说明。

数据来源：`simple-icons`（CC0-1.0），各品牌 logo 归其各自权利人所有，仅作展示用途。

## 目录结构

```
prime-work-brand-icons/
├── package.json            # name=prime-work-brand-icons，ESM+CJS+d.ts，sideEffects=false
├── tsconfig.json
├── tsup.config.ts          # tsup，输出 .mjs/.cjs/.d.ts/.d.cts
├── scripts/export-icons.mjs  # 从 simple-icons 生成 src/icons.ts（数据源唯一入口）
├── src/
│   ├── index.ts            # 导出 brandIcons / BrandIconSlug / 类型
│   ├── types.ts            # BrandIcon / BrandIconSource
│   └── icons.ts            # 图标表（自动生成，勿手改）
└── dist/                   # 构建产物（gitignore）
```

## 构建

```bash
npm install
npm run export:icons   # 从 simple-icons 重新生成 src/icons.ts
npm run build          # tsup 输出 dist/ 下的 ESM(.mjs) + CJS(.cjs) + 类型声明
```
