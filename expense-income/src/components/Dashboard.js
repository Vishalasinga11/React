import React from 'react';
import { useSelector } from 'react-redux';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { getMonthlyData } from '../utils/dateUtils';

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const expenses = useSelector((state) => state.expenses.expenses);
  const income = useSelector((state) => state.income.income);

  const { monthlyIncome, monthlyExpenses } = getMonthlyData(income, expenses);

  // Bar chart data
  const barData = {
    labels: Object.keys(monthlyIncome),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyIncome),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyExpenses),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Total income and expenses
  const totalIncome = Object.values(monthlyIncome).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(monthlyExpenses).reduce((a, b) => a + b, 0);

  // Pie chart data
  const pieData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome-totalExpenses,totalExpenses],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = totalIncome;
            const value = tooltipItem.raw;
            const percentage = ((value/total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  // Line chart data
  const lineData = {
    labels: Object.keys(monthlyIncome),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyIncome),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyExpenses),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  // Combined income minus expenses data
  const combinedData = {
    labels: Object.keys(monthlyIncome),
    datasets: [
      {
        label: 'Net Income',
        data: Object.keys(monthlyIncome).map((month) => monthlyIncome[month] - monthlyExpenses[month] || 0),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-xl text-center mb-5">Monthly Income & Expenses</h2>
      <div className="mb-10">
        <Bar data={barData} />
      </div>
      <div className="w-full max-w-md mx-auto mt-10">
        <h2 className="text-xl text-center mb-5">Income vs. Expenses</h2>
        <Pie data={pieData} options={pieOptions} />
      </div>
      <div className="w-full max-w-md mx-auto mt-10">
        <h2 className="text-xl text-center mb-5">Monthly Income & Expenses (Line Chart)</h2>
        <Line data={lineData} />
      </div>
      <div className="w-full max-w-md mx-auto mt-10">
        <h2 className="text-xl text-center mb-5">Net Income (Income - Expenses)</h2>
        <Line data={combinedData} />
      </div>
    </div>
  );
};

export default Dashboard;
