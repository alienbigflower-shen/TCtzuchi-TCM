// js/components/CalendarTab.js - 2. 綜合行事曆分頁

function CalendarTab({
  currentYear,
  currentMonth,
  focusD,
  calendarViewMode,
  setCalendarViewMode,
  onPrevMonth,
  onNextMonth,
  events,
  isApproved,
  onOpenNewEventModal,
  onSelectEvent,
  residentReports,
  newReport,
  setNewReport,
  onAddResidentReport,
  onDeleteResidentReport
}) {
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm space-y-4 md:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onPrevMonth} className="px-3 py-1.5 border rounded-xl hover:bg-gray-50 text-[16px] md:text-[20px] font-bold no-print">◀ 上個月</button>
          <h2 className="text-[18px] md:text-[26px] font-bold text-gray-900">{currentYear} 年 {currentMonth} 月 綜合行事曆</h2>
          <button onClick={onNextMonth} className="px-3 py-1.5 border rounded-xl hover:bg-gray-50 text-[16px] md:text-[20px] font-bold no-print">下個月 ▶</button>
        </div>

        <div className="flex flex-wrap items-center gap-2 no-print">
          <div className="bg-gray-100 p-1 rounded-xl flex border gap-1 text-[14px] md:text-[16px] font-bold">
            <button 
              onClick={() => setCalendarViewMode('list')} 
              className={`px-3 py-1.5 rounded-lg transition ${calendarViewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              📋 縱向列表
            </button>
            <button 
              onClick={() => setCalendarViewMode('month')} 
              className={`px-3 py-1.5 rounded-lg transition ${calendarViewMode === 'month' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              📅 月視圖 (可橫滑)
            </button>
          </div>

          {isApproved && (
            <button 
              onClick={onOpenNewEventModal} 
              className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-xl text-[14px] md:text-[20px] font-bold hover:bg-blue-700"
            >
              + 排定事件
            </button>
          )}
          <button onClick={() => window.print()} className="border border-gray-300 px-3 md:px-4 py-2 rounded-xl text-[14px] md:text-[20px] font-bold hover:bg-gray-100 flex items-center gap-1.5">
            🖨️ 列印全月
          </button>
        </div>
      </div>

      {/* 縱向觀看模式 */}
      {calendarViewMode === 'list' && (
        <div className="space-y-3">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = events
              .filter(e => e.year === currentYear && e.month === currentMonth && e.day === day)
              .sort((a, b) => window.parseStartTime(a.time) - window.parseStartTime(b.time));

            if (dayEvents.length === 0) return null;

            const dayOfWeekStr = ['日','一','二','三','四','五','六'][new Date(currentYear, currentMonth - 1, day).getDay()];

            return (
              <div key={day} className="bg-gray-50/80 p-3.5 md:p-5 rounded-2xl border space-y-3">
                <div className="font-bold text-gray-900 text-[16px] md:text-[20px] border-b pb-1.5 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span>{currentMonth}月{day}日（週{dayOfWeekStr}）</span>
                </div>
                <div className="space-y-3">
                  {dayEvents.map(ev => {
                    const presenterName = window.parsePresenter(ev.note);
                    return (
                      <div 
                        key={ev.id} 
                        onClick={() => onSelectEvent(ev)} 
                        className="p-3.5 md:p-5 rounded-xl font-bold cursor-pointer hover:opacity-90 shadow-sm border space-y-1.5 transition relative" 
                        style={window.getEventCardStyle(ev)}
                      >
                        <div className="text-[17px] md:text-[22px] border-b border-gray-400/40 pb-1 text-gray-900 font-extrabold flex justify-between items-center">
                          <span>{ev.title}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[14px] md:text-[18px] text-gray-800 font-medium pt-1 pb-4">
                          <div>時間：<span className="font-bold text-gray-900">{ev.time}</span></div>
                          <div>地點：<span className="font-bold text-gray-900">{ev.location || '無'}</span></div>
                          <div>指導醫師：<span className="font-bold text-blue-900">{ev.advisor || '無'}</span></div>
                          <div>主持醫師：<span className="font-bold text-gray-900">{ev.instructor || '無'}</span></div>
                          <div>報告醫師：<span className="font-bold text-gray-900">{presenterName || '無'}</span></div>
                          <div>與會人員：<span className="font-bold text-gray-900">{ev.participants || '無'}</span></div>
                          <div>紀錄：<span className="font-bold text-gray-900">{ev.recorder || '無'}</span></div>
                        </div>

                        {ev.dept_tag && (
                          <div className="absolute bottom-2 right-2">
                            <span className={`text-[11px] md:text-[12px] px-2 py-0.5 rounded-md font-extrabold border shadow-sm ${window.getDeptTagStyle(ev.dept_tag)}`}>
                              {ev.dept_tag}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 月觀看模式 */}
      {calendarViewMode === 'month' && (
        <div className="overflow-x-auto no-scrollbar rounded-xl border border-gray-200">
          <div className="min-w-[750px] grid grid-cols-7 text-[11px] md:text-[18px]">
            {['週日', '週一', '週二', '週三', '週四', '週五', '週六'].map((d, i) => (
              <div key={d} className={`p-2 text-center font-bold border-b border-r bg-gray-50 ${i === 0 || i === 6 ? 'text-red-500' : 'text-gray-800'}`}>{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={'empty-' + i} className="p-1 min-h-[110px] border-b border-r bg-gray-50/20"></div>
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = events
                .filter(e => e.year === currentYear && e.month === currentMonth && e.day === day)
                .sort((a, b) => window.parseStartTime(a.time) - window.parseStartTime(b.time));

              return (
                <div key={day} className="p-1.5 min-h-[110px] border-b border-r space-y-1.5 hover:bg-blue-50/20 transition">
                  <div className="font-bold text-gray-900 border-b pb-0.5">{day}日</div>
                  {dayEvents.map(ev => {
                    const presenterName = window.parsePresenter(ev.note);
                    return (
                      <div 
                        key={ev.id} 
                        onClick={() => onSelectEvent(ev)} 
                        className="p-1.5 rounded-lg font-bold cursor-pointer hover:opacity-90 shadow-sm space-y-0.5 text-[11px] md:text-[13px] leading-snug border border-gray-300/80 relative pb-5" 
                        style={window.getEventCardStyle(ev)}
                      >
                        <div className="text-[12px] md:text-[14px] border-b border-gray-400/40 pb-0.5 font-extrabold text-gray-900">{ev.title}</div>
                        <div className="text-gray-900">時間：{ev.time}</div>
                        {ev.location && <div className="text-gray-800">地點：{ev.location}</div>}
                        {ev.advisor && <div className="text-blue-900 font-extrabold">指導：{ev.advisor}</div>}
                        {ev.instructor && <div className="text-gray-800">主持：{ev.instructor}</div>}
                        {presenterName && <div className="text-gray-800">報告：{presenterName}</div>}
                        {ev.participants && <div className="text-gray-800">與會：{ev.participants}</div>}
                        {ev.recorder && <div className="text-gray-800">紀錄：{ev.recorder}</div>}

                        {ev.dept_tag && (
                          <div className="absolute bottom-1 right-1">
                            <span className={`text-[11px] px-1.5 py-0.2 rounded font-extrabold border ${window.getDeptTagStyle(ev.dept_tag)}`}>
                              {ev.dept_tag}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 說明對照框 */}
      <div className="bg-gray-50 p-3 md:p-5 rounded-2xl border border-gray-300 text-[13px] md:text-[18px] text-gray-800 space-y-0.5 font-medium mt-4">
        <div>&lt;全&gt;中醫部全體主治、實習、住院醫師皆須參加；</div>
        <div>&lt;實住12&gt;實習醫師跟第一年、第二年住院醫師需參加。</div>
        <div>&lt;內&gt;輪訓內科跟當科資深、主治醫師者需參加；</div>
        <div>&lt;針&gt;輪訓針灸科跟當科資深、主治醫師者需參加；</div>
        <div>&lt;傷&gt;輪訓傷科跟資深、當科主治醫師者需參加；</div>
        <div>&lt;婦兒&gt;輪訓婦兒科跟資深、當科主治醫師者需參加；</div>
      </div>

      {/* 住院醫師報告預定方框 */}
      <div className="bg-indigo-50/90 border-2 border-indigo-200 p-4 md:p-5 rounded-2xl space-y-3 mt-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
          <span className="font-extrabold text-indigo-950 text-[15px] md:text-[17px] flex items-center gap-1.5">
            <span>📌</span> 住院醫師報告預定
          </span>
          <span className="text-indigo-700 font-bold text-[13px] md:text-[14px]">共 {residentReports.length} 項預定</span>
        </div>

        {isApproved && (
          <form onSubmit={onAddResidentReport} className="flex flex-wrap items-center gap-2 pt-1 border-b border-indigo-100 pb-3 no-print">
            <input 
              type="text" 
              value={newReport.date} 
              onChange={e => setNewReport({...newReport, date: e.target.value})} 
              placeholder="日期 (如 09.15)" 
              className="bg-white border border-indigo-300 rounded-xl px-3 py-1.5 font-bold text-gray-900 w-28 text-[13px] md:text-[15px] outline-none focus:border-indigo-600"
            />
            <input 
              type="text" 
              value={newReport.content} 
              onChange={e => setNewReport({...newReport, content: e.target.value})} 
              placeholder="報告內容 / 醫師姓名" 
              className="bg-white border border-indigo-300 rounded-xl px-3 py-1.5 font-bold text-gray-900 flex-1 min-w-[200px] text-[13px] md:text-[15px] outline-none focus:border-indigo-600"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl text-[13px] md:text-[15px] shadow">
              + 新增預定
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1 text-[13px] md:text-[15px]">
          {residentReports.map(rep => (
            <div key={rep.id} className="bg-white p-2.5 rounded-xl border border-indigo-100 shadow-sm flex justify-between items-center gap-2">
              <div className="truncate">
                <span className="font-extrabold text-indigo-900 mr-2 border-r border-indigo-200 pr-2">{rep.date}</span>
                <span className="font-bold text-gray-800">{rep.content}</span>
              </div>
              {isApproved && (
                <button 
                  onClick={() => onDeleteResidentReport(rep.id)} 
                  className="text-red-500 hover:text-red-700 font-bold text-[13px] p-1 shrink-0 hover:bg-red-50 rounded no-print"
                  title="刪除"
                >
                  🗑️
                </button>
              )}
            </div>
          ))}

          {residentReports.length === 0 && (
            <div className="col-span-full text-center py-3 text-gray-400 font-bold text-[14px]">
              目前尚無預定報告紀錄
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.CalendarTab = CalendarTab;
