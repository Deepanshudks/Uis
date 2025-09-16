import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { useEffect, useRef, useState, type JSX } from "react";

interface TimeState {
  hour: number;
  minute: number;
  period: "AM" | "PM";
}

interface DateTimeWidgetProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DateTimePicker: React.FC<DateTimeWidgetProps> = ({
  value,
  onChange,
  placeholder = "Select Date & Time",
  disabled = false,
  className = "",
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [selectedTime, setSelectedTime] = useState<TimeState>({
    hour: value ? value.getHours() % 12 || 12 : 12,
    minute: value ? value.getMinutes() : 46,
    period: value ? (value.getHours() >= 12 ? "PM" : "AM") : "PM",
  });
  const [quickRange, setQuickRange] = useState<string>("");
  const widgetRef = useRef<HTMLDivElement>(null);

  const quickRangeOptions = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "This Month", value: "thismonth" },
  ];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleQuickRange = (range: string): void => {
    setQuickRange(range);
    const today = new Date();
    let date = new Date();

    switch (range) {
      case "today":
        date = new Date();
        break;
      case "last7days":
        date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "thismonth":
        date = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
    }

    setSelectedDate(date);
    setCurrentMonth(date);
  };

  const handleSet = (): void => {
    if (selectedDate) {
      const finalDateTime = new Date(selectedDate);
      let hour = selectedTime.hour;
      if (selectedTime.period === "PM" && hour !== 12) hour += 12;
      if (selectedTime.period === "AM" && hour === 12) hour = 0;
      finalDateTime.setHours(hour, selectedTime.minute, 0, 0);

      onChange?.(finalDateTime);
      setIsOpen(false);
    }
  };

  const handleCancel = (): void => {
    setIsOpen(false);
    setQuickRange("");
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const renderCalendar = (): JSX.Element => {
    const today = new Date();
    const currentYear = currentMonth.getFullYear();
    const currentMonthIndex = currentMonth.getMonth();
    const firstDay = new Date(currentYear, currentMonthIndex, 1);
    const lastDay = new Date(currentYear, currentMonthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: JSX.Element[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(currentYear, currentMonthIndex, 0);
      const day = prevMonth.getDate() - startingDayOfWeek + i + 1;
      days.push(
        <div
          key={`prev-${day}`}
          className="p-2 text-gray-500 text-sm text-center"
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        selectedDate && date.toDateString() === selectedDate.toDateString();
      const disabled = isDateDisabled(date);

      days.push(
        <button
          key={day}
          onClick={() => !disabled && setSelectedDate(date)}
          disabled={disabled}
          className={`p-2 text-sm w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isSelected
              ? "bg-teal-500 text-white"
              : isToday
              ? "bg-blue-100 text-blue-600"
              : disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-white hover:bg-gray-700"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentYear, currentMonthIndex - 1))
            }
            className="p-1 hover:bg-gray-700 rounded"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          <div className="text-white font-medium">
            {monthNames[currentMonthIndex]} {currentYear}
          </div>
          <button
            onClick={() =>
              setCurrentMonth(new Date(currentYear, currentMonthIndex + 1))
            }
            className="p-1 hover:bg-gray-700 rounded"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-xs text-gray-400 text-center font-medium"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderTimePicker = (): JSX.Element => {
    return (
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* Hour Controls */}
        <div className="flex flex-col items-center">
          <button
            onClick={() =>
              setSelectedTime((prev) => ({
                ...prev,
                hour: prev.hour === 12 ? 1 : prev.hour + 1,
              }))
            }
            className="p-1 hover:bg-gray-600 rounded"
          >
            <ChevronUp className="w-3 h-3 text-gray-300" />
          </button>
          <div className="bg-white px-3 py-1 rounded text-black font-mono">
            {selectedTime.hour.toString().padStart(2, "0")}
          </div>
          <button
            onClick={() =>
              setSelectedTime((prev) => ({
                ...prev,
                hour: prev.hour === 1 ? 12 : prev.hour - 1,
              }))
            }
            className="p-1 hover:bg-gray-600 rounded"
          >
            <ChevronDown className="w-3 h-3 text-gray-300" />
          </button>
        </div>

        <span className="text-white">:</span>

        {/* Minute Controls */}
        <div className="flex flex-col items-center">
          <button
            onClick={() =>
              setSelectedTime((prev) => ({
                ...prev,
                minute: prev.minute === 59 ? 0 : prev.minute + 1,
              }))
            }
            className="p-1 hover:bg-gray-600 rounded"
          >
            <ChevronUp className="w-3 h-3 text-gray-300" />
          </button>
          <div className="bg-white px-3 py-1 rounded text-black font-mono">
            {selectedTime.minute.toString().padStart(2, "0")}
          </div>
          <button
            onClick={() =>
              setSelectedTime((prev) => ({
                ...prev,
                minute: prev.minute === 0 ? 59 : prev.minute - 1,
              }))
            }
            className="p-1 hover:bg-gray-600 rounded"
          >
            <ChevronDown className="w-3 h-3 text-gray-300" />
          </button>
        </div>

        {/* AM/PM Toggle */}
        <button
          onClick={() =>
            setSelectedTime((prev) => ({
              ...prev,
              period: prev.period === "AM" ? "PM" : "AM",
            }))
          }
          className="bg-white px-3 py-1 rounded text-black font-mono ml-2"
        >
          {selectedTime.period}
        </button>
      </div>
    );
  };

  const displayValue = selectedDate
    ? `${selectedDate.toLocaleDateString()}, ${
        selectedTime.hour
      }:${selectedTime.minute.toString().padStart(2, "0")} ${
        selectedTime.period
      }`
    : placeholder;

  return (
    <div ref={widgetRef} className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors w-full ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm flex-1 text-left">{displayValue}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50 min-w-80">
          {/* Quick Range Options */}
          <div className="flex gap-2 mb-4">
            {quickRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuickRange(option.value)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  quickRange === option.value
                    ? "bg-teal-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {renderCalendar()}
          {renderTimePicker()}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSet}
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
            >
              Set
            </button>
          </div>

          {selectedDate && (
            <div className="mt-2 text-xs text-gray-400 text-center">
              {displayValue}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
