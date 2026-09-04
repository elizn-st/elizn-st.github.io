type ClassValue = string | false | null | undefined;

/** Minimal className joiner — keeps conditional class lists readable in JSX. */
export const cx = (...values: ClassValue[]): string => values.filter(Boolean).join(' ');
