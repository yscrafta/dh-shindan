// 結果ページのロジック

// URLパラメータからMBTIタイプを取得
const urlParams = new URLSearchParams(window.location.search);
const mbtiType = urlParams.get('type') || localStorage.getItem('diagnosis_result') || 'ENFP';

// キャラクターデータを取得
const character = characterData[mbtiType];

if (!character) {
  // タイプが見つからない場合はトップページへ
  window.location.href = '/';
}

// グローバル変数で画像URLを保持
let generatedImageUrl = null;

// ページ読み込み時に結果を表示して画像を生成
window.addEventListener('DOMContentLoaded', async function() {
  displayResult();
  drawRadarChart();
  // バックグラウンドで画像を生成
  await generateResultImage();
});

// 結果を表示
function displayResult() {
  document.getElementById('characterImage').src = character.image;
  document.getElementById('characterImage').alt = character.name;
  document.getElementById('typeName').textContent = character.name;
  document.getElementById('catchphrase').textContent = character.catchphrase;
  document.getElementById('description').textContent = character.description;
  
  // LINEボタン上部のキャラ名リマインダーにも表示
  document.getElementById('characterNameReminder').textContent = character.name;

  // 向いている働き方
  const workStyleList = document.getElementById('workStyleList');
  workStyleList.innerHTML = '';
  character.workStyle.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    workStyleList.appendChild(li);
  });

  // 向いている医院タイプ
  const clinicTypeList = document.getElementById('clinicTypeList');
  clinicTypeList.innerHTML = '';
  character.clinicType.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    clinicTypeList.appendChild(li);
  });

  // 相性の良いキャラ
  const compatibilityList = document.getElementById('compatibilityList');
  compatibilityList.innerHTML = '';
  character.compatibility.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    compatibilityList.appendChild(li);
  });
}

// レーダーチャートを描画
function drawRadarChart() {
  const canvas = document.getElementById('radarChart');
  const ctx = canvas.getContext('2d');
  
  // キャンバスのサイズを設定（レスポンシブ対応）
  const container = canvas.parentElement;
  const size = Math.min(container.clientWidth - 40, 350);  // パディングを考慮
  canvas.width = size;
  canvas.height = size;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = size * 0.28;  // 0.3 → 0.28にさらに縮小
  const levels = 5;
  const labels = ['共感力', '技術力', 'コミュ力', '積極性', '柔軟性'];
  const data = character.radar;

  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景の同心円を描画
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  for (let i = 1; i <= levels; i++) {
    ctx.beginPath();
    const radius = (maxRadius / levels) * i;
    for (let j = 0; j <= labels.length; j++) {
      const angle = (Math.PI * 2 / labels.length) * j - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 軸を描画
  ctx.strokeStyle = '#B0B0B0';
  ctx.lineWidth = 1;
  for (let i = 0; i < labels.length; i++) {
    const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + maxRadius * Math.cos(angle),
      centerY + maxRadius * Math.sin(angle)
    );
    ctx.stroke();
  }

  // ラベルを描画（背景付きで見やすく）
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let i = 0; i < labels.length; i++) {
    const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
    const labelRadius = maxRadius + 32;  // 35 → 32に調整
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    
    // 背景の白い円を描画
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);  // 20 → 18に縮小
    ctx.fill();
    
    // ラベルテキストを描画
    ctx.fillStyle = '#2C5F8D';
    ctx.font = 'bold 11px "M PLUS Rounded 1c", sans-serif';  // 13px → 11pxに縮小
    ctx.fillText(labels[i], x, y);
  }

  // データを描画（塗りつぶし）
  ctx.fillStyle = 'rgba(255, 107, 157, 0.3)';
  ctx.strokeStyle = '#FF6B9D';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2;
    const value = data[i] / levels;
    const x = centerX + maxRadius * value * Math.cos(angle);
    const y = centerY + maxRadius * value * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // データポイントを描画
  ctx.fillStyle = '#FF6B9D';
  for (let i = 0; i < data.length; i++) {
    const angle = (Math.PI * 2 / data.length) * i - Math.PI / 2;
    const value = data[i] / levels;
    const x = centerX + maxRadius * value * Math.cos(angle);
    const y = centerY + maxRadius * value * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// シェア機能（TOPページのURLをコピー）
function shareResult() {
  const topUrl = 'https://dental-hygienist-diagnosis.pages.dev/';
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(topUrl).then(() => {
      alert('診断サイトのURLをコピーしました！📋\n\nSNSで友達を招待しよう！');
    }).catch(() => {
      fallbackCopy(topUrl);
    });
  } else {
    fallbackCopy(topUrl);
  }
}

// フォールバック（テキストエリアでコピー）
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    alert('診断サイトのURLをコピーしました！📋\n\nSNSに貼り付けてシェアしてください');
  } catch (err) {
    alert('URL: https://dental-hygienist-diagnosis.pages.dev/\n\n手動でコピーしてシェアしてください');
  }
  
  document.body.removeChild(textarea);
}

// もう一度診断する
function retryDiagnosis() {
  localStorage.removeItem('diagnosis_result');
  localStorage.removeItem('diagnosis_answers');
  localStorage.removeItem('current_question');
  localStorage.removeItem('user_type');
  window.location.href = '/';
}

// 診断をやってみる（新規ユーザー向け）
function startDiagnosis() {
  window.location.href = '/';
}

// 結果画像を事前生成（バックグラウンド）
async function generateResultImage() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 背景のグラデーション（歯科医院の清潔感）
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
    gradient.addColorStop(0, '#E8F5FF');  // 清潔な水色
    gradient.addColorStop(0.5, '#F0F8FF');  // アリスブルー
    gradient.addColorStop(1, '#FFF5F8');  // 優しいピンク
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 歯科器具のイラスト（背景装飾 - 歯ブラシと歯のみ）
    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.font = '120px sans-serif';
    
    // 歯のイラスト
    ctx.fillText('🦷', 100, 250);
    ctx.fillText('🦷', 900, 350);
    ctx.fillText('🦷', 120, 900);
    ctx.fillText('🦷', 880, 1000);
    ctx.fillText('🦷', 150, 1500);
    ctx.fillText('🦷', 850, 1700);
    
    // 歯ブラシ
    ctx.fillText('🪥', 850, 250);
    ctx.fillText('🪥', 120, 500);
    ctx.fillText('🪥', 900, 900);
    ctx.fillText('🪥', 100, 1300);
    ctx.fillText('🪥', 880, 1500);
    
    ctx.restore();

    // 上部の白いヘッダー帯（歯科医院の清潔感）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.fillRect(0, 80, 1080, 180);
    ctx.shadowColor = 'transparent';
    
    // 白十字マーク（医療感）
    ctx.fillStyle = '#4FC3F7';
    ctx.fillRect(50, 140, 15, 60);
    ctx.fillRect(27, 162, 60, 15);
    ctx.fillRect(993, 140, 15, 60);
    ctx.fillRect(970, 162, 60, 15);

    // タイトル
    ctx.fillStyle = '#00ACC1';
    ctx.font = 'bold 52px "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦷 あなたはどの歯科衛生士？', 540, 160);
    
    ctx.fillStyle = '#FF6B9D';
    ctx.font = 'bold 32px "M PLUS Rounded 1c", sans-serif';
    ctx.fillText('キャラ診断結果', 540, 210);

    // 画像をfetchで取得
    const response = await fetch(character.image);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = imageUrl;
    });

    // キャラクター画像用の白い円形背景（歯のような白さ）
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(540, 550, 320, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // 水色の円（歯科医院カラー）
    ctx.strokeStyle = '#4FC3F7';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(540, 550, 320, 0, Math.PI * 2);
    ctx.stroke();

    // キャラクター画像を円形にクリップして描画
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 550, 300, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, 240, 250, 600, 600);
    ctx.restore();
    
    URL.revokeObjectURL(imageUrl);

    // キャラクター名エリア（歯科医院の清潔感）
    const nameY = 920;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.roundRect(80, nameY, 920, 100, 20);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // 上下のボーダー（医療感）
    ctx.strokeStyle = '#4FC3F7';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(80, nameY, 920, 100, 20);
    ctx.stroke();

    // キャラクター名（中央配置）
    ctx.fillStyle = '#FF6B9D';
    ctx.font = 'bold 64px "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character.name, 540, nameY + 50);
    ctx.textBaseline = 'alphabetic';

    // キャッチフレーズエリア
    const catchY = 1060;
    ctx.fillStyle = 'rgba(79, 195, 247, 0.15)';
    ctx.beginPath();
    ctx.roundRect(60, catchY, 960, 100, 20);
    ctx.fill();
    
    // キャッチフレーズを中央に配置
    ctx.fillStyle = '#00ACC1';
    ctx.font = 'bold 36px "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, character.catchphrase, 540, catchY + 55, 900, 45);
    ctx.textBaseline = 'alphabetic';

    // 歯科器具アイコン（装飾）
    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#4FC3F7';
    ctx.fillText('🪥', 100, catchY + 55);
    ctx.fillText('🦷', 980, catchY + 55);

    // 説明文エリア（白い清潔なボックス）
    const descY = 1220;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 5;
    ctx.beginPath();
    ctx.roundRect(60, descY, 960, 520, 25);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // ボーダー
    ctx.strokeStyle = '#FFB6C1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(60, descY, 960, 520, 25);
    ctx.stroke();

    // 説明文のタイトル
    ctx.fillStyle = '#FF6B9D';
    ctx.font = 'bold 36px "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ あなたの特徴 ✨', 540, descY + 55);

    // 説明文の本文（フォントサイズを大きく）
    ctx.fillStyle = '#555';
    ctx.font = '32px "M PLUS Rounded 1c", sans-serif';
    ctx.textAlign = 'center';
    wrapText(ctx, character.description, 540, descY + 130, 880, 48);

    // 下部の招待メッセージ（歯科医院カラー）
    ctx.fillStyle = '#4FC3F7';
    ctx.font = 'bold 38px "M PLUS Rounded 1c", sans-serif';
    ctx.fillText('🦷 あなたも診断してみてね 🪥', 540, 1800);

    // 小さなロゴ風
    ctx.fillStyle = '#999';
    ctx.font = '20px "M PLUS Rounded 1c", sans-serif';
    ctx.fillText('歯科衛生士キャラ診断', 540, 1870);

    // Data URLを生成して保存
    generatedImageUrl = canvas.toDataURL('image/png', 1.0);
    console.log('✅ 画像生成完了！');
    
  } catch (error) {
    console.error('画像生成エラー:', error);
  }
}

// 結果画像を表示（事前生成済みの画像を使用）
async function showResultImage(event) {
  const btn = event.target;
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  const resultImagePreview = document.getElementById('resultImagePreview');
  
  // 既に生成済みの画像がある場合
  if (generatedImageUrl) {
    resultImagePreview.src = generatedImageUrl;
    imagePreviewContainer.style.display = 'block';
    btn.style.display = 'none';
    
    // スムーズにスクロール
    setTimeout(() => {
      imagePreviewContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    return;
  }
  
  // まだ生成中の場合はローディング表示
  const originalText = btn.textContent;
  btn.textContent = '生成中...';
  btn.disabled = true;
  
  try {
    // 画像生成を待つ
    await generateResultImage();
    
    if (generatedImageUrl) {
      resultImagePreview.src = generatedImageUrl;
      imagePreviewContainer.style.display = 'block';
      btn.style.display = 'none';
      
      // スムーズにスクロール
      setTimeout(() => {
        imagePreviewContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  } catch (error) {
    console.error('画像生成エラー:', error);
    alert('画像の生成に失敗しました。\nもう一度お試しください。');
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// 旧関数（互換性のため残す）
async function downloadResultImage(event) {
  return showResultImage(event);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split('');
  let line = '';
  let testLine = '';
  let lineArray = [];
  
  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lineArray.push(line);
      line = words[n];
    } else {
      line = testLine;
    }
  }
  lineArray.push(line);
  
  for (let k = 0; k < lineArray.length; k++) {
    ctx.fillText(lineArray[k], x, y + (k * lineHeight));
  }
}
