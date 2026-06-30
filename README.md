# shadcn-ui-wangch

Internal Vue 3 component package maintained for Wangch projects.

[繁體中文](./README.zh-TW.md)

## Package Status

Consumer projects use this repository as a GitHub source dependency:

- package entry: `shadcn-ui-wangch`
- source entry: `./src/lib/index.ts`
- styles export: `shadcn-ui-wangch/styles.css`
- component sources: `src/components/ui`, `src/components/shadcn-vue`, and `src/layout/sidebar01`

Consumer projects should install the package from the repository and let their lockfile record the resolved commit.

## Install In A Consumer Project

Use the GitHub dependency without pinning a commit in `package.json`:

```bash
pnpm add shadcn-ui-wangch@github:wangch15/shadcn-ui-wangch
```

For a workspace package:

```bash
pnpm --filter <workspace-package> add shadcn-ui-wangch@github:wangch15/shadcn-ui-wangch
```

The dependency should look like this:

```json
{
  "dependencies": {
    "shadcn-ui-wangch": "github:wangch15/shadcn-ui-wangch"
  }
}
```

`pnpm-lock.yaml` records the resolved Git commit. Commit the lockfile so every machine installs the same resolved source.

## Update In A Consumer Project

When this repository has a newer commit that a consumer project should use, run this in the consumer workspace:

```bash
pnpm update shadcn-ui-wangch -r
```

Then commit the updated `pnpm-lock.yaml`.

Do not normally pin `package.json` to a specific commit such as `github:wangch15/shadcn-ui-wangch#<sha>`. A commit pin is only for a short-lived local investigation or emergency override, and should be removed before normal project work continues.

If Vite still serves an old optimized dependency after updating, clear the consumer app's Vite cache, for example:

```bash
rm -rf apps/cms/node_modules/.vite
```

## Usage

Import components and helpers from the package entry:

```ts
import { Button, DataTable, Sidebar01, cn } from 'shadcn-ui-wangch'
```

Import the package stylesheet from the styles export:

```ts
import 'shadcn-ui-wangch/styles.css'
```

For Tailwind CSS v4 consumers, include this package in source scanning. Adjust the path for the consumer app location:

```css
@source '../../node_modules/shadcn-ui-wangch/src/**/*.{ts,vue}';
```

## Development Notes

Run checks inside this repository:

```bash
pnpm typecheck
pnpm build
```

Exported source files must use relative imports for package-internal code. Do not rely on consumer aliases such as `@/`, and do not use invalid package import aliases such as `#/components/...` in files exported to consumers.
