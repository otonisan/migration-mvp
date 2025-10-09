'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Users, Shield, Ban, Search, Mail, Calendar } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
  is_active: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchUsers();
    };
    init();
  }, []);

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

  const fetchUsers = async () => {
    try {
      // auth.usersから全ユーザーを取得（管理者APIが必要）
      // 代わりにusersテーブルから取得
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ユーザー取得エラー:', error);
        // usersテーブルが空の場合、auth.usersからデータを表示
        setUsers([]);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`ロールを「${newRole}」に変更しますか？`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      alert('ロールを変更しました');
      fetchUsers();
    } catch (error) {
      console.error('ロール変更エラー:', error);
      alert('ロール変更に失敗しました');
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? '停止' : '有効化';
    if (!confirm(`このアカウントを${action}しますか？`)) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      alert(`アカウントを${action}しました`);
      fetchUsers();
    } catch (error) {
      console.error('ステータス変更エラー:', error);
      alert('ステータス変更に失敗しました');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    } else if (role === 'premium') {
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    } else {
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
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
            <Users className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">ユーザー管理</h1>
          </div>
          <div className="text-white/80">
            総ユーザー数: <span className="text-2xl font-bold">{users.length}</span>
          </div>
        </div>

        {/* 検索バー */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
            <input
              type="text"
              placeholder="メールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-6 h-6 text-blue-300" />
              <p className="text-white/80">通常ユーザー</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {users.filter(u => u.role === 'user').length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-yellow-300" />
              <p className="text-white/80">プレミアム</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {users.filter(u => u.role === 'premium').length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-red-300" />
              <p className="text-white/80">管理者</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Ban className="w-6 h-6 text-gray-300" />
              <p className="text-white/80">停止中</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {users.filter(u => !u.is_active).length}
            </p>
          </div>
        </div>

        {/* ユーザー一覧 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              ユーザーが見つかりません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-white/80 border-b border-white/20">
                    <th className="text-left py-3 px-4">メールアドレス</th>
                    <th className="text-left py-3 px-4">ロール</th>
                    <th className="text-left py-3 px-4">登録日</th>
                    <th className="text-left py-3 px-4">最終ログイン</th>
                    <th className="text-left py-3 px-4">ステータス</th>
                    <th className="text-right py-3 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="text-white border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-white/60" />
                          {user.email || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role || 'user')}`}>
                          {user.role === 'admin' ? '管理者' : user.role === 'premium' ? 'プレミアム' : '通常'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/60" />
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('ja-JP') : '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('ja-JP') : '未ログイン'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.is_active !== false 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {user.is_active !== false ? '有効' : '停止中'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end gap-2">
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-white/40"
                          >
                            <option value="user">通常</option>
                            <option value="premium">プレミアム</option>
                            <option value="admin">管理者</option>
                          </select>
                          <button
                            onClick={() => handleToggleActive(user.id, user.is_active !== false)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              user.is_active !== false
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300'
                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                            }`}
                          >
                            {user.is_active !== false ? '停止' : '有効化'}
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
    </div>
  );
}