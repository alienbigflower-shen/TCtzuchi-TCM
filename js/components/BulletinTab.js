// js/components/BulletinTab.js - 7. 部上公佈欄分頁

function BulletinTab({
  bulletins,
  isApproved,
  onOpenNewBulletinModal,
  onEditBulletin,
  onDeleteBulletin
}) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900">部上事務公佈欄</h2>
        {isApproved && (
          <button 
            onClick={onOpenNewBulletinModal} 
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[14px] md:text-[18px] font-bold shadow hover:bg-blue-700"
          >
            + 發布公告
          </button>
        )}
      </div>
      <div className="space-y-3">
        {bulletins.map(item => (
          <div 
            key={item.id} 
            className={`p-3.5 md:p-4 rounded-2xl border space-y-1.5 relative transition ${item.level === '重要' ? 'bg-red-50/50 border-red-200' : 'bg-gray-50'}`}
          >
            <div className="flex justify-between items-start gap-2 border-b pb-1.5 border-gray-200/80">
              <h3 className="font-bold text-[15px] md:text-[19px] text-gray-900 flex items-center gap-2">
                <span>{item.title}</span>
                {item.level === '重要' && (
                  <span className="text-[11px] bg-red-100 text-red-700 border border-red-300 font-bold px-2 py-0.5 rounded-full">重要</span>
                )}
              </h3>
              
              {isApproved && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={() => onEditBulletin(item)} 
                    className="text-blue-600 hover:text-blue-800 font-bold text-[12px] md:text-[13px] px-2 py-1 rounded hover:bg-blue-50 transition flex items-center gap-1"
                    title="編輯此公告"
                  >
                    <span>✏️</span>
                    <span>編輯</span>
                  </button>
                  <button 
                    onClick={() => onDeleteBulletin(item.id)} 
                    className="text-red-500 hover:text-red-700 font-bold text-[12px] md:text-[13px] px-2 py-1 rounded hover:bg-red-100/50 transition flex items-center gap-1"
                    title="刪除此公告"
                  >
                    <span>🗑️</span>
                    <span>刪除</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-[13px] md:text-[17px] text-gray-700 whitespace-pre-line leading-relaxed">{item.content}</p>
            {item.date && <div className="text-[11px] md:text-[12px] text-gray-400 text-right font-medium">發布日期：{item.date}</div>}
          </div>
        ))}

        {bulletins.length === 0 && (
          <div className="text-center py-8 text-gray-400">目前尚無公告紀錄</div>
        )}
      </div>
    </div>
  );
}

window.BulletinTab = BulletinTab;
