// js/utils.js - 純工具函式

// 取得今日日期字串 YYYY-MM-DD
window.getTodayString = function() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
};

// 解析開始時間（轉成分鐘數以便排序）
window.parseStartTime = function(timeStr) {
  if (!timeStr) return 9999;
  var match = timeStr.match(/(\d{1,2})[:：](\d{2})/);
  if (match) {
    return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
  }
  return 9999;
};

// 解析報告醫師姓名
window.parsePresenter = function(note) {
  if (note && note.startsWith('報告醫師：')) {
    return note.replace('報告醫師：', '');
  }
  return '';
};

// 解析住院醫師備註 (科別與主治醫師)
window.parseResidentNote = function(note) {
  if (!note) return { dept: '未指定', supervisor: '無' };
  var parts = note.split('｜負責主治：');
  return {
    dept: parts[0] || '未指定',
    supervisor: parts[1] || '無'
  };
};

// 解析實習醫師備註 (梯次、組別、科別)
window.parseInternNote = function(note) {
  if (!note) return { batch: '1', group: 'A', dept: '內一' };
  var batch = '1';
  var mainStr = note;

  if (note.includes('｜')) {
    var parts = note.split('｜');
    if (parts[0].includes('組別') || parts[0].includes('梯次')) {
      batch = parts[0].replace(/[^0-9]/g, '').trim() || '1';
      mainStr = parts[1] || '';
    }
  }

  var groupParts = mainStr.split('組 - ');
  if (groupParts.length === 2) {
    return { batch: batch, group: groupParts[0], dept: groupParts[1] };
  }
  return { batch: batch, group: 'A', dept: mainStr };
};

// 取得受訓日期區間之起始日
window.getStartDate = function(dateRangeStr) {
  if (!dateRangeStr) return '9999.99.99';
  var parts = dateRangeStr.split('-');
  return parts[0] ? parts[0].trim() : '9999.99.99';
};
