import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FaTree, FaTint, FaFlask, FaCut } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import api from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    zones: 0,
    watering: 0,
    pesticide: 0,
    trimming: 0
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts - in real app, fetch from API
  const [chartData, setChartData] = useState({
    greenCover: [],
    taskDistribution: [],
    activityTrend: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch summary counts
        const [zonesRes, wateringRes, pesticideRes, trimmingRes] = await Promise.all([
          api.get('/zones'),
          api.get('/watering'),
          api.get('/pesticide'),
          api.get('/trimming')
        ]);

        setStats({
          zones: zonesRes.data.length || 0,
          watering: wateringRes.data.length || 0,
          pesticide: pesticideRes.data.length || 0,
          trimming: trimmingRes.data.length || 0
        });

        // Simulating chart data based on response
        // In a real scenario, the backend would provide aggregated data
        setChartData({
          greenCover: zonesRes.data.slice(0, 5).map(z => ({ name: z.zoneName, cover: z.greenCover })),
          taskDistribution: [
            { name: 'Watering', value: wateringRes.data.length },
            { name: 'Pesticide', value: pesticideRes.data.length },
            { name: 'Trimming', value: trimmingRes.data.length }
          ],
          activityTrend: [
            { name: 'Mon', tasks: 4 },
            { name: 'Tue', tasks: 3 },
            { name: 'Wed', tasks: 7 },
            { name: 'Thu', tasks: 2 },
            { name: 'Fri', tasks: 6 },
            { name: 'Sat', tasks: 8 },
            { name: 'Sun', tasks: 5 },
          ]
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback for demo purposes if backend is largely empty
        setChartData({
          greenCover: [
            { name: 'North Zone', cover: 75 },
            { name: 'South Zone', cover: 60 },
            { name: 'East Zone', cover: 80 },
            { name: 'West Zone', cover: 55 },
            { name: 'Central', cover: 90 },
          ],
          taskDistribution: [
            { name: 'Watering', value: 35 },
            { name: 'Pesticide', value: 15 },
            { name: 'Trimming', value: 25 }
          ],
          activityTrend: [
            { name: 'Mon', tasks: 4 },
            { name: 'Tue', tasks: 3 },
            { name: 'Wed', tasks: 7 },
            { name: 'Thu', tasks: 2 },
            { name: 'Fri', tasks: 6 },
            { name: 'Sat', tasks: 8 },
            { name: 'Sun', tasks: 5 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) return <Loader />;

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Dashboard Overview</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Zones" value={stats.zones} icon={<FaTree size={24} />} color="#2e7d32" />
        <StatCard title="Watering Tasks" value={stats.watering} icon={<FaTint size={24} />} color="#0288d1" />
        <StatCard title="Pesticide Tasks" value={stats.pesticide} icon={<FaFlask size={24} />} color="#7b1fa2" />
        <StatCard title="Trimming Tasks" value={stats.trimming} icon={<FaCut size={24} />} color="#e65100" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Zone Green Cover Comparison */}
        <div className="card">
          <h3 className="text-gray text-sm mb-4">Zone Green Cover (%)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.greenCover}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cover" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="card">
          <h3 className="text-gray text-sm mb-4">Task Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Trend */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="text-gray text-sm mb-4">Weekly Activity Schedule</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="var(--secondary-color)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
