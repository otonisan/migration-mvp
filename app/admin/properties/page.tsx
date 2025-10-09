'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { Home, Plus, Edit, Trash2, X } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  city: string;
  prefecture: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  year_built: number;
  deposit: number;
  key_money: number;
  image_url: string;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // フォームの状態
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    city: '',
    prefecture: '',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    year_built: 2024,
    deposit: 0,
    key_money: 0,
    image_url: '',
  });

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchProperties();
    };
    init();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('セッション:', session);
      console.log('ユーザー:', session?.user);
      console.log('メールアドレス:', session?.user?.email);
      
      const adminEmails = ['youyangg1@gmail.com'];
      
      if (!session || !session.user) {
        alert('ログインしてください');
        router.push('/login');
        return;
      }
      
      if (!adminEmails.includes(session.user.email || '')) {
        alert(`管理者権限がありません。現在のメール: ${session.user.email}`);
        router.push('/dashboard');
        return;
      }
      
      console.log('管理者認証成功');
    } catch (error) {
      console.error('認証エラー:', error);
      alert('認証エラーが発生しました');
      router.push('/login');
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('物件取得エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      alert('画像のアップロードに失敗しました');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;

      // 画像ファイルがある場合はアップロード
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const propertyData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editingProperty) {
        // 更新
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingProperty.id);

        if (error) throw error;
        alert('物件を更新しました');
      } else {
        // 新規追加
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        alert('物件を追加しました');
      }

      setShowModal(false);
      setEditingProperty(null);
      setImageFile(null);
      resetForm();
      fetchProperties();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('物件を削除しました');
      fetchProperties();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('削除に失敗しました');
    }
  };

  const openEditModal = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      city: property.city,
      prefecture: property.prefecture,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      year_built: property.year_built,
      deposit: property.deposit,
      key_money: property.key_money,
      image_url: property.image_url,
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingProperty(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      city: '',
      prefecture: '',
      address: '',
      bedrooms: 1,
      bathrooms: 1,
      area: 0,
      year_built: 2024,
      deposit: 0,
      key_money: 0,
      image_url: '',
    });
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
            <Home className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white">物件管理</h1>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            新規物件追加
          </button>
        </div>

        {/* 物件一覧 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white/80 border-b border-white/20">
                  <th className="text-left py-3 px-4">画像</th>
                  <th className="text-left py-3 px-4">物件名</th>
                  <th className="text-left py-3 px-4">地域</th>
                  <th className="text-left py-3 px-4">家賃</th>
                  <th className="text-left py-3 px-4">面積</th>
                  <th className="text-left py-3 px-4">築年</th>
                  <th className="text-right py-3 px-4">操作</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="text-white border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">
                      {property.image_url ? (
                        <img src={property.image_url} alt={property.title} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-white/20 rounded flex items-center justify-center">
                          <Home className="w-8 h-8 text-white/50" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{property.title || '-'}</td>
                    <td className="py-3 px-4">{property.city || '-'}</td>
                    <td className="py-3 px-4">¥{(property.price || 0).toLocaleString()}/月</td>
                    <td className="py-3 px-4">{property.area || 0}㎡</td>
                    <td className="py-3 px-4">{property.year_built || '-'}年</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(property)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {properties.length === 0 && (
            <div className="text-center py-12 text-white/60">
              物件がありません。新規物件を追加してください。
            </div>
          )}
        </div>
      </div>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingProperty ? '物件編集' : '新規物件追加'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">物件名</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">説明</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">都道府県</label>
                  <input
                    type="text"
                    value={formData.prefecture}
                    onChange={(e) => setFormData({...formData, prefecture: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">市区町村</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">住所</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">家賃（円/月）</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">敷金（円）</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData({...formData, deposit: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">礼金（円）</label>
                  <input
                    type="number"
                    value={formData.key_money}
                    onChange={(e) => setFormData({...formData, key_money: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">面積（㎡）</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">寝室数</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">浴室数</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">築年</label>
                  <input
                    type="number"
                    value={formData.year_built}
                    onChange={(e) => setFormData({...formData, year_built: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">画像アップロード</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {uploading && <p className="text-sm text-gray-500 mt-2">アップロード中...</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {uploading ? 'アップロード中...' : (editingProperty ? '更新' : '追加')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}