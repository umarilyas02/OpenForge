import {
  AlertTriangle,
  BarChart2,
  BarChart3,
  Building2,
  ChevronsUpDown,
  CircleDot,
  CircleUser,
  Columns3,
  CreditCard,
  DollarSign,
  Flag,
  GalleryHorizontalEnd,
  GitCommitHorizontal,
  Heading,
  HelpCircle,
  Image,
  LayoutGrid,
  LayoutTemplate,
  ListChecks,
  Megaphone,
  Minus,
  MousePointerClick,
  MoveHorizontal,
  PanelBottom,
  Quote,
  Shapes,
  Sparkle,
  Sparkles,
  Square,
  Star,
  StretchVertical,
  Table,
  Tag,
  TrendingUp,
  Type,
  User,
  Users,
  Video,
} from "lucide-react";

/** Palette-only metadata (grouping + icon) for the official CMS block catalog, keyed by block id. Not part of the block definition itself — the registry stays a pure block package, so this presentational mapping lives here in the admin app. */
const BLOCK_PALETTE_META = {
  "openforge-cms.heading": { category: "Basic", icon: Heading },
  "openforge-cms.gradient-heading": { category: "Basic", icon: Sparkles },
  "openforge-cms.rich-text": { category: "Basic", icon: Type },
  "openforge-cms.image": { category: "Basic", icon: Image },
  "openforge-cms.button": { category: "Basic", icon: MousePointerClick },
  "openforge-cms.icon-box": { category: "Basic", icon: Shapes },
  "openforge-cms.divider": { category: "Basic", icon: Minus },
  "openforge-cms.spacer": { category: "Basic", icon: StretchVertical },
  "openforge-cms.video": { category: "Basic", icon: Video },
  "openforge-cms.badge": { category: "Basic", icon: Tag },
  "openforge-cms.alert": { category: "Basic", icon: AlertTriangle },

  "openforge-cms.columns": { category: "Layout", icon: Columns3 },
  "openforge-cms.card": { category: "Layout", icon: CreditCard },
  "openforge-cms.hero": { category: "Layout", icon: LayoutTemplate },
  "openforge-cms.cta": { category: "Layout", icon: Megaphone },
  "openforge-cms.banner": { category: "Layout", icon: Flag },
  "openforge-cms.spotlight-card": { category: "Layout", icon: Sparkle },
  "openforge-cms.footer": { category: "Layout", icon: PanelBottom },

  "openforge-cms.carousel": { category: "Content", icon: GalleryHorizontalEnd },
  "openforge-cms.carousel-slide": { category: "Content", icon: Square },
  "openforge-cms.accordion": { category: "Content", icon: ChevronsUpDown },
  "openforge-cms.faq-item": { category: "Content", icon: HelpCircle },
  "openforge-cms.testimonial": { category: "Content", icon: Quote },
  "openforge-cms.team-member": { category: "Content", icon: User },
  "openforge-cms.pricing": { category: "Content", icon: DollarSign },
  "openforge-cms.stat": { category: "Content", icon: TrendingUp },
  "openforge-cms.stats-row": { category: "Content", icon: BarChart3 },
  "openforge-cms.logo-cloud": { category: "Content", icon: LayoutGrid },
  "openforge-cms.logo-item": { category: "Content", icon: Building2 },
  "openforge-cms.avatar-group": { category: "Content", icon: Users },
  "openforge-cms.avatar-item": { category: "Content", icon: CircleUser },
  "openforge-cms.feature-list": { category: "Content", icon: ListChecks },
  "openforge-cms.data-table": { category: "Content", icon: Table },

  "openforge-cms.timeline": { category: "Advanced", icon: GitCommitHorizontal },
  "openforge-cms.timeline-step": { category: "Advanced", icon: CircleDot },
  "openforge-cms.marquee-text": { category: "Advanced", icon: MoveHorizontal },
  "openforge-cms.rating": { category: "Advanced", icon: Star },
  "openforge-cms.progress": { category: "Advanced", icon: BarChart2 },
};

const CATEGORY_ORDER = ["Basic", "Layout", "Content", "Advanced"];

export function getBlockPaletteMeta(blockId) {
  return BLOCK_PALETTE_META[blockId] ?? { category: "Other", icon: Shapes };
}

/**
 * Group a filtered catalog into palette categories, in a fixed display
 * order (falling back to any unmapped block under "Other" at the end).
 *
 * @param {object[]} definitions
 */
export function groupBlocksByCategory(definitions) {
  const byCategory = new Map();
  for (const definition of definitions) {
    const { category } = getBlockPaletteMeta(definition.id);
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(definition);
  }

  const order = [
    ...CATEGORY_ORDER.filter((category) => byCategory.has(category)),
    ...[...byCategory.keys()].filter(
      (category) => !CATEGORY_ORDER.includes(category),
    ),
  ];

  return order.map((category) => ({
    category,
    items: byCategory.get(category),
  }));
}
