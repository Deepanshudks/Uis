import "./App.css";
import ChartWidget from "./components/ChartWidget";
import CustomCalender from "./components/CustomCalender";
import { DateTimePicker } from "./components/DateTimePicker";
import { MultiDocumentUpload } from "./components/MultiDocumentUpload";
import { MultiSelectDropdown } from "./components/MultiSelectDropdown";
import { NotificationButton } from "./components/Notification";
import { dropdownLoadOptions, type DocumentType } from "./mocks";

import { useState } from "react";

interface OptionType {
  label: string;
  value: string;
}

function App() {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [docs, setDocs] = useState<DocumentType[]>([]);

  const loadOptions = async () => {
    return new Promise<OptionType[]>((resolve) => {
      setTimeout(() => resolve(dropdownLoadOptions), 500);
    });
  };

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((err) => console.log("Service Worker registration failed:", err));
  }

  return (
    <>
      <div className="w-screen h-screen bg-gray-100 flex flex-col">
        <div className="px-10 flex w-1/2  justify-between items-center">
          <div>
            <label className="block mb-2 font-semibold">
              Property Sub-Type <span className="text-red-500">*</span>
            </label>
            <MultiSelectDropdown
              loadOptions={loadOptions}
              value={selectedOptions}
              onChange={(options) => setSelectedOptions(options)}
            />
          </div>
          {/* <div>
            <CustomCalender />
          </div> */}

          <div>
            <div className="py-4 !w-fit"></div>
            <DateTimePicker
              onChange={(date) => {
                console.log("Selected Date:", date);
              }}
            />
          </div>

          <div>
            <div className="py-4"></div>
            <NotificationButton />
          </div>
        </div>
        <div className="grid  grid-cols-1 md:grid-cols-2 justify-center  items-center min-h-screen px-8 bg-gray-100">
          <ChartWidget />
          <MultiDocumentUpload value={docs} onChange={setDocs} />
        </div>
      </div>
    </>
  );
}

export default App;
