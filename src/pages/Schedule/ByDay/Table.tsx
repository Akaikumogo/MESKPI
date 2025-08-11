import { useTranslation } from '@/hooks/useTranslation';
import { ConfigProvider, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { LogIn, LogOut } from 'lucide-react';
type WorkerColumn = {
  key: number | string;
  name: string;
  [key: `hour_${number}`]: React.ReactNode;
};
const hours = Array.from({ length: 17 }, (_, i) => i + 7); // 05:00 - 23:00
// eslint-disable-next-line react-refresh/only-export-components
export const mockAttendance = [
  {
    employeeId: 101,
    name: 'Ali Valiyev',
    logs: [
      { type: 'checkin', hour: 8 },
      { type: 'checkout', hour: 12 }
    ]
  },
  {
    employeeId: 102,
    name: 'Dilshod Karimov',
    logs: [
      { type: 'checkin', hour: 9 },
      { type: 'checkout', hour: 18 }
    ]
  },
  {
    employeeId: 103,
    name: 'Aziza Qodirova',
    logs: [
      { type: 'checkin', hour: 7 },
      { type: 'checkout', hour: 11 },
      { type: 'checkin', hour: 13 },
      { type: 'checkout', hour: 17 }
    ]
  },
  {
    employeeId: 101,
    name: 'Ali Valiyev',
    logs: [
      { type: 'checkin', hour: 8 },
      { type: 'checkout', hour: 12 }
    ]
  },
  {
    employeeId: 10133,
    name: 'Ali Valiyev',
    logs: []
  },
  {
    employeeId: 102,
    name: 'Dilshod Karimov',
    logs: [
      { type: 'checkin', hour: 14 },
      { type: 'checkout', hour: 18 }
    ]
  },
  {
    employeeId: 103,
    name: 'Aziza Qodirova',
    logs: [
      { type: 'checkin', hour: 7 },
      { type: 'checkout', hour: 11 },
      { type: 'checkin', hour: 13 },
      { type: 'checkout', hour: 17 }
    ]
  },
  {
    employeeId: 101,
    name: 'Ali Valiyev',
    logs: [
      { type: 'checkin', hour: 8 },
      { type: 'checkout', hour: 12 }
    ]
  },
  {
    employeeId: 102,
    name: 'Dilshod Karimov',
    logs: [
      { type: 'checkin', hour: 9 },
      { type: 'checkout', hour: 18 }
    ]
  },
  {
    employeeId: 103,
    name: 'Aziza Qodirova',
    logs: [
      { type: 'checkin', hour: 7 },
      { type: 'checkout', hour: 11 },
      { type: 'checkin', hour: 13 },
      { type: 'checkout', hour: 17 }
    ]
  },
  {
    employeeId: 101,
    name: 'Ali Valiyev',
    logs: [
      { type: 'checkin', hour: 8 },
      { type: 'checkout', hour: 12 }
    ]
  },
  {
    employeeId: 102,
    name: 'Dilshod Karimov',
    logs: [
      { type: 'checkin', hour: 9 },
      { type: 'checkout', hour: 18 }
    ]
  },
  {
    employeeId: 103,
    name: 'Aziza Qodirova',
    logs: [
      { type: 'checkin', hour: 7 },
      { type: 'checkout', hour: 11 },
      { type: 'checkin', hour: 13 },
      { type: 'checkout', hour: 17 }
    ]
  },
  {
    employeeId: 101,
    name: 'Ali Valiyev',
    logs: [
      { type: 'checkin', hour: 8 },
      { type: 'checkout', hour: 12 }
    ]
  },
  {
    employeeId: 102,
    name: 'Dilshod Karimov',
    logs: [
      { type: 'checkin', hour: 9 },
      { type: 'checkout', hour: 18 }
    ]
  },
  {
    employeeId: 103,
    name: 'Aziza Qodirova',
    logs: [
      { type: 'checkin', hour: 7 },
      { type: 'checkout', hour: 11 },
      { type: 'checkin', hour: 13 },
      { type: 'checkout', hour: 17 }
    ]
  },
  {
    employeeId: 101,
    name: 'Ali Valiyev',
    logs: [
      { type: 'checkin', hour: 8 },
      { type: 'checkout', hour: 12 }
    ]
  },
  {
    employeeId: 102,
    name: 'Dilshod Karimov',
    logs: [
      { type: 'checkin', hour: 9 },
      { type: 'checkout', hour: 18 }
    ]
  },
  {
    employeeId: 103,
    name: 'Aziza Qodirova',
    logs: [
      { type: 'checkin', hour: 7 },
      { type: 'checkout', hour: 11 },
      { type: 'checkin', hour: 13 },
      { type: 'checkout', hour: 17 }
    ]
  }
];

export default function AttendanceTable() {
  const { t } = useTranslation();
  const columns: ColumnsType<WorkerColumn> = [
    {
      title: (
        <div className="px-2  border">
          {t({ uz: 'Ishchilar', en: 'Workers', ru: 'Работники' })}
        </div>
      ),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 300
    },
    ...hours.map((hour) => ({
      title: `${hour}:00`,
      dataIndex: `hour_${hour}`,
      key: `hour_${hour}`,
      align: 'center' as AlignSetting,
      width: 60
    }))
  ];

  const dataSource = mockAttendance.map((emp) => {
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

      // Har bir kirish-chiqish intervalini tekshiramiz
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
          <div className="bg-blue-500 h-8 rounded-r-md flex items-center justify-center">
            <Tooltip title="Chiqdi">
              <LogOut size={18} color="white" />
            </Tooltip>
          </div>
        );
      } else if (isInside) {
        row[`hour_${h}`] = <div className="bg-blue-500 h-8"></div>;
      } else {
        row[`hour_${h}`] = null;
      }
    });

    return row;
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            padding: 0,
            lineHeight: 3,
            borderColor: 'transparent'
          }
        }
      }}
    >
      <Table
        // bordered={false}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </ConfigProvider>
  );
}
