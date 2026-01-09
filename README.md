# 歯科衛生士キャラ診断メーカー

## プロジェクト概要
- **名前**: あなたはどの歯科衛生士？キャラ診断メーカー
- **目的**: 歯科衛生士学生・現役歯科衛生士向けの性格診断サイト
- **特徴**: 
  - 12問の質問に答えてMBTIベースの16タイプのキャラクターに診断
  - 学生版・社会人版で質問を分岐
  - 可愛いパステルブルーのデザイン
  - レーダーチャート表示
  - 公式LINE誘導機能

## 現在実装済みの機能

### 1. TOPページ（index.html）
- 診断スタートボタン
- 結果を見るボタン（診断後に表示）
- TOP画像表示

### 2. 属性選択ページ（select-type.html）
- 歯科衛生士学生（🦷）
- 現役歯科衛生士（🪥）

### 3. 診断質問ページ（question.html）
- 進捗バー表示（Q1/12形式）
- 共通質問3問
- 学生版・社会人版それぞれ9問（計12問）
- MBTIスコア計算機能

### 4. 診断結果ページ（result.html）
- キャラクター画像表示
- タイプ名、キャッチコピー、性格説明
- レーダーチャート（Canvas描画）
  - 共感力
  - 技術力
  - コミュニケーション力
  - 積極性
  - 柔軟性
- 向いている働き方
- 向いている医院タイプ
- 相性の良いキャラ
- SNSシェアボタン（Twitter・LINE）
- 公式LINE誘導ボタン（https://lin.ee/PJoKVxPo）
- もう一度診断するボタン

### 5. 16タイプのキャラクター
1. ポジティブうさぎ型（ENFP）
2. リーダーライオン型（ENTJ）
3. 職人ねこ型（ISTP）
4. 癒しパンダ型（ISFP）
5. 教育者フクロウ型（INFJ）
6. ムードメーカーイヌ型（ESFP）
7. サポートひつじ型（ESFJ）
8. 戦略家キツネ型（INTJ）
9. 探究者リス型（INTP）
10. アイデアマンペンギン型（ENTP）
11. 慎重派コアラ型（ISFJ）
12. 完璧主義シカ型（ISTJ）
13. 情熱家トラ型（ENFJ）
14. 思慮深いクマ型（INFP）
15. 実務家カンガルー型（ESTJ）
16. 好奇心ハムスター型（ESTP）

## データ構造

### LocalStorageに保存されるデータ
- `user_type`: 'student' または 'professional'
- `current_question`: 現在の質問番号（1-12）
- `diagnosis_answers`: 回答データとMBTIスコア
- `diagnosis_result`: 診断結果のMBTIタイプ（例: ENFP）

### MBTIスコア計算方式
- E/I（外向/内向）
- S/N（感覚/直観）
- T/F（思考/感情）
- J/P（判断/知覚）

各質問の選択肢にスコアを設定し、合計値で判定。

## 技術スタック

### フロントエンド
- HTML5/CSS3/JavaScript（Vanilla JS）
- Canvas API（レーダーチャート描画）
- Google Fonts（M PLUS Rounded 1c）
- LocalStorage（データ保存）

### バックエンド
- Hono（Cloudflare Workers/Pages用軽量フレームワーク）
- TypeScript
- Vite（ビルドツール）

### デプロイ
- Cloudflare Pages
- Wrangler（Cloudflare CLI）

## ローカル開発

### サンドボックス環境
```bash
# ビルド
npm run build

# PM2でサービス起動
pm2 start ecosystem.config.cjs

# サービステスト
curl http://localhost:3000

# ログ確認
pm2 logs webapp --nostream
```

### ローカルマシン
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## プロジェクト構造
```
webapp/
├── src/
│   └── index.tsx          # Honoアプリケーション
├── public/
│   ├── index.html         # TOPページ
│   ├── select-type.html   # 属性選択ページ
│   ├── question.html      # 質問ページ
│   ├── result.html        # 結果ページ
│   └── static/
│       ├── styles.css     # 共通CSS
│       ├── question-data.js       # 質問データ
│       ├── question-logic.js      # 質問ページロジック
│       ├── character-data.js      # キャラクターデータ
│       ├── result-logic.js        # 結果ページロジック
│       └── images/        # 画像ファイル（TOP画像 + 16キャラ）
├── dist/                  # ビルド出力
│   ├── _worker.js         # Cloudflare Worker
│   ├── _routes.json       # ルーティング設定
│   └── ...                # 静的ファイル
├── ecosystem.config.cjs   # PM2設定
├── wrangler.jsonc         # Cloudflare設定
├── vite.config.ts         # Vite設定
└── package.json
```

## デプロイ手順

### Cloudflare Pages
```bash
# ビルド
npm run build

# デプロイ
npm run deploy:prod
```

### デプロイ先URL
- **開発環境**: https://3000-iyl1s73oadku0s0j2x031-5634da27.sandbox.novita.ai
- **本番環境**: （デプロイ後に更新）

## デザインガイドライン

### カラースキーム
- メインカラー: パステルブルー系（#E6F3FF, #B3D9FF, #80BFFF）
- アクセントカラー: ピンク系（#FF6B9D, #FFA07A）
- LINE誘導: グリーン系（#00C300）

### フォント
- メインフォント: M PLUS Rounded 1c（丸ゴシック）

### デザイン要素
- 丸みのあるボタン（border-radius: 50px）
- ふんわりしたホバーエフェクト
- グラデーション背景
- 影付きカード
- 可愛くて優しい雰囲気

## 今後の開発予定

### 未実装機能
- 結果のスクリーンショット保存機能
- より詳細な診断結果（公式LINE限定）
- 診断結果の統計データ収集

### 推奨される改善点
1. OGP画像の設定（SNSシェア時の表示最適化）
2. Google Analytics導入（アクセス解析）
3. セキュリティヘッダーの追加
4. パフォーマンス最適化（画像圧縮など）

## ライセンス
MIT License

## 最終更新日
2026-01-09
