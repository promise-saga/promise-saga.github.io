import {createSaga} from '../saga';

interface PokemonData {
  pokemonName: string;
}

let i = 0;

export const getPokemonData = createSaga(async function (pokemon: string, n: number) {
  const fetchLabel = `Test ${n}: fetched ${pokemon}`;
  console.time(fetchLabel);

  const resp = await this.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  console.timeEnd(fetchLabel);
  return resp.data;
});

export const startPokemonsRace = createSaga(async function (timeout = 0, withCancel = false) {
  const n = ++i;
  console.log(`Test ${n}: start race ${withCancel ? `with timeout: ${timeout}ms` : ''}`);
  const [pikachu, raichu] = await this.race([
    getPokemonData('pikachu', n),
    getPokemonData('raichu', n),
    withCancel ? this.delay(timeout) : undefined,
  ], withCancel);
  console.log({pikachu, raichu});
});

export const fetchAllPokemons = createSaga(async function () {
  const n = ++i;
  console.log(`Test ${n}: fetch all`);
  const [pikachu, raichu] = await this.all([
    getPokemonData('pikachu', n),
    getPokemonData('raichu', n),
  ]);
  console.log({pikachu, raichu});
});
