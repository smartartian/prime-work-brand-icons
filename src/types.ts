export type BrandIconSource = "third-party" | "company";

export interface BrandIcon {
  /** 图标唯一标识，与 `si:<slug>` 中的 slug 一致 */
  slug: string;
  /** 品牌展示名 */
  title: string;
  /** 24×24 viewBox、单色 fill 的 SVG path d 数据 */
  path: string;
  /** 品牌主色（不含 #），可选，仅用于预览站着色 */
  hex?: string;
  /** 图标来源：第三方 / 公司自有 */
  source: BrandIconSource;
  /** 图标出处 / 版权归属说明 */
  attribution?: string;
}
