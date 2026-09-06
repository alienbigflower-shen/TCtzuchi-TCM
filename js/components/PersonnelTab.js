// js/components/PersonnelTab.js - 4. 中醫部醫師陣容與輪訓分頁

function PersonnelTab({
  personnelList,
  sortedBatches,
  batchDates,
  setBatchDates,
  isApproved,
  onOpenNewPersonnelModal,
  onEditPersonnel,
  onDeletePersonnel,
  onSaveBatchDates
}) {
  return (
    <div className="space-y-6">
      {/* 🖨️ 列印專用 Excel 風格總表 */}
      <div className="print-only">
        <div className="print-title">
          臺中慈濟醫院中醫部 醫師陣容與輪訓總表
        </div>
        <table className="excel-table">
          <thead>
            <tr>
              <th className="w-28">醫師類別</th>
              <th className="w-32">醫師姓名</th>
              <th className="w-28">輪訓科別/組別</th>
              <th>負責主治醫師 / 備註資訊</th>
              <th className="w-48">受訓時間區間</th>
            </tr>
          </thead>
          <tbody>
            {personnelList.filter(p => p.category === 'chiefDepartment').map(p => (
              <tr key={p.id}>
                <td className="font-bold">部總醫師</td>
                <td>{p.name}</td>
                <td>-</td>
                <td>{p.note || '中醫部總醫師'}</td>
                <td>-</td>
              </tr>
            ))}
            {personnelList.filter(p => p.category === 'chiefSections').map(p => (
              <tr key={p.id}>
                <td className="font-bold">科總醫師</td>
                <td>{p.name}</td>
                <td>-</td>
                <td>{p.note || '各專科總醫師'}</td>
                <td>-</td>
              </tr>
            ))}
            {personnelList.filter(p => p.category === 'residents').map(p => {
              const res = window.parseResidentNote(p.note);
              return (
                <tr key={p.id}>
                  <td className="font-bold">各科住院醫師</td>
                  <td>{p.name}</td>
                  <td>{res.dept}</td>
                  <td>負責主治：{res.supervisor}</td>
                  <td>-</td>
                </tr>
              );
            })}
            {personnelList.filter(p => p.category === 'specialtyTrainings' || p.category === 'externalTrainings').map(p => (
              <tr key={p.id}>
                <td className="font-bold">{p.category === 'specialtyTrainings' ? '專科輪訓' : '外訓醫師'}</td>
                <td>{p.name}</td>
                <td>-</td>
                <td>{p.note || '-'}</td>
                <td>-</td>
              </tr>
            ))}
            {personnelList.filter(p => p.category === 'interns').map(p => {
              const intData = window.parseInternNote(p.note);
              const batchObj = sortedBatches.find(b => b.id === intData.batch);
              return (
                <tr key={p.id}>
                  <td className="font-bold">輪訓實習醫師</td>
                  <td>{p.name}</td>
                  <td>{intData.dept} ({intData.group}組)</td>
                  <td>實習醫學生</td>
                  <td>{batchObj ? batchObj.dateStr : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 💻 平時螢幕瀏覽介面 (純彩色卡片，完整保留) */}
      <div className="screen-only bg-white p-5 md:p-8 rounded-2xl border shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-[22px] md:text-[28px] font-bold text-gray-900">中醫部醫師陣容與幹部</h2>
            <p className="text-[14px] md:text-[18px] text-gray-500 mt-1">
              {isApproved ? '💡 點擊任何一位醫師卡片即可直接進行編輯' : '當月部總、科總、住院醫師、外訓與實習醫師資訊'}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="border border-gray-300 px-4 py-2 rounded-xl text-[15px] md:text-[18px] font-bold hover:bg-gray-100 flex items-center gap-1.5">
              🖨️ 列印名冊
            </button>
            {isApproved && (
              <button 
                onClick={onOpenNewPersonnelModal} 
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[16px] md:text-[20px] font-bold hover:bg-blue-700 shadow"
              >
                + 新增醫師
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-3 shadow-sm">
              <h3 className="font-bold text-[20px] md:text-[24px] text-blue-900 border-b border-blue-200 pb-2">當月部總醫師</h3>
              <div className="space-y-2">
                {personnelList.filter(p => p.category === 'chiefDepartment').map(p => (
                  <div key={p.id} onClick={() => onEditPersonnel(p)} className={`p-3.5 rounded-xl border bg-white flex justify-between items-center transition ${isApproved ? 'hover:border-blue-500 hover:shadow-md cursor-pointer' : ''}`}>
                    <div className="font-bold text-[18px] md:text-[20px] text-gray-800">{p.name} <span className="text-[15px] font-normal text-gray-500">({p.note || '總醫師'})</span></div>
                    {isApproved && <button onClick={(e) => onDeletePersonnel(e, p.id)} className="text-red-500 font-bold p-1 hover:bg-red-50 rounded">刪除</button>}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3 shadow-sm">
              <h3 className="font-bold text-[20px] md:text-[24px] text-indigo-900 border-b border-indigo-200 pb-2">當月科總醫師</h3>
              <div className="space-y-2">
                {personnelList.filter(p => p.category === 'chiefSections').map(p => (
                  <div key={p.id} onClick={() => onEditPersonnel(p)} className={`p-3.5 rounded-xl border bg-white flex justify-between items-center transition ${isApproved ? 'hover:border-indigo-500 hover:shadow-md cursor-pointer' : ''}`}>
                    <div className="font-bold text-[18px] md:text-[20px] text-gray-800">{p.name} <span className="text-[15px] font-normal text-gray-500">({p.note || '科總'})</span></div>
                    {isApproved && <button onClick={(e) => onDeletePersonnel(e, p.id)} className="text-red-500 font-bold p-1 hover:bg-red-50 rounded">刪除</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 shadow-sm">
              <h3 className="font-bold text-[20px] md:text-[24px] text-amber-900 border-b border-amber-200 pb-2">專科輪訓醫師</h3>
              <div className="space-y-2">
                {personnelList.filter(p => p.category === 'specialtyTrainings').map(p => (
                  <div key={p.id} onClick={() => onEditPersonnel(p)} className={`p-3.5 rounded-xl border bg-white flex justify-between items-center transition ${isApproved ? 'hover:border-amber-500 hover:shadow-md cursor-pointer' : ''}`}>
                    <div className="font-bold text-[18px] md:text-[20px] text-gray-800">{p.name} <span className="text-[15px] font-normal text-gray-500">({p.note || '輪訓'})</span></div>
                    {isApproved && <button onClick={(e) => onDeletePersonnel(e, p.id)} className="text-red-500 font-bold p-1 hover:bg-red-50 rounded">刪除</button>}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3 shadow-sm">
              <h3 className="font-bold text-[20px] md:text-[24px] text-purple-900 border-b border-purple-200 pb-2">外訓醫師</h3>
              <div className="space-y-2">
                {personnelList.filter(p => p.category === 'externalTrainings').map(p => (
                  <div key={p.id} onClick={() => onEditPersonnel(p)} className={`p-3.5 rounded-xl border bg-white flex justify-between items-center transition ${isApproved ? 'hover:border-purple-500 hover:shadow-md cursor-pointer' : ''}`}>
                    <div className="font-bold text-[18px] md:text-[20px] text-gray-800">{p.name} <span className="text-[15px] font-normal text-gray-500">({p.note || '外訓'})</span></div>
                    {isApproved && <button onClick={(e) => onDeletePersonnel(e, p.id)} className="text-red-500 font-bold p-1 hover:bg-red-50 rounded">刪除</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-4 shadow-sm">
            <h3 className="font-bold text-[22px] md:text-[26px] text-emerald-900 border-b border-emerald-200 pb-2">各科住院醫師</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personnelList.filter(p => p.category === 'residents').map(p => {
                const resData = window.parseResidentNote(p.note);
                return (
                  <div 
                    key={p.id} 
                    onClick={() => onEditPersonnel(p)} 
                    className={`p-4 rounded-xl border bg-white space-y-2.5 transition shadow-sm ${isApproved ? 'hover:border-emerald-500 hover:shadow-md cursor-pointer' : ''}`}
                  >
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-extrabold text-[20px] text-gray-900">{p.name}</span>
                      <span className="text-[13px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">{resData.dept}</span>
                    </div>
                    <div className="text-[15px] font-bold text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      負責主治：{resData.supervisor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-5 shadow-sm">
            <div className="flex flex-wrap justify-between items-center border-b border-teal-200 pb-3 gap-3">
              <h3 className="font-bold text-[22px] md:text-[26px] text-teal-900">輪訓實習醫師</h3>
              
              <div className="flex flex-wrap items-center gap-2 text-[14px] md:text-[16px]">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-teal-300 flex items-center gap-1">
                  <span className="font-bold text-teal-800">受訓時間一：</span>
                  {isApproved ? (
                    <input type="text" value={batchDates.batch1} onChange={e => setBatchDates({...batchDates, batch1: e.target.value})} className="font-bold text-gray-800 border-b border-teal-400 outline-none w-44 px-1" />
                  ) : (
                    <span className="font-bold text-gray-800">{batchDates.batch1}</span>
                  )}
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-teal-300 flex items-center gap-1">
                  <span className="font-bold text-teal-800">受訓時間二：</span>
                  {isApproved ? (
                    <input type="text" value={batchDates.batch2} onChange={e => setBatchDates({...batchDates, batch2: e.target.value})} className="font-bold text-gray-800 border-b border-teal-400 outline-none w-44 px-1" />
                  ) : (
                    <span className="font-bold text-gray-800">{batchDates.batch2}</span>
                  )}
                </div>
                {isApproved && (
                  <button onClick={onSaveBatchDates} className="bg-teal-700 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-teal-800">💾 儲存時間</button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {sortedBatches.map(b => {
                const batchInterns = personnelList.filter(p => p.category === 'interns' && window.parseInternNote(p.note).batch === b.id);

                return (
                  <div key={b.id} className="p-4 md:p-5 rounded-2xl bg-white border-2 border-teal-300 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-extrabold text-[18px] md:text-[22px] text-teal-950">受訓區間：{b.dateStr}</span>
                      <span className="text-[14px] font-bold text-gray-500">共 {batchInterns.length} 位</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {batchInterns.map(p => {
                        const intData = window.parseInternNote(p.note);
                        return (
                          <div key={p.id} onClick={() => onEditPersonnel(p)} className={`p-4 rounded-xl border bg-teal-50/40 space-y-2 transition shadow-sm ${isApproved ? 'hover:border-teal-500 hover:shadow-md cursor-pointer' : ''}`}>
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="font-extrabold text-[20px] text-gray-900">{p.name}</span>
                              {isApproved && <button onClick={(e) => onDeletePersonnel(e, p.id)} className="text-red-500 font-bold p-1 hover:bg-red-50 rounded">刪除</button>}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[15px] font-bold">
                              <div className="bg-white text-blue-900 p-2 rounded-lg border border-blue-200 text-center">
                                <span className="text-gray-500 text-[12px] block font-normal">所屬組別</span>
                                {intData.group} 組
                              </div>
                              <div className="bg-white text-teal-900 p-2 rounded-lg border border-teal-200 text-center">
                                <span className="text-gray-500 text-[12px] block font-normal">輪訓科別</span>
                                {intData.dept}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PersonnelTab = PersonnelTab;
