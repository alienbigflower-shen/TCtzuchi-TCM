// js/components/RosterTab.js - 3. 跟診排班表分頁 (支援螢幕卡片與列印專用 Excel 黑白表格)

function RosterTab({
  currentYear,
  currentMonth,
  selectedDept,
  setSelectedDept,
  onPrevMonth,
  onNextMonth,
  isApproved,
  onOpenNewRosterModal,
  rosterShifts,
  firstDayOfWeek,
  daysInMonth,
  focusD,
  acuConsultInfo,
  setAcuConsultInfo,
  onSaveAcuConsultInfo,
  onCardClick,
  onDeleteRoster,
  personnelList = [],
  loading = false
}) {
  const savedAcu = (personnelList || []).find(p => p.category === 'setting_acu_consult');
  const isAcuModified = savedAcu ? (
    (acuConsultInfo?.trainee || '').trim() !== (savedAcu.name || '').trim() ||
    (acuConsultInfo?.period || '').trim() !== (savedAcu.note || '').trim()
  ) : Boolean((acuConsultInfo?.trainee || '').trim() || (acuConsultInfo?.period || '').trim());
  return (
    <div className="space-y-4 md:space-y-6">
      {/* 🖨️ 列印專用表頭 */}
      <div className="print-title">
        臺中慈濟醫院中醫部 {currentYear}年{currentMonth}月份【{selectedDept}】跟診排班表
      </div>

      {/* 🖨️ 列印專用 Excel 黑白格線月曆 */}
      <div className="print-only">
        <table className="excel-table">
          <thead>
            <tr>
              {['週日', '週一', '週二', '週三', '週四', '週五', '週六'].map(d => (
                <th key={d} className="w-[14.28%] text-center font-bold">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil((firstDayOfWeek + daysInMonth) / 7) }).map((_, weekIndex) => (
              <tr key={'print-week-' + weekIndex}>
                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                  const dayNumber = weekIndex * 7 + dayIndex - firstDayOfWeek + 1;
                  const isValid = dayNumber > 0 && dayNumber <= daysInMonth;

                  if (!isValid) return <td key={'p-empty-' + dayIndex} className="excel-grid-cell"></td>;

                  const dayShifts = rosterShifts
                    .filter(s => s.year === currentYear && s.month === currentMonth && s.day === dayNumber && s.dept === selectedDept)
                    .sort((a, b) => ({ '早診': 1, '午診': 2, '晚診': 3 }[a.shift] - { '早診': 1, '午診': 2, '晚診': 3 }[b.shift]));

                  return (
                    <td key={'p-day-' + dayNumber} className="excel-grid-cell">
                      <div className="font-bold border-b border-black pb-0.5 mb-1">{dayNumber} 日</div>
                      <div className="space-y-1">
                        {dayShifts.map(s => (
                          <div key={s.id} className="border border-black p-0.5 text-[10px]">
                            <div className="font-bold">{s.doctor} ({s.shift}){s.is_teaching ? ' [教學]' : ''}</div>
                            <div>學員: {s.students?.length ? s.students.join('、') : '無'}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 💻 平時螢幕瀏覽介面 (純彩色卡片，完整保留) */}
      <div className="screen-only space-y-4 md:space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm space-y-3">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <button onClick={onPrevMonth} className="px-3 py-1.5 border rounded-xl hover:bg-gray-50 text-[16px] md:text-[20px] font-bold">◀ 上個月</button>
              <h2 className="text-[18px] md:text-[26px] font-bold text-gray-900">
                {currentYear} 年 {currentMonth} 月 跟診表 <span className="text-blue-600">({selectedDept})</span>
              </h2>
              <button onClick={onNextMonth} className="px-3 py-1.5 border rounded-xl hover:bg-gray-50 text-[16px] md:text-[20px] font-bold">下個月 ▶</button>
            </div>
            
            <div className="flex items-center gap-2">
              {isApproved && (
                <button 
                  onClick={onOpenNewRosterModal} 
                  className="bg-gray-900 text-white px-4 py-2 rounded-xl text-[15px] md:text-[18px] font-bold"
                >
                  ⚙️ 排診 / 批次建立門診
                </button>
              )}
              <button onClick={() => window.print()} className="border border-gray-300 px-4 py-2 rounded-xl text-[15px] md:text-[18px] font-bold hover:bg-gray-100 flex items-center gap-1.5">
                🖨️ 列印【{selectedDept}】跟診表
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t overflow-x-auto no-scrollbar whitespace-nowrap">
            {['內一', '內二', '婦兒科', '傷科', '針灸科'].map(dept => (
              <button 
                key={dept} 
                onClick={() => setSelectedDept(dept)} 
                className={`px-4 py-2 rounded-xl text-[16px] md:text-[22px] font-bold border transition ${selectedDept === dept ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700'}`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {selectedDept === '針灸科' && (
          <div className="bg-purple-900 text-white p-4 md:p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex justify-between items-center border-b border-purple-700/60 pb-2">
              <span className="font-extrabold text-[18px] md:text-[20px] flex items-center gap-2">
                <span>🪡</span> 針灸科會診組資訊
              </span>
              {isApproved && (
                <button 
                  onClick={onSaveAcuConsultInfo} 
                  disabled={loading}
                  className={`px-4 py-1.5 rounded-xl font-bold text-[14px] md:text-[16px] shadow transition border ${
                    loading 
                      ? 'bg-purple-800/60 text-purple-300 border-purple-600/30 cursor-not-allowed'
                      : isAcuModified 
                        ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400/50 animate-pulse' 
                        : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400/30'
                  }`}
                >
                  {loading ? '載入中...' : isAcuModified ? '⚠️ 儲存變更 (Enter或點此)' : '💾 儲存資訊 (同步資料庫)'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[16px] md:text-[18px]">
              <div className="flex items-center gap-2 bg-purple-950/40 p-2.5 rounded-xl border border-purple-700/50">
                <span className="font-bold text-purple-200 shrink-0">會診組：</span>
                {isApproved ? (
                  <input 
                    type="text" 
                    value={acuConsultInfo.trainee} 
                    onChange={e => setAcuConsultInfo({...acuConsultInfo, trainee: e.target.value})} 
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSaveAcuConsultInfo(); } }}
                    disabled={loading}
                    className="bg-white border border-purple-300 rounded-lg px-3 py-1 font-bold text-gray-900 outline-none w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={loading ? '資料載入中...' : '輸入受訓人 (按 Enter 即可儲存)'}
                  />
                ) : (
                  <span className="font-extrabold text-white">{loading ? '載入中...' : (acuConsultInfo.trainee || '未設定')}</span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-purple-950/40 p-2.5 rounded-xl border border-purple-700/50">
                <span className="font-bold text-purple-200 shrink-0">受訓時間：</span>
                {isApproved ? (
                  <input 
                    type="text" 
                    value={acuConsultInfo.period} 
                    onChange={e => setAcuConsultInfo({...acuConsultInfo, period: e.target.value})} 
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSaveAcuConsultInfo(); } }}
                    disabled={loading}
                    className="bg-white border border-purple-300 rounded-lg px-3 py-1 font-bold text-gray-900 outline-none w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={loading ? '資料載入中...' : '輸入受訓時間 (按 Enter 即可儲存)'}
                  />
                ) : (
                  <span className="font-extrabold text-white">{loading ? '載入中...' : (acuConsultInfo.period || '未設定')}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7 欄彩色卡片月曆 */}
        <div className="grid grid-cols-7 border-t border-l text-[16px] md:text-[20px] bg-white rounded-2xl overflow-hidden border">
          {['週日', '週一', '週二', '週三', '週四', '週五', '週六'].map((d, i) => (
            <div key={d} className={`p-2 md:p-3 text-center font-bold border-b border-r bg-gray-50 ${i === 0 || i === 6 ? 'text-red-500' : 'text-gray-800'}`}>{d}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={'e-' + i} className="p-2 min-h-[140px] border-b border-r bg-gray-50/20"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const allDayShifts = rosterShifts
              .filter(s => s.year === currentYear && s.month === currentMonth && s.day === day && s.dept === selectedDept)
              .sort((a, b) => ({ '早診': 1, '午診': 2, '晚診': 3 }[a.shift] - { '早診': 1, '午診': 2, '晚診': 3 }[b.shift]));

            return (
              <div 
                key={day} 
                onClick={() => {
                  if (isApproved) {
                    onOpenNewRosterModal(day);
                  }
                }} 
                className="p-2 min-h-[140px] border-b border-r space-y-2 hover:bg-blue-50/30 cursor-pointer"
              >
                <div className="font-bold text-gray-800 border-b pb-0.5">{day}日</div>
                {allDayShifts.map(shift => (
                  <div 
                    key={shift.id} 
                    onClick={(e) => onCardClick(e, shift, day)} 
                    className={`border p-2 rounded-xl text-[13px] md:text-[16px] transition space-y-1 relative group ${window.getShiftStyle(shift.shift, shift.is_teaching)}`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1">
                        {shift.doctor} ({shift.shift})
                        {shift.is_teaching && (
                          <span className="text-[10px] md:text-[11px] bg-pink-600 text-white px-1 py-0.2 rounded font-bold">教學診</span>
                        )}
                      </span>
                      {isApproved && (
                        <button 
                          onClick={(e) => onDeleteRoster(e, shift, day)} 
                          className="text-red-500 hover:text-red-700 font-bold text-[13px] p-0.5 rounded hover:bg-red-100/50 transition"
                          title="刪除單診或批次刪除"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="text-[12px] md:text-[14px]">跟診學員：{shift.students?.length ? shift.students.join('、') : ''}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.RosterTab = RosterTab;
