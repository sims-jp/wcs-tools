// video-auto-editor main.js v2.0 — ローカル処理専用
// Google Drive の入出力は Cowork の Google Drive MCP（Claude側）が担当する。
// サービスアカウント鍵（credentials.json）は使用しない（wcs-japan.com orgポリシーで鍵作成不可）。
// 前提: ./temp/input/ に動画クリップが配置済みであること。
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const config = require('./config');

const inDir = path.join(__dirname, config.paths.input);
const outDir = path.join(__dirname, config.paths.output);

async function run() {
  console.log('🎬 自動動画編集エンジン v2.0 起動（ローカル処理モード）');
  if (!fs.existsSync(inDir)) {
    console.error(`❌ 入力フォルダがありません: ${inDir}（Drive MCP で事前ダウンロードしてください）`);
    process.exit(1);
  }
  const clips = fs.readdirSync(inDir)
    .filter(f => /\.(mp4|mov|m4v)$/i.test(f))
    .sort()
    .map(f => path.join(inDir, f));
  if (!clips.length) {
    console.error('❌ 入力動画がありません（temp/input に .mp4/.mov/.m4v を配置）');
    process.exit(1);
  }
  console.log(`📹 ${clips.length}本のクリップを処理`);

  const listFile = path.join(__dirname, config.paths.temp, 'list.txt');
  fs.mkdirSync(path.dirname(listFile), { recursive: true });
  fs.writeFileSync(listFile, clips.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n'));
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `edited_${new Date().toISOString().slice(0, 10)}.mp4`);

  console.log('✂️  結合・エンコード中...');
  await new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', [
      '-f', 'concat', '-safe', '0', '-i', listFile,
      '-c:v', config.output.videoCodec, '-preset', config.output.preset,
      '-crf', String(config.output.crf), '-c:a', 'aac', '-y', outPath, '-loglevel', 'error'
    ]);
    ff.on('close', c => c === 0 ? resolve() : reject(new Error('FFmpeg失敗')));
    ff.on('error', reject);
  });
  console.log(`✅ 完成: ${outPath}`);
  console.log('➡️  この出力ファイルを Drive MCP で VideoAutoEditor_Output にアップロードしてください');
}

run().catch(e => { console.error('❌', e.message); process.exit(1); });
