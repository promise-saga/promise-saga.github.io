import {AnyRecord, SagaPlugin} from '../types';

type OptionalPropertyNames<T> =
  {[K in keyof T]-?: ({} extends {[P in K]: T[K]} ? K : never)}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
  {[P in K]: L[P] | Exclude<R[P], undefined>};

type Id<T> = T extends infer U ? {[K in keyof U]: U[K]} : never;

type SpreadTwo<L, R> = Id<
  & Pick<L, Exclude<keyof L, keyof R>>
  & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
  & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
  & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ?
  SpreadTwo<L, Spread<R>> : unknown;

export const merge = <A extends (AnyRecord | undefined)[]>(...a: A) => (
  Object.assign({}, ...a) as Spread<A>
);

export const mergePlugins = <A extends SagaPlugin[]>(...plugins: A) => ({
  main: merge<{[P in keyof A]: A[P]['main']}>(...plugins.map(plugin => plugin.main) as {[P in keyof A]: A[P]['main']}),
  lower: merge<{[P in keyof A]: A[P]['lower']}>(...plugins.map(plugin => plugin.lower) as {[P in keyof A]: A[P]['lower']}),
  higher: merge<{[P in keyof A]: A[P]['higher']}>(...plugins.map(plugin => plugin.higher) as {[P in keyof A]: A[P]['higher']}),
});
