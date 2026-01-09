# 歯科衛生士キャラ診断メーカー

## 🦷 プロジェクト概要

12問の質問に答えて、あなたにぴったりの働き方がわかる歯科衛生士向けのMBTI診断サイトです。

### 主な機能
- 3つの属性選択（学生🐥・現役🦷・復帰考え中🤔）
- 12問の質問による性格診断
- 16タイプのキャラクター結果
- レーダーチャートによる特性の可視化
- SNSシェア機能（TikTok/Instagram）
- 結果画像のダウンロード機能
- 公式LINE誘導

## 🌐 公開URL

- **本番サイト**: https://dental-hygienist-diagnosis.pages.dev/
- **GitHubリポジトリ**: https://github.com/yscrafta/dh-shindan

## 📊 データアーキテクチャ

### キャラクターデータ
16種類のMBTIタイプに基づくキャラクター：
- ENFP, ENFJ, ENTJ, ENTP
- ESFP, ESFJ, ESTJ, ESTP
- INFP, INFJ, INTJ, INTP
- ISFP, ISFJ, ISTJ, ISTP

### 質問データ構造
- 共通質問: 3問（全ユーザー共通）
- 属性別質問: 9問（学生/現役/復帰考え中）
- 合計: 12問

### スコアリングシステム
各回答にMBTI要素のスコアを設定：
- E/I（外向/内向）
- S/N（感覚/直感）
- T/F（思考/感情）
- J/P（判断/知覚）

### レーダーチャート要素
5つの特性を5段階で評価：
- 共感力
- 技術力
- コミュ力
- 積極性
- 柔軟性

## 🎯 ユーザーフロー

1. **TOPページ**: 「診断スタート」or「結果を見る」
2. **属性選択**: 学生/現役/復帰考え中を選択
3. **質問ページ**: 12問の質問に回答（進捗バー表示）
4. **結果ページ**: 
   - キャラクター画像・名前・説明
   - レーダーチャート
   - 向いている働き方・医院タイプ
   - 相性の良いキャラクター
   - 画像ダウンロードボタン
   - SNSシェアボタン（TikTok/Instagram）
   - 公式LINE誘導

## 💻 技術スタック

- **フレームワーク**: Hono（Cloudflare Workers）
- **デプロイ**: Cloudflare Pages
- **フロントエンド**: Vanilla JavaScript + TailwindCSS（CDN）
- **バージョン管理**: Git + GitHub
- **ビルドツール**: Vite

## 🎨 デザイン

- **カラーテーマ**: 青→ピンクのグラデーション（#A7D1E9 → #B8D2E5 → #FCD5DE）
- **フォント**: M PLUS Rounded 1c（Googleフォント）
- **レスポンシブ**: モバイルファースト設計

## 📱 シェア機能

### TikTok / Instagram
- 結果画像をダウンロード（1080×1920px）
- ストーリーに最適化されたサイズ
- キャラクター情報と公式LINE URLを含む

### 画像ダウンロード内容
- キャラクター画像
- キャラクター名・MBTIタイプ
- キャッチフレーズ
- 説明文
- 公式LINE URL

## 🚀 デプロイ状況

- **ステータス**: ✅ 本番稼働中
- **プラットフォーム**: Cloudflare Pages
- **プロジェクト名**: dental-hygienist-diagnosis
- **本番ブランチ**: main
- **最終デプロイ**: 2026年1月9日

## 📂 プロジェクト構造

```
webapp/
├── public/                      # 静的ファイル
│   ├── index.html              # TOPページ
│   ├── select-type.html        # 属性選択
│   ├── question.html           # 質問ページ
│   ├── result.html             # 結果ページ
│   └── static/
│       ├── images/             # キャラクター画像（17枚）
│       ├── styles.css          # スタイルシート
│       ├── character-data.js   # キャラクターデータ
│       ├── question-data.js    # 質問データ
│       ├── question-logic.js   # 質問ロジック
│       └── result-logic.js     # 結果表示ロジック
├── src/
│   └── index.tsx               # Honoアプリケーション
├── dist/                        # ビルド出力（自動生成）
├── wrangler.jsonc              # Cloudflare設定
├── vite.config.ts              # Viteビルド設定
├── ecosystem.config.cjs        # PM2設定（開発用）
└── package.json                # 依存関係

```

## 🔧 開発コマンド

```bash
# 開発サーバー起動（サンドボックス環境）
npm run build
pm2 start ecosystem.config.cjs

# 本番ビルド
npm run build

# Cloudflare Pagesにデプロイ
npm run deploy

# ポートクリーンアップ
npm run clean-port

# サービステスト
npm run test
```

## 📝 今後の改善案

### 完成済み機能
✅ 3つの属性選択（学生・現役・復帰考え中）  
✅ 属性別の質問カスタマイズ  
✅ 16タイプのキャラクター診断  
✅ レーダーチャート表示  
✅ SNSシェア機能（TikTok/Instagram）  
✅ 画像ダウンロード機能  
✅ 公式LINE誘導  
✅ ローカルストレージによる結果保存  

### 追加検討中の機能
- [ ] 診断結果の詳細分析
- [ ] キャラクター相性診断の拡張
- [ ] 複数回診断の履歴機能
- [ ] OGP画像の動的生成
- [ ] アクセス解析の実装

## 👤 開発者情報

- **GitHubアカウント**: yscrafta
- **メールアドレス**: yscraft.a@gmail.com
- **リポジトリ**: https://github.com/yscrafta/dh-shindan

## 📄 ライセンス

このプロジェクトは個人用途で開発されています。

---

**最終更新日**: 2026年1月9日
