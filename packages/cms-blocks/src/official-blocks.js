import { columnsBlock } from "./blocks/columns.jsx";
import { ctaBlock } from "./blocks/cta.jsx";
import { footerBlock } from "./blocks/footer.jsx";
import { heroBlock } from "./blocks/hero.jsx";
import { imageBlock } from "./blocks/image.jsx";
import { richTextBlock } from "./blocks/rich-text.jsx";

export const OFFICIAL_CMS_BLOCKS = Object.freeze([
  heroBlock,
  richTextBlock,
  imageBlock,
  ctaBlock,
  columnsBlock,
  footerBlock,
]);
