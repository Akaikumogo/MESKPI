import { Users } from 'lucide-react';
import { Card, Row, Col, Typography, Statistic, Table, Button } from 'antd';
import { useTranslation } from '@/hooks/useTranslation';
import { EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
const { Title } = Typography;

// Worker data type based on the entity structure
export type WorkerDto = {
  id: string;
  userName: string;
  phoneNumber: string;
  birthDate?: string;
  passportSeria: string;
  passportNumber: number;
  fullName: string;
  companyId: string;
  role: 'Admin' | 'Manager' | 'Seller' | 'CEO';
  image?: string;
  password: string;
  status: 'active' | 'inactive';
  joinDate: string;
  salary: number;
  performance: number;
  attendance: number;
};

export default function WorkersPage() {
  const { t } = useTranslation();
  const mockData = {
    workers: 100,
    todayWorkers: 90,
    tasks: 200,
    todayTasks: 15
  };
  const colorGenerator = (fact: number, total: number) => {
    const percentage = (fact / total) * 100;

    if (percentage >= 80) {
      return 'from-green-400 to-green-600'; // yaxshi holat
    } else if (percentage >= 50) {
      return 'from-blue-400 to-blue-600'; // o‘rtacha holat
    } else {
      return 'from-red-400 to-red-600'; // yomon holat
    }
  };
  const navigate = useNavigate();
  return (
    <div className="p-2 space-y-6 min-h-full">
      {/* Statistics */}
      <div className="mb-6">
        <Title level={3} className="mb-4 text-slate-900 dark:text-white">
          {new Date().toLocaleDateString('uz-UZ')}{' '}
          {t({
            uz: 'uchun statistika',
            ru: 'для статистики',
            en: 'Statistics for'
          })}
          :
        </Title>
      </div>
      <div>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <div
              className={`  rounded p-4 bg-gradient-to-br ${colorGenerator(
                mockData.workers,
                mockData.todayWorkers
              )}  border-0 text-white`}
            >
              <Statistic
                title={<h1 className="text-white text-xl">Bugungi davomat</h1>}
                value={'90/100'}
                prefix={<Users />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div
              className={`  rounded p-4 bg-gradient-to-br ${colorGenerator(
                mockData.todayTasks,
                mockData.tasks
              )}  border-0 text-white`}
            >
              <Statistic
                title={<h1 className="text-white text-xl">Vazifalar</h1>}
                value={mockData.todayTasks + '/' + mockData.tasks}
                prefix={<Users />}
                valueStyle={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white'
                }}
              />
            </div>
          </Col>
        </Row>
      </div>

      <div>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12}>
            <Card
              className="border-0 shadow-sm"
              title={
                <div className="flex items-center justify-between">
                  <h1>
                    {t({
                      uz: "Bugungi ishchilar yo'qlamasi",
                      ru: 'Список работников на сегодня',
                      en: "Today's Workers List"
                    })}
                  </h1>
                  <Button
                    onClick={() => navigate('/dashboard/schedule')}
                    icon={<EyeOutlined />}
                    type="primary"
                  >
                    {t({
                      uz: "To'liq ko'rish",
                      ru: 'Посмотреть полностью',
                      en: 'View All'
                    })}
                  </Button>
                </div>
              }
            >
              <Table
                dataSource={Array.from({ length: 100 }, (_, index) => {
                  const statusCycle = ['active', 'late', 'notArrived'] as const;
                  const status = statusCycle[index % 3];

                  // Random arrival time based on status
                  const arrival = new Date();
                  if (status === 'active') {
                    arrival.setHours(7, Math.floor(Math.random() * 59), 0); // 07:00 – 07:59
                  } else if (status === 'late') {
                    arrival.setHours(8, Math.floor(Math.random() * 30), 0); // 08:00 – 08:29
                  } else {
                    arrival.setHours(
                      9 + Math.floor(Math.random() * 2),
                      Math.floor(Math.random() * 59),
                      0
                    ); // 09:00 – 10:59
                  }

                  return {
                    key: index,
                    name: `Worker ${index + 1}`,
                    arrivalTime: arrival.toLocaleTimeString(),
                    status
                  };
                })}
                size="small"
                columns={[
                  {
                    title: t({
                      uz: 'Ism',
                      ru: 'Имя',
                      en: 'Name'
                    }),
                    render: (_, record) => (
                      <Link to={`/dashboard/workers/${record.key}`}>
                        <div>{record.name}</div>
                      </Link>
                    ),
                    dataIndex: 'name',
                    key: 'name'
                  },
                  {
                    title: t({
                      uz: 'Kelgan vaqti',
                      ru: 'Время прихода',
                      en: 'Arrival Time'
                    }),
                    dataIndex: 'arrivalTime',
                    key: 'arrivalTime'
                  },
                  {
                    title: t({
                      uz: 'Holat',
                      ru: 'Статус',
                      en: 'Status'
                    }),
                    render: (_, record) => (
                      <div className="flex items-center gap-2 justify-start ">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            record.status === 'active'
                              ? 'bg-green-500'
                              : record.status === 'late'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                        />
                        {t({
                          uz:
                            record.status === 'active'
                              ? 'Faol'
                              : record.status === 'late'
                              ? 'Kechikkan'
                              : 'Kelmagan',
                          ru:
                            record.status === 'active'
                              ? 'Активный'
                              : record.status === 'late'
                              ? 'Опоздал'
                              : 'Не пришел',
                          en:
                            record.status === 'active'
                              ? 'Active'
                              : record.status === 'late'
                              ? 'Late'
                              : 'Not Arrived'
                        })}
                      </div>
                    ),
                    filters: [
                      {
                        text: t({ uz: 'Faol', ru: 'Активный', en: 'Active' }),
                        value: 'active'
                      },
                      {
                        text: t({ uz: 'Kechikkan', ru: 'Опоздал', en: 'Late' }),
                        value: 'late'
                      },
                      {
                        text: t({
                          uz: 'Kelmagan',
                          ru: 'Не пришел',
                          en: 'Not Arrived'
                        }),
                        value: 'notArrived'
                      }
                    ],
                    onFilter: (value, record) => record.status === value,
                    dataIndex: 'status',
                    key: 'status'
                  }
                ]}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card
              className="border-0 shadow-sm"
              title={
                <div className="flex items-center justify-between">
                  <h1>
                    {t({
                      uz: 'Bugungi vazifalar',
                      ru: 'Задачи на сегодня',
                      en: "Today's Tasks"
                    })}
                  </h1>
                  <Button
                    onClick={() => navigate('/dashboard/tasks')}
                    icon={<EyeOutlined />}
                    type="primary"
                  >
                    {t({
                      uz: "To'liq ko'rish",
                      ru: 'Посмотреть полностью',
                      en: 'View All'
                    })}
                  </Button>
                </div>
              }
            >
              <Table
                dataSource={Array.from({ length: 200 }, (_, index) => {
                  const statusCycle = ['new', 'inProgress', 'done'] as const;
                  const status = statusCycle[index % 3];

                  const createdAt = new Date();
                  createdAt.setHours(
                    9 + Math.floor(Math.random() * 4),
                    Math.floor(Math.random() * 59),
                    0
                  ); // 09:00 – 13:59

                  return {
                    key: index,
                    title: `Task ${index + 1}`,
                    createdAt: createdAt.toLocaleTimeString(),
                    status
                  };
                })}
                size="small"
                columns={[
                  {
                    title: t({
                      uz: 'Nomi',
                      ru: 'Название',
                      en: 'Title'
                    }),
                    render: (_, record) => (
                      <Link to={`/dashboard/tasks/${record.key}`}>
                        <div>{record.title}</div>
                      </Link>
                    ),
                    dataIndex: 'title',
                    key: 'title'
                  },
                  {
                    title: t({
                      uz: 'Berilgan vaqti',
                      ru: 'Время выдачи',
                      en: 'Assigned Time'
                    }),
                    dataIndex: 'createdAt',
                    key: 'createdAt'
                  },
                  {
                    title: t({
                      uz: 'Holat',
                      ru: 'Статус',
                      en: 'Status'
                    }),
                    dataIndex: 'status',
                    key: 'status',
                    filters: [
                      {
                        text: t({ uz: 'Yangi', ru: 'Новая', en: 'New' }),
                        value: 'new'
                      },
                      {
                        text: t({
                          uz: 'Jarayonda',
                          ru: 'В процессе',
                          en: 'In Progress'
                        }),
                        value: 'inProgress'
                      },
                      {
                        text: t({
                          uz: 'Bajarilgan',
                          ru: 'Завершена',
                          en: 'Done'
                        }),
                        value: 'done'
                      }
                    ],
                    onFilter: (value, record) => record.status === value,
                    render: (_, record) => (
                      <div className="flex items-center gap-2 justify-start">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            record.status === 'new'
                              ? 'bg-blue-500'
                              : record.status === 'inProgress'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                        />
                        {t({
                          uz:
                            record.status === 'new'
                              ? 'Yangi'
                              : record.status === 'inProgress'
                              ? 'Jarayonda'
                              : 'Bajarilgan',
                          ru:
                            record.status === 'new'
                              ? 'Новая'
                              : record.status === 'inProgress'
                              ? 'В процессе'
                              : 'Завершена',
                          en:
                            record.status === 'new'
                              ? 'New'
                              : record.status === 'inProgress'
                              ? 'In Progress'
                              : 'Done'
                        })}
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
