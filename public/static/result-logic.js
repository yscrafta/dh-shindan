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
  const size = Math.min(container.clientWidth - 60, 400);
  canvas.width = size;
  canvas.height = size;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = size * 0.35;
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

  // ラベルを描画
  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px "M PLUS Rounded 1c", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < labels.length; i++) {
    const angle = (Math.PI * 2 / labels.length) * i - Math.PI / 2;
    const labelRadius = maxRadius + 30;
    const x = centerX + labelRadius * Math.cos(angle);
    const y = centerY + labelRadius * Math.sin(angle);
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

// シェア機能
function shareResult() {
  const siteUrl = 'https://dental-hygienist-diagnosis.pages.dev/';
  const shareText = `私は「${character.name}」でした！\n${character.catchphrase}\n\nあなたはどの歯科衛生士？`;
  
  // Web Share APIをサポートしているか確認
  if (navigator.share) {
    navigator.share({
      title: 'あなたはどの歯科衛生士？',
      text: shareText,
      url: siteUrl
    }).then(() => {
      console.log('シェア成功');
    }).catch((error) => {
      console.log('シェアキャンセル', error);
      fallbackShare(siteUrl, shareText);
    });
  } else {
    fallbackShare(siteUrl, shareText);
  }
}

// フォールバック（コピー機能）
function fallbackShare(url, text) {
  const shareContent = `${text}\n\n${url}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareContent).then(() => {
      alert('診断結果のリンクをコピーしました！\n\nSNSに貼り付けてシェアしてください 📤');
    }).catch(() => {
      promptCopy(shareContent);
    });
  } else {
    promptCopy(shareContent);
  }
}

// テキストエリアでコピー
function promptCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    alert('診断結果のリンクをコピーしました！\n\nSNSに貼り付けてシェアしてください 📤');
  } catch (err) {
    alert('リンク: https://dental-hygienist-diagnosis.pages.dev/\n\n手動でコピーしてシェアしてください');
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

// 結果画像をダウンロード
function downloadResultImage() {
  // モバイルでは別の方法を使用
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
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

  // キャラクター画像を読み込んで描画
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    // キャラクター画像（中央）
    const imgWidth = 600;
    const imgHeight = 600;
    const imgX = (1080 - imgWidth) / 2;
    const imgY = 200;
    ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

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

    // 画像をダウンロード
    if (isMobile) {
      // モバイル: 新しいタブで画像を開く
      const dataUrl = canvas.toDataURL('image/png');
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write('<img src="' + dataUrl + '" style="max-width:100%;" /><p style="text-align:center;">長押しして画像を保存してください</p>');
      } else {
        // ポップアップがブロックされた場合
        const link = document.createElement('a');
        link.download = `歯科衛生士診断_${character.name}.png`;
        link.href = dataUrl;
        link.click();
      }
    } else {
      // PC: 通常のダウンロード
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `歯科衛生士診断_${character.name}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    }
  };
  img.onerror = function() {
    alert('画像の読み込みに失敗しました。もう一度お試しください。');
  };
  img.src = character.image;
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
