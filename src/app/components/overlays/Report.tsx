"use client";
import { isOpenReport, valueReport } from "@/utils/Overlay/Report";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

let reports = [
  "Hate Speech",
  "Spam",
  "False Information",
  "Suicidal or Self Injury",
  "Harrasment",
  "Violence",
  "Nudity",
  "Something Else",
];

function Report({ reload }: any) {
  const [reportCategory, setReportCategory] = useState<string>("");
  const Report = isOpenReport();
  const reportValue = valueReport();

  let status = ["BUSY", "UNAUTHORIZED", "NEGATIVE", "ERROR", "FAILED"];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const addReport = new Promise(async (resolve, reject) => {
        const response = await axios.post("/api/post/actions/report", {
          postId: reportValue.id,
          reason: reportCategory,
        });

        const data = response.data;

        if (!status.includes(data.status)) {
          if (data.ok) {
            resolve(data);
          } else reject(data);
        } else reject(data);
      });

      toast.promise(
        addReport,
        {
          loading: "loading",
          success: (data: any) => `Success: ${data.msg}`,
          error: (data: any) => `Failed: ${data.msg}`,
        },
        { position: "top-center" }
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center animate-fadeIn duration-700 z-50 bg-slate-500/60">
      <div className="bg-white w-1/3 p-4 flex items-center flex-col rounded-xl gap-4">
        <div className="w-full flex items-center justify-end">
          <button
            type="button"
            className="text-3xl"
            onClick={() => {
              setReportCategory("");
              Report.close();
            }}
          >
            <IoClose />
          </button>
        </div>

        <div>
          <div>Please Select a problem</div>
          <div>
            If someone is in immediate danger, get help before reporting to
            admins. Don't Wait.
          </div>
        </div>

        <form
          className="w-full flex flex-col items-start justify-center gap-2"
          onSubmit={handleSubmit}
        >
          {reports.map((item, key) => {
            return (
              <button
                key={key}
                onClick={() => {
                  setReportCategory(item.toLowerCase());
                }}
                type="button"
                className={`font-semibold text-lg w-full flex items-center justify-start rounded-xl px-4 ${
                  reportCategory === item.toLowerCase() && "bg-slate-200"
                }`}
              >
                {item}
              </button>
            );
          })}

          <button type="submit">Report</button>
        </form>
      </div>
    </div>
  );
}

export default Report;