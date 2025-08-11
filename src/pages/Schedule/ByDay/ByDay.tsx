import dayjs from 'dayjs';
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Row,
  Table,
  Tooltip
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LogIn, LogOut } from 'lucide-react';
import { mockAttendanceByMonth } from '../Mock';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

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
  [key: `hour_${number}`]: React.ReactNode;
};

const hours = Array.from({ length: 17 }, (_, i) => i + 7); // 7:00 dan 23:00 gacha

export default function AttendanceTable({ date }: { date: string }) {
  // Misol uchun yil va oyni belgilaymiz (buni o'zing kerak bo'lganda o'zgartir)
  const { t } = useTranslation();
  const monthIndex = dayjs().month(); // hozirgi oy indexi
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

  // Oylik ma'lumotni olamiz
  const entriesForMonth: AttendanceEntry[] =
    mockAttendanceByMonth[monthNames[monthIndex]] || [];

  // Kerak bo'lsa bitta kunni filtrlash (masalan bugungi sana)
  const today = date;
  const entriesForDay = entriesForMonth.filter((e) => e.date === today);

  // Columns
  const columns: ColumnsType<WorkerColumn> = [
    {
      title: (
        <div className="px-2  ">
          {t({ uz: 'Ishchilar', en: 'Workers', ru: 'Работники' })}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 300,
      render: (text: string) => (
        <span className="font-semibold px-2">{text}</span>
      )
    },
    ...hours.map((hour) => ({
      title: `${hour}:00`,
      dataIndex: `hour_${hour}`,
      key: `hour_${hour}`,
      align: 'center' as AlignSetting,
      width: 60
    }))
  ];

  // dataSource ni tayyorlaymiz
  const dataSource = entriesForDay.map((emp) => {
    const row: WorkerColumn = { key: emp.employeeId, name: emp.name };
    let totalHours = 0;

    for (let i = 0; i < emp.logs.length; i += 2) {
      const checkin = emp.logs[i];
      const checkout = emp.logs[i + 1];
      if (checkin && checkout) {
        totalHours += checkout.hour - checkin.hour;
      }
    }
    row.name = `${emp.name} (${totalHours} soat)`;

    hours.forEach((h) => {
      let isInside = false;
      let isCheckin = false;
      let isCheckout = false;

      for (let i = 0; i < emp.logs.length; i += 2) {
        const checkinLog = emp.logs[i];
        const checkoutLog = emp.logs[i + 1];
        if (!checkinLog || !checkoutLog) continue;

        if (h === checkinLog.hour) {
          isCheckin = true;
          break;
        }
        if (h === checkoutLog.hour) {
          isCheckout = true;
          break;
        }
        if (h > checkinLog.hour && h < checkoutLog.hour) {
          isInside = true;
          break;
        }
      }

      if (isCheckin) {
        row[`hour_${h}`] = (
          <div className="bg-blue-500 h-8 rounded-l-md flex items-center justify-center">
            <Tooltip title="Kirdi">
              <LogIn size={18} color="white" />
            </Tooltip>
          </div>
        );
      } else if (isCheckout) {
        row[`hour_${h}`] = (
          <div className="bg-blue-500 w-[90%] h-8 rounded-r-md flex items-center justify-center">
            <Tooltip title="Chiqdi">
              <LogOut size={18} color="white" />
            </Tooltip>
          </div>
        );
      } else if (isInside) {
        row[`hour_${h}`] = <div className="bg-blue-500 h-8 "></div>;
      } else {
        row[`hour_${h}`] = null;
      }
    });

    return row;
  });
  const navigate = useNavigate();
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            padding: 0,
            lineHeight: 3
          }
        }
      }}
    >
      {' '}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <DatePicker
            value={today ? dayjs(today) : null}
            onChange={(date) => {
              navigate(
                `/dashboard/schedule/${date ? date.format('YYYY-MM-DD') : ''}`
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
        scroll={{ x: 'max-content' }}
        rowKey="key"
      />
    </ConfigProvider>
  );
}
