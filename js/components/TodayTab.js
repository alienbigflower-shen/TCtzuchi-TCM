// js/components/TodayTab.js - 1. 當日焦點分頁

function TodayTab({
  focusDate,
  focusY,
  focusM,
  focusD,
  events,
  onFocusDateChange,
  onUpdateFocusDate,
  onSelectEvent
}) {
  const dayEvents = events
    .filter(e => e.year === focusY && e.month === focusM && e.day === focusD)
    .sort((a, b) => window.parseStartTime(a.time) - window.parseStartTime(b.time));

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 md:p-8 rounded-2xl text-white shadow-md space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="text-[14px] md:text-[20px] opacity-80 font-bold uppercase tracking-wider">Today's Focus</div>
            <h2 className="text-[22px] md:text-[32px] font-bold mt-1">重點動態（{focusY}年{focusM}月{focusD}日）</h2>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20 text-[14px] md:text-[20px] w-full md:w-auto justify-between no-print">
            <button onClick={() => onFocusDateChange(-1)} className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-xl font-bold">◀ 前一天</button>
            <input 
              type="date" 
              value={focusDate} 
              onChange={e => onUpdateFocusDate(e.target.value)} 
              className="bg-white text-gray-900 px-2 py-1 rounded-xl font-bold cursor-pointer outline-none" 
            />
            <button onClick={() => onUpdateFocusDate(window.getTodayString())} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold">今天</button>
            <button onClick={() => onFocusDateChange(1)} className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-xl font-bold">後一天 ▶</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-2xl border shadow-sm space-y-4 md:space-y-6">
        <h3 className="text-[20px] md:text-[26px] font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
          <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-700"></span>
          {focusY}年{focusM}月{focusD}日 行程與會議事件
        </h3>

        <div className="space-y-4">
          {dayEvents.map(ev => {
            const presenterName = window.parsePresenter(ev.note);
            return (
              <div 
                key={ev.id} 
                onClick={() => onSelectEvent(ev)} 
                className="p-4 md:p-6 rounded-2xl border-l-8 bg-gray-50 space-y-2 cursor-pointer hover:bg-gray-100 transition relative" 
                style={{ borderColor: ev.color }}
              >
                <div className="text-[20px] md:text-[26px] font-bold text-gray-900 flex justify-between items-start">
                  <span>{ev.title}</span>
                  {ev.dept_tag && (
                    <span className={`text-[11px] md:text-[12px] px-2 py-0.5 rounded-md font-bold border ${window.getDeptTagStyle(ev.dept_tag)}`}>
                      {ev.dept_tag}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[15px] md:text-[20px] text-gray-700">
                  <div>與會者：<span className="font-bold">{ev.participants || '無'}</span></div>
                  <div>時間：<span className="font-bold text-emerald-800">{ev.time}</span></div>
                  <div>地點：<span className="font-bold">{ev.location || '無'}</span></div>
                  <div>指導醫師：<span className="font-bold text-blue-900">{ev.advisor || '無'}</span></div>
                  <div>主持醫師：<span className="font-bold">{ev.instructor || '無'}</span></div>
                  <div>報告醫師：<span className="font-bold">{presenterName || '無'}</span></div>
                  <div>紀錄：<span className="font-bold text-emerald-900">{ev.recorder || '無'}</span></div>
                </div>
              </div>
            );
          })}

          {dayEvents.length === 0 && (
            <div className="text-[18px] md:text-[22px] text-gray-400 py-8 text-center">該日期尚無排定行程事件</div>
          )}
        </div>
      </div>
    </div>
  );
}

window.TodayTab = TodayTab;
