module.exports = {
  paths: { input: './temp/input', output: './output', temp: './temp' },
  output: { videoCodec: 'libx265', preset: 'fast', crf: 18 },
  subtitles: { font: 'M+ 1c', fontSize: 48, fontColor: 'white', borderColor: 'black', borderWidth: 3 },
  schedule: { cronExpression: '0 11 * * *', timezone: 'Asia/Tokyo' }
};
