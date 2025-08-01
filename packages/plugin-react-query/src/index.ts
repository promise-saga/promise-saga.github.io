import {
  DefaultError,
  FetchQueryOptions,
  Mutation,
  MutationOptions,
  Query,
  QueryClient,
  QueryKey,
} from '@tanstack/react-query';
import {SagaLowerEffectsScope, SagaPlugin} from '@promise-saga/core';

const bindToAbortController = (
  abortController: AbortController,
  ...abortSignals: AbortSignal[]
) => {
  const {abort} = abortController;

  for (const signal of abortSignals) {
    signal.addEventListener('abort', abort, {once: true});
    abortController.signal.addEventListener('abort', () => {
      signal.removeEventListener('abort', abort);
    }, {once: true});
  }
};

export type PluginConfig = {
  queryClient: QueryClient,
};

export const createPlugin = (
  {
    queryClient,
  }: PluginConfig,
): SagaPlugin<{
  queryFn: Query['fetch'],
  query: QueryClient['fetchQuery'],
  mutateFn: Mutation['execute'],
  mutate: Mutation['execute'],
}> => ({
  main: {
    queryFn: async function<
      TQueryFnData,
      TError = DefaultError,
      TData = TQueryFnData,
      TQueryKey extends QueryKey = QueryKey,
    >(
      this: SagaLowerEffectsScope,
      query: Query<TQueryFnData, TError, TData, TQueryKey>,
      ...args: Parameters<Query<TQueryFnData, TError, TData, TQueryKey>['fetch']>
    ) {
      this.throwIfCancelled();
      const result = await query.fetch(...args);
      this.throwIfCancelled();
      return result;
    },

    query: async function<
      TQueryFnData,
      TError = DefaultError,
      TData = TQueryFnData,
      TQueryKey extends QueryKey = QueryKey,
      TPageParam = never
    >(
      this: SagaLowerEffectsScope,
      options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    ) {
      this.throwIfCancelled();

      const {queryFn} = options;
      const result = await queryClient.fetchQuery({
        ...options,
        queryFn: typeof queryFn === 'function'
          ? ((config, ...rest) => {
            bindToAbortController(this.abortController, config.signal);
            return queryFn({...config, signal: this.abortController.signal}, ...rest);
          })
          : undefined,
      });

      this.throwIfCancelled();
      return result;
    },

    mutateFn: async function<
      TData = unknown,
      TError = DefaultError,
      TVariables = never[],
      TContext = unknown
    >(
      this: SagaLowerEffectsScope,
      mutation: Mutation<TData, TError, TVariables, TContext>,
      args?: TVariables,
    ) {
      this.throwIfCancelled();
      const result = await mutation.execute(args as TVariables);
      this.throwIfCancelled();
      return result;
    },

    mutate: async function<
      TData = unknown,
      TError = DefaultError,
      TVariables = never[],
      TContext = unknown
    >(
      this: SagaLowerEffectsScope,
      options: MutationOptions<TData, TError, TVariables, TContext>,
      args?: TVariables,
    ) {
      this.throwIfCancelled();

      const mutation = new Mutation<TData, TError, TVariables, TContext>({
        mutationId: 0,
        mutationCache: queryClient.getMutationCache(),
        options,
      });

      this.throwIfCancelled();
      const result = await mutation.execute(args as TVariables);
      this.throwIfCancelled();
      return result;
    },
  },
});
