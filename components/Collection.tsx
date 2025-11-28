import React, { useState } from 'react';
import { Doll } from '../types';
import { editDollImage } from '../services/geminiService';

interface CollectionProps {
  dolls: Doll[];
  onBack: () => void;
  onUpdateDoll: (id: string, newImageUrl: string) => void;
}

const Collection: React.FC<CollectionProps> = ({ dolls, onBack, onUpdateDoll }) => {
  const [editingDoll, setEditingDoll] = useState<Doll | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEditStart = async (doll: Doll) => {
    setEditingDoll(doll);
    setEditPrompt('');
    setPreviewImage(null);
  };

  const handleMagicEdit = async () => {
    if (!editingDoll || !editPrompt) return;
    setIsGenerating(true);

    try {
      // Convert current image to base64
      let base64Image = previewImage || editingDoll.imageUrl;
      
      // If it's a remote URL, fetch and convert
      if (!base64Image.startsWith('data:')) {
        try {
          const response = await fetch(base64Image, { mode: 'cors' });
          const blob = await response.blob();
          base64Image = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.error("Failed to fetch image for editing", e);
          alert("無法讀取圖片，請稍後再試");
          setIsGenerating(false);
          return;
        }
      }

      const result = await editDollImage(base64Image, editPrompt);
      if (result) {
        setPreviewImage(result);
      } else {
        alert("魔法失效了，請換個咒語試試看！");
      }
    } catch (e) {
      console.error(e);
      alert("發生錯誤");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (editingDoll && previewImage) {
      onUpdateDoll(editingDoll.id, previewImage);
      setEditingDoll(null);
      setPreviewImage(null);
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center animate-fade-in relative">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
           <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-bold text-gray-700 transition"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-bold text-indigo-600">我的收藏室</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        {dolls.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg border-dashed border-4 border-indigo-100">
            <p className="text-2xl text-gray-400 mb-4">空空如也...</p>
            <p className="text-gray-500">快去闖關贏取可愛公仔吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dolls.map((doll) => (
              <div key={doll.id} className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center group">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-indigo-50 to-pink-50 relative">
                  <img 
                    src={doll.imageUrl} 
                    alt={doll.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleEditStart(doll)}
                      className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-indigo-50"
                    >
                      ✨ 魔法編輯
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{doll.name}</h3>
                <p className="text-xs text-center text-gray-500 mt-1">{doll.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Magic Edit Modal */}
      {editingDoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">✨ 魔法編輯室</h3>
              <button onClick={() => setEditingDoll(null)} className="text-white/80 hover:text-white text-2xl">×</button>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden relative shadow-inner">
                <img 
                  src={previewImage || editingDoll.imageUrl} 
                  alt="Preview" 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">輸入魔法咒語 (例如: 加上復古濾鏡, 移除背景...)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="你想把公仔變成什麼樣子？"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none bg-gray-50"
                    onKeyDown={(e) => e.key === 'Enter' && handleMagicEdit()}
                  />
                  <button 
                    onClick={handleMagicEdit}
                    disabled={isGenerating || !editPrompt}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-6 rounded-xl font-bold transition"
                  >
                    變身!
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setEditingDoll(null)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition"
                >
                  取消
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!previewImage}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold rounded-xl shadow-lg transition"
                >
                  保存新造型
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
