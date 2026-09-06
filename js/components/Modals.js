// js/components/Modals.js - 系統中所有操作彈窗

// 1. 事件詳情彈窗
function EventDetailModal({ selectedEvent, onClose, isApproved, onEdit, onDelete }) {
  if (!selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 no-print" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-4 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start border-b pb-3">
          <div className="space-y-1">
            <h3 className="font-bold text-[22px] md:text-[28px] text-gray-900">{selectedEvent.title}</h3>
            {selectedEvent.dept_tag && (
              <span className={`inline-block text-[12px] px-2.5 py-0.5 rounded-md font-extrabold border ${window.getDeptTagStyle(selectedEvent.dept_tag)}`}>
                {selectedEvent.dept_tag}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 font-bold text-[24px]">✕</button>
        </div>
        <div className="space-y-3 text-[18px] md:text-[22px] text-gray-800">
          <div>與會者：<strong>{selectedEvent.participants || '無'}</strong></div>
          <div>時間：<strong className="text-emerald-800">{selectedEvent.time}</strong></div>
          <div>地點：<strong>{selectedEvent.location || '無'}</strong></div>
          <div>指導醫師：<strong className="text-blue-900">{selectedEvent.advisor || '無'}</strong></div>
          <div>主持醫師：<strong>{selectedEvent.instructor || '無'}</strong></div>
          <div>報告醫師：<strong>{window.parsePresenter(selectedEvent.note) || '無'}</strong></div>
          <div>紀錄：<strong>{selectedEvent.recorder || '無'}</strong></div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t">
          {isApproved ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit(selectedEvent)} className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold">編輯事件</button>
              <button onClick={() => onDelete(selectedEvent)} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold">刪除</button>
            </div>
          ) : <div></div>}
          <button onClick={onClose} className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold">關閉</button>
        </div>
      </div>
    </div>
  );
}

// 2. 排定/編輯事件彈窗
function EventFormModal({
  show,
  newEvent,
  setNewEvent,
  daysInModalMonth,
  onSave,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50 no-print">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-[22px] md:text-[26px] text-gray-900 border-b pb-3">
          {newEvent.editId ? '編輯行事曆事件' : '排定行事曆事件'}
        </h3>
        <form onSubmit={onSave} className="space-y-4 text-[16px] md:text-[18px]">
          {!newEvent.editId && (
            <div className="bg-gray-100 p-2 rounded-xl flex gap-2">
              <button 
                type="button" 
                onClick={() => setNewEvent({...newEvent, isRecurring: false})} 
                className={`flex-1 py-2 rounded-lg font-bold ${!newEvent.isRecurring ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
              >
                指定單日事件
              </button>
              <button 
                type="button" 
                onClick={() => setNewEvent({...newEvent, isRecurring: true})} 
                className={`flex-1 py-2 rounded-lg font-bold ${newEvent.isRecurring ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
              >
                批次每週重複事件
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">色彩等級</label>
              <select value={newEvent.color} onChange={e => setNewEvent({...newEvent, color: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold">
                <option value="紅色">紅色（高度重要）</option>
                <option value="黃色">黃色（中度重要）</option>
                <option value="綠色">綠色（一般事件）</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">所屬科別 (Tag)</label>
              <select value={newEvent.deptTag} onChange={e => setNewEvent({...newEvent, deptTag: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold">
                <option value="">無標籤</option>
                <option value="內科">內科</option>
                <option value="婦科">婦科</option>
                <option value="兒科">兒科</option>
                <option value="針灸科">針灸科</option>
                <option value="傷科">傷科</option>
                <option value="家醫科">家醫科</option>
              </select>
            </div>
          </div>

          {newEvent.isRecurring ? (
            <div>
              <label className="block text-blue-900 font-bold mb-1">當月每週幾固定舉行？</label>
              <select value={newEvent.weeklyDay} onChange={e => setNewEvent({...newEvent, weeklyDay: e.target.value})} className="w-full border rounded-xl p-3 bg-blue-50 font-bold">
                <option value="1">週一</option><option value="2">週二</option><option value="3">週三</option><option value="4">週四</option><option value="5">週五</option><option value="6">週六</option><option value="0">週日</option>
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 font-bold mb-1">選擇月份</label>
                <select 
                  value={newEvent.month} 
                  onChange={e => setNewEvent({...newEvent, month: parseInt(e.target.value)})} 
                  className="w-full border rounded-xl p-3 bg-gray-50 font-bold"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m} 月</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">選擇日期</label>
                <select 
                  value={newEvent.day} 
                  onChange={e => setNewEvent({...newEvent, day: parseInt(e.target.value)})} 
                  className="w-full border rounded-xl p-3 bg-gray-50 font-bold"
                >
                  {Array.from({ length: daysInModalMonth }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>{d} 日</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-1">活動時間 (開始 - 結束)</label>
            <div className="grid grid-cols-2 gap-3 items-center">
              <select 
                value={newEvent.startTime} 
                onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} 
                className="w-full border rounded-xl p-3 bg-gray-50 font-bold"
              >
                {window.TIME_OPTIONS.map(t => (
                  <option key={'s-' + t} value={t}>{t}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-bold">至</span>
                <select 
                  value={newEvent.endTime} 
                  onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} 
                  className="w-full border rounded-xl p-3 bg-gray-50 font-bold"
                >
                  {window.TIME_OPTIONS.map(t => (
                    <option key={'e-' + t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div><label className="block text-gray-700 font-bold mb-1">標題</label><input type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold" required placeholder="如：須彌山講座" /></div>
          <div><label className="block text-gray-700 font-bold mb-1">與會者</label><input type="text" value={newEvent.participants} onChange={e => setNewEvent({...newEvent, participants: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50" placeholder="如：全體醫師、實習醫師" /></div>
          <div><label className="block text-gray-700 font-bold mb-1">地點</label><input type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50" placeholder="如：第一會議室" /></div>
          
          <div><label className="block text-blue-900 font-bold mb-1">指導醫師</label><input type="text" value={newEvent.advisor} onChange={e => setNewEvent({...newEvent, advisor: e.target.value})} className="w-full border rounded-xl p-3 bg-blue-50 font-bold" placeholder="如：黃仲諄主任、王人澍副院長" /></div>

          <div><label className="block text-gray-700 font-bold mb-1">主持醫師</label><input type="text" value={newEvent.instructor} onChange={e => setNewEvent({...newEvent, instructor: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50" placeholder="如：黃仲諄主任" /></div>
          <div><label className="block text-gray-700 font-bold mb-1">報告醫師</label><input type="text" value={newEvent.presenter} onChange={e => setNewEvent({...newEvent, presenter: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50" placeholder="如：張醫師" /></div>
          <div><label className="block text-gray-700 font-bold mb-1">紀錄</label><input type="text" value={newEvent.recorder} onChange={e => setNewEvent({...newEvent, recorder: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50" placeholder="如：蕭醫師" /></div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl font-bold text-gray-600">取消</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">儲存事件</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. 跟診診次設定彈窗
function RosterFormModal({
  show,
  newRoster,
  setNewRoster,
  daysInMonth,
  onToggleSlot,
  onSave,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50 no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 md:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-[20px] md:text-[26px] text-gray-900 border-b pb-3">
          {newRoster.editId ? `編輯單診資料` : `新增 / 批次建立門診`}
        </h3>
        <form onSubmit={onSave} className="space-y-4 text-[16px] md:text-[20px]">
          {!newRoster.editId && (
            <div className="bg-gray-100 p-2 rounded-xl flex gap-2">
              <button 
                type="button" 
                onClick={() => setNewRoster({...newRoster, isRecurring: false})} 
                className={`flex-1 py-2 rounded-lg font-bold ${!newRoster.isRecurring ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
              >
                指定單日門診
              </button>
              <button 
                type="button" 
                onClick={() => setNewRoster({...newRoster, isRecurring: true})} 
                className={`flex-1 py-2 rounded-lg font-bold ${newRoster.isRecurring ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
              >
                複選多時段 (建全月)
              </button>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-1">跟診主治醫師</label>
            <input type="text" value={newRoster.doctor} onChange={e => setNewRoster({...newRoster, doctor: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold" required />
          </div>

          <div className="flex items-center gap-3 bg-pink-50 p-3.5 rounded-2xl border border-pink-200">
            <input 
              type="checkbox" 
              id="isTeachingCheck" 
              checked={newRoster.isTeaching} 
              onChange={e => setNewRoster({...newRoster, isTeaching: e.target.checked})} 
              className="w-5 h-5 accent-pink-600 cursor-pointer" 
            />
            <label htmlFor="isTeachingCheck" className="font-bold text-pink-900 text-[16px] md:text-[18px] cursor-pointer">
              開通為「教學診」（勾選後呈現粉紅色背景與專屬標籤）
            </label>
          </div>

          {newRoster.isRecurring && !newRoster.editId ? (
            <div className="space-y-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-200">
              <label className="block text-blue-900 font-bold text-[16px] md:text-[18px]">請勾選當月固定門診時段：</label>

              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-center bg-white rounded-xl overflow-hidden border">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900 font-bold">
                      <th className="p-2 border">診別</th>
                      {['週一', '週二', '週三', '週四', '週五', '週六'].map(d => <th key={d} className="p-2 border">{d}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {['早診', '午診', '晚診'].map(shift => (
                      <tr key={shift} className="border-t">
                        <td className="p-2 font-bold bg-gray-50 border">{shift}</td>
                        {[1, 2, 3, 4, 5, 6].map(w => {
                          const isChecked = newRoster.selectedSlots.some(s => s.weeklyDay === w && s.shift === shift);
                          return (
                            <td key={w} className="p-2 border hover:bg-blue-50 cursor-pointer" onClick={() => onToggleSlot(w, shift)}>
                              <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-2 md:hidden">
                {['週一', '週二', '週三', '週四', '週五', '週六'].map((dayName, index) => {
                  const w = index + 1;
                  return (
                    <div key={w} className="bg-white p-2.5 rounded-xl border space-y-1.5">
                      <div className="font-bold text-blue-900 border-b pb-1 text-center text-[15px]">{dayName}</div>
                      {['早診', '午診', '晚診'].map(shift => {
                        const isChecked = newRoster.selectedSlots.some(s => s.weeklyDay === w && s.shift === shift);
                        return (
                          <button
                            key={shift}
                            type="button"
                            onClick={() => onToggleSlot(w, shift)}
                            className={`w-full py-1.5 rounded-lg text-[13px] font-bold border transition ${
                              isChecked ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {shift} {isChecked ? '✓' : ''}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-gray-700 font-bold mb-1">日期 (幾號)</label><input type="number" min="1" max={daysInMonth} value={newRoster.day} onChange={e => setNewRoster({...newRoster, day: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold" /></div>
              <div><label className="block text-gray-700 font-bold mb-1">診別</label><select value={newRoster.shift} onChange={e => setNewRoster({...newRoster, shift: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold"><option value="早診">早診</option><option value="午診">午診</option><option value="晚診">晚診</option></select></div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-bold mb-1">跟診學員名單</label>
            <input type="text" value={newRoster.studentName} onChange={e => setNewRoster({...newRoster, studentName: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold" placeholder="例如：沈小花、張小明" />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl font-bold text-gray-600">取消</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">儲存</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. 醫師管理彈窗
function PersonnelFormModal({
  show,
  newPerson,
  setNewPerson,
  batchDates,
  onSave,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 no-print">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <h3 className="font-bold text-[22px] text-gray-900 border-b pb-3">{newPerson.editId ? '修改醫師資料' : '新增醫師名單'}</h3>
        <form onSubmit={onSave} className="space-y-4 text-[16px] md:text-[18px]">
          <div>
            <label className="block text-gray-700 font-bold mb-1">醫師類別</label>
            <select value={newPerson.category} onChange={e => setNewPerson({...newPerson, category: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold">
              <option value="chiefDepartment">當月部總醫師</option>
              <option value="chiefSections">當月科總醫師</option>
              <option value="residents">各科住院醫師</option>
              <option value="specialtyTrainings">專科輪訓醫師</option>
              <option value="externalTrainings">外訓醫師</option>
              <option value="interns">輪訓實習醫師</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">醫師姓名</label>
            <input type="text" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold" required placeholder="如：張小明醫師" />
          </div>

          {newPerson.category === 'residents' && (
            <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <div>
                <label className="block text-emerald-950 font-bold mb-1">所屬科別 (標籤)</label>
                <select value={newPerson.deptName} onChange={e => setNewPerson({...newPerson, deptName: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white font-bold">
                  <option value="內科">內科</option>
                  <option value="婦科">婦科</option>
                  <option value="兒科">兒科</option>
                  <option value="針灸科">針灸科</option>
                  <option value="傷科">傷科</option>
                  <option value="家醫科">家醫科</option>
                </select>
              </div>
              <div>
                <label className="block text-emerald-950 font-bold mb-1">負責的主治醫師</label>
                <input type="text" value={newPerson.supervisorDoctor} onChange={e => setNewPerson({...newPerson, supervisorDoctor: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white font-bold" placeholder="如：黃仲諄主任" required />
              </div>
            </div>
          )}

          {newPerson.category === 'interns' && (
            <div className="space-y-3 bg-teal-50/60 p-4 rounded-2xl border border-teal-200">
              <div>
                <label className="block text-teal-950 font-bold mb-1">受訓時間區間</label>
                <select value={newPerson.batchNumber} onChange={e => setNewPerson({...newPerson, batchNumber: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white font-bold">
                  <option value="1">第一組受訓時間 ({batchDates.batch1})</option>
                  <option value="2">第二組受訓時間 ({batchDates.batch2})</option>
                </select>
              </div>
              <div>
                <label className="block text-teal-950 font-bold mb-1">所屬組別 (A - H)</label>
                <select value={newPerson.groupCode} onChange={e => setNewPerson({...newPerson, groupCode: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white font-bold">
                  {['A','B','C','D','E','F','G','H'].map(g => (
                    <option key={g} value={g}>{g} 組</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-teal-950 font-bold mb-1">跑的科別</label>
                <select value={newPerson.rotationDept} onChange={e => setNewPerson({...newPerson, rotationDept: e.target.value})} className="w-full border rounded-xl p-2.5 bg-white font-bold">
                  <option value="內一">內一</option>
                  <option value="內二">內二</option>
                  <option value="婦兒科">婦兒科</option>
                  <option value="針灸科">針灸科</option>
                  <option value="傷科">傷科</option>
                </select>
              </div>
            </div>
          )}

          {newPerson.category !== 'residents' && newPerson.category !== 'interns' && (
            <div>
              <label className="block text-gray-700 font-bold mb-1">備註說明 (可選)</label>
              <input type="text" value={newPerson.note} onChange={e => setNewPerson({...newPerson, note: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50" placeholder="如：5266 分機 或 外訓科別" />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl font-bold">取消</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl">儲存變更</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 5. 核心課程管理彈窗
function CourseFormModal({
  show,
  newCourse,
  setNewCourse,
  onSave,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 no-print">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <h3 className="font-bold text-[20px] text-gray-900 border-b pb-3">{newCourse.editId ? '✏️ 編輯核心課程' : '📚 新增核心課程'}</h3>
        <form onSubmit={onSave} className="space-y-3 text-[15px]">
          <div>
            <label className="block text-gray-700 font-bold mb-1">課程歸類</label>
            <select value={newCourse.isScheduled ? 'true' : 'false'} onChange={e => setNewCourse({...newCourse, isScheduled: e.target.value === 'true'})} className="w-full border rounded-xl p-2.5 bg-gray-50 font-bold">
              <option value="true">年度核心課程內容</option>
              <option value="false">尚未排程課程</option>
            </select>
          </div>
          <div><label className="block text-gray-700 font-bold mb-1">日期（或備註時間）</label><input type="text" value={newCourse.date} onChange={e => setNewCourse({...newCourse, date: e.target.value})} className="w-full border rounded-xl p-2.5 bg-gray-50" required /></div>
          <div><label className="block text-gray-700 font-bold mb-1">講師</label><input type="text" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} className="w-full border rounded-xl p-2.5 bg-gray-50" /></div>
          <div><label className="block text-gray-700 font-bold mb-1">課程內容</label><textarea value={newCourse.content} onChange={e => setNewCourse({...newCourse, content: e.target.value})} className="w-full border rounded-xl p-2.5 bg-gray-50 h-24" required></textarea></div>
          <div className="flex justify-end gap-3 pt-2 border-t"><button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl font-bold">取消</button><button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl">儲存變更</button></div>
        </form>
      </div>
    </div>
  );
}

// 6. 公告發布彈窗
function BulletinFormModal({
  show,
  newBulletin,
  setNewBulletin,
  onSave,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 no-print">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
        <h3 className="font-bold text-[22px] text-gray-900 border-b pb-3">{newBulletin.editId ? '✏️ 編輯公告' : '📢 發布公告'}</h3>
        <form onSubmit={onSave} className="space-y-3">
          <div>
            <label className="block text-gray-700 font-bold mb-1">公告層級</label>
            <select value={newBulletin.level} onChange={e => setNewBulletin({...newBulletin, level: e.target.value})} className="w-full border rounded-xl p-2.5 bg-gray-50 font-bold">
              <option value="普通">普通公告</option>
              <option value="重要">重要公告 (紅底醒目)</option>
            </select>
          </div>
          <div><label className="block text-gray-700 font-bold mb-1">標題</label><input type="text" value={newBulletin.title} onChange={e => setNewBulletin({...newBulletin, title: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 font-bold" required /></div>
          <div><label className="block text-gray-700 font-bold mb-1">內容</label><textarea value={newBulletin.content} onChange={e => setNewBulletin({...newBulletin, content: e.target.value})} className="w-full border rounded-xl p-3 bg-gray-50 h-28" required></textarea></div>
          <div className="flex justify-end gap-3 pt-3"><button type="button" onClick={onClose} className="px-5 py-2.5 border rounded-xl font-bold">取消</button><button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow">儲存變更</button></div>
        </form>
      </div>
    </div>
  );
}

window.EventDetailModal = EventDetailModal;
window.EventFormModal = EventFormModal;
window.RosterFormModal = RosterFormModal;
window.PersonnelFormModal = PersonnelFormModal;
window.CourseFormModal = CourseFormModal;
window.BulletinFormModal = BulletinFormModal;
