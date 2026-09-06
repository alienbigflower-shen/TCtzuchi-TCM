// js/app.js - 主應用程式核心與狀態整合

const { useState, useEffect } = React;

function App() {
  const todayStr = window.getTodayString();
  const todayObj = new Date();

  const [user, setUser] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [loading, setLoading] = useState(true);

  const [currentTab, setCurrentTab] = useState('today');
  const [calendarViewMode, setCalendarViewMode] = useState('month'); 
  const [rulesSubTab, setRulesSubTab] = useState('meeting');

  const [currentYear, setCurrentYear] = useState(todayObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayObj.getMonth() + 1);
  const [selectedDept, setSelectedDept] = useState('內一');
  const [focusDate, setFocusDate] = useState(todayStr);

  const [events, setEvents] = useState([]);
  const [rosterShifts, setRosterShifts] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [courses, setCourses] = useState([]);

  const [residentReports, setResidentReports] = useState([]);
  const [newReport, setNewReport] = useState({ date: '', content: '' });

  const [batchDates, setBatchDates] = useState({
    batch1: '2026.08.12 - 2026.09.13',
    batch2: '2026.09.14 - 2026.10.13'
  });

  const [acuConsultInfo, setAcuConsultInfo] = useState({
    trainee: '沈小花',
    period: '2026.09.01 - 2026.09.30'
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showBulletinModal, setShowBulletinModal] = useState(false);
  const [showPersonnelModal, setShowPersonnelModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [newEvent, setNewEvent] = useState({ 
    editId: null, 
    title: '', 
    participants: '', 
    month: todayObj.getMonth() + 1,
    day: todayObj.getDate(), 
    startTime: '08:00',
    endTime: '09:00',
    time: '08:00~09:00', 
    location: '', 
    advisor: '', 
    instructor: '黃仲諄醫師', 
    presenter: '', 
    recorder: '', 
    color: '紅色', 
    deptTag: '', 
    isRecurring: false, 
    weeklyDay: 1 
  });

  const [newRoster, setNewRoster] = useState({ 
    editId: null, 
    day: todayObj.getDate(), 
    dept: '內一', 
    shift: '早診', 
    doctor: '伍崇弘醫師', 
    studentName: '', 
    isTeaching: false, 
    isRecurring: false, 
    selectedSlots: [] 
  });

  const [newBulletin, setNewBulletin] = useState({ editId: null, title: '', content: '', author: '黃仲諄醫師', level: '普通' });
  
  const [newPerson, setNewPerson] = useState({ 
    editId: null, 
    category: 'chiefDepartment', 
    name: '', 
    note: '', 
    deptName: '內科', 
    supervisorDoctor: '', 
    groupCode: 'A', 
    rotationDept: '內一',
    batchNumber: '1'
  });

  const [newCourse, setNewCourse] = useState({
    editId: null,
    isScheduled: true,
    date: todayStr,
    instructor: '',
    content: '',
    isConfirmed: false
  });

  // 🧪 本機測試專用切換身份函式 (僅在線下本機有效)
  const handleDevRoleChange = (role) => {
    if (role === 'admin') {
      setUser({
        email: 'alienbigflower@gmail.com',
        user_metadata: { full_name: '測試總醫師' }
      });
      setIsApproved(true);
      setUserRole('admin');
    } else if (role === 'user') {
      setUser({
        email: 'intern_test@tzuchi.com.tw',
        user_metadata: { full_name: '測試實習醫師' }
      });
      setIsApproved(false);
      setUserRole('user');
    } else {
      setUser(null);
      setIsApproved(false);
      setUserRole('user');
    }
  };

  // 1. 初始化與身份驗證監聽
  useEffect(() => {
    window.supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) checkApproval(currentUser.email);
    });

    const { data: { subscription } } = window.supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        checkApproval(currentUser.email);
        if (window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        setIsApproved(false);
        setUserRole('user');
      }
    });

    fetchAllData();
    return () => subscription.unsubscribe();
  }, []);

  // 權限檢查
  const checkApproval = async (email) => {
    if (!email) {
      setUserRole('user');
      setIsApproved(false);
      return;
    }
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'alienbigflower@gmail.com') {
      setIsApproved(true);
      setUserRole('admin');
      return;
    }

    try {
      const { data, error } = await window.supabase
        .from('approved_users')
        .select('email, role')
        .eq('email', cleanEmail)
        .single();

      if (!error && data) {
        setIsApproved(true);
        setUserRole(data.role || 'admin');
      } else {
        setIsApproved(false);
        setUserRole('user');
      }
    } catch (err) {
      setIsApproved(false);
      setUserRole('user');
    }
  };

  // 抓取全域資料庫資料
  const fetchAllData = async () => {
    setLoading(true);
    const { data: evData } = await window.supabase.from('events').select('*').limit(5000);
    if (evData) setEvents(evData);

    const { data: roData } = await window.supabase.from('roster_shifts').select('*').limit(5000);
    if (roData) setRosterShifts(roData);

    const { data: buData } = await window.supabase.from('bulletins').select('*').order('id', { ascending: false }).limit(1000);
    if (buData) setBulletins(buData);

    const { data: peData } = await window.supabase.from('personnel').select('*').limit(2000);
    if (peData) {
      setPersonnelList(peData);

      const reports = peData.filter(p => p.category === 'resident_report_schedule');
      setResidentReports(reports.map(r => ({ id: r.id, date: r.name, content: r.note })));

      const acuSetting = peData.find(p => p.category === 'setting_acu_consult');
      if (acuSetting) {
        setAcuConsultInfo({ trainee: acuSetting.name || '', period: acuSetting.note || '' });
      }

      const batchSetting = peData.find(p => p.category === 'setting_batch_dates');
      if (batchSetting) {
        setBatchDates({ batch1: batchSetting.name || '', batch2: batchSetting.note || '' });
      }
    }

    const { data: coData } = await window.supabase.from('core_courses').select('*').limit(1000);
    if (coData) setCourses(coData);

    setLoading(false);
  };

  // 住院醫師報告管理
  const handleAddResidentReport = async (e) => {
    e.preventDefault();
    if (!isApproved) return alert('權限不足！');
    if (!newReport.date || !newReport.content) return alert('請完整填寫日期與內容！');

    const payload = {
      category: 'resident_report_schedule',
      name: newReport.date,
      note: newReport.content
    };

    const { data, error } = await window.supabase.from('personnel').insert([payload]).select();
    if (!error && data) {
      setResidentReports([...residentReports, { id: data[0].id, date: data[0].name, content: data[0].note }]);
      setNewReport({ date: '', content: '' });
    } else {
      alert('新增失敗：' + error.message);
    }
  };

  const handleDeleteResidentReport = async (id) => {
    if (!isApproved) return alert('權限不足！');
    if (confirm('確定刪除此預定項目？')) {
      const { error } = await window.supabase.from('personnel').delete().eq('id', id);
      if (!error) {
        setResidentReports(residentReports.filter(r => r.id !== id));
      } else {
        alert('刪除失敗：' + error.message);
      }
    }
  };

  // 針灸科會診組資訊
  const handleSaveAcuConsultInfo = async () => {
    if (!isApproved) return alert('權限不足！');

    const existing = personnelList.find(p => p.category === 'setting_acu_consult');
    const payload = {
      category: 'setting_acu_consult',
      name: acuConsultInfo.trainee,
      note: acuConsultInfo.period
    };

    if (existing) {
      const { error } = await window.supabase.from('personnel').update(payload).eq('id', existing.id);
      if (!error) alert('針灸科會診組資訊已更新儲存！');
    } else {
      const { data, error } = await window.supabase.from('personnel').insert([payload]).select();
      if (!error && data) {
        setPersonnelList([...personnelList, data[0]]);
        alert('針灸科會診組資訊已建立並儲存！');
      }
    }
  };

  // 實習醫師受訓時間
  const handleSaveBatchDates = async () => {
    if (!isApproved) return alert('權限不足！');

    const existing = personnelList.find(p => p.category === 'setting_batch_dates');
    const payload = {
      category: 'setting_batch_dates',
      name: batchDates.batch1,
      note: batchDates.batch2
    };

    if (existing) {
      const { error } = await window.supabase.from('personnel').update(payload).eq('id', existing.id);
      if (!error) alert('實習醫師受訓時間已更新儲存！');
    } else {
      const { data, error } = await window.supabase.from('personnel').insert([payload]).select();
      if (!error && data) {
        setPersonnelList([...personnelList, data[0]]);
        alert('實習醫師受訓時間已建立並儲存！');
      }
    }
  };

  // 行事曆事件儲存
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');
    if (!newEvent.title) return alert('請填寫事件標題！');

    const colorHex = window.getColorHex(newEvent.color);
    const eventMonth = parseInt(newEvent.month) || currentMonth;
    const timeFormatted = `${newEvent.startTime}~${newEvent.endTime}`;

    if (newEvent.isRecurring && !newEvent.editId) {
      const targetDayOfWeek = parseInt(newEvent.weeklyDay);
      const totalDays = new Date(currentYear, eventMonth, 0).getDate();
      const batchItems = [];

      for (let d = 1; d <= totalDays; d++) {
        const w = new Date(currentYear, eventMonth - 1, d).getDay();
        if (w === targetDayOfWeek) {
          batchItems.push({
            year: currentYear,
            month: eventMonth,
            day: d,
            title: newEvent.title,
            participants: newEvent.participants,
            time: timeFormatted,
            location: newEvent.location,
            advisor: newEvent.advisor || '',
            instructor: newEvent.instructor,
            note: newEvent.presenter ? `報告醫師：${newEvent.presenter}` : '',
            recorder: newEvent.recorder,
            color: colorHex,
            level: newEvent.color,
            dept_tag: newEvent.deptTag || null,
            is_recurring: true,
            weekly_day: targetDayOfWeek
          });
        }
      }

      let { data, error } = await window.supabase.from('events').insert(batchItems).select();

      if (error && (error.message.includes('dept_tag') || error.message.includes('advisor'))) {
        const fallbackBatch = batchItems.map(b => {
          const clone = {...b};
          if (error.message.includes('dept_tag')) delete clone.dept_tag;
          if (error.message.includes('advisor')) delete clone.advisor;
          return clone;
        });
        const fbRes = await window.supabase.from('events').insert(fallbackBatch).select();
        data = fbRes.data;
        error = fbRes.error;
      }

      if (error) {
        alert('批次新增失敗：' + error.message);
      } else if (data) {
        setEvents([...events, ...data]);
        alert(`已成功批次建立 ${eventMonth} 月所有【週${['日','一','二','三','四','五','六'][targetDayOfWeek]}】的事件！`);
      }
    } else {
      const item = {
        year: currentYear,
        month: eventMonth,
        day: parseInt(newEvent.day),
        title: newEvent.title,
        participants: newEvent.participants,
        time: timeFormatted,
        location: newEvent.location,
        advisor: newEvent.advisor || '',
        instructor: newEvent.instructor,
        note: newEvent.presenter ? `報告醫師：${newEvent.presenter}` : '',
        recorder: newEvent.recorder,
        color: colorHex,
        level: newEvent.color,
        dept_tag: newEvent.deptTag || null,
        is_recurring: false,
        weekly_day: new Date(currentYear, eventMonth - 1, parseInt(newEvent.day)).getDay()
      };

      if (newEvent.editId) {
        let { data, error } = await window.supabase.from('events').update(item).eq('id', newEvent.editId).select();

        if (error && (error.message.includes('dept_tag') || error.message.includes('advisor'))) {
          if (error.message.includes('dept_tag')) delete item.dept_tag;
          if (error.message.includes('advisor')) delete item.advisor;
          const fbRes = await window.supabase.from('events').update(item).eq('id', newEvent.editId).select();
          data = fbRes.data;
          error = fbRes.error;
        }

        if (!error && data) {
          setEvents(events.map(ev => ev.id === newEvent.editId ? data[0] : ev));
          setSelectedEvent(data[0]);
          alert('事件更新成功！');
        }
      } else {
        let { data, error } = await window.supabase.from('events').insert([item]).select();

        if (error && (error.message.includes('dept_tag') || error.message.includes('advisor'))) {
          if (error.message.includes('dept_tag')) delete item.dept_tag;
          if (error.message.includes('advisor')) delete item.advisor;
          const fbRes = await window.supabase.from('events').insert([item]).select();
          data = fbRes.data;
          error = fbRes.error;
        }

        if (!error && data) {
          setEvents([...events, data[0]]);
          alert('事件新增成功！');
        }
      }
    }

    setShowEventModal(false);
  };

  // 行事曆事件刪除
  const handleDeleteEvent = async (ev) => {
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');
    
    if (ev.is_recurring) {
      const opt = prompt(`刪除每週固定事件【${ev.title}】\n\n[1] 僅刪除 ${ev.month}/${ev.day} 此單日事件\n[2] 批次刪除包含今日與後續所有相同事件`, "1");
      if (opt === '1') {
        await window.supabase.from('events').delete().eq('id', ev.id);
        setEvents(events.filter(e => e.id !== ev.id));
        setSelectedEvent(null);
      } else if (opt === '2') {
        const { error } = await window.supabase.from('events').delete()
          .eq('title', ev.title)
          .eq('year', currentYear)
          .gte('month', ev.month)
          .gte('day', ev.day);
        
        if (!error) {
          setEvents(events.filter(e => !(e.title === ev.title && e.year === currentYear && ((e.month === ev.month && e.day >= ev.day) || e.month > ev.month))));
          setSelectedEvent(null);
          alert('已成功批次刪除所有後續重複事件！');
        }
      }
    } else {
      if (confirm('確定要刪除此行事曆事件嗎？')) {
        await window.supabase.from('events').delete().eq('id', ev.id);
        setEvents(events.filter(e => e.id !== ev.id));
        setSelectedEvent(null);
      }
    }
  };

  const openEditEventModal = (ev) => {
    const presenterVal = window.parsePresenter(ev.note);
    let colorName = '紅色';
    if (ev.color === '#EAB308' || ev.color === '#FEF3C7' || ev.level === '黃色') colorName = '黃色';
    if (ev.color === '#10B981' || ev.color === '#D1FAE5' || ev.level === '綠色') colorName = '綠色';

    let startT = '08:00';
    let endT = '09:00';
    if (ev.time && ev.time.includes('~')) {
      const parts = ev.time.split('~');
      startT = parts[0].trim();
      endT = parts[1].trim();
    }

    setNewEvent({
      editId: ev.id,
      title: ev.title || '',
      participants: ev.participants || '',
      month: ev.month || currentMonth,
      day: ev.day || 1,
      startTime: startT,
      endTime: endT,
      time: ev.time || '08:00~09:00',
      location: ev.location || '',
      advisor: ev.advisor || '',
      instructor: ev.instructor || '',
      presenter: presenterVal,
      recorder: ev.recorder || '',
      color: colorName,
      deptTag: ev.dept_tag || '',
      isRecurring: false,
      weeklyDay: ev.weekly_day || 1
    });
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  // 跟診時段批次選擇
  const handleToggleSlot = (weeklyDay, shift) => {
    const slots = [...newRoster.selectedSlots];
    const index = slots.findIndex(s => s.weeklyDay === weeklyDay && s.shift === shift);
    if (index >= 0) {
      slots.splice(index, 1);
    } else {
      slots.push({ weeklyDay, shift });
    }
    setNewRoster({ ...newRoster, selectedSlots: slots });
  };

  // 跟診排班儲存
  const handleSaveRoster = async (e) => {
    e.preventDefault();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');

    const studentsArr = newRoster.studentName ? newRoster.studentName.split(/[,、\s]+/).map(s => s.trim()).filter(Boolean) : [];

    if (newRoster.editId) {
      const updatePayload = {
        doctor: newRoster.doctor, 
        shift: newRoster.shift, 
        students: studentsArr,
        is_teaching: newRoster.isTeaching,
        day: parseInt(newRoster.day)
      };

      let { data, error } = await window.supabase
        .from('roster_shifts')
        .update(updatePayload)
        .eq('id', newRoster.editId)
        .select();

      if (error && error.message.includes('is_teaching')) {
        delete updatePayload.is_teaching;
        const fallback = await window.supabase
          .from('roster_shifts')
          .update(updatePayload)
          .eq('id', newRoster.editId)
          .select();
        data = fallback.data;
      }

      if (data) {
        setRosterShifts(rosterShifts.map(s => s.id === newRoster.editId ? data[0] : s));
        alert(`已成功獨立更新 ${currentMonth}/${newRoster.day} 的跟診資料！`);
      }
    } else if (newRoster.isRecurring) {
      if (newRoster.selectedSlots.length === 0) {
        return alert('請至少勾選一個「每週門診時段」！');
      }

      const totalDays = new Date(currentYear, currentMonth, 0).getDate();
      const batchShifts = [];

      for (let d = 1; d <= totalDays; d++) {
        const w = new Date(currentYear, currentMonth - 1, d).getDay();
        
        newRoster.selectedSlots.forEach(slot => {
          if (slot.weeklyDay === w) {
            batchShifts.push({
              id: 's_' + Date.now() + '_' + d + '_' + slot.shift + '_' + Math.random().toString(36).substring(2, 6),
              group_id: 'grp_' + Date.now() + '_' + slot.weeklyDay + '_' + slot.shift,
              year: currentYear,
              month: currentMonth,
              day: d,
              dept: selectedDept,
              shift: slot.shift,
              doctor: newRoster.doctor,
              students: studentsArr,
              is_teaching: newRoster.isTeaching,
              is_recurring: true,
              weekly_day: w
            });
          }
        });
      }

      let { data, error } = await window.supabase.from('roster_shifts').insert(batchShifts).select();

      if (error && error.message.includes('is_teaching')) {
        const cleanBatch = batchShifts.map(b => { const clone = {...b}; delete clone.is_teaching; return clone; });
        const fallback = await window.supabase.from('roster_shifts').insert(cleanBatch).select();
        data = fallback.data;
      }

      if (data) {
        setRosterShifts([...rosterShifts, ...data]);
        alert(`已成功為【${newRoster.doctor}】批次建置整個月共有 ${data.length} 個對應門診！`);
      }
    } else {
      const item = {
        id: 's_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        group_id: null,
        year: currentYear, 
        month: currentMonth, 
        day: parseInt(newRoster.day),
        dept: selectedDept, 
        shift: newRoster.shift, 
        doctor: newRoster.doctor,
        students: studentsArr, 
        is_teaching: newRoster.isTeaching,
        is_recurring: false, 
        weekly_day: new Date(currentYear, currentMonth - 1, parseInt(newRoster.day)).getDay()
      };

      let { data, error } = await window.supabase.from('roster_shifts').insert([item]).select();

      if (error && error.message.includes('is_teaching')) {
        delete item.is_teaching;
        const fallback = await window.supabase.from('roster_shifts').insert([item]).select();
        data = fallback.data;
      }

      if (data) {
        setRosterShifts([...rosterShifts, data[0]]);
        alert('已成功新增單日門診！');
      }
    }

    setShowRosterModal(false);
  };

  const handleCardClick = (e, shift, day) => {
    e.stopPropagation();
    if (isApproved) {
      setNewRoster({
        editId: shift.id,
        day: day,
        dept: selectedDept,
        shift: shift.shift,
        doctor: shift.doctor,
        studentName: shift.students ? shift.students.join(', ') : '',
        isTeaching: shift.is_teaching || false,
        isRecurring: false,
        selectedSlots: []
      });
      setShowRosterModal(true);
    } else {
      toggleBookingStudent(shift);
    }
  };

  const toggleBookingStudent = async (shift) => {
    if (!user) return alert('請先使用 Google 帳號登入！');
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    let updatedStudents = [...(shift.students || [])];

    if (updatedStudents.includes(name)) {
      if (!confirm(`確定要取消認領 ${shift.doctor} (${shift.shift}) 的跟診嗎？`)) return;
      updatedStudents = updatedStudents.filter(n => n !== name);
    } else {
      if (updatedStudents.length >= 2) return alert('該診次跟診名額已滿（上限 2 人）！');
      updatedStudents.push(name);
    }

    await window.supabase.from('roster_shifts').update({ students: updatedStudents }).eq('id', shift.id);
    setRosterShifts(rosterShifts.map(s => s.id === shift.id ? { ...s, students: updatedStudents } : s));
  };

  const handleDeleteRoster = async (e, shift, day) => {
    e.stopPropagation();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');

    const opt = prompt(
      `刪除【${shift.doctor} - ${shift.shift}】(${currentMonth}/${day}號)\n\n` +
      `[1] 僅刪除 ${currentMonth}/${day}號 這一天單診\n` +
      `[2] 批次刪除【包含今日與後續所有】同醫師的 ${shift.shift} 診次`, 
      "1"
    );

    if (opt === '1') {
      await window.supabase.from('roster_shifts').delete().eq('id', shift.id);
      setRosterShifts(rosterShifts.filter(s => s.id !== shift.id));
    } else if (opt === '2') {
      let query;
      if (shift.group_id) {
        query = window.supabase.from('roster_shifts').delete()
          .eq('group_id', shift.group_id)
          .gte('day', day);
      } else {
        query = window.supabase.from('roster_shifts').delete()
          .eq('dept', selectedDept)
          .eq('shift', shift.shift)
          .eq('doctor', shift.doctor)
          .eq('year', currentYear)
          .gte('month', currentMonth)
          .gte('day', day);
      }

      const { error } = await query;
      if (!error) {
        if (shift.group_id) {
          setRosterShifts(rosterShifts.filter(s => !(s.group_id === shift.group_id && s.day >= day)));
        } else {
          setRosterShifts(rosterShifts.filter(s => !(
            s.dept === selectedDept && s.shift === shift.shift && s.doctor === shift.doctor &&
            s.year === currentYear && ((s.month === currentMonth && s.day >= day) || s.month > currentMonth)
          )));
        }
        alert(`已成功批次刪除門診！`);
      }
    }
  };

  // 公告管理
  const handleSaveBulletin = async (e) => {
    e.preventDefault();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');

    const item = { 
      title: newBulletin.title, 
      content: newBulletin.content, 
      author: newBulletin.author || '黃仲諄醫師', 
      level: newBulletin.level || '普通',
      date: new Date().toISOString().split('T')[0] 
    };

    if (newBulletin.editId) {
      const { data, error } = await window.supabase.from('bulletins').update(item).eq('id', newBulletin.editId).select();
      if (!error && data) {
        setBulletins(bulletins.map(b => b.id === newBulletin.editId ? data[0] : b));
        alert('公告已更新！');
      }
    } else {
      const { data, error } = await window.supabase.from('bulletins').insert([item]).select();
      if (!error && data) {
        setBulletins([data[0], ...bulletins]);
        alert('公告已發布！');
      }
    }

    setShowBulletinModal(false);
  };

  const openEditBulletinModal = (b) => {
    if (!isApproved) return;
    setNewBulletin({
      editId: b.id,
      title: b.title || '',
      content: b.content || '',
      author: b.author || '黃仲諄醫師',
      level: b.level || '普通'
    });
    setShowBulletinModal(true);
  };

  const handleDeleteBulletin = async (id) => {
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');
    if (confirm('確定要刪除此公告嗎？')) {
      const { error } = await window.supabase.from('bulletins').delete().eq('id', id);
      if (!error) {
        setBulletins(bulletins.filter(b => b.id !== id));
      }
    }
  };

  // 醫師名冊管理
  const handleSavePersonnel = async (e) => {
    e.preventDefault();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');

    let noteString = newPerson.note || '';

    if (newPerson.category === 'residents') {
      noteString = `${newPerson.deptName}｜負責主治：${newPerson.supervisorDoctor || '無'}`;
    } else if (newPerson.category === 'interns') {
      noteString = `組別${newPerson.batchNumber || '1'}｜${newPerson.groupCode}組 - ${newPerson.rotationDept}`;
    }

    const payload = {
      category: newPerson.category,
      name: newPerson.name,
      note: noteString
    };

    if (newPerson.editId) {
      const { data, error } = await window.supabase.from('personnel').update(payload).eq('id', newPerson.editId).select();
      if (!error && data) {
        setPersonnelList(personnelList.map(p => p.id === newPerson.editId ? data[0] : p));
        alert('醫師資料已更新！');
      }
    } else {
      const { data, error } = await window.supabase.from('personnel').insert([payload]).select();
      if (!error && data) {
        setPersonnelList([...personnelList, data[0]]);
        alert('成功新增醫師！');
      }
    }

    setShowPersonnelModal(false);
  };

  const openEditPersonnelModal = (p) => {
    if (!isApproved) return;

    let deptName = '內科';
    let supervisorDoctor = '';
    let groupCode = 'A';
    let rotationDept = '內一';
    let batchNumber = '1';

    if (p.category === 'residents' && p.note) {
      const resObj = window.parseResidentNote(p.note);
      deptName = resObj.dept;
      supervisorDoctor = resObj.supervisor;
    } else if (p.category === 'interns' && p.note) {
      const intObj = window.parseInternNote(p.note);
      batchNumber = intObj.batch;
      groupCode = intObj.group;
      rotationDept = intObj.dept;
    }

    setNewPerson({
      editId: p.id,
      category: p.category,
      name: p.name,
      note: p.note || '',
      deptName,
      supervisorDoctor,
      groupCode,
      rotationDept,
      batchNumber
    });
    setShowPersonnelModal(true);
  };

  const handleDeletePersonnel = async (e, id) => {
    e.stopPropagation();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');
    if (confirm('確定刪除該人員？')) {
      await window.supabase.from('personnel').delete().eq('id', id);
      setPersonnelList(personnelList.filter(p => p.id !== id));
    }
  };

  // 月份切換與焦點日期
  const handlePrevMonth = () => { 
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(currentYear - 1); } 
    else { setCurrentMonth(currentMonth - 1); } 
  };
  const handleNextMonth = () => { 
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(currentYear + 1); } 
    else { setCurrentMonth(currentMonth + 1); } 
  };

  const updateFocusDateAndSyncCalendar = (newDateStr) => {
    setFocusDate(newDateStr);
    const [y, m] = newDateStr.split('-').map(Number);
    if (y && m) {
      setCurrentYear(y);
      setCurrentMonth(m);
    }
  };

  const handleFocusDateChange = (offset) => {
    const d = new Date(focusDate);
    d.setDate(d.getDate() + offset);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    updateFocusDateAndSyncCalendar(`${y}-${m}-${day}`);
  };

  // -------------------------------------------------------------
  // ✨【完整補齊核心課程 4 個 CRUD 處理函式】
  // -------------------------------------------------------------
  // 1. 切換通知確認 (is_confirmed)
  const handleToggleCourseConfirmed = async (course) => {
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');
    const newStatus = !course.is_confirmed;
    const { error } = await window.supabase
      .from('core_courses')
      .update({ is_confirmed: newStatus })
      .eq('id', course.id);

    if (!error) {
      setCourses(courses.map(c => c.id === course.id ? { ...c, is_confirmed: newStatus } : c));
    } else {
      alert('更新通知狀態失敗：' + error.message);
    }
  };

  // 2. 開啟編輯核心課程彈窗
  const openEditCourseModal = (course) => {
    if (!isApproved) return;
    setNewCourse({
      editId: course.id,
      isScheduled: course.is_scheduled ?? true,
      date: course.course_date || '',
      instructor: course.instructor || '',
      content: course.content || '',
      isConfirmed: course.is_confirmed || false
    });
    setShowCourseModal(true);
  };

  // 3. 刪除核心課程
  const handleDeleteCourse = async (id) => {
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');
    if (confirm('確定要刪除此核心課程嗎？')) {
      const { error } = await window.supabase.from('core_courses').delete().eq('id', id);
      if (!error) {
        setCourses(courses.filter(c => c.id !== id));
        alert('已成功刪除核心課程！');
      } else {
        alert('刪除失敗：' + error.message);
      }
    }
  };

  // 4. 儲存核心課程 (新增或更新)
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!isApproved) return alert('權限不足！僅限管理醫師/總醫師操作');

    const payload = {
      is_scheduled: newCourse.isScheduled,
      course_date: newCourse.date,
      instructor: newCourse.instructor,
      content: newCourse.content,
      is_confirmed: newCourse.isConfirmed
    };

    if (newCourse.editId) {
      const { data, error } = await window.supabase
        .from('core_courses')
        .update(payload)
        .eq('id', newCourse.editId)
        .select();

      if (!error && data) {
        setCourses(courses.map(c => c.id === newCourse.editId ? data[0] : c));
        alert('核心課程已更新！');
      } else {
        alert('更新失敗：' + (error?.message || '未知錯誤'));
      }
    } else {
      const { data, error } = await window.supabase
        .from('core_courses')
        .insert([payload])
        .select();

      if (!error && data) {
        setCourses([...courses, data[0]]);
        alert('成功新增核心課程！');
      } else {
        alert('新增失敗：' + (error?.message || '未知錯誤'));
      }
    }

    setShowCourseModal(false);
  };
  // -------------------------------------------------------------

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const [focusY, focusM, focusD] = focusDate.split('-').map(Number);

  const isBatch1Earlier = window.getStartDate(batchDates.batch1) <= window.getStartDate(batchDates.batch2);
  const sortedBatches = isBatch1Earlier
    ? [
        { id: '1', dateStr: batchDates.batch1 },
        { id: '2', dateStr: batchDates.batch2 }
      ]
    : [
        { id: '2', dateStr: batchDates.batch2 },
        { id: '1', dateStr: batchDates.batch1 }
      ];

  const daysInModalMonth = new Date(currentYear, parseInt(newEvent.month || currentMonth), 0).getDate();

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* 頂部 Header */}
      <window.Header 
        user={user}
        isApproved={isApproved}
        userRole={userRole}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onSignIn={() => window.supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })}
        onSignOut={() => window.supabase.auth.signOut()}
        onDevRoleChange={handleDevRoleChange}
      />

      {/* 導覽列 Navbar */}
      <window.Navbar 
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* 1. 當日焦點 */}
      {currentTab === 'today' && (
        <window.TodayTab 
          focusDate={focusDate}
          focusY={focusY}
          focusM={focusM}
          focusD={focusD}
          events={events}
          onFocusDateChange={handleFocusDateChange}
          onUpdateFocusDate={updateFocusDateAndSyncCalendar}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {/* 2. 綜合行事曆 */}
      {currentTab === 'calendar' && (
        <window.CalendarTab 
          currentYear={currentYear}
          currentMonth={currentMonth}
          focusD={focusD}
          calendarViewMode={calendarViewMode}
          setCalendarViewMode={setCalendarViewMode}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          events={events}
          isApproved={isApproved}
          onOpenNewEventModal={() => {
            setNewEvent({ 
              editId: null, 
              title: '', 
              participants: '', 
              month: currentMonth,
              day: focusD, 
              startTime: '08:00',
              endTime: '09:00',
              time: '08:00~09:00', 
              location: '', 
              advisor: '', 
              instructor: '黃仲諄醫師', 
              presenter: '', 
              recorder: '', 
              color: '紅色', 
              deptTag: '', 
              isRecurring: false, 
              weeklyDay: 1 
            }); 
            setShowEventModal(true);
          }}
          onSelectEvent={setSelectedEvent}
          residentReports={residentReports}
          newReport={newReport}
          setNewReport={setNewReport}
          onAddResidentReport={handleAddResidentReport}
          onDeleteResidentReport={handleDeleteResidentReport}
        />
      )}

      {/* 3. 跟診表 */}
      {currentTab === 'roster' && (
        <window.RosterTab 
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          isApproved={isApproved}
          onOpenNewRosterModal={(day) => {
            setNewRoster({ 
              editId: null, 
              day: day || focusD, 
              dept: selectedDept, 
              shift: '早診', 
              doctor: '伍崇弘醫師', 
              studentName: '', 
              isTeaching: false, 
              isRecurring: false, 
              selectedSlots: [] 
            }); 
            setShowRosterModal(true);
          }}
          rosterShifts={rosterShifts}
          firstDayOfWeek={firstDayOfWeek}
          daysInMonth={daysInMonth}
          focusD={focusD}
          acuConsultInfo={acuConsultInfo}
          setAcuConsultInfo={setAcuConsultInfo}
          onSaveAcuConsultInfo={handleSaveAcuConsultInfo}
          onCardClick={handleCardClick}
          onDeleteRoster={handleDeleteRoster}
        />
      )}

      {/* 4. 中醫部醫師 */}
      {currentTab === 'personnel' && (
        <window.PersonnelTab 
          personnelList={personnelList}
          sortedBatches={sortedBatches}
          batchDates={batchDates}
          setBatchDates={setBatchDates}
          isApproved={isApproved}
          onOpenNewPersonnelModal={() => {
            setNewPerson({ 
              editId: null, 
              category: 'chiefDepartment', 
              name: '', 
              note: '', 
              deptName: '內科', 
              supervisorDoctor: '', 
              groupCode: 'A', 
              rotationDept: '內一', 
              batchNumber: '1' 
            }); 
            setShowPersonnelModal(true);
          }}
          onEditPersonnel={openEditPersonnelModal}
          onDeletePersonnel={handleDeletePersonnel}
          onSaveBatchDates={handleSaveBatchDates}
        />
      )}

      {/* 5. 核心課程一覽表 */}
      {currentTab === 'courses' && (
        <window.CoursesTab 
          courses={courses}
          isApproved={isApproved}
          onOpenNewCourseModal={(isScheduled) => {
            setNewCourse({
              editId: null,
              isScheduled: isScheduled,
              date: isScheduled ? todayStr : '未定',
              instructor: '',
              content: '',
              isConfirmed: false
            });
            setShowCourseModal(true);
          }}
          onEditCourse={openEditCourseModal}
          onDeleteCourse={handleDeleteCourse}
          onToggleCourseConfirmed={handleToggleCourseConfirmed}
        />
      )}

      {/* 6. 重要規範 */}
      {currentTab === 'rules' && (
        <window.RulesTab 
          rulesSubTab={rulesSubTab}
          setRulesSubTab={setRulesSubTab}
        />
      )}

      {/* 7. 部上公佈欄 */}
      {currentTab === 'bulletin' && (
        <window.BulletinTab 
          bulletins={bulletins}
          isApproved={isApproved}
          onOpenNewBulletinModal={() => {
            setNewBulletin({ editId: null, title: '', content: '', author: '黃仲諄醫師', level: '普通' });
            setShowBulletinModal(true);
          }}
          onEditBulletin={openEditBulletinModal}
          onDeleteBulletin={handleDeleteBulletin}
        />
      )}

      {/* 彈窗群組 */}
      <window.EventDetailModal 
        selectedEvent={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isApproved={isApproved}
        onEdit={openEditEventModal}
        onDelete={handleDeleteEvent}
      />

      <window.EventFormModal 
        show={showEventModal && isApproved}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        daysInModalMonth={daysInModalMonth}
        onSave={handleSaveEvent}
        onClose={() => setShowEventModal(false)}
      />

      <window.RosterFormModal 
        show={showRosterModal && isApproved}
        newRoster={newRoster}
        setNewRoster={setNewRoster}
        daysInMonth={daysInMonth}
        onToggleSlot={handleToggleSlot}
        onSave={handleSaveRoster}
        onClose={() => setShowRosterModal(false)}
      />

      <window.PersonnelFormModal 
        show={showPersonnelModal && isApproved}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
        batchDates={batchDates}
        onSave={handleSavePersonnel}
        onClose={() => setShowPersonnelModal(false)}
      />

      <window.CourseFormModal 
        show={showCourseModal && isApproved}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
        onSave={handleSaveCourse}
        onClose={() => setShowCourseModal(false)}
      />

      <window.BulletinFormModal 
        show={showBulletinModal && isApproved}
        newBulletin={newBulletin}
        setNewBulletin={setNewBulletin}
        onSave={handleSaveBulletin}
        onClose={() => setShowBulletinModal(false)}
      />
    </div>
  );
}

// 確保所有外部模組就緒後再進行渲染，避免網路載入延遲造成的競態問題
function startApp() {
  if (
    window.Header &&
    window.Navbar &&
    window.TodayTab &&
    window.CalendarTab &&
    window.RosterTab &&
    window.PersonnelTab &&
    window.CoursesTab &&
    window.RulesTab &&
    window.BulletinTab &&
    window.EventDetailModal
  ) {
    const rootEl = document.getElementById('root');
    if (rootEl) {
      ReactDOM.createRoot(rootEl).render(<App />);
    }
  } else {
    setTimeout(startApp, 20);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
