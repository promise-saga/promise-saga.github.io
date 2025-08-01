import {runTests as runTestsCall} from './tests/call';
import {runTests as runTestsSpawn} from './tests/spawn';
import {runTests as runTestsExtraThis} from './tests/extraThis';
import {TestsConfig} from './types';

export const _runTests = (config: TestsConfig) => {
  runTestsCall(config);
  runTestsSpawn(config);
  runTestsExtraThis(config);
};
