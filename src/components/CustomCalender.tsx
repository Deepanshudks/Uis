const CustomCalender = () => {
  return (
    <div>
      <div className="relative">
        <input
          type="date"
          className="bg-teal-400 py-2 px-3 pr-10 border-2 border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <span className="absolute right-3 top-2.5 pointer-events-none">
          📅 {/* or your custom SVG */}
        </span>
      </div>
    </div>
  );
};

export default CustomCalender;
