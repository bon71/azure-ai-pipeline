/**
 * AI パイプライン共通の型定義
 */

/**
 * パイプライン入力データ
 */
export interface PipelineInput {
  /** タスクのタイトル */
  title: string;
  /** 仕様書作成のためのプロンプト */
  specPrompt: string;
  /** ソースURL（Input Warehouseとの連携用・オプション） */
  sourceUrl?: string;
  /** ソースタイトル（Input Warehouseとの連携用・オプション） */
  sourceTitle?: string;
}

/**
 * パイプライン実行結果
 */
export interface PipelineResult {
  /** タスクのタイトル */
  title: string;
  /** Notion ページID */
  notionPageId: string;
  /** ソースがリンクされたか */
  sourceLinked: boolean;
  /** 成功フラグ */
  success: boolean;
}

/**
 * Notion タスク更新データ
 */
export interface NotionTaskData {
  /** タスクのタイトル */
  title: string;
  /** Claude による仕様書 */
  spec: string;
  /** ChatGPT による設計書 */
  design: string;
  /** Perplexity による調査結果 */
  research: string;
  /** ソースURL（Input Warehouseとの連携用・オプション） */
  sourceUrl?: string;
  /** ソースタイトル（Input Warehouseとの連携用・オプション） */
  sourceTitle?: string;
}

/**
 * Notion 統合トークン設定
 */
export interface NotionTokens {
  /** Claude 統合トークン */
  claude: string;
  /** ChatGPT 統合トークン */
  chatgpt: string;
  /** Perplexity 統合トークン */
  perplexity: string;
}
