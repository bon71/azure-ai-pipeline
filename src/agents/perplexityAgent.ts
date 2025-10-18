import axios from "axios";

/**
 * Perplexity を使用して技術調査を行う
 * @param title - タスクのタイトル
 * @param spec - Claude で生成された仕様書
 * @returns 調査結果
 */
export async function researchWithPerplexity(
  title: string,
  spec: string
): Promise<string> {
  // Perplexity API キーが設定されていない場合はスキップ
  if (!process.env.PERPLEXITY_API_KEY) {
    console.warn("Perplexity API キーが設定されていません。調査をスキップします。");
    return "(Perplexityキー未設定)";
  }

  try {
    const resp = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "pplx-70b-online",
        messages: [
          {
            role: "system",
            content: "あなたは技術調査アシスタントです。",
          },
          {
            role: "user",
            content: `機能名:${title}\n仕様:\n${spec}\n関連技術・APIを簡潔にまとめてください。`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return resp.data.choices?.[0]?.message?.content ?? "";
  } catch (error) {
    console.error("Perplexity API エラー:", error);
    throw new Error(`Perplexity API の呼び出しに失敗しました: ${error}`);
  }
}
