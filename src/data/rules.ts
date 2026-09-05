export interface RulesCopy {
  readonly title: string;
  readonly body: string;
  readonly backLabel: string;
}

/** The Rules screen is a placeholder this cycle: a heading, a note and a way back. */
export const RULES_COPY: RulesCopy = {
  title: 'Pricing rules',
  body: 'Guardrails, floors and ceilings live here. The Finance role has read-only access this cycle.',
  backLabel: 'Back to home',
};
