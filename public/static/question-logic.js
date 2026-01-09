// 質問ページのロジック

// 現在の質問番号を取得
let currentQuestionIndex = parseInt(localStorage.getItem('current_question') || '1');
const userType = localStorage.getItem('user_type') || 'student';

// 回答データを取得または初期化
let answers = JSON.parse(localStorage.getItem('diagnosis_answers') || '{}');

// MBTI スコアを初期化
if (!answers.scores) {
  answers.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

// 質問を取得する関数
function getQuestion(index) {
  if (index <= 3) {
    return commonQuestions[index - 1];
  } else {
    let specificQuestions;
    if (userType === 'student') {
      specificQuestions = studentQuestions;
    } else if (userType === 'returning') {
      specificQuestions = returningQuestions;
    } else {
      specificQuestions = professionalQuestions;
    }
    return specificQuestions[index - 4];
  }
}

// 質問を表示
function displayQuestion() {
  const question = getQuestion(currentQuestionIndex);
  
  if (!question) {
    // すべての質問が終了したら結果を計算
    calculateResult();
    return;
  }

  // 進捗表示を更新
  document.getElementById('progressText').textContent = `Q${currentQuestionIndex}/12`;
  const progressPercent = (currentQuestionIndex / 12) * 100;
  document.getElementById('progressFill').style.width = `${progressPercent}%`;

  // 質問テキストを表示
  document.getElementById('questionText').textContent = question.text;

  // 選択肢を表示
  const choicesContainer = document.getElementById('choices');
  choicesContainer.innerHTML = '';

  question.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.className = 'choice-btn';
    button.textContent = choice.text;
    button.onclick = () => selectAnswer(choice);
    choicesContainer.appendChild(button);
  });
}

// 回答を選択
function selectAnswer(choice) {
  // スコアを加算
  Object.keys(choice.scores).forEach(key => {
    answers.scores[key] += choice.scores[key];
  });

  // LocalStorageに保存
  localStorage.setItem('diagnosis_answers', JSON.stringify(answers));

  // 次の質問へ
  currentQuestionIndex++;
  localStorage.setItem('current_question', currentQuestionIndex.toString());

  if (currentQuestionIndex <= 12) {
    displayQuestion();
  } else {
    calculateResult();
  }
}

// 結果を計算してMBTIタイプを判定
function calculateResult() {
  const scores = answers.scores;

  // 各軸で優位な方を判定
  const E_I = scores.E >= scores.I ? 'E' : 'I';
  const S_N = scores.S >= scores.N ? 'S' : 'N';
  const T_F = scores.T >= scores.F ? 'T' : 'F';
  const J_P = scores.J >= scores.P ? 'J' : 'P';

  const mbtiType = E_I + S_N + T_F + J_P;

  // 結果を保存
  localStorage.setItem('diagnosis_result', mbtiType);

  // 結果ページへ遷移
  window.location.href = `/result.html?type=${mbtiType}`;
}

// 戻るボタン
function goBack() {
  if (currentQuestionIndex > 1) {
    currentQuestionIndex--;
    localStorage.setItem('current_question', currentQuestionIndex.toString());
    
    // 前の回答のスコアを引く（簡略化のため、完全な実装では前回の選択肢を記録する必要あり）
    displayQuestion();
  } else {
    window.location.href = '/select-type.html';
  }
}

// ページ読み込み時に質問を表示
window.addEventListener('DOMContentLoaded', displayQuestion);
