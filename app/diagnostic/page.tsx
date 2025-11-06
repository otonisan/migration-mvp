// app/diagnostic/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

interface Question {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  type: 'radio' | 'checkbox' | 'slider';
  options?: QuestionOption[];
}

type AnswerValue = string | number | string[] | undefined;
interface Answers {
  [key: string]: AnswerValue;
}

const questions: Question[] = [
  {
    id: 'q1_work_mode',
    category: 'WORK STYLE',
    title: 'あなたの働き方について',
    subtitle: '山形での働き方を教えてください',
    type: 'radio',
    options: [
      { value: 'remote_majority', label: 'フルリモート', description: '場所を選ばない働き方' },
      { value: 'hybrid', label: 'ハイブリッド', description: '週2-3日のオフィス勤務' },
      { value: 'onsite', label: 'オフィス勤務', description: '山形市内での通勤' },
      { value: 'local_business', label: '地元企業・起業', description: '山形で新しい仕事' }
    ]
  },
  {
    id: 'q2_age_group',
    category: 'AGE',
    title: '年齢層を選択',
    subtitle: 'あなたの年齢層について',
    type: 'radio',
    options: [
      { value: '20s', label: '20代', description: '単身・カップル' },
      { value: '30s', label: '30代', description: '子育て世代' },
      { value: '40s', label: '40代', description: 'ファミリー' },
      { value: '50s', label: '50代', description: 'セカンドライフ準備' },
      { value: '60plus', label: '60代以上', description: 'リタイア世代' }
    ]
  },
  {
    id: 'q3_household',
    category: 'FAMILY',
    title: '家族構成について',
    subtitle: '一緒に山形へ移住される方',
    type: 'radio',
    options: [
      { value: 'single', label: 'シングル', description: '単身での移住' },
      { value: 'couple', label: 'カップル・夫婦', description: '二人での新生活' },
      { value: 'with_children', label: 'ファミリー', description: 'お子様との移住' }
    ]
  },
  {
    id: 'q4_priority',
    category: 'PRIORITY',
    title: '重視する要素',
    subtitle: '山形での暮らしで最も大切にしたいこと',
    type: 'radio',
    options: [
      { value: 'onsen', label: '温泉・リラックス', description: '癒しの時間を大切に' },
      { value: 'nature', label: '自然・農業体験', description: '豊かな自然との共生' },
      { value: 'education', label: '子育て・教育', description: '子供の成長環境' },
      { value: 'history', label: '歴史・文化', description: '伝統ある街並み' },
      { value: 'commercial', label: '利便性', description: '買い物・交通の便' }
    ]
  },
  {
    id: 'q5_lifestyle',
    category: 'LIFESTYLE',
    title: '理想のライフスタイル',
    subtitle: '山形でどんな暮らしがしたいですか',
    type: 'radio',
    options: [
      { value: 'quiet', label: '静かな住環境', description: '落ち着いた住宅街' },
      { value: 'active', label: '活気ある街', description: 'カフェや若者が集まる' },
      { value: 'rural', label: '田舎暮らし', description: '田畑に囲まれた環境' },
      { value: 'urban', label: '便利な都市部', description: '駅近・商業施設充実' }
    ]
  },
  {
    id: 'q6_budget',
    category: 'BUDGET',
    title: '月額予算',
    subtitle: '試住期間中の月額費用',
    type: 'radio',
    options: [
      { value: 'under_100k', label: '〜10万円', description: 'ベーシックプラン' },
      { value: '100k_150k', label: '10〜15万円', description: 'スタンダードプラン' },
      { value: '150k_200k', label: '15〜20万円', description: 'プレミアムプラン' },
      { value: 'over_200k', label: '20万円〜', description: 'エグゼクティブプラン' }
    ]
  },
  {
    id: 'q7_duration',
    category: 'DURATION',
    title: '試住期間',
    subtitle: 'ご希望の滞在期間',
    type: 'radio',
    options: [
      { value: '1week', label: '1週間', description: '短期トライアル' },
      { value: '2weeks', label: '2週間', description: 'しっかり体験' },
      { value: '1month', label: '1ヶ月', description: 'じっくり検討' },
      { value: '3months', label: '3ヶ月', description: '本格的な試住' }
    ]
  }
];

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, [currentQuestion]);

  const handleAnswer = async (value: AnswerValue) => {
    setSelectedOption(value as string);
    
    setTimeout(() => {
      const question = questions[currentQuestion];
      setAnswers(prev => ({ ...prev, [question.id]: value }));
      
      setIsVisible(false);
      
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedOption(null);
        } else {
          submitDiagnostic();
        }
      }, 300);
    }, 400);
  };

  const submitDiagnostic = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers)
      });
      
      if (!response.ok) throw new Error('診断の送信に失敗しました');
      
      const data = await response.json();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('diagnostic_result', JSON.stringify(data));
      }
      
      router.push('/diagnostic/result');
      
    } catch (error) {
      console.error('エラー:', error);
      alert('診断の処理中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setIsVisible(false);
      setSelectedOption(null);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
      }, 200);
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div 
      className="min-h-screen bg-emerald-50"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif' }}
    >
      {/* 固定ヘッダー */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            🍒 山形移住ナビ
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            ← 戻る
          </button>
        </div>
      </nav>

      {/* プログレスバー */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-white px-8 py-2 border-b-2 border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 bg-emerald-100 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">
              質問 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {progress.toFixed(0)}% 完了
            </span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="pt-40 pb-24 px-8">
        <div className="max-w-4xl mx-auto">
          {/* 質問番号 */}
          <div 
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border-2 border-emerald-200 rounded-full mb-6">
              <span className="text-xs font-bold text-emerald-700">
                {question.category}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {question.title}
            </h2>
            
            {question.subtitle && (
              <p className="text-lg font-medium text-gray-700">
                {question.subtitle}
              </p>
            )}
          </div>

          {/* 選択肢 */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {question.options?.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={isLoading || selectedOption !== null}
                className={`w-full text-left p-6 border-2 rounded-xl transition-all duration-500 group ${
                  selectedOption === option.value
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-600 shadow-xl'
                    : 'bg-white border-emerald-200 hover:border-emerald-500 hover:shadow-lg hover:bg-emerald-50'
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: `${index * 100 + 200}ms`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${
                      selectedOption === option.value ? 'text-white' : 'text-gray-900'
                    }`}>
                      {option.label}
                    </h3>
                    {option.description && (
                      <p className={`text-sm font-medium transition-colors ${
                        selectedOption === option.value ? 'text-emerald-50' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    selectedOption === option.value
                      ? 'border-white bg-white'
                      : 'border-emerald-300 group-hover:border-emerald-500'
                  }`}>
                    {selectedOption === option.value && (
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ナビゲーション */}
          <div className="mt-12 flex items-center justify-between max-w-2xl mx-auto">
            {currentQuestion > 0 ? (
              <button
                onClick={handleBack}
                disabled={isLoading || selectedOption !== null}
                className="px-6 py-3 text-sm font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50 border-2 border-gray-300 hover:border-emerald-500"
              >
                ← 前の質問
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      {/* ローディング */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              診断結果を分析中... 🍒
            </h3>
            <p className="text-sm font-medium text-emerald-600">
              あなたにぴったりの山形エリアを探しています
            </p>
          </div>
        </div>
      )}
    </div>
  );
}