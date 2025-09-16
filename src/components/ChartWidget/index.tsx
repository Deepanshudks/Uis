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

  // Sample data
  const allData: DataPoint[] = Array.from({ length: 30 }).map((_, i) => ({
    date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
    value: Math.floor(Math.random() * 100),
  }));

  const filteredData = allData.filter((d) => {
    const current = dayjs(d.date);
    return current.isAfter(startDate) && current.isBefore(endDate);
  });

  return (
    <div className="bg-white px-4 rounded shadow w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <select
          value={chartType}
          onChange={(e) =>
            setChartType(e.target.value as "bar" | "line" | "pie")
          }
          className="border p-2 rounded"
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm">From:</label>
          <input
            type="date"
            value={startDate.format("YYYY-MM-DD")}
            onChange={(e) => setStartDate(dayjs(e.target.value))}
            className="border p-1 rounded"
          />
          <label className="text-sm">To:</label>
          <input
            type="date"
            value={endDate.format("YYYY-MM-DD")}
            onChange={(e) => setEndDate(dayjs(e.target.value))}
            className="border p-1 rounded"
          />
        </div>
      </div>

      <div className="flex justify-center">
        {chartType === "bar" && (
          <BarChart width={500} height={300} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        )}

        {chartType === "line" && (
          <LineChart width={500} height={300} data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        )}

        {chartType === "pie" && (
          <PieChart width={500} height={300}>
            <Pie
              data={filteredData}
              dataKey="value"
              nameKey="date"
              cx="50%"
              cy="50%"
              outerRadius={100}
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
        )}
      </div>
    </div>
  );
};

export default ChartWidget;
