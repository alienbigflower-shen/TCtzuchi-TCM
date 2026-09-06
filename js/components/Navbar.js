// js/components/Navbar.js - 7 大導覽分頁列

function Navbar({ currentTab, onSelectTab }) {
  const tabs = [
    { id: 'today', name: '當日焦點', icon: '📍' },
    { id: 'calendar', name: '綜合行事曆', icon: '📅' },
    { id: 'roster', name: '跟診表', icon: '🩺' },
    { id: 'personnel', name: '中醫部醫師', icon: '👨‍⚕️' },
    { id: 'courses', name: '核心課程一覽表', icon: '📚' },
    { id: 'rules', name: '重要規範', icon: '📖' },
    { id: 'bulletin', name: '部上公佈欄', icon: '📢' }
  ];

  return (
    <nav className="flex gap-2 bg-white p-2 rounded-2xl border shadow-sm no-print overflow-x-auto no-scrollbar whitespace-nowrap">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`flex-shrink-0 py-2.5 px-4 rounded-xl font-bold text-[16px] md:text-[20px] transition flex items-center gap-2 ${
            currentTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.name}</span>
        </button>
      ))}
    </nav>
  );
}

window.Navbar = Navbar;
