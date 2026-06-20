# sns-memo

SNSネタ出し用メモアプリ。Next.js + Neon (PostgreSQL) + Vercel で動作します。

## セットアップ手順

### 1. Neonでデータベースを作成

Neonのダッシュボードで新しいプロジェクト（またはブランチ）を作成し、
接続文字列（Connection String）をコピーします。
形式: `postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

### 2. 環境変数を設定

`.env.local` の `DATABASE_URL` を実際の接続文字列に書き換えます。

```
DATABASE_URL=postgresql://user:password@ep-xxx...
```

### 3. Vercelにデプロイ

```bash
# GitHubにpush後、Vercelでリポジトリを連携
# または Vercel CLI でデプロイ
npx vercel
```

Vercelの環境変数設定画面で `DATABASE_URL` を同じ接続文字列で設定します。

### 4. テーブルを作成（初回のみ）

デプロイ後、ブラウザで以下にアクセスしてボタンを押します：

```
https://your-app.vercel.app/setup
```

「✓ 完了しました」と表示されたら完了です。

---

## ローカル開発

```bash
npm install
npm run dev
# → http://localhost:3000
```

ローカルでも `.env.local` の `DATABASE_URL` が必要です（NeonはクラウドなのでNet接続が必要）。

---

## 機能

- **メモ作成**: トップの入力欄に書いてすぐ保存
- **タグ**: 自由入力（Enter で確定、既存タグはサジェスト表示）
- **編集**: カードホバー → 鉛筆アイコン
- **削除**: カードホバー → ゴミ箱アイコン（2回クリックで確定）
- **フィルター**: 期間（from/to）＋タグ（複数選択）＋全文検索
- **一覧**: カード形式、作成日時の新しい順

---

## ファイル構成

```
app/
  page.tsx              # メインページ（一覧・フィルター）
  layout.tsx            # レイアウト
  globals.css           # グローバルスタイル
  setup/page.tsx        # 初回セットアップページ
  api/
    notes/route.ts      # GET（一覧）/ POST（作成）
    notes/[id]/route.ts # PUT（更新）/ DELETE（削除）
    tags/route.ts       # GET（タグ一覧）
    migrate/route.ts    # POST（テーブル作成）
components/
  NoteForm.tsx          # 新規作成フォーム
  NoteCard.tsx          # メモカード（編集・削除含む）
  FilterBar.tsx         # 検索・フィルターバー
  TagInput.tsx          # タグ入力コンポーネント
lib/
  db.ts                 # Neon接続
  queries.ts            # DB操作関数
  types.ts              # 型定義
```
