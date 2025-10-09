'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface Diagnosis {
  id: string
  created_at: string
  answers: Record<string, unknown>
  result: {
    matchedPrefecture?: string
    matchPercentage?: number
  }
}

interface AnalyticsData {
  dailyDiagnoses: Array<{
    date: string
    count: number
  }>
  prefectureDistribution: Array<{
    prefecture: string
    count: number
    percentage: number
  }>
  timeDistribution: Array<{
    hour: number
    count: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    dailyDiagnoses: [],
    prefectureDistribution: [],
    timeDistribution: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState(7)

  const fetchAnalyticsData = useCallback(async () => {
    const supabase = createClient()
    
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - dateRange)
      
      const { data: diagnosesData } = await supabase
        .from('diagnoses')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (diagnosesData) {
        const dailyMap: Record<string, number> = {}
        const prefectureMap: Record<string, number> = {}
        const hourMap: Record<number, number> = {}

        diagnosesData.forEach((diagnosis: Diagnosis) => {
          const date = new Date(diagnosis.created_at).toLocaleDateString('ja-JP')
          dailyMap[date] = (dailyMap[date] || 0) + 1

          const prefecture = diagnosis.result?.matchedPrefecture || '不明'
          prefectureMap[prefecture] = (prefectureMap[prefecture] || 0) + 1

          const hour = new Date(diagnosis.created_at).getHours()
          hourMap[hour] = (hourMap[hour] || 0) + 1
        })

        const dailyData = Object.entries(dailyMap).map(([date, count]) => ({
          date,
          count
        }))

        const total = diagnosesData.length
        const prefectureData = Object.entries(prefectureMap)
          .map(([prefecture, count]) => ({
            prefecture,
            count,
            percentage: Math.round((count / total) * 100)
          }))
          .sort((a, b) => b.count - a.count)

        const timeData = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: hourMap[i] || 0
        }))

        setData({
          dailyDiagnoses: dailyData,
          prefectureDistribution: prefectureData,
          timeDistribution: timeData
        })
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err)
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-8">データ分析</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-purple-300 animate-pulse">分析データを読み込み中...</div>
          </div>
        </div>
      </div>
    )
  }

  const maxDaily = Math.max(...data.dailyDiagnoses.map(d => d.count), 1)
  const maxHour = Math.max(...data.timeDistribution.map(t => t.count), 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">データ分析</h1>
            <p className="text-purple-300">診断データの詳細分析</p>
          </div>
          <div className="flex gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
              className="bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-purple-400"
            >
              <option value={7}>過去7日間</option>
              <option value={14}>過去14日間</option>
              <option value={30}>過去30日間</option>
              <option value={90}>過去90日間</option>
            </select>
            <Link
              href="/admin"
              className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              ダッシュボードに戻る
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">日別診断数</h2>
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between gap-2">
                {data.dailyDiagnoses.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <span className="text-xs text-purple-300 mb-2">{day.count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
                      style={{ height: `${(day.count / maxDaily) * 100}%` }}
                    />
                    <span className="text-xs text-gray-400 mt-2 -rotate-45 origin-left whitespace-nowrap">
                      {day.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">都道府県別分布</h2>
            <div className="space-y-3">
              {data.prefectureDistribution.slice(0, 10).map((pref, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-white font-medium w-24">{pref.prefecture}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-8 relative overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${pref.percentage}%` }}
                    >
                      <span className="text-xs text-white font-bold">{pref.percentage}%</span>
                    </div>
                  </div>
                  <span className="text-purple-300 text-sm w-12 text-right">{pref.count}件</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">時間帯別アクセス</h2>
            <div className="relative h-48">
              <div className="absolute inset-0 flex items-end justify-between">
                {data.timeDistribution.map((time, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    {time.count > 0 && (
                      <span className="text-xs text-purple-300 mb-1">{time.count}</span>
                    )}
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all duration-300"
                      style={{ height: `${(time.count / maxHour) * 100}%` }}
                    />
                    {index % 3 === 0 && (
                      <span className="text-xs text-gray-400 mt-2">{time.hour}時</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <p className="text-purple-400 text-sm mb-2">期間中の総診断数</p>
              <p className="text-3xl font-bold text-white">
                {data.dailyDiagnoses.reduce((sum, d) => sum + d.count, 0)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-6 border border-green-500/20">
              <p className="text-green-400 text-sm mb-2">1日平均</p>
              <p className="text-3xl font-bold text-white">
                {(data.dailyDiagnoses.reduce((sum, d) => sum + d.count, 0) / dateRange).toFixed(1)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/20">
              <p className="text-blue-400 text-sm mb-2">最も多い時間帯</p>
              <p className="text-3xl font-bold text-white">
                {data.timeDistribution.reduce((max, t) => t.count > max.count ? t : max).hour}時
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-lg rounded-xl p-6 border border-pink-500/20">
              <p className="text-pink-400 text-sm mb-2">提案都道府県数</p>
              <p className="text-3xl font-bold text-white">
                {data.prefectureDistribution.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}