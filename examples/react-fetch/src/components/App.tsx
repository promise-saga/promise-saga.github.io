import {type ChangeEventHandler, useRef, useState} from 'react';
import {fetchAllPokemons, startPokemonsRace} from '../model/sagas';

export default function App() {
  const [withCancel, setWithCancel] = useState(false);
  const [timeoutValue, setTimeoutValue] = useState('10');
  const rangeRef = useRef<HTMLInputElement | null>(null);

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTimeoutValue(e.target.value);
  };

  const handleWithCancelChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setWithCancel(e.target.checked);
  };

  const startRace = () => {
    startPokemonsRace(Number(rangeRef.current?.value), withCancel);
  };

  return (
    <>
      <h3>Fetch Example</h3>
      <button onClick={startRace}>Start pokemons race</button>
      <div>
        <label>
          Cancel timeout:
          <input
            type="checkbox"
            checked={withCancel}
            onChange={handleWithCancelChange}
          />
          <input
            type="range"
            ref={rangeRef}
            min={0}
            max={100}
            value={timeoutValue}
            onChange={handleRangeChange}
            disabled={!withCancel}
          />
          <span>{timeoutValue}ms</span>
        </label>
      </div>
      <br />
      <button onClick={fetchAllPokemons}>Fetch all pokemons</button>
    </>
  );
}
