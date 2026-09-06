import { KPI_DIRECTIONS, KPI_TONES } from '@/data/ui';
import { SEVERITIES } from '@/data/home';
import type { FieldReader } from '@/lib/firestore/parse';
import type {
  ActionSpec,
  ChartCopy,
  KpiSpec,
  LegendSpec,
  NoticeSpec,
  PageToken,
  PaginationSpec,
} from '@/data/ui';
import type { Severity } from '@/data/home';

/**
 * Readers for the shapes that repeat across the copy documents. Each takes a
 * FieldReader positioned on the containing object, so errors still name the
 * exact document and field.
 */

export const readKpis = (f: FieldReader, field: string): readonly KpiSpec[] =>
  f.objects(field, (k) => ({
    label: k.string('label'),
    value: k.string('value'),
    delta: k.optionalString('delta', ''),
    direction: k.oneOfOrEmpty('direction', KPI_DIRECTIONS),
    tone: k.oneOfOrEmpty('tone', KPI_TONES),
    graph: k.optionalBoolean('graph', false),
  }));

export const readLegend = (f: FieldReader, field: string): readonly LegendSpec[] =>
  f.objects(field, (l, index) => ({
    label: l.string('label'),
    color: l.string('color'),
    // Defaults to position, which is right whenever the legend is ordered the
    // same way as the data.
    series: l.optionalNumber('series', index),
  }));

export const readChartCopy = (f: FieldReader, field: string): ChartCopy =>
  f.object(field, (c) => ({
    title: c.string('title'),
    subtitle: c.optionalString('subtitle', ''),
  }));

export const readActions = (f: FieldReader, field: string): readonly ActionSpec[] =>
  f.objects(field, (a) => ({
    label: a.string('label'),
    icon: a.optionalString('icon', ''),
    message: a.string('message'),
  }));

/**
 * Page tokens arrive as strings so the Console shows one array of one type;
 * anything that is not the ellipsis marker has to be a number.
 */
export const readPagination = (f: FieldReader, field: string): PaginationSpec =>
  f.object(field, (p) => ({
    pages: p
      .strings('pages')
      .map<PageToken>((token) => (token === 'dots' ? 'dots' : Number(token))),
    active: p.number('active'),
  }));

/** Table rows of plain strings, used where a table is authored not computed. */
export const readRows = (f: FieldReader, field: string): readonly (readonly string[])[] => {
  const value = f.raw(field);
  if (value === undefined || value === null) return [];
  return f.objects(field, (row) => row.strings('cells'));
};

export const readNotice = (f: FieldReader, field: string): NoticeSpec =>
  f.object(field, (n) => ({
    severity: n.oneOf<Severity>('severity', SEVERITIES),
    icon: n.string('icon'),
    title: n.string('title'),
  }));
