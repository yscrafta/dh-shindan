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

// ページ読み込み時に結果を表示
window.addEventListener('DOMContentLoaded', function() {
  displayResult();
  drawRadarChart();
});

// 結果を表示
function displayResult() {
  document.getElementById('characterImage').src = character.image;
  document.getElementById('characterImage').alt = character.name;
  document.getElementById('typeName').textContent = character.name;
  document.getElementById('mbtiType').textContent = character.mbti;
  document.getElementById('catchphrase').textContent = character.catchphrase;
  document.getElementById('description').textContent = character.description;

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
  const size = Math.min(container.clientWidth - 60, 350);  // 400 → 350に縮小
  canvas.width = size;
  canvas.height = size;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = size * 0.3;  // 0.35 → 0.3に縮小
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
    const labelRadius = maxRadius + 35;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
    
    // 背景の白い円を描画
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);  // 22 → 20に縮小
    ctx.fill();
    
    // ラベルテキストを描画
    ctx.fillStyle = '#2C5F8D';
    ctx.font = 'bold 13px "M PLUS Rounded 1c", sans-serif';  // 14px → 13pxに縮小
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

// シェア機能（現在のページURLをコピー）
function shareResult() {
  const resultUrl = window.location.href;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(resultUrl).then(() => {
      alert('診断結果のURLをコピーしました！📋\n\nSNSに貼り付けてシェアしてください');
    }).catch(() => {
      fallbackCopy(resultUrl);
    });
  } else {
    fallbackCopy(resultUrl);
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

// 結果画像をダウンロード
async function downloadResultImage(event) {
  // ローディング表示
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = '生成中...';
  btn.disabled = true;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    // 背景のグラデーション
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
    gradient.addColorStop(0, '#A7D1E9');
    gradient.addColorStop(0.5, '#B8D2E5');
    gradient.addColorStop(1, '#FCD5DE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // タイトル
    ctx.fillStyle = '#333';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('あなたはどの歯科衛生士？', 540, 100);

    // 画像をfetchで取得してからcanvasに描画
    const response = await fetch(character.image);
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
      img.src = imageUrl;
    });

    // キャラクター画像（中央）
    const imgWidth = 600;
    const imgHeight = 600;
    const imgX = (1080 - imgWidth) / 2;
    const imgY = 200;
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
    
    URL.revokeObjectURL(imageUrl);

    // キャラクター名
    ctx.fillStyle = '#FF6B9D';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(character.name, 540, 900);

    // MBTIタイプ
    ctx.fillStyle = '#666';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(character.mbti, 540, 960);

    // キャッチフレーズ
    ctx.fillStyle = '#333';
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'center';
    const maxWidth = 900;
    wrapText(ctx, character.catchphrase, 540, 1040, maxWidth, 50);

    // 説明文
    ctx.font = '24px sans-serif';
    wrapText(ctx, character.description, 540, 1200, maxWidth, 40);

    // 公式LINE誘導
    ctx.fillStyle = '#00B900';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('📱 公式LINEでより詳しい診断をゲット！', 540, 1700);

    // URL
    ctx.fillStyle = '#666';
    ctx.font = '20px sans-serif';
    ctx.fillText('https://dental-hygienist-diagnosis.pages.dev/', 540, 1800);

    // ボタンを元に戻す
    btn.textContent = originalText;
    btn.disabled = false;

    // 画像を新しいタブで表示（モバイル対応）
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const newWindow = window.open();
    
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>診断結果画像</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #f0f0f0;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: sans-serif;
            }
            img {
              max-width: 100%;
              height: auto;
              box-shadow: 0 4px 12px rgba(0,0,0,0.2);
              border-radius: 10px;
            }
            p {
              margin: 20px 0;
              text-align: center;
              color: #333;
              font-size: 16px;
              line-height: 1.6;
            }
            .note {
              background: white;
              padding: 15px;
              border-radius: 8px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="診断結果" />
          <div class="note">
            <p><strong>📸 画像を保存する方法</strong></p>
            <p>画像を<strong>長押し</strong>して「画像を保存」を選択してください</p>
          </div>
        </body>
        </html>
      `);
    } else {
      // ポップアップがブロックされた場合
      alert('画像を表示できませんでした。\nポップアップブロックを解除してください。');
    }
    
  } catch (error) {
    console.error('画像生成エラー:', error);
    alert('画像の生成に失敗しました。\nもう一度お試しください。');
    btn.textContent = originalText;
    btn.disabled = false;
  }
}

// テキストを折り返して描画
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
