import type { ScreenId } from './routeIds';
import type { ScreenRegistry } from './screens';
import { HomeScreen, homeMeta } from '@/screens/HomeScreen';
import { QueueScreen, queueMeta } from '@/screens/QueueScreen';
import { DetailScreen, detailMeta } from '@/screens/DetailScreen';
import { SimulatorScreen, simulatorMeta } from '@/screens/SimulatorScreen';
import { ChatScreen, chatMeta } from '@/screens/ChatScreen';
import { HistoryScreen, historyMeta } from '@/screens/HistoryScreen';
import { ProfileScreen, profileMeta } from '@/screens/ProfileScreen';
import { RulesScreen, rulesMeta } from '@/screens/RulesScreen';
import { ReportsScreen, reportsMeta } from '@/screens/ReportsScreen';
import { ChartDetailScreen, chartDetailMeta } from '@/screens/chartDetail/ChartDetailScreen';
import {
  PricingPerformanceScreen,
  pricingPerformanceMeta,
} from '@/screens/dashboards/PricingPerformanceScreen';
import {
  CompetitorIntelligenceScreen,
  competitorIntelligenceMeta,
} from '@/screens/dashboards/CompetitorIntelligenceScreen';
import {
  ForecastAccuracyScreen,
  forecastAccuracyMeta,
} from '@/screens/dashboards/ForecastAccuracyScreen';
import { RevenueImpactScreen, revenueImpactMeta } from '@/screens/dashboards/RevenueImpactScreen';
import {
  CustomerBehaviourScreen,
  customerBehaviourMeta,
} from '@/screens/dashboards/CustomerBehaviourScreen';

/** Single source of truth for what `#/<route>` renders. */
export const SCREENS: ScreenRegistry = {
  home: { component: HomeScreen, meta: homeMeta },
  queue: { component: QueueScreen, meta: queueMeta },
  detail: { component: DetailScreen, meta: detailMeta },
  sim: { component: SimulatorScreen, meta: simulatorMeta },
  chat: { component: ChatScreen, meta: chatMeta },
  history: { component: HistoryScreen, meta: historyMeta },
  chartd: { component: ChartDetailScreen, meta: chartDetailMeta },
  profile: { component: ProfileScreen, meta: profileMeta },
  rules: { component: RulesScreen, meta: rulesMeta },
  reports: { component: ReportsScreen, meta: reportsMeta },
  c1: { component: PricingPerformanceScreen, meta: pricingPerformanceMeta },
  c2: { component: CompetitorIntelligenceScreen, meta: competitorIntelligenceMeta },
  c3: { component: ForecastAccuracyScreen, meta: forecastAccuracyMeta },
  c4: { component: RevenueImpactScreen, meta: revenueImpactMeta },
  c5: { component: CustomerBehaviourScreen, meta: customerBehaviourMeta },
};

export const isScreenId = (route: string): route is ScreenId =>
  Object.prototype.hasOwnProperty.call(SCREENS, route);
