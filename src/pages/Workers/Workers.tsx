/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Table, Tooltip, Badge, Space } from 'antd';

import { Link } from 'react-router-dom';

import { useTranslation } from '@/hooks/useTranslation';

const WorkerPage = () => {
  const { t } = useTranslation();

  const workers = Array.from({ length: 50 }, (_, index) => {
    const fullName = `Worker ${index + 1}`;
    const department = ['IT', 'HR', 'Finance', 'Logistics'][index % 4];
    const status = ['active', 'inactive'][index % 2];
    const totalTasks = Math.floor(Math.random() * 20) + 1;
    const completedTasks = Math.floor(Math.random() * totalTasks);
    const gender = index % 2 === 0 ? 'male' : 'female';
    const age = 20 + Math.floor(Math.random() * 25);
    return {
      key: index,
      name: fullName,
      department,
      status,
      totalTasks,
      completedTasks,
      gender,
      age,
      joinedAt: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toLocaleDateString()
    };
  });

  const columns = [
    {
      title: t({ uz: 'Ism', ru: 'Имя', en: 'Name' }),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => (
        <Link
          to={`/workers/${record.key}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {record.name}
        </Link>
      ),

      onFilter: (value: any, record: any) =>
        record.name.toLowerCase().includes(value.toLowerCase()) ||
        record.department.toLowerCase().includes(value.toLowerCase())
    },
    {
      title: t({ uz: "Bo'lim", ru: 'Отдел', en: 'Department' }),
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => (
        <Badge
          color={
            department === 'IT'
              ? 'blue'
              : department === 'HR'
              ? 'green'
              : department === 'Finance'
              ? 'orange'
              : 'purple'
          }
        >
          {department}
        </Badge>
      ),
      filters: [
        { text: 'IT', value: 'IT' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Logistics', value: 'Logistics' }
      ],
      onFilter: (value: any, record: any) => record.department === value
    },
    {
      title: t({ uz: 'Vazifalar', ru: 'Задачи', en: 'Tasks' }),
      key: 'tasks',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <span>{`${record.completedTasks} / ${record.totalTasks}`}</span>
          <div
            style={{
              width: '100px',
              height: '6px',
              backgroundColor: '#f0f0f0',
              borderRadius: '3px'
            }}
          >
            <div
              style={{
                width: `${(record.completedTasks / record.totalTasks) * 100}%`,
                height: '100%',
                backgroundColor: '#1890ff',
                borderRadius: '3px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </Space>
      ),
      sorter: (a: any, b: any) =>
        a.completedTasks / a.totalTasks - b.completedTasks / b.totalTasks
    },
    {
      title: t({ uz: 'Yosh', ru: 'Возраст', en: 'Age' }),
      dataIndex: 'age',
      key: 'age',
      sorter: (a: any, b: any) => a.age - b.age
    },
    {
      title: t({ uz: 'Jins', ru: 'Пол', en: 'Gender' }),
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Badge color={gender === 'male' ? 'blue' : 'pink'}>
          {t({
            uz: gender === 'male' ? 'Erkak' : 'Ayol',
            ru: gender === 'male' ? 'Мужчина' : 'Женщина',
            en: gender === 'male' ? 'Male' : 'Female'
          })}
        </Badge>
      ),
      filters: [
        { text: t({ uz: 'Erkak', ru: 'Мужчина', en: 'Male' }), value: 'male' },
        {
          text: t({ uz: 'Ayol', ru: 'Женщина', en: 'Female' }),
          value: 'female'
        }
      ],
      onFilter: (value: any, record: any) => record.gender === value
    },
    {
      title: t({ uz: "Qo'shilgan sana", ru: 'Дата приема', en: 'Joined At' }),
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      sorter: (a: any, b: any) =>
        new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
    },
    {
      title: t({ uz: 'Holat', ru: 'Статус', en: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: t({ uz: 'Faol', ru: 'Активный', en: 'Active' }),
          value: 'active'
        },
        {
          text: t({ uz: 'Nofaol', ru: 'Неактивный', en: 'Inactive' }),
          value: 'inactive'
        }
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (_: any, record: any) => (
        <Space align="center">
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                record.status === 'active' ? '#52c41a' : '#ff4d4f',
              display: 'inline-block'
            }}
          />
          {record.status === 'active' ? (
            <Badge
              status="success"
              text={t({ uz: 'Faol', ru: 'Активный', en: 'Active' })}
            />
          ) : (
            <Tooltip
              title={t({
                uz: 'Oxirgi 7 kun ichida hech qanday task bajarmagan',
                ru: 'За последние 7 дней не выполнил ни одной задачи',
                en: 'Has not completed any tasks in the last 7 days'
              })}
            >
              <Badge
                status="error"
                text={t({ uz: 'Nofaol', ru: 'Неактивный', en: 'Inactive' })}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Workers Table */}
      <Card
        title={t({
          uz: 'Ishchilar roʻyxati',
          ru: 'Список работников',
          en: 'Workers List'
        })}
        style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Table
          dataSource={workers}
          columns={columns}
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} workers`
          }}
          scroll={{ x: 1000 }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </Card>
    </div>
  );
};

export default WorkerPage;
