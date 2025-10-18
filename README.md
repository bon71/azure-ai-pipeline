# Azure Functions版 AIパイプライン

ChatGPT・Claude・Perplexity・Notionを連携させるNode.jsワークフローを **Azure Functions (TypeScript)** 上で構築したプロジェクトです。

## 🚀 概要

このAzure Functionは、HTTPリクエストを受け取って以下を実行します：

1. **Claude** で要件から仕様書を生成
2. **ChatGPT** で仕様書から設計書を生成
3. **Perplexity** で技術調査を実施
4. **Notion** のTask DBに結果を保存
5. JSON結果を返却

## 📦 プロジェクト構成

```
azure-ai-pipeline/
├─ package.json
├─ tsconfig.json
├─ .env.example          # 環境変数のテンプレート
├─ .gitignore
├─ README.md
└─ src/
   ├─ index.ts           # Azure Functionエントリポイント
   ├─ orchestrator.ts    # Claude→ChatGPT→Perplexity→Notion連携
   ├─ types.ts           # TypeScript型定義
   ├─ integrations/
   │   └─ notionClient.ts
   └─ agents/
       ├─ claudeAgent.ts
       ├─ chatgptAgent.ts
       └─ perplexityAgent.ts
```

## ⚙️ セットアップ手順

### 1. 環境変数の設定

`.env.example` をコピーして `.env` を作成し、各種APIキーを設定してください。

```bash
cp .env.example .env
```

`.env` に以下の値を設定：

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=sk-pplx-...
NOTION_TASK_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_TOKENS_JSON={"claude":"secret_xxx","chatgpt":"secret_yyy","perplexity":"secret_zzz"}
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. ビルド

```bash
npm run build
```

## 🧪 ローカル実行

Azure Functions Core Toolsをインストール後、以下のコマンドでローカルサーバーを起動：

```bash
npm start
```

起動後、`http://localhost:7071/api/aiPipeline` にPOSTリクエストを送信して動作確認できます。

### リクエスト例

```bash
curl -X POST http://localhost:7071/api/aiPipeline \
  -H "Content-Type: application/json" \
  -d '{
    "title": "ユーザー認証機能",
    "specPrompt": "Webアプリケーションにユーザー認証機能を追加したい。メールアドレスとパスワードでログインできるようにする。"
  }'
```

### レスポンス例

```json
{
  "title": "ユーザー認証機能",
  "spec": "## 仕様書\n...",
  "design": "## 設計書\n...",
  "research": "## 技術調査結果\n...",
  "notionPageId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## ☁️ Azureデプロイ

### 1. Azure CLIでログイン

```bash
az login
```

### 2. Function Appを作成

```bash
az functionapp create \
  --resource-group ai-functions \
  --consumption-plan-location japaneast \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name ai-pipeline-func \
  --storage-account mystorage123
```

### 3. デプロイ

```bash
func azure functionapp publish ai-pipeline-func
```

## 🔑 環境変数の説明

| 変数名 | 説明 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI (ChatGPT) のAPIキー |
| `ANTHROPIC_API_KEY` | Anthropic (Claude) のAPIキー |
| `PERPLEXITY_API_KEY` | Perplexity のAPIキー（オプション） |
| `NOTION_TASK_DB_ID` | Notion のタスクデータベースID |
| `NOTION_TOKENS_JSON` | Notion統合トークン（JSON形式） |

## ✅ メリットまとめ

| 項目 | 内容 |
|------|------|
| **監視統一** | Azure Portalで監視可能（Application Insights含む） |
| **コスト最小** | 無料枠内（100万req/月）で十分運用可能 |
| **セキュリティ** | Azure Managed Identity対応可 |
| **拡張性** | 後にSupabaseやStripeを追加可能 |
| **TypeScript構成** | ClaudeCodeやVSCodeとの相性が高く、CI/CDにも対応 |

## 📝 開発

### ビルド

```bash
npm run build
```

### 監視モード

```bash
npm run watch
```

### テスト

```bash
npm test
```

## 🤝 貢献

プルリクエストを歓迎します。大きな変更を加える場合は、まずIssueを開いて変更内容を議論してください。

## 📄 ライセンス

ISC
