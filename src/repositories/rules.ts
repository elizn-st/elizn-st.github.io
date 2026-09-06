import { RULE_ENFORCEMENTS, RULE_STAGES, RULE_STATUSES } from '@/data/rules';
import type { Parser } from '@/hooks/useFirestore';
import type { Ordered } from './recommendations';
import type { PricingRule, RuleEnforcement, RuleStage, RuleStatus } from '@/data/rules';

/**
 * A rule as stored: its authored shape plus the document id, which is the
 * readable slug a customer sees in the Console and the stable key the table
 * renders against -- renaming a rule should not remount its row.
 */
export type RuleRecord = PricingRule & { readonly id: string };

export const RULES = 'rules';

/**
 * The guardrails the pricing engine applies before a recommendation reaches the
 * queue. One document per rule, so a customer edits a threshold on its own --
 * and because the whole Rules screen is derived from this collection, that one
 * edit moves the table, the stage counts, the coverage list, the binding bars
 * and every scorecard together.
 *
 * `stage`, `enforcement` and `status` are validated against the build's own
 * lists: they drive grouping and precedence, so a typo has to fail loudly
 * rather than quietly drop a rule out of its stage.
 */
export const parsePricingRule: Parser<Ordered<RuleRecord>> = (f, id) => ({
  id,
  order: f.number('order'),
  name: f.string('name'),
  note: f.optionalString('note', ''),
  icon: f.string('icon'),
  stage: f.oneOf<RuleStage>('stage', RULE_STAGES),
  scopes: f.strings('scopes'),
  threshold: f.string('threshold'),
  enforcement: f.oneOf<RuleEnforcement>('enforcement', RULE_ENFORCEMENTS),
  status: f.oneOf<RuleStatus>('status', RULE_STATUSES),
  bindings: f.number('bindings'),
  blocked: f.number('blocked'),
  owner: f.string('owner'),
  updated: f.string('updated'),
});
