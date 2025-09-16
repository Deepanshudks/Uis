import "./App.css";
import ChartWidget from "./components/ChartWidget";
import { DateTimePicker } from "./components/DateTimePicker";
import { MultiDocumentUpload } from "./components/MultiDocumentUpload";
import { MultiSelectDropdown } from "./components/MultiSelectDropdown";
import { Notification } from "./components/Notification";
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

          <div>
            <div className="py-4"></div>
            <DateTimePicker
              onChange={(date) => {
                console.log("Selected Date:", date);
              }}
            />
          </div>

          <div>
            <div className="py-4"></div>
            <Notification />
          </div>
        </div>
        <div className="grid  grid-cols-1 md:grid-cols-2 justify-center px-8 py-2 items-center min-h-screen bg-gray-100">
          <ChartWidget />
          <MultiDocumentUpload value={docs} onChange={setDocs} />
        </div>
      </div>
    </>
  );
}

export default App;
