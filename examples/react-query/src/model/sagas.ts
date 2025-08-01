import {createSaga} from '../saga';

interface PokemonData {
  pokemonName: string;
}

let i = 0;

export const getPokemonData = createSaga(async function (pokemon: string, n: number) {
  return this.query({
    queryKey: ['pokemon', pokemon],
    queryFn: async ({signal}) => {
      const fetchLabel = `Test ${n}: fetched ${pokemon}`;
      console.time(fetchLabel);
      const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {signal});
      console.timeEnd(fetchLabel);
      this.throwIfCancelled();

      const parseLabel = `parsed ${pokemon}`;
      console.time(parseLabel);
      const data: PokemonData = await resp.json();
      console.timeEnd(parseLabel);

      return data;
    },
  });
});

export const startPokemonsRace = createSaga(async function (timeout: number, withCancel: boolean) {
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
