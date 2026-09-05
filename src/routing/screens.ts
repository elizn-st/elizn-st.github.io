import type { ComponentType } from 'react';
import type { ScreenId } from './routeIds';
import type { ChartDetailKey } from '@/screens/chartDetail/keys';
import type { SeriesDoc } from '@/repositories/analytics';
import type { BoardsDoc, ChartDetailsDoc } from '@/repositories/boards';
import type { NavigationDoc } from '@/repositories/content';
import type { BreadcrumbId } from '@/data/navigation';

export interface ScreenMeta {
  /** Breadcrumb section, or `null` for top-level screens. */
  readonly section: string | null;
  readonly page: string;
  /** Content column width in pixels, applied as `--cmax`. */
  readonly width: number;
  /** Shows the conversation history rail. */
  readonly chatSidebar?: boolean;
  /** Pins content to the bottom of the viewport (chat). */
  readonly bottom?: boolean;
}

/**
 * What resolving a screen's metadata needs.
 *
 * Breadcrumb labels are copy, so they come from Firestore like the rest --
 * which means metadata cannot be a module constant any more. Widths and the
 * chat/bottom layout flags stay in code: they are layout, not content.
 */
export interface ScreenMetaInput {
  readonly chartKey: ChartDetailKey;
  readonly series: SeriesDoc;
  readonly navigation: NavigationDoc;
  readonly boards: BoardsDoc;
  readonly chartDetails: ChartDetailsDoc;
}

/** The fixed section/page pair for a screen, with '' meaning "top level". */
export const breadcrumb = (
  navigation: NavigationDoc,
  id: BreadcrumbId,
): { readonly section: string | null; readonly page: string } => {
  const crumb = navigation.copy.breadcrumbs[id];
  return { section: crumb.section || null, page: crumb.page };
};

export interface ScreenDefinition {
  readonly component: ComponentType;
  readonly meta: ScreenMeta | ((input: ScreenMetaInput) => ScreenMeta);
}

export const resolveMeta = (definition: ScreenDefinition, input: ScreenMetaInput): ScreenMeta =>
  typeof definition.meta === 'function' ? definition.meta(input) : definition.meta;

export type ScreenRegistry = Record<ScreenId, ScreenDefinition>;
