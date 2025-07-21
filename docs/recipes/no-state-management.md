# No State Management?

Then use `default` plugin. Suppose you're making a `SearchBlock` component with an `input type="text"` search field and quite expensive search logic behind it. Obviously, taking search text as an input should be debounced. For example:

```tsx
import React, {useState} from 'react';
import {createAction} from '@promise-saga/plugin-default';
import {createSaga, useDebounce} from '../saga';

// create an empty action to trigger manually on search text changed
const searchAction = createAction<void, [string]>();

export function SearchBlock() {
    // create a React state
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    // debounce searchAction with 500ms delay and call a saga
    useDebounce(500, searchAction, createSaga(async function({args: [pattern]}) {
        // mutate a React state
        setSearchResults(searchRegistry.search(pattern));
    }));

    // ...
}
```

See more on how to set up the Zustand example with `default` plugin in the [tutorials section](../tutorials/zustand.md).
