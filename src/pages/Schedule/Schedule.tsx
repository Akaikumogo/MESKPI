/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from 'react';
import { DatePicker, Card, Row, Col, Button } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from '@/hooks/useTranslation';
import { mockAttendanceByMonth } from './Mock';
import { EyeOutlined } from '@ant-design/icons';
const Schedule = () => {
  console.log(mockAttendanceByMonth);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentYear = parseInt(
    searchParams.get('year') || dayjs().year().toString()
  );
  const [year, setYear] = useState(currentYear);

  const onYearChange = (date: dayjs.Dayjs | null) => {
    const newYear = date ? date.year() : dayjs().year();
    setYear(newYear);
    setSearchParams({ year: newYear.toString() });
  };
  const COLORS = ['#52c41a', '#faad14', '#ff4d4f'];

  const monthNames = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr'
  ];
  const monthTranslations = [
    { uz: 'Yanvar', ru: 'Январь', en: 'January' },
    { uz: 'Fevral', ru: 'Февраль', en: 'February' },
    { uz: 'Mart', ru: 'Март', en: 'March' },
    { uz: 'Aprel', ru: 'Апрель', en: 'April' },
    { uz: 'May', ru: 'Май', en: 'May' },
    { uz: 'Iyun', ru: 'Июнь', en: 'June' },
    { uz: 'Iyul', ru: 'Июль', en: 'July' },
    { uz: 'Avgust', ru: 'Август', en: 'August' },
    { uz: 'Sentabr', ru: 'Сентябрь', en: 'September' },
    { uz: 'Oktabr', ru: 'Октябрь', en: 'October' },
    { uz: 'Noyabr', ru: 'Ноябрь', en: 'November' },
    { uz: 'Dekabr', ru: 'Декабрь', en: 'December' }
  ];
  const monthlyStats = useMemo(() => {
    const stats = Array.from({ length: 12 }, (_, i) => ({
      month: t(monthTranslations[i]),
      late: 0,
      onTime: 0,
      absent: 0
    }));

    const allEntries = Object.values(mockAttendanceByMonth).flat();

    allEntries.forEach((entry) => {
      const entryDate = dayjs(entry.date, 'YYYY-MM-DD');
      if (entryDate.year() !== year) return;

      const monthIndex = entryDate.month();
      const logs = entry.logs;

      if (logs.length === 0) {
        stats[monthIndex].absent += 1;
      } else {
        if (logs[0].type === 'checkin' && logs[0].hour > 9) {
          stats[monthIndex].late += 1;
        } else {
          stats[monthIndex].onTime += 1;
        }
      }
    });

    return stats;
  }, [monthNames, year]);

  const data = (stat: any) => [
    {
      name:
        t({ uz: 'Vaqtida', ru: 'Вовремя', en: 'On Time' }) +
        ` (${stat.onTime})`,
      value: stat.onTime
    },
    {
      name:
        t({ uz: 'Kechikish', ru: 'Опоздание', en: 'Late' }) + ` (${stat.late})`,
      value: stat.late
    },
    {
      name:
        t({ uz: 'Kelmagan', ru: 'Отсутствовал', en: 'Absent' }) +
        ` (${stat.absent})`,
      value: stat.absent
    }
  ];
  const navigate = useNavigate();

  return (
    <div>
      {/* Filter panel */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <DatePicker
            picker="year"
            value={dayjs(`${year}`, 'YYYY')}
            onChange={onYearChange}
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
      {/* Umumiy diagramma */}
      <Card
        title={t({
          uz: 'Yillik umumiy statistika',
          ru: 'Годовая общая статистика',
          en: 'Annual Summary'
        })}
        style={{ marginTop: 20 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyStats}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name: string) => [
                `${value} ta`,
                t({ uz: name, ru: name, en: name })
              ]}
            />
            <Bar
              dataKey="onTime"
              stackId="a"
              fill="#52c41a"
              name={t({ uz: 'Vaqtida', ru: 'Вовремя', en: 'On Time' })}
            />
            <Bar
              dataKey="late"
              stackId="a"
              fill="#faad14"
              name={t({ uz: 'Kechikish', ru: 'Опоздание', en: 'Late' })}
            />
            <Bar
              dataKey="absent"
              stackId="a"
              fill="#ff4d4f"
              name={t({ uz: 'Kelmagan', ru: 'Отсутствовал', en: 'Absent' })}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 12 ta karta */}
      <Row gutter={[18, 18]} className="mt-4">
        {monthlyStats.map((stat, index) => (
          <Col xs={26} sm={14} md={10} lg={8} key={stat.month}>
            <div
              className={
                dayjs().month() === dayjs(stat.month, 'MMMM').month()
                  ? 'border-2 border-blue-500 rounded-lg'
                  : ''
              }
            >
              <Card
                title={
                  <div className="flex items-center justify-between">
                    {stat.month}
                    <Button
                      onClick={() =>
                        navigate(
                          `/dashboard/schedule/${year}-${
                            index + 1 > 10 ? index + 1 : `0${index + 1}`
                          }`
                        )
                      }
                      icon={<EyeOutlined />}
                      type="link"
                    >
                      {t({ uz: 'Batafsil', ru: 'Подробнее', en: 'More' })}
                    </Button>
                  </div>
                }
              >
                {/* <Meta
                description={
                  <div>
                    <p>
                      {t({ uz: 'Vaqtida', ru: 'Вовремя', en: 'On Time' })}:{' '}
                      {stat.onTime}
                    </p>
                    <p>
                      {t({ uz: 'Kechikish', ru: 'Опоздание', en: 'Late' })}:{' '}
                      {stat.late}
                    </p>
                    <p>
                      {' '}
                      {t({
                        uz: 'Kelmagan',
                        ru: 'Отсутствовал',
                        en: 'Absent'
                      })}
                      : {stat.absent}
                    </p>
                  </div>
                }
              /> */}

                <ResponsiveContainer width="100%" height={120}>
                  <BarChart
                    layout="vertical"
                    data={data(stat)}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value} ta`]} />
                    <Bar dataKey="value">
                      {data(stat).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Schedule;
