import { randomUUID } from '@/utils/id';
import type { DifficultyLevel, GameQuestion } from '@/types/game';

interface RawQuestion {
  id: string;
  prompt: string;
  difficulty: DifficultyLevel;
  options: Array<{ text: string; isOddOneOut: boolean }>;
}

const footballQuestions: RawQuestion[] = [
  {
    id: 'football-easy-1',
    prompt: 'FCバルセロナの伝統的なホームユニフォームに含まれない色はどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'ディープブルー', isOddOneOut: false },
      { text: 'クラレットレッド', isOddOneOut: false },
      { text: 'ゴールデンイエロー', isOddOneOut: true },
      { text: 'ネイビーストライプ', isOddOneOut: false },
    ],
  },
  {
    id: 'football-easy-2',
    prompt: '伝説のストライカーの中から仲間外れを見つけてください。',
    difficulty: 'easy',
    options: [
      { text: 'ティエリ・アンリ', isOddOneOut: false },
      { text: 'ロナウド・ナザーリオ', isOddOneOut: false },
      { text: 'イケル・カシージャス', isOddOneOut: true },
      { text: 'ディディエ・ドログバ', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-1',
    prompt: 'これらのクラブのうち3つはUEFAチャンピオンズリーグを複数回制覇しています。制覇していないのはどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'ACミラン', isOddOneOut: false },
      { text: 'ノッティンガム・フォレスト', isOddOneOut: false },
      { text: 'オリンピック・リヨン', isOddOneOut: true },
      { text: 'レアル・マドリード', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-2',
    prompt: '3バックシステムに一般的に関連しない戦術フォーメーションを選んでください。',
    difficulty: 'medium',
    options: [
      { text: '3-4-3', isOddOneOut: false },
      { text: '3-5-2', isOddOneOut: false },
      { text: '4-2-3-1', isOddOneOut: true },
      { text: '3-1-4-2', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-1',
    prompt: 'ブンデスリーガに所属していないクラブを特定してください。',
    difficulty: 'hard',
    options: [
      { text: 'ボルシア・ドルトムント', isOddOneOut: false },
      { text: 'RBライプツィヒ', isOddOneOut: false },
      { text: 'FCシンシナティ', isOddOneOut: true },
      { text: 'バイヤー・レバークーゼン', isOddOneOut: false },
    ],
  },
  {
    id: 'football-expert-1',
    prompt: 'サッカーのルールで、オフサイドの反則基準に含まれないのはどれですか？',
    difficulty: 'expert',
    options: [
      { text: '後ろから2番目のディフェンダーと同一線上にいること', isOddOneOut: false },
      { text: 'リバウンドから利益を得ること', isOddOneOut: false },
      { text: 'スローインから直接ボールを受けること', isOddOneOut: true },
      { text: '相手選手を妨害すること', isOddOneOut: false },
    ],
  },
  {
    id: 'football-easy-3',
    prompt: 'バロンドールを受賞したことがない選手はどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'リオネル・メッシ', isOddOneOut: false },
      { text: 'クリスティアーノ・ロナウド', isOddOneOut: false },
      { text: 'ネイマール・ジュニオール', isOddOneOut: true },
      { text: 'ルカ・モドリッチ', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-3',
    prompt: '3つのスタジアムはFIFAワールドカップ決勝を開催しました。開催していないのはどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'マラカナン', isOddOneOut: false },
      { text: 'ウェンブリー・スタジアム', isOddOneOut: false },
      { text: 'カンプ・ノウ', isOddOneOut: true },
      { text: 'ルサイル・スタジアム', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-2',
    prompt: 'コパ・アメリカで優勝したことがない国はどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'ウルグアイ', isOddOneOut: false },
      { text: 'アルゼンチン', isOddOneOut: false },
      { text: 'メキシコ', isOddOneOut: true },
      { text: 'チリ', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-3',
    prompt: 'チャンピオンズリーグ決勝でゴールを決めたことがない選手を特定してください。',
    difficulty: 'hard',
    options: [
      { text: 'セルヒオ・ラモス', isOddOneOut: false },
      { text: 'ジネディーヌ・ジダン', isOddOneOut: false },
      { text: 'ジャンルイジ・ブッフォン', isOddOneOut: true },
      { text: 'スティーヴン・ジェラード', isOddOneOut: false },
    ],
  },
  {
    id: 'football-expert-2',
    prompt: '2019年のIFAB競技規則改正に含まれなかったルール変更はどれですか？',
    difficulty: 'expert',
    options: [
      { text: '攻撃側選手の壁への参加禁止', isOddOneOut: false },
      { text: 'ゴールキックがペナルティエリアを出る必要がなくなった', isOddOneOut: false },
      { text: '全プロリーグでVARが義務化', isOddOneOut: true },
      { text: '交代選手は最も近いラインから退場', isOddOneOut: false },
    ],
  },
];

const animeQuestions: RawQuestion[] = [
  {
    id: 'anime-easy-1',
    prompt: 'スタジオジブリの作品ではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: '千と千尋の神隠し', isOddOneOut: false },
      { text: '君の名は。', isOddOneOut: true },
      { text: 'ハウルの動く城', isOddOneOut: false },
      { text: 'もののけ姫', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-easy-2',
    prompt: '3人の主人公は主な武器として剣を使います。使わないのは誰ですか？',
    difficulty: 'easy',
    options: [
      { text: '黒崎一護', isOddOneOut: false },
      { text: 'ロロノア・ゾロ', isOddOneOut: false },
      { text: '夜神月', isOddOneOut: true },
      { text: '竈門炭治郎', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-1',
    prompt: '週刊少年ジャンプ発ではない作品を特定してください。',
    difficulty: 'medium',
    options: [
      { text: '呪術廻戦', isOddOneOut: false },
      { text: '僕のヒーローアカデミア', isOddOneOut: false },
      { text: '進撃の巨人', isOddOneOut: true },
      { text: 'ブラッククローバー', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-2',
    prompt: '3人の作曲家は有名な少年アニメのサウンドトラックを手がけました。仲間外れは誰ですか？',
    difficulty: 'medium',
    options: [
      { text: '林ゆうき', isOddOneOut: false },
      { text: '澤野弘之', isOddOneOut: false },
      { text: 'ハンス・ジマー', isOddOneOut: true },
      { text: '鷺巣詩郎', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-1',
    prompt: '2015年以降に初放送されたアニメを見つけてください。',
    difficulty: 'hard',
    options: [
      { text: 'モブサイコ100', isOddOneOut: true },
      { text: 'ハイキュー!!', isOddOneOut: false },
      { text: 'ジョジョの奇妙な冒険 スターダストクルセイダース', isOddOneOut: false },
      { text: 'HUNTER×HUNTER（2011年版）', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-expert-1',
    prompt: 'これらの作家のうち3人は手塚治虫文化賞を受賞しています。受賞していないのは誰ですか？',
    difficulty: 'expert',
    options: [
      { text: '浦沢直樹', isOddOneOut: false },
      { text: '高橋留美子', isOddOneOut: false },
      { text: '尾田栄一郎', isOddOneOut: true },
      { text: '藤田和日郎', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-easy-3',
    prompt: '3つはロボットアニメです。ロボットアニメではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: '新世紀エヴァンゲリオン', isOddOneOut: false },
      { text: 'コードギアス', isOddOneOut: false },
      { text: 'デスノート', isOddOneOut: true },
      { text: '天元突破グレンラガン', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-3',
    prompt: 'スタジオMAPPAが制作していないアニメはどれですか？',
    difficulty: 'medium',
    options: [
      { text: '呪術廻戦', isOddOneOut: false },
      { text: '進撃の巨人 The Final Season', isOddOneOut: false },
      { text: 'SPY×FAMILY', isOddOneOut: true },
      { text: 'チェンソーマン', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-2',
    prompt: 'これらのアニメのうち3つは2010年より前に初放送されました。そうでないのはどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'NARUTO -ナルト-', isOddOneOut: false },
      { text: 'BLEACH', isOddOneOut: false },
      { text: 'ソードアート・オンライン', isOddOneOut: true },
      { text: '鋼の錬金術師', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-3',
    prompt: 'スタジオボンズが制作していないアニメはどれですか？',
    difficulty: 'hard',
    options: [
      { text: '鋼の錬金術師 FULLMETAL ALCHEMIST', isOddOneOut: false },
      { text: '僕のヒーローアカデミア', isOddOneOut: false },
      { text: 'カウボーイビバップ', isOddOneOut: true },
      { text: 'モブサイコ100', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-expert-2',
    prompt: 'ライトノベルが原作ではないアニメはどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'ソードアート・オンライン', isOddOneOut: false },
      { text: 'Re:ゼロから始める異世界生活', isOddOneOut: false },
      { text: '鋼の錬金術師', isOddOneOut: true },
      { text: 'ノーゲーム・ノーライフ', isOddOneOut: false },
    ],
  },
];

const scienceQuestions: RawQuestion[] = [
  {
    id: 'science-easy-1',
    prompt: '希ガスに分類されないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'ヘリウム', isOddOneOut: false },
      { text: 'ネオン', isOddOneOut: false },
      { text: '酸素', isOddOneOut: true },
      { text: 'アルゴン', isOddOneOut: false },
    ],
  },
  {
    id: 'science-easy-2',
    prompt: '3つの発明は電力利用を変革しました。変革していないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: '交流モーター', isOddOneOut: false },
      { text: 'LED照明', isOddOneOut: false },
      { text: '蒸気タービン', isOddOneOut: true },
      { text: 'リチウムイオン電池', isOddOneOut: false },
    ],
  },
  {
    id: 'science-medium-1',
    prompt: '進化論に関する論文を発表していない科学者を見つけてください。',
    difficulty: 'medium',
    options: [
      { text: 'チャールズ・ダーウィン', isOddOneOut: false },
      { text: 'アルフレッド・ラッセル・ウォレス', isOddOneOut: false },
      { text: 'ジャン＝バティスト・ラマルク', isOddOneOut: false },
      { text: 'グレゴール・メンデル', isOddOneOut: true },
    ],
  },
  {
    id: 'science-medium-2',
    prompt: '火星を探査していない宇宙探査機を選んでください。',
    difficulty: 'medium',
    options: [
      { text: 'バイキング1号', isOddOneOut: false },
      { text: 'キュリオシティ・ローバー', isOddOneOut: false },
      { text: 'カッシーニ・ホイヘンス', isOddOneOut: true },
      { text: 'パーサヴィアランス・ローバー', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-1',
    prompt: '3つの分野は古典力学に属します。属さないのはどれですか？',
    difficulty: 'hard',
    options: [
      { text: '運動学', isOddOneOut: false },
      { text: '動力学', isOddOneOut: false },
      { text: '熱力学', isOddOneOut: true },
      { text: '静力学', isOddOneOut: false },
    ],
  },
  {
    id: 'science-expert-1',
    prompt: '素粒子物理学の標準模型に含まれない概念はどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'ヒッグス粒子', isOddOneOut: false },
      { text: 'WボソンとZボソン', isOddOneOut: false },
      { text: 'グラビトン', isOddOneOut: true },
      { text: 'グルーオン', isOddOneOut: false },
    ],
  },
  {
    id: 'science-easy-3',
    prompt: '太陽系の惑星ではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: '火星', isOddOneOut: false },
      { text: '木星', isOddOneOut: false },
      { text: '冥王星', isOddOneOut: true },
      { text: '土星', isOddOneOut: false },
    ],
  },
  {
    id: 'science-medium-3',
    prompt: 'これらの科学者のうち3人はノーベル物理学賞を受賞しています。受賞していないのは誰ですか？',
    difficulty: 'medium',
    options: [
      { text: 'アルベルト・アインシュタイン', isOddOneOut: false },
      { text: 'ニールス・ボーア', isOddOneOut: false },
      { text: 'ニコラ・テスラ', isOddOneOut: true },
      { text: 'リチャード・ファインマン', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-2',
    prompt: 'レプトンに分類されない粒子はどれですか？',
    difficulty: 'hard',
    options: [
      { text: '電子', isOddOneOut: false },
      { text: 'ミューオン', isOddOneOut: false },
      { text: 'パイオン', isOddOneOut: true },
      { text: 'タウ粒子', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-3',
    prompt: 'これらの元素のうち3つはランタノイドです。ランタノイドではないのはどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'セリウム', isOddOneOut: false },
      { text: 'ユウロピウム', isOddOneOut: false },
      { text: 'ジルコニウム', isOddOneOut: true },
      { text: 'ガドリニウム', isOddOneOut: false },
    ],
  },
  {
    id: 'science-expert-2',
    prompt: '一般相対性理論で予測されない現象はどれですか？',
    difficulty: 'expert',
    options: [
      { text: '重力レンズ効果', isOddOneOut: false },
      { text: 'フレームドラッギング', isOddOneOut: false },
      { text: '量子トンネル効果', isOddOneOut: true },
      { text: '重力による時間の遅れ', isOddOneOut: false },
    ],
  },
];

const spaceExplorersQuestions: RawQuestion[] = [
  {
    id: 'space-explorers-easy-1',
    prompt: 'これらの宇宙飛行士のうち3人は月面を歩きました。歩いていないのは誰ですか？',
    difficulty: 'easy',
    options: [
      { text: 'ニール・アームストロング', isOddOneOut: false },
      { text: 'バズ・オルドリン', isOddOneOut: false },
      { text: 'マイケル・コリンズ', isOddOneOut: true },
      { text: 'アラン・シェパード', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-easy-2',
    prompt: '国際宇宙ステーションのパートナーではない宇宙機関はどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'NASA', isOddOneOut: false },
      { text: 'ESA', isOddOneOut: false },
      { text: 'CNSA', isOddOneOut: true },
      { text: 'JAXA', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-easy-3',
    prompt: '3つはNASAのスペースシャトル・オービターです。オービターではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'コロンビア', isOddOneOut: false },
      { text: 'ディスカバリー', isOddOneOut: false },
      { text: 'アポロ', isOddOneOut: true },
      { text: 'アトランティス', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-1',
    prompt: 'アポロ計画に含まれないミッションはどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'アポロ11号', isOddOneOut: false },
      { text: 'アポロ13号', isOddOneOut: false },
      { text: 'ジェミニ4号', isOddOneOut: true },
      { text: 'アポロ17号', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-2',
    prompt: '3つは木星の衛星です。木星の衛星ではないのはどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'エウロパ', isOddOneOut: false },
      { text: 'ガニメデ', isOddOneOut: false },
      { text: 'タイタン', isOddOneOut: true },
      { text: 'カリスト', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-3',
    prompt: '火星探査用に設計されていないローバーはどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'オポチュニティ', isOddOneOut: false },
      { text: 'スピリット', isOddOneOut: false },
      { text: '玉兔（ユートゥ）', isOddOneOut: true },
      { text: 'キュリオシティ', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-1',
    prompt: '太陽系を離れる軌道に乗っていない探査機はどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'ボイジャー1号', isOddOneOut: false },
      { text: 'ボイジャー2号', isOddOneOut: false },
      { text: 'ジュノー', isOddOneOut: true },
      { text: 'ニュー・ホライズンズ', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-2',
    prompt: 'これらの宇宙飛行士のうち3人はアポロ計画のミッションを指揮しました。指揮していないのは誰ですか？',
    difficulty: 'hard',
    options: [
      { text: 'ジム・ラヴェル', isOddOneOut: false },
      { text: 'フランク・ボーマン', isOddOneOut: false },
      { text: 'ジョン・グレン', isOddOneOut: true },
      { text: 'アラン・シェパード', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-3',
    prompt: '主に赤外線波長で観測しない望遠鏡はどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'ジェイムズ・ウェッブ宇宙望遠鏡', isOddOneOut: false },
      { text: 'スピッツァー宇宙望遠鏡', isOddOneOut: false },
      { text: 'チャンドラX線観測衛星', isOddOneOut: true },
      { text: 'ハーシェル宇宙天文台', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-expert-1',
    prompt: '実際の宇宙船で使用されたことがない推進方式はどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'イオンスラスター', isOddOneOut: false },
      { text: 'ソーラーセイル', isOddOneOut: false },
      { text: 'EMドライブ', isOddOneOut: true },
      { text: 'ホール効果スラスター', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-expert-2',
    prompt: 'これらのミッションのうち3つは金星の重力アシストを利用しました。利用していないのはどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'ガリレオ', isOddOneOut: false },
      { text: 'メッセンジャー', isOddOneOut: false },
      { text: 'ジュノー', isOddOneOut: true },
      { text: 'カッシーニ', isOddOneOut: false },
    ],
  },
];

const streetFoodsQuestions: RawQuestion[] = [
  {
    id: 'street-foods-easy-1',
    prompt: '3つは日本の伝統的な屋台料理です。日本の屋台料理ではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'たこ焼き', isOddOneOut: false },
      { text: '焼き鳥', isOddOneOut: false },
      { text: 'バインミー', isOddOneOut: true },
      { text: 'お好み焼き', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-easy-2',
    prompt: 'メキシコの屋台料理ではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'タコス・アル・パストール', isOddOneOut: false },
      { text: 'エロテ', isOddOneOut: false },
      { text: 'プーティン', isOddOneOut: true },
      { text: 'チュロス', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-easy-3',
    prompt: '3つはインドで人気の屋台スナックです。インドの屋台スナックではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'サモサ', isOddOneOut: false },
      { text: 'パニプリ', isOddOneOut: false },
      { text: 'エンパナーダ', isOddOneOut: true },
      { text: 'ワダパオ', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-1',
    prompt: '東南アジア発祥ではない屋台料理はどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'サテ', isOddOneOut: false },
      { text: 'ハロハロ', isOddOneOut: false },
      { text: 'アレパ', isOddOneOut: true },
      { text: 'ソムタム', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-2',
    prompt: '3つは餃子の一種です。餃子の一種ではないのはどれですか？',
    difficulty: 'medium',
    options: [
      { text: '餃子', isOddOneOut: false },
      { text: 'モモ', isOddOneOut: false },
      { text: 'ファラフェル', isOddOneOut: true },
      { text: 'ピエロギ', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-3',
    prompt: '3つは中東で人気の屋台料理です。中東の屋台料理ではないのはどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'ファラフェル', isOddOneOut: false },
      { text: 'シャワルマ', isOddOneOut: false },
      { text: 'カリーヴルスト', isOddOneOut: true },
      { text: 'マナキーシュ', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-1',
    prompt: '米を主な材料としていない屋台料理はどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'おにぎり', isOddOneOut: false },
      { text: 'ジョロフライス', isOddOneOut: false },
      { text: 'バニーチャウ', isOddOneOut: true },
      { text: 'ナシゴレン', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-2',
    prompt: '3つは伝統的に揚げて作る屋台料理です。揚げないのはどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'チュロス', isOddOneOut: false },
      { text: 'ベニエ', isOddOneOut: false },
      { text: 'クレープ', isOddOneOut: true },
      { text: 'パコラ', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-3',
    prompt: '屋台料理の世界的な首都と広く見なされていない都市はどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'バンコク', isOddOneOut: false },
      { text: 'シンガポール', isOddOneOut: false },
      { text: 'チューリッヒ', isOddOneOut: true },
      { text: 'メキシコシティ', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-expert-1',
    prompt: 'タンドール窯で伝統的に焼かれないフラットブレッドはどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'ナン', isOddOneOut: false },
      { text: 'タンドリー・ロティ', isOddOneOut: false },
      { text: 'トルティーヤ', isOddOneOut: true },
      { text: 'クルチャ', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-expert-2',
    prompt: '3つのソースは唐辛子をベースにしています。唐辛子ベースではないのはどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'シラチャ', isOddOneOut: false },
      { text: 'ハリッサ', isOddOneOut: false },
      { text: 'ツァツィキ', isOddOneOut: true },
      { text: 'サンバル', isOddOneOut: false },
    ],
  },
];

const worldHistoryQuestions: RawQuestion[] = [
  {
    id: 'world-history-easy-1',
    prompt: '3つは古代ギリシャの都市国家でした。都市国家ではなかったのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'アテネ', isOddOneOut: false },
      { text: 'スパルタ', isOddOneOut: false },
      { text: 'カルタゴ', isOddOneOut: true },
      { text: 'コリント', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-easy-2',
    prompt: '第二次世界大戦で枢軸国ではなかったのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'ドイツ', isOddOneOut: false },
      { text: '日本', isOddOneOut: false },
      { text: 'イギリス', isOddOneOut: true },
      { text: 'イタリア', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-easy-3',
    prompt: '3人はフランス革命に関連する人物です。関連しないのは誰ですか？',
    difficulty: 'easy',
    options: [
      { text: 'ロベスピエール', isOddOneOut: false },
      { text: 'ナポレオン・ボナパルト', isOddOneOut: false },
      { text: 'オットー・フォン・ビスマルク', isOddOneOut: true },
      { text: 'マリー・アントワネット', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-1',
    prompt: '18世紀に起こらなかった出来事はどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'アメリカ独立革命', isOddOneOut: false },
      { text: 'フランス革命', isOddOneOut: false },
      { text: 'ロシア革命', isOddOneOut: true },
      { text: '産業革命の始まり', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-2',
    prompt: '3人の探検家はスペインのために航海しました。スペインのために航海しなかったのは誰ですか？',
    difficulty: 'medium',
    options: [
      { text: 'クリストファー・コロンブス', isOddOneOut: false },
      { text: 'フェルディナンド・マゼラン', isOddOneOut: false },
      { text: 'ヴァスコ・ダ・ガマ', isOddOneOut: true },
      { text: 'エルナン・コルテス', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-3',
    prompt: '地中海地域に位置していなかった古代の世界の七不思議はどれですか？',
    difficulty: 'medium',
    options: [
      { text: 'ロドス島の巨像', isOddOneOut: false },
      { text: 'アレクサンドリアの大灯台', isOddOneOut: false },
      { text: 'バビロンの空中庭園', isOddOneOut: true },
      { text: 'エフェソスのアルテミス神殿', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-1',
    prompt: 'ヨーロッパの大きな戦争を終結させなかった条約はどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'ヴェルサイユ条約', isOddOneOut: false },
      { text: 'ヴェストファーレン条約', isOddOneOut: false },
      { text: 'トルデシリャス条約', isOddOneOut: true },
      { text: 'ユトレヒト条約', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-2',
    prompt: '3つの王朝は中国を統治しました。中国を統治しなかったのはどれですか？',
    difficulty: 'hard',
    options: [
      { text: '唐王朝', isOddOneOut: false },
      { text: '宋王朝', isOddOneOut: false },
      { text: 'ムガル帝国', isOddOneOut: true },
      { text: '清王朝', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-3',
    prompt: '古代ギリシャの哲学者ではないのは誰ですか？',
    difficulty: 'hard',
    options: [
      { text: 'ソクラテス', isOddOneOut: false },
      { text: 'プラトン', isOddOneOut: false },
      { text: '孔子', isOddOneOut: true },
      { text: 'アリストテレス', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-expert-1',
    prompt: 'これらの革命のうち3つは1848年に起こりました。1848年に起こらなかったのはどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'フランス二月革命', isOddOneOut: false },
      { text: 'ハンガリー革命', isOddOneOut: false },
      { text: 'ハイチ革命', isOddOneOut: true },
      { text: 'ドイツ三月革命', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-expert-2',
    prompt: '啓蒙時代に書かれなかった著作はどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'ルソーの「社会契約論」', isOddOneOut: false },
      { text: 'モンテスキューの「法の精神」', isOddOneOut: false },
      { text: 'ホッブズの「リヴァイアサン」', isOddOneOut: true },
      { text: '「人間悟性論」', isOddOneOut: false },
    ],
  },
];

const popMusicQuestions: RawQuestion[] = [
  {
    id: 'pop-music-easy-1',
    prompt: '3人はBTSのメンバーです。メンバーではないのは誰ですか？',
    difficulty: 'easy',
    options: [
      { text: 'ジョングク', isOddOneOut: false },
      { text: 'V（テテ）', isOddOneOut: false },
      { text: 'G-Dragon（ジードラゴン）', isOddOneOut: true },
      { text: 'RM', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-easy-2',
    prompt: 'マイケル・ジャクソンが歌っていない曲はどれですか？',
    difficulty: 'easy',
    options: [
      { text: 'スリラー', isOddOneOut: false },
      { text: 'ビリー・ジーン', isOddOneOut: false },
      { text: 'パープル・レイン', isOddOneOut: true },
      { text: 'ビート・イット', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-easy-3',
    prompt: '3つはテイラー・スウィフトのアルバムです。テイラーのアルバムではないのはどれですか？',
    difficulty: 'easy',
    options: [
      { text: '1989', isOddOneOut: false },
      { text: 'フォークロア', isOddOneOut: false },
      { text: 'レモネード', isOddOneOut: true },
      { text: 'ミッドナイツ', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-1',
    prompt: '有名なポップデュオの一員ではなかったアーティストは誰ですか？',
    difficulty: 'medium',
    options: [
      { text: 'ソニー・ボノ', isOddOneOut: false },
      { text: 'アンドリュー・リッジリー', isOddOneOut: false },
      { text: 'フレディ・マーキュリー', isOddOneOut: true },
      { text: 'ジョン・オーツ', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-2',
    prompt: '3人のアーティストはスーパーボウルのハーフタイムショーのヘッドライナーを務めました。務めていないのは誰ですか？',
    difficulty: 'medium',
    options: [
      { text: 'ビヨンセ', isOddOneOut: false },
      { text: 'レディー・ガガ', isOddOneOut: false },
      { text: 'アデル', isOddOneOut: true },
      { text: 'シャキーラ', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-3',
    prompt: 'イギリス出身ではないアーティストは誰ですか？',
    difficulty: 'medium',
    options: [
      { text: 'アデル', isOddOneOut: false },
      { text: 'エド・シーラン', isOddOneOut: false },
      { text: 'ドレイク', isOddOneOut: true },
      { text: 'デュア・リパ', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-1',
    prompt: '3人のアーティストは自身のヒット曲の大半を作詞作曲しています。していないのは誰ですか？',
    difficulty: 'hard',
    options: [
      { text: 'ビリー・アイリッシュ', isOddOneOut: false },
      { text: 'テイラー・スウィフト', isOddOneOut: false },
      { text: 'ブリトニー・スピアーズ', isOddOneOut: true },
      { text: 'レディー・ガガ', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-2',
    prompt: 'アメリカで開催されていない音楽フェスティバルはどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'コーチェラ', isOddOneOut: false },
      { text: 'ロラパルーザ', isOddOneOut: false },
      { text: 'グラストンベリー', isOddOneOut: true },
      { text: 'ボナルー', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-3',
    prompt: 'アメリカ発祥ではない音楽ジャンルはどれですか？',
    difficulty: 'hard',
    options: [
      { text: 'ジャズ', isOddOneOut: false },
      { text: 'ヒップホップ', isOddOneOut: false },
      { text: 'レゲエ', isOddOneOut: true },
      { text: 'ロックンロール', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-expert-1',
    prompt: 'タレントオーディション番組から登場しなかったアーティストは誰ですか？',
    difficulty: 'expert',
    options: [
      { text: 'ケリー・クラークソン', isOddOneOut: false },
      { text: 'ワン・ダイレクション', isOddOneOut: false },
      { text: 'ビリー・アイリッシュ', isOddOneOut: true },
      { text: 'フィフス・ハーモニー', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-expert-2',
    prompt: '「ビッグスリー」のメジャーレーベルではないレコードレーベルはどれですか？',
    difficulty: 'expert',
    options: [
      { text: 'ユニバーサル ミュージック グループ', isOddOneOut: false },
      { text: 'ソニー・ミュージック', isOddOneOut: false },
      { text: 'デフ・ジャム・レコーディングス', isOddOneOut: true },
      { text: 'ワーナー・ミュージック・グループ', isOddOneOut: false },
    ],
  },
];

const questionMap: Record<string, RawQuestion[]> = {
  football: footballQuestions,
  anime: animeQuestions,
  science: scienceQuestions,
  'space-explorers': spaceExplorersQuestions,
  'street-foods': streetFoodsQuestions,
  'world-history': worldHistoryQuestions,
  'pop-music': popMusicQuestions,
};

export function getFallbackQuestion(
  themeId: string,
  difficulty: DifficultyLevel,
  excludedIds: Set<string>,
): GameQuestion | null {
  const pool = questionMap[themeId]?.filter(
    (question) => question.difficulty === difficulty && !excludedIds.has(question.id),
  );

  const available = pool && pool.length > 0
    ? pool
    : questionMap[themeId]?.filter((question) => !excludedIds.has(question.id));

  if (!available || available.length === 0) {
    return null;
  }

  const selection = available[Math.floor(Math.random() * available.length)];
  const oddOptionIndex = selection.options.findIndex((option) => option.isOddOneOut);

  if (oddOptionIndex === -1) {
    return null;
  }

  const options = selection.options.map((option, index) => ({
    id: `${selection.id}-option-${index}`,
    text: option.text,
    isOddOneOut: option.isOddOneOut,
  }));

  return {
    id: selection.id,
    seed: randomUUID(),
    prompt: selection.prompt,
    themeId,
    difficulty: selection.difficulty,
    options,
    oddOptionId: `${selection.id}-option-${oddOptionIndex}`,
    source: 'fallback',
    generatedAt: new Date().toISOString(),
  };
}
