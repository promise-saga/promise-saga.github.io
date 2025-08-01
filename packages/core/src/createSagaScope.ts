import {AnyRecord, SagaNodeScope, SagaPlugin, SagaScope} from './types';
import {throwIfCancelled} from './effects/throwIfCancelled';
import {observable} from './effects/observable';
import {cancellable} from './effects/cancellable';
import {cancel, cancelled} from './effects/canceling';
import {
  all,
  call,
  callFn,
  callPromise,
  delay,
  fork,
  race,
  spawn,
} from './effects/lower';

export const createSagaScope = <
  S1 extends AnyRecord,
  S2 extends AnyRecord,
  S3 extends AnyRecord,
>(
  nodeScope: SagaNodeScope,
  plugin?: SagaPlugin<S1, S2, S3>,
): SagaScope & S1 & S2 & S3 => {
  const lowerEffectsScope = {
    ...nodeScope,
    throwIfCancelled: throwIfCancelled.bind(nodeScope),
    observable: observable.bind(nodeScope) as typeof observable,
    cancellable: cancellable.bind(nodeScope) as typeof cancellable,
    ...plugin?.main as S1,
  };

  const higherEffectsScope = {
    ...lowerEffectsScope,
    delay: delay.bind(lowerEffectsScope),
    call: call.bind(lowerEffectsScope) as typeof call,
    callFn: callFn.bind(lowerEffectsScope) as typeof callFn,
    callPromise: callPromise.bind(lowerEffectsScope) as typeof callPromise,
    fork: fork.bind(lowerEffectsScope) as typeof fork,
    spawn: spawn.bind(lowerEffectsScope) as typeof spawn,
    all: all.bind(lowerEffectsScope) as typeof all,
    race: race.bind(lowerEffectsScope) as typeof race,
    ...plugin?.lower as S2,
  };

  return {
    ...higherEffectsScope,
    cancel: cancel.bind(nodeScope),
    cancelled: cancelled.bind(nodeScope),
    ...plugin?.higher as S3,
  };
};
