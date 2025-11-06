'use client';

import { useRouter } from 'next/navigation';
import type { ChatRoom } from '@/lib/types/chat';

interface ChatRoomCardProps {
  room: ChatRoom;
}

export default function ChatRoomCard({ room }: ChatRoomCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/chat/${room.id}`)}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start gap-4">
        {/* アイコン */}
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          💬
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {room.name}
          </h3>
          <p className="text-sm text-gray-600">
            {room.description}
          </p>
        </div>

        {/* 矢印 */}
        <div className="text-gray-400">
          →
        </div>
      </div>
    </div>
  );
}