import OpenAI from "openai";

/**
 * OpenAI API クライアント
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * ChatGPT を使用して仕様書から設計書を生成する
 * @param spec - Claude で生成された仕様書
 * @returns 生成された設計書
 */
export async function designFromSpec(spec: string): Promise<string> {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "あなたは設計エンジニアです。仕様書からER図とAPI定義を出力してください。",
        },
        {
          role: "user",
          content: spec,
        },
      ],
    });

    return res.choices[0]?.message?.content ?? "";
  } catch (error) {
    console.error("OpenAI API エラー:", error);
    throw new Error(`OpenAI API の呼び出しに失敗しました: ${error}`);
  }
}
