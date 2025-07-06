# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

これはCastMakeサービスとの統合を提供するModel Context Protocol (MCP) サーバーです。`@modelcontextprotocol/sdk`を使用してMCPサーバーを実装し、構造化されたツールを通じてCastMakeのエピソード作成機能を公開します。

## ビルドと開発コマンド

- `npm run build` - TypeScriptをdist/ディレクトリ内のJavaScriptにコンパイル
- `npm run dev` - tsxを使用して開発モードでサーバーを実行
- `npm start` - dist/index.jsからコンパイルされたサーバーを実行

## アーキテクチャ

### 認証
サーバーは以下の方法で渡されるCastMake API KeyとChannel IDを必要とします：
- コマンドライン: `--api-key` または `-k` フラグ、`--channel-id` または `-c` フラグ
- 環境変数: `CASTMAKE_API_KEY`、`CASTMAKE_CHANNEL_ID`

### コアコンポーネント

#### APIクライアント層
- `makeCastMakeRequest()` - CastMake APIへのリクエストを処理
- ベースAPI URL: `https://api.castmake-ai.com/v1`

#### ツールカテゴリ
1. **エピソード作成**: `create_single_episode`, `create_conversation_episode`

#### データフォーマット
- APIレスポンスはJSON形式で返される
- エラー時は文字列メッセージを返す

### 主要な設計パターン

サーバーはMCP標準に従います：
- ツールはパラメーター検証のためのZodスキーマで定義
- すべてのレスポンスは一貫した `{ content: [{ type: "text", text: string }] }` フォーマットを使用
- エラーハンドリングはユーザーフレンドリーなメッセージを返す
- すべてのAPIリクエストに5分のタイムアウト

### 依存関係

- `@modelcontextprotocol/sdk` - MCPサーバーフレームワーク
- `zod` - ツールパラメーターのスキーマ検証
- `node-fetch` - CastMake API用HTTPクライアント
- `tsx` - 開発用TypeScript実行

サーバーは、API通信、データフォーマット、MCPツール定義の明確な分離を持つ単一ファイル実装として設計されています。