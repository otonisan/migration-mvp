'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { MessageSquare, Mail, Calendar, CheckCircle, Clock, AlertCircle, Eye, X } from 'lucide-react';

interface Inquiry {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchInquiries();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmails = ['youyangg1@gmail.com'];
      
      if (!session || !session.user) {
        alert('ログインしてください');
        router.push('/login');
        return;
      }
      
      if (!adminEmails.includes(session.user.email || '')) {
        alert('管理者権限がありません');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('認証エラー:', error);
      router.push('/login');
    }
  };

  const fetchInquiries = async () => {
    try {
      let query = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) {
        console.error('お問い合わせ取得エラー:', error);
        setInquiries([]);
      } else {
        setInquiries(data || []);
      }
    } catch (error) {
      console.error('エラー:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', inquiryId);

      if (error) throw error;
      alert('ステータスを更新しました');
      fetchInquiries();
      if (selectedInquiry?.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as 'new' | 'in_progress' | 'resolved' });
      }
    } catch (error) {
      console.error('ステータス更新エラー:', error);
      alert('更新に失敗しました');
    }
  };

  const openDetailModal = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_progress':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return '新規';
      case 'in_progress':
        return '対応中';
      case 'resolved':
        return '解決済';
      default:
        return status;
    }
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in_progress').length,
    resolved: inquiries.filter(i => i.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">お問い合わせ管理</h1>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-white" />
              <p className="text-white/80">総数</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-blue-300" />
              <p className="text-white/80">新規</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.new}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-yellow-300" />
              <p className="text-white/80">対応中</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-300" />
              <p className="text-white/80">解決済</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.resolved}</p>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">ステータス:</span>
            <div className="flex gap-2">
              {['all', 'new', 'in_progress', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-white text-purple-900'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {status === 'all' ? '全て' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* お問い合わせ一覧 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">お問い合わせ一覧</h2>
          {inquiries.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              お問い合わせが見つかりません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/80 border-b border-white/20">
                    <th className="text-left py-3 px-4">日時</th>
                    <th className="text-left py-3 px-4">名前</th>
                    <th className="text-left py-3 px-4">メール</th>
                    <th className="text-left py-3 px-4">件名</th>
                    <th className="text-left py-3 px-4">ステータス</th>
                    <th className="text-right py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="text-white border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          {new Date(inquiry.created_at).toLocaleDateString('ja-JP')}
                        </div>
                      </td>
                      <td className="py-3 px-4">{inquiry.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white/60" />
                          {inquiry.email}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="line-clamp-1">{inquiry.subject}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 w-fit ${getStatusBadge(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          {getStatusText(inquiry.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openDetailModal(inquiry)}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 詳細モーダル */}
      {showModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">お問い合わせ詳細</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">受信日時</label>
                <p className="text-gray-900">{new Date(selectedInquiry.created_at).toLocaleString('ja-JP')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">名前</label>
                <p className="text-gray-900">{selectedInquiry.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">メールアドレス</label>
                <p className="text-gray-900">{selectedInquiry.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">件名</label>
                <p className="text-gray-900">{selectedInquiry.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">メッセージ</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">ステータス変更</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'new')}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      selectedInquiry.status === 'new'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    新規
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'in_progress')}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      selectedInquiry.status === 'in_progress'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    対応中
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'resolved')}
                    className={`flex-1 py-2 rounded-lg font-medium ${
                      selectedInquiry.status === 'resolved'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    解決済
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}