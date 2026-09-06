// js/components/CoursesTab.js - 5. 核心課程一覽表分頁 (完整補齊新增/編輯/刪除/通知確認)

function CoursesTab({
  courses,
  isApproved,
  onOpenNewCourseModal,
  onEditCourse,
  onDeleteCourse,
  onToggleCourseConfirmed
}) {
  const scheduledCourses = courses
    .filter(c => c.is_scheduled)
    .sort((a, b) => (a.course_date || '').localeCompare(b.course_date || ''));

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm space-y-6 text-[13px] md:text-[15px]">
      <div className="flex flex-wrap justify-between items-center border-b pb-3 gap-3">
        <div>
          <h2 className="text-[18px] md:text-[22px] font-bold text-gray-900">📚 核心課程一覽表</h2>
          <p className="text-[12px] md:text-[14px] text-gray-500 mt-0.5">年度核心課程一覽</p>
        </div>
        {isApproved && (
          <div className="flex gap-2">
            <button 
              onClick={() => onOpenNewCourseModal(true)} 
              className="bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-blue-700 text-[13px] md:text-[14px]"
            >
              + 新增年度課程
            </button>
            <button 
              onClick={() => onOpenNewCourseModal(false)} 
              className="bg-amber-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-amber-700 text-[13px] md:text-[14px]"
            >
              + 新增未排程課程
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-[15px] md:text-[17px] font-bold text-blue-900 border-l-4 border-blue-600 pl-2">年度核心課程內容</h3>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-950 font-bold border-b text-[13px] md:text-[14px]">
                {isApproved && <th className="p-2.5 border-r w-12 text-center">通知</th>}
                <th className="p-2.5 border-r w-28 md:w-36">日期</th>
                <th className="p-2.5 border-r w-28 md:w-36">講師</th>
                <th className="p-2.5 border-r">課程內容</th>
                {isApproved && <th className="p-2.5 w-20 text-center">操作</th>}
              </tr>
            </thead>
            <tbody className="divide-y text-[13px] md:text-[14px]">
              {scheduledCourses.map(c => (
                <tr key={c.id} className={`hover:bg-gray-50 transition ${c.is_confirmed ? 'font-bold bg-blue-50/30' : ''}`}>
                  {isApproved && (
                    <td className="p-2.5 border-r text-center">
                      <input 
                        type="checkbox" 
                        checked={c.is_confirmed || false} 
                        onChange={() => onToggleCourseConfirmed(c)} 
                        className="w-4 h-4 accent-blue-600 cursor-pointer" 
                        title="切換通知確認狀態"
                      />
                    </td>
                  )}
                  <td className="p-2.5 border-r text-gray-800">{c.course_date || '未定'}</td>
                  <td className="p-2.5 border-r text-gray-900">{c.instructor || '無'}</td>
                  <td className="p-2.5 border-r text-gray-800 whitespace-pre-line">{c.content}</td>
                  {isApproved && (
                    <td className="p-2.5 text-center space-x-1 whitespace-nowrap">
                      <button onClick={() => onEditCourse(c)} className="text-blue-600 hover:underline">編輯</button>
                      <button onClick={() => onDeleteCourse(c.id)} className="text-red-500 hover:underline">刪除</button>
                    </td>
                  )}
                </tr>
              ))}

              {scheduledCourses.length === 0 && (
                <tr>
                  <td colSpan={isApproved ? 5 : 4} className="text-center py-6 text-gray-400">目前尚無已排定的年度核心課程</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

window.CoursesTab = CoursesTab;
