import dayjs from 'dayjs';

export type AttendanceLog = {
  type: 'checkin' | 'checkout';
  hour: number; // soat, masalan: 8, 9, 17 va hokazo
};

export type AttendanceEntry = {
  date: string; // YYYY-MM-DD formatida sana
  employeeId: number;
  name: string;
  logs: AttendanceLog[];
};

export type Employee = {
  employeeId: number;
  name: string;
};

export const employees: Employee[] = [
  { employeeId: 101, name: 'Ali Valiyev' },
  { employeeId: 102, name: 'Dilshod Karimov' },
  { employeeId: 103, name: 'Aziza Qodirova' },
  { employeeId: 104, name: 'Sardor Mamatov' },
  { employeeId: 105, name: 'Gulnora Ismoilova' },
  { employeeId: 106, name: 'Jasur Bekchanov' },
  { employeeId: 107, name: 'Nargiza Tashkentova' },
  { employeeId: 108, name: 'Shokir Mirzayev' },
  { employeeId: 109, name: 'Dildora Nurmatova' },
  { employeeId: 110, name: 'Rustam Yusupov' },
  { employeeId: 111, name: 'Malika Sobirova' },
  { employeeId: 112, name: 'Firdavs Rasulov' }
];

// Oy nomlarini kichik harflar bilan, oson kalit sifatida
export const monthNames: Record<number, string> = {
  0: 'yanvar',
  1: 'fevral',
  2: 'mart',
  3: 'aprel',
  4: 'may',
  5: 'iyun',
  6: 'iyul',
  7: 'avgust',
  8: 'sentyabr',
  9: 'oktyabr',
  10: 'noyabr',
  11: 'dekabr'
};

/**
 * Berilgan yil uchun har oyda har bir xodimning
 * tasodifiy davomat ma'lumotlarini generatsiya qiladi.
 *
 * Statuslar:
 * 0 = kelmagan
 * 1 = vaqtida (8:00 checkin)
 * 2 = kechikkan (9 yoki 10 soatda checkin)
 */
export const generateYearlyMock = (
  year: number
): Record<string, AttendanceEntry[]> => {
  const result: Record<string, AttendanceEntry[]> = {};

  for (let month = 0; month < 12; month++) {
    const daysInMonth = dayjs(`${year}-${month + 1}-01`).daysInMonth();
    const monthKey = monthNames[month];
    result[monthKey] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(`${year}-${month + 1}-${day}`).format('YYYY-MM-DD');

      employees.forEach((emp) => {
        // Nechta kirish-chiqish juftligi bo'lishi mumkin (1 dan 5 gacha)
        const entriesCount = 1 + Math.floor(Math.random() * 5);

        const logs: AttendanceLog[] = [];

        let currentHour = 8; // Ish kuni boshlanish soati taxminan 8:00

        for (let i = 0; i < entriesCount; i++) {
          // Check-in soatiga tasodifiy kechikish qo'shish (0-2 soatgacha)
          const delay = Math.floor(Math.random() * 3); // 0,1,2

          // Check-in va check-out orasidagi vaqt 1-2 soat orasida
          const workDuration = 1 + Math.floor(Math.random() * 2);

          const checkinHour = currentHour + delay;

          logs.push({ type: 'checkin', hour: checkinHour });
          logs.push({ type: 'checkout', hour: checkinHour + workDuration });

          // Keyingi kirish uchun soatni biroz oldinga suramiz
          currentHour = checkinHour + workDuration + 1; // 1 soat tanaffus
        }

        // Ba'zida (taxminan 1/3 hollarda) umuman kelmagan bo'lishi mumkin
        const absentChance = Math.random();
        if (absentChance < 0.33) {
          result[monthKey].push({
            date,
            employeeId: emp.employeeId,
            name: emp.name,
            logs: []
          });
        } else {
          result[monthKey].push({
            date,
            employeeId: emp.employeeId,
            name: emp.name,
            logs
          });
        }
      });
    }
  }

  return result;
};

// 2025 yil uchun mock ma'lumotlar
export const mockAttendanceByMonth = generateYearlyMock(2025);
