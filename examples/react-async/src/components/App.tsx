import {useState} from 'react';
import {createSaga} from '@promise-saga/core';
import {useSaga} from '@promise-saga/plugin-react';

const SagaCheckbox = ({flow}: {flow: ReturnType<typeof useSaga>}) => (
  <input type="checkbox" onChange={flow.toggle} checked={flow.isRunning} />
);

const sum = createSaga(async function(a: number, b: number) {
  await this.delay(3000);
  return a + b;
});

export default function App() {
  const sumFlow = useSaga(sum, 1, 2);

  const [num, setNum] = useState(0);
  const intervalFlow = useSaga(createSaga(async function() {
    while (true) {
      await this.delay(1000);
      setNum(num => num + 1);
    }
  }));

  return (
    <>
      <div>
        <label>
          <SagaCheckbox flow={intervalFlow} />
          Interval
        </label>
      </div>

      <div>Interval: {num}</div>
      <div>
        Sum: 1 + 2 = {sumFlow.result}
        {sumFlow.isDone && ' (done in 3 seconds)'}
      </div>
    </>
  );
}
