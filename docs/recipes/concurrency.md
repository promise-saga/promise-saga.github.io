# Concurrency and Racing

Promise Saga replicates the functionality of the well-known [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) and [Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) for sagas.

While having a simple `getPokemonData` saga to test:
```ts
export const getPokemonData = createSaga(async function(pokemon: string) {
    const resp = await this.fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data: PokemonData = await resp.json();
    return data;
});
```

You can load many Pokémon concurrently with the [all](../api.md#all) effect:
```ts
export const fetchAllPokemons = createSaga(async function() {
    const [pikachu, raichu] = await this.all([
        getPokemonData('pikachu'),
        getPokemonData('raichu'),
    ]);
    console.log({pikachu, raichu});
});
```

Use the [race](../api.md#race) effect to finish one of the sagas and cancel the others with internal fetch requests:
```ts
export const startPokemonsRace = createSaga(async function(timeout: number, withCancel: boolean) {
    const [pikachu, raichu] = await this.race([
        getPokemonData('pikachu'),
        getPokemonData('raichu'),
    ]);
    console.log({pikachu, raichu});
});
```

Use [delay](../api.md#delay) and [take](../api.md#take) within race to perform a timeout for sagas racing:
```ts
import {createAction} from '@reduxjs/toolkit';

export const cancelAction = createAction('action/cancel');

export const startPokemonsRace = createSaga(async function(timeout: number, withCancel: boolean) {
    const [pikachu, raichu] = await this.race([
        getPokemonData('pikachu'),
        getPokemonData('raichu'),
        this.delay(500), // automatic cancel in 500 ms
        this.take(cancelAction), // manual cancel on action dispatch
    ]);
    console.log({pikachu, raichu});
});
```
