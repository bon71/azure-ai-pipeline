import { Client } from "@notionhq/client";
import type { NotionTaskData, NotionTokens } from "../types.js";

/**
 * Notion 統合トークンの設定を読み込む
 */
function getNotionTokens(): NotionTokens {
  const tokensJson = process.env.NOTION_TOKENS_JSON;
  if (!tokensJson) {
    throw new Error("NOTION_TOKENS_JSON 環境変数が設定されていません");
  }

  try {
    return JSON.parse(tokensJson) as NotionTokens;
  } catch (error) {
    throw new Error(
      `NOTION_TOKENS_JSON のパースに失敗しました: ${error}`
    );
  }
}

/**
 * Notion データベースIDを取得
 */
function getNotionDatabaseId(): string {
  const dbId = process.env.NOTION_TASK_DB_ID;
  if (!dbId) {
    throw new Error("NOTION_TASK_DB_ID 環境変数が設定されていません");
  }
  return dbId;
}

/**
 * Notion にタスク結果を保存する
 * @param data - タスクデータ
 * @returns 作成されたページのID
 */
export async function updateNotionTask(data: NotionTaskData): Promise<string> {
  const tokens = getNotionTokens();
  const dbId = getNotionDatabaseId();

  // Claude 統合トークンをデフォルトで使用
  const notion = new Client({ auth: tokens.claude });

  const { title, spec, design, research } = data;

  // ページ本文のコンテンツを作成
  const content = `## Spec\n${spec}\n\n## Design\n${design}\n\n## Research\n${research}`;

  try {
    const page = await notion.pages.create({
      parent: { database_id: dbId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Status: {
          select: {
            name: "Review",
          },
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content,
                },
              },
            ],
          },
        },
      ],
    });

    console.log(`Notion ページを作成しました: ${page.id}`);
    return page.id;
  } catch (error) {
    console.error("Notion API エラー:", error);
    throw new Error(`Notion ページの作成に失敗しました: ${error}`);
  }
}
