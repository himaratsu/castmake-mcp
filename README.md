# castmake MCP Server

## castmakeとは？

castmakeはAIラジオを簡単に作れるツールです。
自分向けのPodcast番組をつくって毎朝ニュースをラジオにしたり、企業の運営しているメディアの音声版を簡単に作ったりできます。

## MCP設定

### 方法1: Desktop Extension (DXT) をつかう

Claude Desktopに導入する場合、dxtファイルを使って簡単にインストールできます。

1. リリースページ から最新の `castmake-mcp.dxt` をダウンロード
2. Claude Desktopを起動し、設定 > エクステンション を開く
3. ダウンロードしたdxtファイルをClaude Desktopにドラッグ＆ドロップ
4. チャンネルIDとAPIキーを設定する

### 方法2. npmを使って設定する

以下の設定をCursorなどのお使いのサービスに追記してください。

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

API KeyとChannel IDは、castmakeのダッシュボードで取得できます。

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
