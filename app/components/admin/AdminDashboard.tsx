// components/admin/AdminDashboard.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface DiagnosisResult {
  matchedPrefecture?: string
  matchPercentage?: number
}

interface Diagnosis {
  id: string
  created_at: string
  answers: Record<string, unknown>
  result: DiagnosisResult
}

interface DashboardStats {
  totalDiagnoses: number
  todayDiagnoses: number
  popularDestinations: Array<{
    destination: string
    count: number
  }>
  recentDiagnoses: Diagnosis[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDiagnoses: 0,
    todayDiagnoses: 0,
    popularDestinations: [],
    recentDiagnoses: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const supabase = createClient()
    
    try {
      // 全診断数を取得
      const { count: totalCount } = await supabase
        .from('diagnoses')
        .select('*', { count: 'exact', head: true })

      // 今日の診断数を取得
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: todayCount } = await supabase
        .from('diagnoses')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // 最新10件の診断結果を取得
      const { data: recentData } = await supabase
        .from('diagnoses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      // 人気の移住先を集計
      const destinations: Record<string, number> = {}
      if (recentData) {
        recentData.forEach((diagnosis: Diagnosis) => {
          const destination = diagnosis.result?.matchedPrefecture || '不明'
          destinations[destination] = (destinations[destination] || 0) + 1
        })
      }

      const popularDest = Object.entries(destinations)
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      setStats({
        totalDiagnoses: totalCount || 0,
        todayDiagnoses: todayCount || 0,
        popularDestinations: popularDest,
        recentDiagnoses: (recentData as Diagnosis[]) || []
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">データを読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">総診断数</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalDiagnoses}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">本日の診断数</h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.todayDiagnoses}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">平均診断/日</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalDiagnoses > 0 ? (stats.totalDiagnoses / 30).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      {/* 人気の移住先 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">人気の移住先 TOP5</h2>
        <div className="space-y-3">
          {stats.popularDestinations.map((dest, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-400">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-900">
                  {dest.destination}
                </span>
              </div>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {dest.count}件
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 最近の診断結果 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最近の診断結果</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  診断日時
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  提案先
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  マッチ度
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recentDiagnoses.map((diagnosis) => (
                <tr key={diagnosis.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {new Date(diagnosis.created_at).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {diagnosis.result?.matchedPrefecture || '不明'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className="text-purple-600 font-medium">
                      {diagnosis.result?.matchPercentage || 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}