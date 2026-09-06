/**
 * The signed-in person's own details, stored per user at `users/{uid}`.
 *
 * Name and email are not here: they come from Firebase Auth, which is where
 * the account actually lives. This document carries only what Auth has no
 * field for -- the organisational details a customer would maintain -- so
 * there is one place per fact and no copy to keep in step.
 *
 * `initials` is stored rather than derived: "Aisha Al-Khayyat" yields "AA" by
 * any simple rule, and the avatar reads "AK".
 */
export interface UserProfile {
  readonly initials: string;
  readonly jobTitle: string;
  readonly department: string;
  /** Third segment of the profile headline, after department and job title. */
  readonly focus: string;
  readonly employeeId: string;
  readonly location: string;
  /**
   * Report ids this person has chosen to receive. The one thing on the portal
   * a reviewer owns and writes for themselves -- everything else about a
   * report's distribution belongs to Admin.
   */
  readonly reportSubscriptions: readonly string[];
}

/** Seeded for the reviewer the portal was built around. */
export const USER_PROFILE: UserProfile = {
  initials: 'AK',
  jobTitle: 'Senior Analyst',
  department: 'Finance',
  focus: 'Pricing governance',
  employeeId: 'Employee ID 40 128',
  location: 'Dubai, GST +4',
  // Seeded with the cycle report, which Profile already offers as a
  // notification preference: "Weekly report - Every Monday at 08:00 GST".
  reportSubscriptions: ['weekly-pricing-cycle-report'],
};

/** The account this profile is seeded against. */
export const SEED_USER_EMAIL = 'aisha.alkhayyat@eand.com';

/** Auth has no display name until one is set, so the seed sets this. */
export const SEED_USER_DISPLAY_NAME = 'Aisha Al-Khayyat';
