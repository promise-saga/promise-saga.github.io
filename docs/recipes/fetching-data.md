# Fetching Data

Fetching data is done with the help of Fetch and Axios plugins.

### Fetch

Apply like this:

```ts
import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-fetch';

export const createSaga = createCreateSaga({plugin});
```

And use like this:
```ts
export const getPokemonData = createSaga(async function(pokemon: string) {
    const resp = await this.fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data: PokemonData = await resp.json();
    return data;
});
```

### Axios

Apply like this:
```ts
import {createCreateSaga} from '@promise-saga/core';
import {plugin} from '@promise-saga/plugin-axios';

export const createSaga = createCreateSaga({plugin});
```

And use like this:
```ts
export const getPokemonData = createSaga(async function(pokemon: string) {
    const resp = await this.get<PokemonData>(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    return resp.data;
});
```
