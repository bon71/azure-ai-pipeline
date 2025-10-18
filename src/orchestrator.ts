import { specFromClaude } from "./agents/claudeAgent.js";
import { designFromSpec } from "./agents/chatgptAgent.js";
import { researchWithPerplexity } from "./agents/perplexityAgent.js";
import { updateNotionTask } from "./integrations/notionClient.js";
import type { PipelineInput, PipelineResult } from "./types.js";

/**
 * AI パイプラインを実行する
 * Claude → ChatGPT → Perplexity → Notion の順で処理
 * @param input - パイプライン入力データ
 * @returns パイプライン実行結果
 */
export async function runPipeline(input: PipelineInput): Promise<PipelineResult> {
  const { title, specPrompt } = input;
  console.log("Pipeline started for:", title);

  try {
    // Step 1: Claude で仕様書を生成
    console.log("Step 1: Claude で仕様書を生成中...");
    const spec = await specFromClaude(specPrompt);
    console.log("仕様書の生成が完了しました");

    // Step 2: ChatGPT で設計書を生成
    console.log("Step 2: ChatGPT で設計書を生成中...");
    const design = await designFromSpec(spec);
    console.log("設計書の生成が完了しました");

    // Step 3: Perplexity で技術調査
    console.log("Step 3: Perplexity で技術調査中...");
    const research = await researchWithPerplexity(title, spec);
    console.log("技術調査が完了しました");

    // Step 4: Notion に結果を保存
    console.log("Step 4: Notion に結果を保存中...");
    const notionPageId = await updateNotionTask({ title, spec, design, research });
    console.log("Notion への保存が完了しました");

    return {
      title,
      spec,
      design,
      research,
      notionPageId,
    };
  } catch (error) {
    console.error("パイプライン実行エラー:", error);
    throw error;
  }
}
