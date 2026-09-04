import { readFields } from './parse';
import type { FieldReader } from './parse';
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

export interface ConverterSpec<T> {
  /** Build the domain object from a validating reader. Throws DocumentShapeError. */
  readonly parse: (fields: FieldReader, id: string) => T;
  /**
   * Only needed for collections the client writes to (per-user state). Org
   * data is Console- and Admin-SDK-authored, so leaving this out makes an
   * accidental client write fail loudly at the call site rather than at the
   * rules boundary.
   */
  readonly serialize?: (value: T) => DocumentData;
}

export function createConverter<T>({
  parse,
  serialize,
}: ConverterSpec<T>): FirestoreDataConverter<T> {
  return {
    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      return parse(readFields(snapshot.ref.path, snapshot.data(options)), snapshot.id);
    },
    toFirestore(value: T): DocumentData {
      if (!serialize) {
        throw new Error(
          'This converter is read-only: the collection is authored in the Firebase ' +
            'Console or by the seed script. Add `serialize` to write to it from the client.',
        );
      }
      return serialize(value);
    },
  };
}
