import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

interface DataPoint {
  [key: string]: string | number;
  date: string;
  value: number;
}

const ChartWidget: React.FC = () => {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());

  const allData: DataPoint[] = Array.from({ length: 30 }).map((_, i) => ({
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: Math.floor(Math.random() * 100),
  }));

  const filteredData = allData.filter((d) => {
    const current = dayjs(d.date);
    return current.isAfter(startDate) && current.isBefore(endDate);
  });

  return (
    <div className="bg-white px-2 sm:px-4 py-4 rounded shadow w-full overflow-x-auto">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={chartType}
          onChange={(e) =>
            setChartType(e.target.value as "bar" | "line" | "pie")
          }
          className="border p-2 rounded text-sm sm:text-base"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm">From:</label>
          <input
            type="date"
            value={startDate.format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(dayjs(e.target.value))}
            className="border p-1 rounded text-sm"
          />
          <label className="text-sm">To:</label>
          <input
            type="date"
            value={endDate.format("YYYY-MM-DD")}
            onChange={(e) => setEndDate(dayjs(e.target.value))}
            className="border p-1 rounded text-sm"
          />
        </div>
      </div>

      {/* Chart container with responsive height */}
      <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96">
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="value"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius="70%" // % keeps it responsive
                fill="#8884d8"
                label
              >
                {filteredData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ChartWidget;
