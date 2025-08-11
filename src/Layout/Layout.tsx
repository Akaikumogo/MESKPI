/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  Search,
  LogOut,
  ChartSpline,
  Expand,
  Shrink,
  UsersRound,
  FileText,
  ListTodo,
  CalendarDays,
  MonitorCog
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTranslation } from '@/hooks/useTranslation';
import { Button, ConfigProvider, Input, Select } from 'antd';
import { Sidebar } from './SideBar';
import dayjs from 'dayjs';

const navItems = [
  {
    path: '/dashboard/home',
    label: { uz: 'Bosh sahifa', en: 'Overview', ru: 'Главная' },
    icon: Home
  },
  {
    path: '/dashboard/workers',
    label: { uz: 'Ishchilar', en: 'Workers', ru: 'Работники' },
    icon: UsersRound
  },
  {
    path: '/dashboard/schedule',
    label: { uz: "Yo'qlama", en: 'Schedule', ru: 'Расписание' },
    icon: CalendarDays,
    children: [
      {
        path: `/dashboard/schedule/${dayjs().format('YYYY-MM-DD')}`,
        label: { uz: 'Kunlik', en: 'Daily', ru: 'Дневной' }
      },
      {
        path: `/dashboard/schedule/${dayjs().format('YYYY-MM')}`,
        label: { uz: 'Oylik', en: 'Monthly', ru: 'Месячной' }
      },
      {
        path: `/dashboard/schedule/yearly`,
        label: { uz: 'Yillik', en: 'Yearly', ru: 'Годово́й' }
      }
    ]
  },
  {
    path: '/dashboard/documents',
    label: { uz: 'Hujjatlar', en: 'Documents', ru: 'Документы' },
    icon: FileText
  },
  {
    path: '/dashboard/tasks',
    label: { uz: 'Topshiriqlar', en: 'Tasks', ru: 'Задачи' },
    icon: ListTodo
  },

  {
    path: '/dashboard/control',
    label: { uz: 'Nazorat', en: 'Control', ru: 'Контроль' },
    icon: MonitorCog
  }
];

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t, lang, setLang } = useTranslation();
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find((item) =>
      location.pathname.includes(item.path)
    );
    return currentItem?.label ?? { uz: 'Bosh sahifa', en: 'Home', ru: ' ' };
  };

  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    !!document.fullscreenElement
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
    };
  }, []);

  const [search, setSearch] = useState<string>('');
  const debounce = (fn: (e: any) => void, delay: number) => {
    let timer: number;
    return (e: any) => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        fn(e);
      }, delay);
    };
  };

  return (
    <ConfigProvider>
      <div className="min-h-screen">
        <div className="min-h-screen bg-slate-50 dark:bg-[#000000] transition-colors duration-300">
          <div className="flex min-h-screen w-screen">
            {/* Sidebar */}
            <aside
              style={{ width: isCollapsed ? 100 : 340 }}
              className="row-span-2 w-full bg-slate-50 dark:bg-[#1b1b1b] backdrop-blur-sm transition-all duration-300"
            >
              <div className="flex flex-col h-full w-full">
                {/* Logo */}
                <div className="min-h-20 w-full flex items-center justify-center px-4 ">
                  <AnimatePresence mode="popLayout">
                    <div className="w-full flex items-center justify-start">
                      <motion.div
                        key="expanded-logo"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-3 cursor-pointer ${
                          isCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                        onClick={toggleSidebar}
                        layout
                      >
                        <motion.div
                          layoutId="l"
                          className="w-16 h-12 bg-gradient-to-br from-blue-500 to-[#0cb9d4] rounded-lg flex items-center justify-center"
                        >
                          <motion.span className="text-white dark:text-slate-900 font-bold text-lg">
                            <ChartSpline color="white" />
                          </motion.span>
                        </motion.div>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col overflow-auto"
                          >
                            <h1 className="min-w-[200px] font-bold text-lg text-slate-900 dark:text-white">
                              MES KPI
                            </h1>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <Sidebar navItems={navItems} isCollapsed={isCollapsed} />

                {/* Logout */}
                <div className="p-4 min-h-[50px]">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#000000]/50">
                    <button
                      onClick={() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                      }}
                      style={{
                        justifyContent: isCollapsed ? 'center' : 'flex-start'
                      }}
                      className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200 w-full"
                    >
                      <LogOut size={20} className="dark:text-slate-300" />
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="font-medium whitespace-nowrap overflow-hidden z-10 dark:text-slate-300 text-slate-600"
                        >
                          logout
                        </motion.span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="w-full">
              {/* Header */}
              <header
                className=" min-h-20 bg-slate-50 dark:bg-[#1b1b1b] backdrop-blur-sm  flex items-center justify-between"
                style={{
                  transition: 'margin-left 0.3s ease-in-out'
                }}
              >
                <div className="flex items-center justify-between px-8 py-[11.5px] w-full">
                  {/* Left Section */}
                  <div className="flex items-center gap-6">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t(getCurrentPageTitle())}
                      </h1>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4">
                    {/* Fullscreen */}
                    <Button size="large" onClick={toggleFullscreen}>
                      {isFullscreen ? (
                        <Shrink size={18} />
                      ) : (
                        <Expand size={18} />
                      )}
                    </Button>
                    {/* Search */}
                    <div className="relative">
                      <Input
                        placeholder={t({
                          uz: 'Qidiruv',
                          en: 'Search',
                          ru: 'Поиск'
                        })}
                        onChange={debounce(
                          (e) => setSearch(e.target.value),
                          500
                        )}
                        size="large"
                        prefix={<Search />}
                      />
                    </div>
                    {/* Theme Toggle */}
                    <ThemeToggle />
                    {/* Lang Changer */}
                    <Select
                      defaultValue={lang}
                      style={{ width: 140 }}
                      size="large"
                      onChange={(value) => setLang(value)}
                      options={[
                        {
                          value: 'en',
                          label: 'English'
                        },
                        {
                          value: 'ru',
                          label: 'Русский'
                        },
                        {
                          value: 'uz',
                          label: "O'zbekcha"
                        },
                        {
                          value: 'cr',
                          label: 'Ўзбекча'
                        }
                      ]}
                    />
                    {/* User Avatar */}
                    {/* <div className="flex items-center gap-3 px-3 py-1 rounded-lg bg-slate-50 dark:bg-[#000000]">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Sarvarbek Xazratov
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          administrator
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-gradient-to-r from-[#53d46f] to-[#35b779] dark:from-[#53d46f] dark:to-[#0bbc31] rounded-full flex items-center justify-center">
                        <span className="text-white dark:text-slate-900 font-semibold text-sm">
                          SX
                        </span>
                      </div>
                    </div> */}
                  </div>
                </div>
              </header>
              {/* Main Content */}
              <main className="overflow-y-auto  bg-slate-200/35 dark:bg-[#0f0f0f]">
                <div className="p-2 grid grid-cols-1 grid-row-1">
                  <div className="col-span-1 row-span-1 rounded-lg w-full h-[calc(100vh-6rem)]   p-2">
                    <AnimatePresence mode="sync">
                      <Outlet context={{ search }} />
                    </AnimatePresence>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Layout;
