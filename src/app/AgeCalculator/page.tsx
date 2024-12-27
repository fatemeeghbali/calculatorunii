import React, { useState } from "react";
import DatePicker from "react-datepicker2";
import moment, { Moment } from "moment-jalaali";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AgeCalculatorProps {
  darkMode: boolean;
}
const AgeCalculator: React.FC<AgeCalculatorProps> = ({ darkMode }) => {
  const [birthDate, setBirthDate] = useState<Moment | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState<Moment | undefined>(moment());
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [language, setLanguage] = useState<"fa" | "en">("fa");
  //این تابع سن را بر اساس تاریخ تولد و تاریخ جاری محاسبه می‌کند.
  const calculateAge = (
    birthDate: Moment,
    currentDate: Moment
  ): {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } => {
    let years = currentDate.jYear() - birthDate.jYear();
    let months = currentDate.jMonth() - birthDate.jMonth();
    let days = currentDate.jDate() - birthDate.jDate();
    let hours = currentDate.hour() - birthDate.hour();
    let minutes = currentDate.minute() - birthDate.minute();
    let seconds = currentDate.second() - birthDate.second();
    //اگر مقدار ثانیه، دقیقه، ساعت، روز یا ماه منفی باشد، با استفاده از تعدیلات مناسب، مقدار آن اصلاح می‌شود:
    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }

    if (minutes < 0) {
      minutes += 60;
      hours--;
    }

    if (hours < 0) {
      hours += 24;
      days--;
    }

    if (days < 0) {
      days += birthDate.daysInMonth();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    return { years, months, days, hours, minutes, seconds };
  };

  const handleCalculateAge = () => {
    if (birthDate && currentDate) {
      const calculatedAge = calculateAge(birthDate, currentDate);
      setAge(calculatedAge);
    } else {
      toast(
        language === "fa"
          ? ".لطفاً هر دو تاریخ را وارد کنید"
          : "Please enter both dates.",
        {
          type: "error",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <button
          onClick={() => setLanguage("fa")}
          className={`text-lg sm:text-xl p-2 ${
            language === "fa"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-black"
          } rounded-md`}
        >
          فارسی
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`text-lg sm:text-xl p-2 ${
            language === "en"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-black"
          } rounded-md`}
        >
          English
        </button>
      </div>

      <DatePicker
        timePicker={false}
        isGregorian={language === "en"}
        value={currentDate || undefined}
        onChange={(value) => setCurrentDate(value)}
        className={`${
          darkMode
            ? "bg-white text-black placeholder-gray-400 border-gray-600"
            : "bg-transparent text-black placeholder-black border-gray-300"
        } focus:outline-none text-lg sm:text-2xl p-2 mt-4 rounded-md border border-gray-300 w-full max-w-md`}
        inputJalaaliFormat="jYYYY/jMM/jDD"
      />

      <DatePicker
        timePicker={false}
        isGregorian={language === "en"}
        value={birthDate || undefined}
        onChange={(value) => setBirthDate(value)}
        className={`${
          darkMode
            ? "bg-white text-black placeholder-gray-400 border-gray-600"
            : "bg-transparent text-black placeholder-black border-gray-300"
        } focus:outline-none text-lg sm:text-2xl p-2 mt-4 rounded-md border border-gray-300 w-full max-w-md`}
        inputJalaaliFormat="jYYYY/jMM/jDD"
      />

      <button
        onClick={handleCalculateAge}
        className="text-white text-lg sm:text-2xl p-2 bg-purple-500 hover:bg-purple-700 rounded-md w-full max-w-xs"
      >
        {language === "fa" ? "محاسبه سن" : "Calculate Age"}
      </button>

      {age !== null && (
        <div
          className={`${
            darkMode ? "text-white" : "text-black"
          } text-lg sm:text-2xl mt-4 text-center`}
        >
          {language === "fa"
            ? `سن شما: ${age.years} سال، ${age.months} ماه، ${age.days} روز، ${age.hours} ساعت، ${age.minutes} دقیقه و ${age.seconds} ثانیه`
            : `Your age: ${age.years} years, ${age.months} months, ${age.days} days, ${age.hours} hours, ${age.minutes} minutes and ${age.seconds} seconds`}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AgeCalculator;
