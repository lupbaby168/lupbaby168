import React from 'react';
import { Doll } from '../types';

interface CollectionProps {
  dolls: Doll[];
  onBack: () => void;
}

const Collection: React.FC<CollectionProps> = ({ dolls, onBack }) => {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center animate-fade-in">
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
              <div key={doll.id} className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col items-center">
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-indigo-50 to-pink-50 relative">
                  <img 
                    src={doll.imageUrl} 
                    alt={doll.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold text-white shadow">
                    NEW
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{doll.name}</h3>
                <p className="text-xs text-center text-gray-500 mt-1">{doll.description}</p>
                <p className="text-[10px] text-gray-400 mt-2">{new Date(doll.dateUnlocked).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
