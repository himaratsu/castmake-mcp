#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Constants
const API_BASE = "https://api.castmake-ai.com/v1";

// コマンドライン引数を解析
function parseArguments(): { apiKey: string, channelId: string } {
    const args = process.argv.slice(2);
    let apiKey = "";
    let channelId = "";
    
    // --api-key または -k フラグを探す
    for (let i = 0; i < args.length; i++) {
        if ((args[i] === '--api-key' || args[i] === '-k') && i + 1 < args.length) {
            apiKey = args[i + 1];
        }
        // --api-key=value の形式もサポート
        if (args[i].startsWith('--api-key=')) {
            apiKey = args[i].substring('--api-key='.length);
        }
        
        // --channel-id または -c フラグを探す
        if ((args[i] === '--channel-id' || args[i] === '-c') && i + 1 < args.length) {
            channelId = args[i + 1];
        }
        // --channel-id=value の形式もサポート
        if (args[i].startsWith('--channel-id=')) {
            channelId = args[i].substring('--channel-id='.length);
        }
    }
    
    return { apiKey, channelId };
}

const { apiKey: CASTMAKE_API_KEY, channelId: CASTMAKE_CHANNEL_ID } = parseArguments();

// API Key と Channel ID が設定されていない場合はエラーを出力して終了
if (!CASTMAKE_API_KEY || !CASTMAKE_CHANNEL_ID) {
    console.error("エラー: CASTMAKE_CHANNEL_ID と CASTMAKE_API_KEY が設定されていません。");
    console.error("使用方法:");
    console.error("  npx castmake-mcp --channel-id YOUR_CHANNEL_ID --api-key YOUR_API_KEY");
    console.error("  npx castmake-mcp -c YOUR_CHANNEL_ID -k YOUR_API_KEY");
    process.exit(1);
}

// Initialize MCP server
const server = new McpServer({
    name: "castmake",
    version: "1.0.0"
});

// Types
interface CastMakeResponse {
    [key: string]: any;
}

// Helper functions
async function makeCastMakeRequest(endpoint: string, body: Record<string, any>): Promise<CastMakeResponse | string> {
    const headers = {
        "x-castmake-api-key": CASTMAKE_API_KEY,
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(300000) // 5分のタイムアウト
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return `エラーが発生しました: ${JSON.stringify(body)} ${error instanceof Error ? error.message : String(error)}`;
    }
}

// Tools
server.tool(
    "create_single_episode",
    "1人語りのエピソードを作成します。指定されたURLから記事を取得し、音声エピソードを生成します。",
    {
        urls: z.array(z.string().url()).describe("記事のURL配列。複数のURLを指定できます。")
    },
    async ({ urls }) => {
        const data = await makeCastMakeRequest("/episodes", {
            channelId: CASTMAKE_CHANNEL_ID,
            urls: urls
        });
        
        if (typeof data === "string") {
            return {
                content: [{
                    type: "text",
                    text: data
                }]
            };
        }
        
        return {
            content: [{
                type: "text",
                text: `1人語りエピソードの作成に成功しました。\n\nレスポンス: ${JSON.stringify(data, null, 2)}`
            }]
        };
    }
);

server.tool(
    "create_conversation_episode",
    "対話式のエピソードを作成します。指定されたテキストをもとに会話形式の音声エピソードを生成します。",
    {
        text: z.string().describe("対話のテーマやトピック。例: 'AIについて話してください'")
    },
    async ({ text }) => {
        const data = await makeCastMakeRequest("/episodes_conversation", {
            channelId: CASTMAKE_CHANNEL_ID,
            text: text
        });
        
        if (typeof data === "string") {
            return {
                content: [{
                    type: "text",
                    text: data
                }]
            };
        }
        
        return {
            content: [{
                type: "text",
                text: `対話式エピソードの作成に成功しました。\n\nレスポンス: ${JSON.stringify(data, null, 2)}`
            }]
        };
    }
);

// Main function
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});