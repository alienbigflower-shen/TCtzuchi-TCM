// js/components/Header.js - 頂部院徽、系統標題、登入狀態與本機測試專屬工具列

function Header({ user, isApproved, userRole, currentYear, currentMonth, onSignIn, onSignOut, onDevRoleChange }) {
  // 安全判定：
  // 1. 電腦本機預覽 (127.0.0.1 或 localhost)
  // 2. 或網址後方帶有您專屬的秘密通關暗號 (?debug=admin)
  // 只要是一般人正常打開正式網頁，此工具列 100% 徹底隱藏，絕對不會出現！
  const isDevMode = window.location.hostname === '127.0.0.1' || 
                    window.location.hostname === 'localhost' ||
                    window.location.search.includes('debug=admin');

  return (
    <header className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border space-y-3 no-print">
      {/* 🧪 測試工具列：只會在本地電腦預覽、或網址帶暗號時出現，一般人打開正式網頁時 100% 徹底隱藏 */}
      {isDevMode && (
        <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[13px] md:text-[14px]">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <span>🧪</span>
            <span>【本機快速測試身份切換】（線上自動隱藏）：</span>
            <span className="text-gray-600 font-normal">免登入 Google 即可自由切換測試權限</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => onDevRoleChange('admin')} 
              className={`px-3 py-1 rounded-lg font-bold border transition ${
                isApproved ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-white text-gray-700 hover:bg-emerald-50'
              }`}
            >
              👑 模擬「總醫師」（全部新增/編輯功能解鎖）
            </button>
            <button 
              type="button" 
              onClick={() => onDevRoleChange('user')} 
              className={`px-3 py-1 rounded-lg font-bold border transition ${
                user && !isApproved ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
            >
              🎓 模擬「一般學員」（測試搶跟診）
            </button>
            <button 
              type="button" 
              onClick={() => onDevRoleChange('guest')} 
              className={`px-3 py-1 rounded-lg font-bold border transition ${
                !user ? 'bg-gray-700 text-white border-gray-700 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              👤 模擬「訪客未登入」
            </button>
          </div>
        </div>
      )}

      {/* 正常頁頭內容 */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-[24px] md:text-[28px]">🏥</div>
          <div>
            <h1 className="text-[22px] md:text-[32px] font-bold text-gray-900 leading-tight">臺中慈濟醫院中醫部</h1>
            <p className="text-gray-500 text-[14px] md:text-[20px] mt-0.5">{currentYear}年{currentMonth}月 行事曆與跟診系統</p>
          </div>
        </div>
        
        <div className="w-full md:w-auto flex justify-end">
          {user ? (
            <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border">
              <div>
                <div className="text-[16px] md:text-[20px] font-bold text-gray-800 flex items-center gap-2">
                  {user.user_metadata?.full_name || user.email.split('@')[0]}
                  {isApproved ? (
                    <span className="text-[12px] md:text-[14px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">已開通總醫師</span>
                  ) : (
                    <span className="text-[12px] md:text-[14px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">一般學員</span>
                  )}
                </div>
              </div>
              <button 
                onClick={onSignOut} 
                className="px-3 py-1.5 bg-white border text-gray-600 rounded-xl text-[15px] md:text-[20px] hover:bg-gray-100 font-bold"
              >
                登出
              </button>
            </div>
          ) : (
            <button 
              onClick={onSignIn} 
              className="w-full md:w-auto bg-blue-600 text-white px-5 py-2.5 md:py-3 rounded-2xl text-[16px] md:text-[20px] font-bold shadow hover:bg-blue-700"
            >
              Google 帳號登入
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
