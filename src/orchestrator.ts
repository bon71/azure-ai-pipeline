import { specFromClaude } from "./agents/claudeAgent.js";
import { designFromSpec } from "./agents/chatgptAgent.js";
import { researchWithPerplexity } from "./agents/perplexityAgent.js";
import { updateNotionTask } from "./integrations/notionClient.js";

/**
 * Claude → ChatGPT → Perplexity → Notion 自動連携
 */
export async function runPipeline(input: {
  title: string;
  specPrompt: string;
  sourceUrl?: string;
  sourceTitle?: string;
}) {
  const { title, specPrompt, sourceUrl, sourceTitle } = input;

  console.log("Pipeline started for:", title);

  // 1) Claudeで仕様生成
  const spec = await specFromClaude(specPrompt);

  // 2) ChatGPTで設計生成
  const design = await designFromSpec(spec);

  // 3) Perplexityで技術調査
  const research = await researchWithPerplexity(title, spec);

  // 4) Notionへ反映（Input Warehouseとの自動リレーション付き）
  const notionResult = await updateNotionTask({
    title,
    spec,
    design,
    research,
    sourceUrl,
    sourceTitle,
  });

  return {
    title,
    notionPageId: notionResult,
    sourceLinked: !!sourceUrl,
    success: true,
  };
}
