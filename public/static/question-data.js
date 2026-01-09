// 質問データ - 歯科衛生士キャラ診断

// 共通質問（Q1-Q3）
const commonQuestions = [
  {
    id: 1,
    text: '初対面の人と話すとき、あなたは？',
    choices: [
      { text: 'A) 自分から積極的に話しかける', scores: { E: 2 } },
      { text: 'B) 相手から話しかけられるのを待つ', scores: { I: 2 } },
      { text: 'C) 状況によって変わる', scores: { E: 1, I: 1 } }
    ]
  },
  {
    id: 2,
    text: '新しいことを学ぶとき、あなたは？',
    choices: [
      { text: 'A) 実際にやってみて覚える', scores: { S: 2 } },
      { text: 'B) まず全体の流れを理解する', scores: { N: 2 } },
      { text: 'C) どちらも大切にする', scores: { S: 1, N: 1 } }
    ]
  },
  {
    id: 3,
    text: '判断するとき、あなたは？',
    choices: [
      { text: 'A) 相手の気持ちを優先する', scores: { F: 2 } },
      { text: 'B) 論理的な正しさを優先する', scores: { T: 2 } },
      { text: 'C) 状況に応じて使い分ける', scores: { F: 1, T: 1 } }
    ]
  }
];

// 学生版質問（Q4-Q12）
const studentQuestions = [
  {
    id: 4,
    text: '実習初日、あなたは？',
    choices: [
      { text: 'A) 積極的に質問・手伝いを申し出る', scores: { E: 2, J: 1 } },
      { text: 'B) まず観察して雰囲気を掴む', scores: { I: 2, P: 1 } },
      { text: 'C) 指示を待ってから動く', scores: { I: 1, J: 1 } }
    ]
  },
  {
    id: 5,
    text: '実習で新しい器具を学んだら？',
    choices: [
      { text: 'A) すぐに試してみたい', scores: { P: 2, N: 1 } },
      { text: 'B) 先輩のやり方を見てから', scores: { S: 2, J: 1 } },
      { text: 'C) しっかり練習してから使いたい', scores: { S: 1, J: 2 } }
    ]
  },
  {
    id: 6,
    text: '患者さんへの説明実習で大切なのは？',
    choices: [
      { text: 'A) 分かりやすい言葉で丁寧に', scores: { F: 2, S: 1 } },
      { text: 'B) 正確な情報と根拠をもとに', scores: { T: 2, S: 1 } },
      { text: 'C) 患者さんの反応を見ながら', scores: { F: 1, N: 1 } }
    ]
  },
  {
    id: 7,
    text: 'グループワークで、あなたは？',
    choices: [
      { text: 'A) リーダーやまとめ役', scores: { E: 2, J: 1 } },
      { text: 'B) アイデアを出す役', scores: { E: 1, N: 2 } },
      { text: 'C) サポート・記録役', scores: { I: 2, S: 1 } }
    ]
  },
  {
    id: 8,
    text: '試験勉強の進め方は？',
    choices: [
      { text: 'A) 計画を立ててコツコツ', scores: { J: 2, S: 1 } },
      { text: 'B) 集中して一気に仕上げる', scores: { P: 2 } },
      { text: 'C) 友達と教え合いながら', scores: { E: 2, F: 1 } }
    ]
  },
  {
    id: 9,
    text: '国家試験に向けて？',
    choices: [
      { text: 'A) 早めに準備を始める', scores: { J: 2 } },
      { text: 'B) 過去問を分析して効率的に', scores: { T: 2, N: 1 } },
      { text: 'C) ギリギリになってから追い込む', scores: { P: 2 } }
    ]
  },
  {
    id: 10,
    text: '就職先を選ぶとき重視するのは？',
    choices: [
      { text: 'A) 職場の雰囲気・人間関係', scores: { F: 2 } },
      { text: 'B) 学べる環境', scores: { T: 1, N: 2 } },
      { text: 'C) 安定性・福利厚生', scores: { S: 2, J: 1 } }
    ]
  },
  {
    id: 11,
    text: '将来のキャリアイメージは？',
    choices: [
      { text: 'A) まだ分からない・色々試したい', scores: { P: 2, N: 1 } },
      { text: 'B) 専門性を高めたい', scores: { T: 2, J: 1 } },
      { text: 'C) 長く続けられる衛生士', scores: { S: 1, J: 1 } }
    ]
  },
  {
    id: 12,
    text: '実習で困ったとき？',
    choices: [
      { text: 'A) すぐに先輩に相談', scores: { E: 2 } },
      { text: 'B) まず自分で考えてから相談', scores: { I: 2, T: 1 } },
      { text: 'C) 友達と相談しながら解決', scores: { E: 1, F: 1 } }
    ]
  }
];

// 社会人版質問（Q4-Q12）
const professionalQuestions = [
  {
    id: 4,
    text: '急な予約変更が入ったら？',
    choices: [
      { text: 'A) すぐに対応策を考えて動く', scores: { E: 2, P: 2 } },
      { text: 'B) 落ち着いて状況を整理する', scores: { I: 2, J: 1 } },
      { text: 'C) チームに相談して決める', scores: { E: 1, F: 1 } }
    ]
  },
  {
    id: 5,
    text: '新しい技術や方法を学んだら？',
    choices: [
      { text: 'A) すぐに実践してみたい', scores: { N: 2, P: 1 } },
      { text: 'B) あまり新しいことはやりたくない', scores: { S: 2, J: 2 } },
      { text: 'C) 少しずつならやってみたい', scores: { S: 1, J: 1 } }
    ]
  },
  {
    id: 6,
    text: '患者さんへの指導で心がけるのは？',
    choices: [
      { text: 'A) 共感しながら寄り添う', scores: { F: 2 } },
      { text: 'B) 根拠を示して説得する', scores: { T: 2 } },
      { text: 'C) 相手に合わせて変える', scores: { N: 1, F: 1 } }
    ]
  },
  {
    id: 7,
    text: 'チームミーティングで？',
    choices: [
      { text: 'A) 積極的に意見を言う', scores: { E: 2, T: 1 } },
      { text: 'B) 必要なときだけ発言', scores: { I: 2 } },
      { text: 'C) みんなの意見を聞く役', scores: { I: 1, F: 2 } }
    ]
  },
  {
    id: 8,
    text: '後輩指導について？',
    choices: [
      { text: 'A) 積極的に教えたい', scores: { E: 2, F: 2 } },
      { text: 'B) 論理的に説明したい', scores: { E: 2, T: 2 } },
      { text: 'C) サポートはするが見守りたい', scores: { I: 2, F: 1 } }
    ]
  },
  {
    id: 9,
    text: '新しい分野への興味は？',
    choices: [
      { text: 'A) 挑戦してみたい', scores: { N: 2, P: 1 } },
      { text: 'B) 今の専門性を深めたい', scores: { S: 2, J: 2 } },
      { text: 'C) 機会があれば考える', scores: { S: 1, P: 1 } }
    ]
  },
  {
    id: 10,
    text: '転職を考えるとき重視するのは？',
    choices: [
      { text: 'A) 年収・待遇', scores: { T: 1, S: 1 } },
      { text: 'B) 人間関係・雰囲気', scores: { F: 2 } },
      { text: 'C) 学べる環境・成長', scores: { N: 2, T: 1 } }
    ]
  },
  {
    id: 11,
    text: '理想の働き方は？',
    choices: [
      { text: 'A) バリバリ働いてキャリアアップ', scores: { E: 2, J: 2 } },
      { text: 'B) ワークライフバランス重視', scores: { I: 1, P: 1 } },
      { text: 'C) 患者さんに寄り添う時間を大切に', scores: { F: 2, S: 1 } }
    ]
  },
  {
    id: 12,
    text: '仕事で困ったとき？',
    choices: [
      { text: 'A) すぐに相談・協力を求める', scores: { E: 2, F: 1 } },
      { text: 'B) 自分で解決策を考える', scores: { I: 2, T: 2 } },
      { text: 'C) 信頼できる人に相談', scores: { I: 1, F: 1 } }
    ]
  }
];

// 復帰考え中版質問（Q4-Q12）
const returningQuestions = [
  {
    id: 4,
    text: 'ブランク期間中、気になっていたことは？',
    choices: [
      { text: 'A) 技術や知識が古くなっていないか', scores: { T: 2, J: 1 } },
      { text: 'B) 職場の人間関係に馴染めるか', scores: { F: 2, I: 1 } },
      { text: 'C) 体力や生活リズムがついていけるか', scores: { S: 2, P: 1 } }
    ]
  },
  {
    id: 5,
    text: '復帰後の新しい環境について？',
    choices: [
      { text: 'A) 早く慣れて積極的に関わりたい', scores: { E: 2, P: 1 } },
      { text: 'B) ゆっくり様子を見ながら慣れたい', scores: { I: 2, S: 1 } },
      { text: 'C) 計画的に段階を踏んで慣れたい', scores: { J: 2, S: 1 } }
    ]
  },
  {
    id: 6,
    text: '最新の機器や技術を学ぶとき？',
    choices: [
      { text: 'A) 興味を持って積極的に学びたい', scores: { N: 2, E: 1 } },
      { text: 'B) 必要なものから少しずつ学ぶ', scores: { S: 2, J: 1 } },
      { text: 'C) 先輩に教わりながら慎重に', scores: { I: 2, F: 1 } }
    ]
  },
  {
    id: 7,
    text: '患者さんへの対応で大切にしたいのは？',
    choices: [
      { text: 'A) 丁寧で親身な対応', scores: { F: 2, I: 1 } },
      { text: 'B) 正確で適切な処置', scores: { T: 2, S: 1 } },
      { text: 'C) 柔軟で臨機応変な対応', scores: { N: 1, P: 2 } }
    ]
  },
  {
    id: 8,
    text: '復帰後の勤務形態は？',
    choices: [
      { text: 'A) フルタイムでしっかり働きたい', scores: { E: 2, J: 2 } },
      { text: 'B) パートで無理なく続けたい', scores: { I: 1, P: 1 } },
      { text: 'C) 状況に合わせて調整したい', scores: { P: 2, F: 1 } }
    ]
  },
  {
    id: 9,
    text: '職場選びで最も重視するのは？',
    choices: [
      { text: 'A) 働きやすさ・融通の利きやすさ', scores: { F: 2, P: 1 } },
      { text: 'B) 研修制度・教育体制の充実', scores: { T: 2, N: 1 } },
      { text: 'C) 通勤の便・勤務時間', scores: { S: 2, J: 1 } }
    ]
  },
  {
    id: 10,
    text: '家庭と仕事の両立について？',
    choices: [
      { text: 'A) 仕事も家庭も全力で頑張りたい', scores: { E: 2, J: 1 } },
      { text: 'B) バランスを取りながら無理なく', scores: { I: 1, P: 2 } },
      { text: 'C) 家庭を優先しながら働きたい', scores: { F: 2, S: 1 } }
    ]
  },
  {
    id: 11,
    text: '復帰後のキャリアビジョンは？',
    choices: [
      { text: 'A) まず現場に慣れることが優先', scores: { S: 2, J: 1 } },
      { text: 'B) 以前のスキルを取り戻したい', scores: { T: 2, I: 1 } },
      { text: 'C) 新しいことにも挑戦したい', scores: { N: 2, P: 1 } }
    ]
  },
  {
    id: 12,
    text: '復帰にあたって不安なことがあったら？',
    choices: [
      { text: 'A) すぐに相談して解決したい', scores: { E: 2, F: 1 } },
      { text: 'B) 自分で調べて対処する', scores: { I: 2, T: 1 } },
      { text: 'C) 同じ立場の人と共有したい', scores: { E: 1, F: 2 } }
    ]
  }
];
