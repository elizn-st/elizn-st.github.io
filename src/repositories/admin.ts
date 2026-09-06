import { ACCOUNT_STATUSES, PORTAL_ROLES } from '@/data/admin';
import type { Parser } from '@/hooks/useFirestore';
import type { Ordered } from './recommendations';
import type { AccountStatus, Person, PortalRole } from '@/data/admin';

export const PEOPLE = 'people';

/**
 * A directory entry as stored: the person plus the document id, which is the
 * readable slug a customer sees in the Console.
 */
export type PersonRecord = Person & { readonly id: string };

/**
 * `role` and `status` are validated against the build's own lists: they drive
 * filtering, the role headcount and which pill is drawn, so a Console typo has
 * to fail loudly rather than quietly drop somebody out of the directory.
 *
 * `portalAccess` and `admin` mirror the custom claims on the Firebase Auth
 * account. For anyone who has actually signed up, the seed overwrites them with
 * the account's real claims -- this document is a readable copy of the truth,
 * not the truth itself, which lives in the token.
 */
export const parsePerson: Parser<Ordered<PersonRecord>> = (f, id) => ({
  id,
  order: f.number('order'),
  name: f.string('name'),
  email: f.string('email'),
  role: f.oneOf<PortalRole>('role', PORTAL_ROLES),
  department: f.string('department'),
  portalAccess: f.boolean('portalAccess'),
  admin: f.boolean('admin'),
  status: f.oneOf<AccountStatus>('status', ACCOUNT_STATUSES),
  // Empty for somebody who was invited and has never signed in.
  lastActive: f.optionalString('lastActive', ''),
  invitedOn: f.string('invitedOn'),
  signedUp: f.optionalBoolean('signedUp', false),
});
