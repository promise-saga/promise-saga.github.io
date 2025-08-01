export type ArrayOr<T> = T | T[];

export const toArray = <T>(arg: ArrayOr<T>): T[] => (
  Array.isArray(arg) ? arg : [arg]
);
