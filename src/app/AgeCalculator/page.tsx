import React, { useState } from "react";
import DatePicker from "react-datepicker2";
import moment, { Moment } from "moment-jalaali";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AgeCalculator: React.FC = () => {
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
    <div className="flex flex-col items-center justify-center w-[70rem] h-[30rem] space-y-4">
      <div className="mb-4">
        <button
          onClick={() => setLanguage("fa")}
          className={`text-xl ml-4 p-2 ${
            language === "fa"
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-black"
          } rounded-md`}
        >
          فارسی
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`text-xl ml-4 p-2 ${
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
        className="bg-transparent  text-black placeholder-black focus:outline-none text-2xl  border border-gray-300 p-2 mt-4 rounded-md"
        inputJalaaliFormat="jYYYY/jMM/jDD"
      />

      <DatePicker
        timePicker={false}
        isGregorian={language === "en"}
        value={birthDate || undefined}
        onChange={(value) => setBirthDate(value)}
        className="bg-transparent text-black placeholder-black focus:outline-none text-2xl border border-gray-300 p-2 rounded-md"
        inputJalaaliFormat="jYYYY/jMM/jDD"
      />

      <button
        onClick={handleCalculateAge}
        className="text-black text-2xl ml-4 p-2 bg-purple-500 hover:bg-purple-700  rounded-md"
      >
        {language === "fa" ? "محاسبه سن" : "Calculate Age"}
      </button>

      {age !== null && (
        <div className="text-black text-2xl mt-4">
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
