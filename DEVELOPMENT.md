## 🛠️ Promise Saga for developers

---

To get started with the development environment:

#### 1. Install `pnpm`, `npm-check-updates` and `changesets` globally
```bash
npm i -g pnpm npm-check-updates @changesets/cli
```

#### 2. Install project dependencies
```bash
pnpm i
```

#### 3. Monorepo structure overview
- `/docs` - project documentation sources
- `/website` - Docusaurus-based documentation site
- `/packages` - main libraries and shared code
- `/examples` - usage examples and test apps

#### 4. Monorepo scripts (from root package.json)
- `build` - build all packages and examples with Turborepo
- `test` - test all packages with Turborepo

#### 5. Health-care: updating deps to latest
```bash
ncu -u --deep # update all deps to latest
pnpm i # install all deps
```

#### 6. Health-care: publishing a changeset
```bash
pnpm changeset init # init changesets, done once
pnpm changeset # create a changeset file
pnpm changeset version # apply a changeset before publishing: update versions and changelogs
pnpm changeset publish # publish a changeset
```
