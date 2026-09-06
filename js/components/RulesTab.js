// js/components/RulesTab.js - 6. 重要規範分頁 (會議規則與會診拔針規範)

function RulesTab({ rulesSubTab, setRulesSubTab }) {
  return (
    <div className="bg-white p-5 md:p-8 rounded-2xl border shadow-sm space-y-6">
      <div className="flex flex-wrap justify-between items-center border-b pb-4 gap-3">
        <h2 className="text-[22px] md:text-[28px] font-bold text-gray-900">本院醫師重要規範</h2>
        
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border gap-1 text-[15px] md:text-[18px]">
          <button 
            onClick={() => setRulesSubTab('meeting')} 
            className={`px-4 py-2 rounded-xl font-bold transition ${
              rulesSubTab === 'meeting' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            📋 會議規則
          </button>
          <button 
            onClick={() => setRulesSubTab('acu_rules')} 
            className={`px-4 py-2 rounded-xl font-bold transition ${
              rulesSubTab === 'acu_rules' ? 'bg-purple-700 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            🪡 針灸科會診組跟診規則
          </button>
        </div>
      </div>

      {rulesSubTab === 'meeting' && (
        <div className="p-5 md:p-7 rounded-2xl border bg-gray-50 space-y-4 text-[16px] md:text-[20px] leading-relaxed text-gray-800">
          <div className="font-bold text-[18px] md:text-[22px] text-gray-900 border-b pb-2">❖ 會議注意事項：</div>
          <ol className="list-decimal list-inside space-y-3 pl-1">
            <li>住院醫師及實習醫師病例及期刊報告請於3日前寄出初稿給全體中醫部醫師。</li>
            <li>中醫部行政會議、聯合視訊會議：實習醫師不參加。</li>
            <li>大內科行政會議：內婦兒科住院醫師、內婦兒科主治醫師必須參加，輪訓內婦兒科住院醫師及實習醫師不強制參加。</li>
            <li>針傷科行政會議：針傷科主治醫師、住院醫師、護理人員必須參加，輪訓針傷科住院醫師及實習醫師不強制參加。</li>
            <li>新思維教育講座：請實習醫師、住院醫師(R1-R2)及內科資深住院醫師必須參加，請紀錄者紀錄並錄影後將影像檔存至中醫部隨身硬碟。</li>
            <li>須彌山講座：經專家同意後錄影，請紀錄者紀錄並錄影後將影像檔存至中醫部硬碟。請負責須彌山紀錄的醫師準備講者的茶水，並檢查麥克風正常運作與否。</li>
            <li>輪訓藥局醫師仍需參與科內(內二)報告，離開藥局前請先報請中藥局主任。輪訓中藥局的實習醫師不必交病例報告，但是每周要交一篇A4兩面的心得報告。</li>
          </ol>
        </div>
      )}

      {rulesSubTab === 'acu_rules' && (
        <div className="p-5 md:p-7 rounded-2xl border bg-purple-50/60 border-purple-200 space-y-5">
          <div className="font-bold text-[20px] md:text-[24px] text-purple-950 border-b border-purple-200 pb-3 flex items-center gap-2">
            <span>🪡</span>
            <span>會診組（拔針時間）排班規範</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[16px] md:text-[20px]">
            <div className="bg-white p-4 md:p-5 rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
              <span className="font-extrabold text-purple-900 text-[20px] md:text-[22px]">傅醫師</span>
              <span className="font-bold text-gray-800 bg-purple-100 text-purple-900 px-3 py-1 rounded-xl">一，三，五早上 10：00 過後</span>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
              <span className="font-extrabold text-purple-900 text-[20px] md:text-[22px]">伍醫師</span>
              <span className="font-bold text-gray-800 bg-purple-100 text-purple-900 px-3 py-1 rounded-xl">二，四中午</span>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
              <span className="font-extrabold text-purple-900 text-[20px] md:text-[22px]">馮醫師</span>
              <span className="font-bold text-gray-800 bg-purple-100 text-purple-900 px-3 py-1 rounded-xl">一，三，五下午</span>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-2xl border border-purple-200 shadow-sm flex items-center justify-between">
              <span className="font-extrabold text-purple-900 text-[20px] md:text-[22px]">歐醫師</span>
              <span className="font-bold text-gray-800 bg-purple-100 text-purple-900 px-3 py-1 rounded-xl">一，三早上</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.RulesTab = RulesTab;
