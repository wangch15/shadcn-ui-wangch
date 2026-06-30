# shadcn-ui-wangch

Wangch 專案內部維護的 Vue 3 元件套件。

[English](./README.md)

## 套件狀態

消費端專案使用這個 repo 作為 GitHub source dependency：

- package entry：`shadcn-ui-wangch`
- source entry：`./src/lib/index.ts`
- styles export：`shadcn-ui-wangch/styles.css`
- 元件來源：`src/components/ui`、`src/components/shadcn-vue`、`src/layout/sidebar01`

消費端專案應從 repo 安裝，並由自己的 lockfile 記錄實際解析到的 commit。

## 在消費端專案安裝

`package.json` 使用 GitHub dependency，不要固定到特定 commit：

```bash
pnpm add shadcn-ui-wangch@github:wangch15/shadcn-ui-wangch
```

如果是在 workspace package 內安裝：

```bash
pnpm --filter <workspace-package> add shadcn-ui-wangch@github:wangch15/shadcn-ui-wangch
```

dependency 應該長這樣：

```json
{
  "dependencies": {
    "shadcn-ui-wangch": "github:wangch15/shadcn-ui-wangch"
  }
}
```

`pnpm-lock.yaml` 會記錄實際解析到的 Git commit。提交 lockfile 後，不同電腦就會安裝同一份解析結果。

## 在消費端專案更新

當這個 repo 有新的 commit，而消費端專案要吃到新版時，在消費端 workspace 跑：

```bash
pnpm update shadcn-ui-wangch -r
```

然後提交更新後的 `pnpm-lock.yaml`。

正常情況下不要把 `package.json` 寫成 `github:wangch15/shadcn-ui-wangch#<sha>` 這種固定 commit 的形式。固定 commit 只適合短期本機排查或緊急覆蓋，正常開發前應移除。

如果更新後 Vite 仍然吃到舊的 optimized dependency，可以清掉消費端 app 的 Vite cache，例如：

```bash
rm -rf apps/cms/node_modules/.vite
```

## 使用方式

從 package entry 匯入元件與工具：

```ts
import { Button, DataTable, Sidebar01, cn } from 'shadcn-ui-wangch'
```

從 styles export 匯入套件樣式：

```ts
import 'shadcn-ui-wangch/styles.css'
```

Tailwind CSS v4 消費端需要把這個套件納入 source scanning。實際路徑依消費端 app 位置調整：

```css
@source '../../node_modules/shadcn-ui-wangch/src/**/*.{ts,vue}';
```

## 開發注意事項

在這個 repo 內執行檢查：

```bash
pnpm typecheck
pnpm build
```

會被消費端匯入的 source files，套件內部 import 必須使用相對路徑。不要依賴消費端 alias，例如 `@/`；也不要在 exported files 使用 `#/components/...` 這種無效的 package import alias。
