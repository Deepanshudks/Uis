const CustomCalender = () => {
  const date = new Date();
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <input
          min={7}
          max={10}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <span className="absolute right-3 top-2.5 pointer-events-none">📅</span>
      </div>
    </div>
  );
};

export default CustomCalender;
