// js/config.js - 系統組態與樣式工具

window.SUPABASE_URL = 'https://htmectgbwqvvuvrajsln.supabase.co';
window.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bWVjdGdid3F2dnV2cmFqc2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MjMyOTksImV4cCI6MjEwMDE5OTI5OX0.5Kd47QjwR_E1Q9yEorLzb49blW-EfpzDmcobP2QjfMw'; 
window.supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);

// 科別標籤樣式
window.getDeptTagStyle = function(dept) {
  switch (dept) {
    case '內科': return 'bg-yellow-400 text-yellow-950 border-yellow-500';
    case '婦科': return 'bg-pink-400 text-pink-950 border-pink-500';
    case '兒科': return 'bg-sky-300 text-sky-950 border-sky-400';
    case '針灸科': return 'bg-purple-300 text-purple-950 border-purple-400';
    case '傷科': return 'bg-amber-700 text-white border-amber-800';
    case '家醫科': return 'bg-gray-300 text-gray-900 border-gray-400';
    default: return null;
  }
};

// 診次卡片樣式
window.getShiftStyle = function(shift, isTeaching) {
  if (isTeaching) {
    return 'bg-pink-100/90 border-pink-300 text-pink-950 hover:border-pink-500 shadow-sm';
  }
  if (shift === '早診') return 'bg-amber-50/90 border-amber-200 text-amber-900 hover:border-amber-400';
  if (shift === '午診') return 'bg-sky-50/90 border-sky-200 text-sky-900 hover:border-sky-400';
  if (shift === '晚診') return 'bg-purple-50/90 border-purple-200 text-purple-900 hover:border-purple-400';
  return 'bg-blue-50/90 border-blue-200 text-blue-900 hover:border-blue-400';
};

// 色彩名稱轉色碼
window.getColorHex = function(colorName) {
  if (colorName === '紅色') return '#FEE2E2'; 
  if (colorName === '黃色') return '#FEF3C7'; 
  if (colorName === '綠色') return '#D1FAE5'; 
  return '#FEE2E2';
};

// 事件卡片樣式
window.getEventCardStyle = function(ev) {
  var bg = ev.color;
  if (ev.color === '#EF4444' || ev.level === '紅色') bg = '#FEE2E2';
  else if (ev.color === '#EAB308' || ev.level === '黃色') bg = '#FEF3C7';
  else if (ev.color === '#10B981' || ev.level === '綠色') bg = '#D1FAE5';
  else if (!bg) bg = '#FEE2E2';
  return { backgroundColor: bg, color: '#111827' };
};

// 時間選項生成 (07:00 ~ 21:45)
window.generateTimeOptions = function() {
  var options = [];
  for (var h = 7; h <= 21; h++) {
    for (var m = 0; m < 60; m += 15) {
      var hh = String(h).padStart(2, '0');
      var mm = String(m).padStart(2, '0');
      options.push(hh + ':' + mm);
    }
  }
  return options;
};
window.TIME_OPTIONS = window.generateTimeOptions();
