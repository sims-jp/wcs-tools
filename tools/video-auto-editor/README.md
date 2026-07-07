# video-auto-editor v2.0

WCS 自動動画編集エンジン。iPhoneクリップを結合し、H.265でエンコードする。

## アーキテクチャ（v2.0 / 2026-07-07 恒久修正）

| 役割 | 担当 |
|------|------|
| Google Drive `VideoAutoEditor_Input` からのダウンロード | Cowork の Google Drive MCP（Claude側） |
| 結合・エンコード（ffmpeg） | `node main.js`（ローカルファイルのみ処理） |
| Google Drive `VideoAutoEditor_Output` へのアップロード | Cowork の Google Drive MCP（Claude側） |

- サービスアカウント鍵（credentials.json）は**使用しない**（wcs-japan.com org ポリシーで鍵作成不可）。
- DriveフォルダIDは Scheduled Task のプロンプト側で保持し、リポジトリには含めない。

## 実行手順（Scheduled Task から）

1. `git clone https://github.com/sims-jp/wcs-tools.git` → `tools/video-auto-editor/` へ移動
2. Drive MCP で `VideoAutoEditor_Input` の動画クリップを `temp/input/` にダウンロード
3. `node main.js` — `temp/input/` のクリップを結合し `output/edited_YYYY-MM-DD.mp4` を生成
4. Drive MCP で出力ファイルを `VideoAutoEditor_Output` にアップロード
5. 処理結果（成功/失敗・処理本数・出力ファイル名）をログに記録

## 必要環境

- Node.js（外部依存なし）
- ffmpeg（libx265対応）

## 履歴

- v2.0 (2026-07-07): googleapis/サービスアカウント鍵依存を撤去しローカル処理専用化。Drive入出力をMCPへ分離。scheduler.js廃止（定期実行はCowork Scheduled Tasks）。
- v1.0 (2026-05-31): 初版（Macローカル・サービスアカウント鍵前提）。
