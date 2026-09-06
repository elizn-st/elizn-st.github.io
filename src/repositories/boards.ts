import { SEVERITIES } from '@/data/home';
import { KPI_DIRECTIONS } from '@/data/ui';
import { DASHBOARD_TAB_IDS } from '@/data/navigation';
import { BOARD_METRIC_IDS } from '@/data/boardMetrics';
import { CHART_METRIC_IDS } from '@/data/chartMetrics';
import { RANGE_IDS } from '@/data/ranges';
import { ROUTE_IDS } from '@/routing/routeIds';
import { CHART_DETAIL_KEYS } from '@/screens/chartDetail/keys';
import { readChartCopy, readLegend, readRows } from './ui';
import type { Parser } from '@/hooks/useFirestore';
import type { FieldReader } from '@/lib/firestore/parse';
import type { BoardCopy, BoardsCopy, NoticeSpec } from '@/data/boards';
import type { BoardKpiSpec, BoardMetricId } from '@/data/boardMetrics';
import type { ChartMetricId } from '@/data/chartMetrics';
import type { RangeId, RangeOption } from '@/data/ranges';
import type { ChartDetailCopy, ChartDetailsCopy, ChartStatSpec } from '@/data/chartDetails';
import type { DashboardTabId } from '@/data/navigation';
import type { Severity } from '@/data/home';
import type { ChartDetailKey } from '@/screens/chartDetail/keys';
import type { RouteId } from '@/routing/routeIds';

/**
 * `content/boards` and `content/chartDetails`: the dashboards' copy, keyed by
 * tab and by chart.
 *
 * Both are keyed maps rather than arrays, because the screens look their entry
 * up by a compile-time key. The keys are validated against the build's own
 * lists, so a renamed key in the Console fails with a named field rather than
 * rendering an undefined board.
 */

/**
 * A scorecard names a metric rather than carrying a figure: the number, its
 * delta and its colour are computed from the weeks the range control selects.
 * An unknown metric id fails here rather than rendering a blank card.
 */
const readBoardKpis = (f: FieldReader, field: string): readonly BoardKpiSpec[] =>
  f.objects(field, (k) => ({
    label: k.string('label'),
    metric: k.oneOf<BoardMetricId>('metric', BOARD_METRIC_IDS),
    note: k.optionalString('note', ''),
    graph: k.optionalBoolean('graph', false),
  }));

/** Only the button's label is copy; its id decides how many weeks it selects. */
const readRangeOptions = (f: FieldReader, field: string): readonly RangeOption[] =>
  f.objects(field, (o) => ({
    id: o.oneOf<RangeId>('id', RANGE_IDS),
    label: o.string('label'),
  }));

const readNotices = (f: FieldReader): readonly NoticeSpec[] =>
  f.objects('notices', (n) => ({
    severity: n.oneOf<Severity>('severity', SEVERITIES),
    icon: n.string('icon'),
    title: n.string('title'),
  }));

const readBoard = (f: FieldReader, key: string): BoardCopy =>
  f.object(key, (b) => ({
    title: b.string('title'),
    subtitle: b.string('subtitle'),
    kpis: readBoardKpis(b, 'kpis'),
    chart: b.object('chart', (c) => ({
      copy: readChartCopy(c, 'copy'),
      legend: readLegend(c, 'legend'),
      seriesNames: c.strings('seriesNames'),
    })),
    columns: b.strings('columns'),
    sectionTitles: b.strings('sectionTitles'),
    notices: readNotices(b),
  }));

export interface BoardsDoc {
  readonly copy: BoardsCopy;
}

export const parseBoards: Parser<BoardsDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    section: c.string('section'),
    exportLabel: c.string('exportLabel'),
    exportIcon: c.string('exportIcon'),
    exportMessage: c.string('exportMessage'),
    rangeOptions: readRangeOptions(c, 'rangeOptions'),
    defaultRange: c.oneOf<RangeId>('defaultRange', RANGE_IDS),
    expandLabel: c.string('expandLabel'),
    boards: c.object('boards', (all) => {
      const boards = {} as Record<DashboardTabId, BoardCopy>;
      for (const id of DASHBOARD_TAB_IDS) boards[id] = readBoard(all, id);
      return boards;
    }),
  })),
});

const readStats = (f: FieldReader): readonly ChartStatSpec[] =>
  f.objects('stats', (s) => ({
    label: s.string('label'),
    // '' means the figure is authored because it does not vary by window.
    metric: s.oneOfOrEmpty<ChartMetricId>('metric', CHART_METRIC_IDS),
    value: s.optionalString('value', ''),
    delta: s.optionalString('delta', ''),
    direction: s.oneOfOrEmpty('direction', KPI_DIRECTIONS),
  }));

const readChartDetail = (f: FieldReader, key: string): ChartDetailCopy =>
  f.object(key, (d) => ({
    section: d.string('section'),
    title: d.string('title'),
    subtitle: d.string('subtitle'),
    back: d.oneOf<RouteId>('back', ROUTE_IDS),
    stats: readStats(d),
    legend: readLegend(d, 'legend'),
    columns: d.strings('columns'),
    rows: readRows(d, 'rows'),
    notes: d.strings('notes'),
  }));

export interface ChartDetailsDoc {
  readonly copy: ChartDetailsCopy;
}

export const parseChartDetails: Parser<ChartDetailsDoc> = (f) => ({
  copy: f.object('copy', (c) => ({
    rangeOptions: readRangeOptions(c, 'rangeOptions'),
    defaultRange: c.oneOf<RangeId>('defaultRange', RANGE_IDS),
    exportLabel: c.string('exportLabel'),
    exportIcon: c.string('exportIcon'),
    exportMessage: c.string('exportMessage'),
    backPrefix: c.string('backPrefix'),
    dataTitle: c.string('dataTitle'),
    notesTitle: c.string('notesTitle'),
    charts: c.object('charts', (all) => {
      const charts = {} as Record<ChartDetailKey, ChartDetailCopy>;
      for (const key of CHART_DETAIL_KEYS) charts[key] = readChartDetail(all, key);
      return charts;
    }),
  })),
});
