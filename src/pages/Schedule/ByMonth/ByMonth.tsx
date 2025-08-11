/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { Button, Col, DatePicker, Row, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LogIn, LogOut } from 'lucide-react';
import { mockAttendanceByMonth } from '../Mock';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

type AttendanceLog = {
  type: 'checkin' | 'checkout';
  hour: number;
};

type AttendanceEntry = {
  date: string; // YYYY-MM-DD
  employeeId: number;
  name: string;
  logs: AttendanceLog[];
};

type WorkerColumn = {
  key: number | string;
  name: string;
  [key: string]: React.ReactNode;
};

const monthNames = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentyabr',
  'oktyabr',
  'noyabr',
  'dekabr'
];

// Tooltip faqat hover paytida ochiladi

export default function MonthlySchedule({ date }: { date: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dayjsDate = date ? dayjs(date) : dayjs();

  const year = dayjsDate.year();
  const monthIndex = dayjsDate.month();
  const daysInMonth = dayjsDate.daysInMonth();
  const daysArray = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  // Oyning barcha ma'lumotlari
  const monthData = useMemo<AttendanceEntry[]>(() => {
    return mockAttendanceByMonth[monthNames[monthIndex]] || [];
  }, [monthIndex]);

  // Ishchilar ro‘yxati
  const workers = useMemo(() => {
    const map = new Map<number, string>();
    monthData.forEach((entry) => {
      if (!map.has(entry.employeeId)) {
        map.set(entry.employeeId, entry.name);
      }
    });
    return Array.from(map.entries()).map(([employeeId, name]) => ({
      employeeId,
      name
    }));
  }, [monthData]);

  const LogInIcon = <LogIn color="green" size={16} />;
  const LogOutIcon = <LogOut color="red" size={16} />;

  // Jadval ustunlari
  const columns: ColumnsType<WorkerColumn> = useMemo(
    () => [
      {
        title: t({ uz: 'Ishchi', ru: 'Сотрудник', en: 'Employee' }),
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 180
      },
      ...daysArray.map((day) => ({
        title: (
          <div
            style={{
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onClick={() =>
              navigate(
                '/dashboard/schedule/' +
                  dayjs(`${year}-${monthIndex + 1}-${day}`).format('YYYY-MM-DD')
              )
            }
          >
            {day}
          </div>
        ),
        dataIndex: `day_${day}`,
        key: `day_${day}`,
        width: 60,
        align: 'center' as const
      }))
    ],
    [daysArray, navigate, t, year, monthIndex]
  );

  // Jadval ma'lumotlari
  const dataSource: WorkerColumn[] = useMemo(() => {
    return workers.map(({ employeeId, name }) => {
      const row: WorkerColumn = { key: employeeId, name };

      daysArray.forEach((day) => {
        const dateStr = dayjs(new Date(year, monthIndex, day)).format(
          'YYYY-MM-DD'
        );
        const entry = monthData.find(
          (e) => e.employeeId === employeeId && e.date === dateStr
        );

        if (!entry || entry.logs.length === 0) {
          row[`day_${day}`] = (
            <span style={{ color: 'var(--ant-error-color)' }}>–</span>
          );
        } else {
          row[`day_${day}`] = (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {Array.from(new Set(entry.logs.map(log => log.type))).map(type =>
                type === 'checkin' ? LogInIcon : LogOutIcon
              )}
            </div>
          );
        }
      });

      return row;
    });
  }, [workers, daysArray, monthData, year, monthIndex, LogInIcon, LogOutIcon]);

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <DatePicker
            picker="month"
            value={dayjsDate}
            onChange={(date) => {
              navigate(
                `/dashboard/schedule/${date ? date.format('YYYY-MM') : ''}`
              );
            }}
            allowClear={false}
          />
        </Col>
        <Col>
          <Button type="primary" style={{ marginRight: 10 }}>
            {t({
              uz: 'Excelga chiqarish',
              ru: 'Экспорт в Excel',
              en: 'Export to Excel'
            })}
          </Button>
          <Button>
            {t({
              uz: 'PDFga chiqarish',
              ru: 'Экспорт в PDF',
              en: 'Export to PDF'
            })}
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: daysInMonth * 60 + 200, y: 600 }}
        bordered
        sticky
        rowKey="key"
      />
    </div>
  );
}
