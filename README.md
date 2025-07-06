# CastMake MCP Server (Node.js/TypeScript)

## What's CastMake?

CastMakeは、URLまたはテキストから高品質なポッドキャストエピソードを自動生成するAIサービスです。LLMから利用するには、このMCPサーバーを使用してください。

## How to use in MCP Client

```json
{
  "mcpServers": {
   "castmake": {
      "command": "npx",
      "args": [
        "-y",
        "castmake-mcp",
        "--api-key",
        "YOUR_API_KEY",
        "--channel-id", 
        "YOUR_CHANNEL_ID"
      ]
    }
  }
}
```

API KeyとChannel IDは、CastMakeのダッシュボードで取得できます。

## 利用可能なツール

### create_single_episode
- **説明**: 1人語りのエピソードを作成
- **パラメータ**: 
  - `urls`: 記事のURL配列（複数可）
- **使用例**: ニュース記事やブログ投稿から音声エピソードを生成

### create_conversation_episode  
- **説明**: 対話式のエピソードを作成
- **パラメータ**:
  - `text`: 対話のテーマやトピック
- **使用例**: 「AIについて話してください」などのテーマから会話形式のエピソードを生成

## 環境変数での設定

コマンドライン引数の代わりに環境変数も使用できます：

```bash
export CASTMAKE_API_KEY="YOUR_API_KEY"
export CASTMAKE_CHANNEL_ID="YOUR_CHANNEL_ID"
npx castmake-mcp
```