import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { runPipeline } from "./orchestrator.js";
import type { PipelineInput } from "./types.js";
import dotenv from "dotenv";

// 環境変数の読み込み
dotenv.config();

/**
 * AI パイプライン Azure Function
 * HTTP POST リクエストを受け付けて、Claude → ChatGPT → Perplexity → Notion のパイプラインを実行
 */
export async function aiPipeline(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // リクエストボディの取得
    const body = (await req.json()) as PipelineInput;

    // 入力検証
    if (!body.title || !body.specPrompt) {
      return {
        status: 400,
        jsonBody: {
          error: "title と specPrompt は必須です",
        },
      };
    }

    context.log(`AI パイプライン開始: ${body.title}`);

    // パイプライン実行
    const result = await runPipeline(body);

    context.log(`AI パイプライン完了: ${body.title}`);

    return {
      status: 200,
      jsonBody: result,
    };
  } catch (err) {
    const error = err as Error;
    context.error("Pipeline error:", error);

    return {
      status: 500,
      jsonBody: {
        error: error.message || "パイプラインの実行に失敗しました",
      },
    };
  }
}

// Azure Functions の HTTP トリガーを登録
app.http("aiPipeline", {
  methods: ["POST"],
  authLevel: "function",
  handler: aiPipeline,
});
