/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';
import { useFontSize } from '@/Providers/Accessibilty';
import { useScheduleActive } from '@/hooks/useDayMonthActive';

export const Sidebar: React.FC<{
  navItems: {
    path: string;
    label: { uz: string; en: string; ru: string };
    icon: React.ComponentType<any>;
    children?: {
      path: string;
      label: { uz: string; en: string; ru: string };
    }[];
  }[];
  isCollapsed?: boolean;
}> = ({ navItems, isCollapsed = false }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useTranslation();
  const { scale } = useFontSize();

  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const d = useScheduleActive('day');
  const m = useScheduleActive('month');
  console.log('Day active:', d, m);
  const toggleMenu = (path: string) => {
    setOpenMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  useEffect(() => {
    const recalcIndicator = () => {
      const activeIndex = navItems.findIndex(
        (item) =>
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + '/')
      );

      const activeEl = itemRefs.current[activeIndex];
      const containerEl = containerRef.current;

      if (activeEl && containerEl && indicatorRef.current) {
        const activeRect = activeEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        const offsetTop = activeRect.top - containerRect.top;

        indicatorRef.current.style.top = `${offsetTop}px`;
        indicatorRef.current.style.height = `3rem`;
      }
    };

    recalcIndicator(); // darhol hisobla
    const timer = setTimeout(recalcIndicator, 250); // animatsiya tugagach qayta hisobla

    return () => clearTimeout(timer);
  }, [location.pathname, navItems, scale, openMenus]);

  return (
    <nav className="flex-1 px-4 py-2">
      <div className="relative space-y-2" ref={containerRef}>
        {/* ACTIVE INDICATOR — faqat parentlar uchun */}
        <div
          ref={indicatorRef}
          className="absolute left-0 w-full bg-gradient-to-br from-blue-500 to-[#0cb9d4] rounded-lg z-0 transition-all duration-300"
          style={{ top: 0, height: 0 }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
          const isOpen = openMenus.includes(item.path);

          return (
            <div
              key={index}
              className="relative z-10"
              ref={(el) => {
                // faqat parent uchun ref beramiz
                if (!item.children) {
                  itemRefs.current[index] = el;
                } else {
                  // parent bo'lsa ham ref beramiz, indicator shu bo'yicha ishlaydi
                  itemRefs.current[index] = el;
                }
              }}
            >
              {item.children ? (
                <>
                  {/* PARENT ITEM */}
                  <div
                    onClick={() => toggleMenu(item.path)}
                    className={`flex items-center justify-between px-4 py-3 min-h-[46px] rounded-xl cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'text-white '
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="flex-shrink-0 ml-1 text-lg" />
                      {!isCollapsed && (
                        <span className="text-sm whitespace-nowrap">
                          {t(item.label)}
                        </span>
                      )}
                    </div>
                    {!isCollapsed &&
                      (isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      ))}
                  </div>

                  {/* SUB MENU ANIMATION */}
                  {/* SUB MENU ANIMATION */}
                  <AnimatePresence initial={false}>
                    {isOpen && !isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child, cIndex) => (
                            <NavLink
                              key={cIndex}
                              to={child.path}
                              className={({ isActive }) =>
                                `
                            group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium relative overflow-hidden
                            transition-all duration-300 ease-in-out
                            ${
                              isActive
                                ? // ACTIVE STYLE
                                  `text-blue-600 dark:text-blue-400
                                   border border-blue-500/50 dark:border-blue-400/50
                                   bg-blue-50 dark:bg-blue-900/30
                                   shadow-md shadow-blue-500/20
                                   after:absolute after:inset-0 after:bg-gradient-to-r after:from-blue-500/5 after:to-cyan-500/5 after:opacity-100 after:transition-all after:duration-500`
                                : // INACTIVE STYLE
                                  `text-slate-600 dark:text-slate-300
                                   hover:text-blue-600 dark:hover:text-blue-400
                                   hover:bg-slate-100 dark:hover:bg-slate-800/50
                                   border border-transparent
                                   after:absolute after:inset-0 after:bg-gradient-to-r after:from-blue-500/0 after:to-cyan-500/0 hover:after:from-blue-500/5 hover:after:to-cyan-500/5 after:opacity-0 hover:after:opacity-100 after:transition-all after:duration-500`
                            }
                          `
                              }
                            >
                              {/* Kichik indikator nuqtasi */}

                              {t(child.label)}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                /* SIMPLE LINK (no children) */
                <NavLink to={item.path}>
                  <div
                    className={`flex items-center gap-4 px-4 py-3 min-h-[46px] rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'text-white '
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="flex-shrink-0 ml-1 text-lg" />
                    {!isCollapsed && (
                      <span className="text-sm whitespace-nowrap">
                        {t(item.label)}
                      </span>
                    )}
                  </div>
                </NavLink>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};
