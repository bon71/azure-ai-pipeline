import { Client } from "@notionhq/client";

const notionTokens = JSON.parse(process.env.NOTION_TOKENS_JSON!);
const taskDbId = process.env.NOTION_TASK_DB_ID!;
const inputDbId = process.env.NOTION_INPUT_DB_ID!;

/**
 * Input WarehouseにURLが存在するか検索
 */
async function findInputByURL(notion: Client, url: string) {
  const q = await notion.databases.query({
    database_id: inputDbId,
    filter: { property: "URL", url: { equals: url } },
    page_size: 1,
  });
  return q.results[0]?.id as string | undefined;
}

/**
 * Input Warehouseに新規ページを作成
 */
async function createInputPage(
  notion: Client,
  { title, url }: { title: string; url: string }
) {
  const res = await notion.pages.create({
    parent: { database_id: inputDbId },
    properties: {
      Name: { title: [{ text: { content: title || url } }] },
      URL: { url },
    },
  });
  return res.id;
}

/**
 * Input Warehouse上でページをUpsertし、IDを返す
 */
export async function upsertInputAndRelate(
  notion: Client,
  {
    sourceUrl,
    sourceTitle,
  }: {
    sourceUrl?: string;
    sourceTitle?: string;
  }
) {
  if (!sourceUrl) return undefined;
  const existing = await findInputByURL(notion, sourceUrl);
  if (existing) return existing;
  return createInputPage(notion, {
    title: sourceTitle ?? "Imported Source",
    url: sourceUrl,
  });
}

/**
 * Task DBへ新規タスクを作成し、Input Warehouseと自動リレーション
 */
export async function updateNotionTask({
  title,
  spec,
  design,
  research,
  sourceUrl,
  sourceTitle,
}: {
  title: string;
  spec: string;
  design: string;
  research: string;
  sourceUrl?: string;
  sourceTitle?: string;
}) {
  // デフォルトでClaudeトークンを利用（他AIも同様に切り替え可能）
  const notion = new Client({ auth: notionTokens["claude"] });

  // Input WarehouseをUpsert
  const inputPageId = await upsertInputAndRelate(notion, {
    sourceUrl,
    sourceTitle,
  });

  // ページ内容整形
  const content = `## Spec\n${spec}\n\n## Design\n${design}\n\n## Research\n${research}`;

  // Task DBにページ作成
  const page = await notion.pages.create({
    parent: { database_id: taskDbId },
    properties: {
      Name: { title: [{ text: { content: title } }] },
      Status: { select: { name: "Review" } },
      ...(inputPageId && {
        "Input Warehouse": { relation: [{ id: inputPageId }] },
      }),
    },
    children: [
      {
        object: "block",
        paragraph: {
          rich_text: [{ type: "text", text: { content } }],
        },
      },
    ],
  });

  return page.id;
}
