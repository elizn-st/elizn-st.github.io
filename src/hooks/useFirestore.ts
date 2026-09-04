import { useEffect, useRef, useState } from 'react';
import { onSnapshot } from 'firebase/firestore';
import { DocumentShapeError, readFields } from '@/lib/firestore/parse';
import type { DependencyList } from 'react';
import type { DocumentData, DocumentReference, Query } from 'firebase/firestore';
import type { FieldReader } from '@/lib/firestore/parse';

export type LoadStatus = 'loading' | 'ready' | 'error';

export interface CollectionState<T> {
  readonly status: LoadStatus;
  /** Empty until `ready`, so screens can render without null-checking. */
  readonly data: readonly T[];
  /**
   * Documents that failed validation and were left out. One malformed edit in
   * the Console should cost you that row, not the whole screen -- so these are
   * reported alongside the good data rather than thrown.
   */
  readonly skipped: readonly DocumentShapeError[];
  readonly error: Error | null;
}

export interface DocumentState<T> {
  readonly status: LoadStatus;
  readonly data: T | null;
  /** True when the listener is attached but the document does not exist. */
  readonly missing: boolean;
  readonly error: Error | null;
}

export type Parser<T> = (fields: FieldReader, id: string) => T;

const toError = (cause: unknown): Error =>
  cause instanceof Error ? cause : new Error(String(cause));

/**
 * Live view of a query. Uses `onSnapshot`, so a document edited in the Firebase
 * Console appears in the running app within a second, with no reload.
 *
 * `build` is called inside the effect and `deps` is the effect's dependency
 * list -- pass the values the query is derived from (a cycle id, a status
 * filter), not the query object. Rebuilding a `Query` on every render and
 * depending on its identity is the classic way to get an infinite
 * resubscribe loop; keying on primitives avoids it.
 */
export function useFirestoreCollection<T>(
  build: () => Query<DocumentData>,
  parse: Parser<T>,
  deps: DependencyList,
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    status: 'loading',
    data: [],
    skipped: [],
    error: null,
  });

  // Held in refs so a fresh closure on each render does not tear down the
  // listener; the effect always reads the current pair.
  const buildRef = useRef(build);
  const parseRef = useRef(parse);
  buildRef.current = build;
  parseRef.current = parse;

  useEffect(() => {
    setState({ status: 'loading', data: [], skipped: [], error: null });

    const unsubscribe = onSnapshot(
      buildRef.current(),
      (snapshot) => {
        const data: T[] = [];
        const skipped: DocumentShapeError[] = [];

        for (const document of snapshot.docs) {
          try {
            data.push(
              parseRef.current(readFields(document.ref.path, document.data()), document.id),
            );
          } catch (cause) {
            if (cause instanceof DocumentShapeError) skipped.push(cause);
            else throw cause;
          }
        }

        if (skipped.length) {
          console.warn(
            `[firestore] skipped ${skipped.length} malformed document(s):\n` +
              skipped.map((e) => `  • ${e.message}`).join('\n'),
          );
        }

        setState({ status: 'ready', data, skipped, error: null });
      },
      (cause) => setState({ status: 'error', data: [], skipped: [], error: toError(cause) }),
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see doc comment
  }, deps);

  return state;
}

/** Live view of a single document. Same contract as useFirestoreCollection. */
export function useFirestoreDoc<T>(
  build: () => DocumentReference<DocumentData>,
  parse: Parser<T>,
  deps: DependencyList,
): DocumentState<T> {
  const [state, setState] = useState<DocumentState<T>>({
    status: 'loading',
    data: null,
    missing: false,
    error: null,
  });

  const buildRef = useRef(build);
  const parseRef = useRef(parse);
  buildRef.current = build;
  parseRef.current = parse;

  useEffect(() => {
    setState({ status: 'loading', data: null, missing: false, error: null });

    const unsubscribe = onSnapshot(
      buildRef.current(),
      (snapshot) => {
        if (!snapshot.exists()) {
          setState({ status: 'ready', data: null, missing: true, error: null });
          return;
        }
        try {
          const data = parseRef.current(
            readFields(snapshot.ref.path, snapshot.data()),
            snapshot.id,
          );
          setState({ status: 'ready', data, missing: false, error: null });
        } catch (cause) {
          setState({ status: 'error', data: null, missing: false, error: toError(cause) });
        }
      },
      (cause) => setState({ status: 'error', data: null, missing: false, error: toError(cause) }),
    );

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see doc comment
  }, deps);

  return state;
}
