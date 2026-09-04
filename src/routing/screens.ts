import type { ComponentType } from 'react';
import type { ScreenId } from './routeIds';
import type { ChartDetailKey } from '@/screens/chartDetail/keys';

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

export interface ScreenMetaInput {
  readonly chartKey: ChartDetailKey;
}

export interface ScreenDefinition {
  readonly component: ComponentType;
  readonly meta: ScreenMeta | ((input: ScreenMetaInput) => ScreenMeta);
}

export const resolveMeta = (definition: ScreenDefinition, input: ScreenMetaInput): ScreenMeta =>
  typeof definition.meta === 'function' ? definition.meta(input) : definition.meta;

export type ScreenRegistry = Record<ScreenId, ScreenDefinition>;
