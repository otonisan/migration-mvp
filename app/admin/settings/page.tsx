'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Settings, Save, Mail, Key, Globe, DollarSign, Bell, Shield } from 'lucide-react';

interface SystemSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  stripe_public_key: string;
  stripe_secret_key: string;
  monthly_plan_price: number;
  yearly_plan_price: number;
  enable_registration: boolean;
  enable_notifications: boolean;
  maintenance_mode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: 'Migration Support',
    site_description: '地方移住を支援するプラットフォーム',
    contact_email: 'support@migration-support.com',
    stripe_public_key: '',
    stripe_secret_key: '',
    monthly_plan_price: 980,
    yearly_plan_price: 9800,
    enable_registration: true,
    enable_notifications: true,
    maintenance_mode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchSettings();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();

      if (error) {
        console.log('設定が見つかりません。デフォルト値を使用します。');
      } else if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('設定取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 既存の設定を更新または新規作成
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          id: 1, // 単一レコードとして管理
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert('設定を保存しました');
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof SystemSettings, value: string | number | boolean) => {
    setSettings({ ...settings, [key]: value });
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
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">システム設定</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>

        {/* 基本設定 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">基本設定</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">サイト名</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">サイト説明</label>
              <textarea
                value={settings.site_description}
                onChange={(e) => handleChange('site_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">お問い合わせメール</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stripe設定 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Stripe設定</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">公開可能キー</label>
              <input
                type="text"
                value={settings.stripe_public_key}
                onChange={(e) => handleChange('stripe_public_key', e.target.value)}
                placeholder="pk_test_..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">シークレットキー</label>
              <input
                type="password"
                value={settings.stripe_secret_key}
                onChange={(e) => handleChange('stripe_secret_key', e.target.value)}
                placeholder="sk_test_..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        </div>

        {/* 料金設定 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">料金設定</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">月額プラン（円）</label>
              <input
                type="number"
                value={settings.monthly_plan_price}
                onChange={(e) => handleChange('monthly_plan_price', Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">年額プラン（円）</label>
              <input
                type="number"
                value={settings.yearly_plan_price}
                onChange={(e) => handleChange('yearly_plan_price', Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        </div>

        {/* 機能設定 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">機能設定</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">新規登録を許可</p>
                <p className="text-white/60 text-sm">ユーザーの新規登録を受け付けます</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_registration}
                  onChange={(e) => handleChange('enable_registration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">通知機能</p>
                <p className="text-white/60 text-sm">メール通知を有効にします</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enable_notifications}
                  onChange={(e) => handleChange('enable_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border-2 border-red-500/30">
              <div>
                <p className="text-white font-medium">メンテナンスモード</p>
                <p className="text-white/60 text-sm">サイトを一時的に閉鎖します</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode}
                  onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-bold transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? '保存中...' : '設定を保存'}
          </button>
        </div>
      </div>
    </div>
  );
}