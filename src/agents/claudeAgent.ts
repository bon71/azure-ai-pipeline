import Anthropic from "@anthropic-ai/sdk";

/**
 * Claude API クライアント
 */
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

/**
 * Claude を使用して要件から仕様書を生成する
 * @param prompt - 仕様書作成のためのプロンプト
 * @returns 生成された仕様書
 */
export async function specFromClaude(prompt: string): Promise<string> {
  try {
    const msg = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `以下の要件を仕様書としてまとめてください。\n\n${prompt}`,
        },
      ],
    });

    // レスポンスから text コンテンツを抽出
    const textContent = msg.content.find((block) => block.type === "text");
    if (textContent && textContent.type === "text") {
      return textContent.text;
    }

    return "";
  } catch (error) {
    console.error("Claude API エラー:", error);
    throw new Error(`Claude API の呼び出しに失敗しました: ${error}`);
  }
}
