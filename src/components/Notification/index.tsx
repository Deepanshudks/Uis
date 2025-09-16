import React from "react";

export const Notification: React.FC = () => {
  const handleTestNotification = () => {};

  return (
    <div className=" p-6">
      <button
        onClick={handleTestNotification}
        className="px-4 py-2 w-fit bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Test Notification
      </button>

      {/* <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-sm text-gray-500">
          Active notifications: {notifications.length}
        </p>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Clear All
          </button>
        )}
      </div> */}
    </div>
  );
};
