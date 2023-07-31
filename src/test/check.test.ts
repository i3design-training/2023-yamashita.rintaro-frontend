// TypeScriptの--isolatedModulesフラグが有効になっているときに、
// モジュールとして認識されないファイル（つまり、何もエクスポートまたはインポートしていないファイル）が存在するとエラーが発生するため、下記を記述
export {};

test('check', () => {
  console.log('OK');
});
