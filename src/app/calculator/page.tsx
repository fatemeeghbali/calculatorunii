import React, { useState, useEffect, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { GrHistory } from "react-icons/gr";
import { MdDelete, MdFileCopy } from "react-icons/md";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
// import { useMediaQuery } from "@mui/material";

interface Operator {
  precedence: number;
  associativity: "L" | "R";
}

interface CalculatorProps {
  darkMode: boolean;
}
const Calculator: React.FC<CalculatorProps> = ({ darkMode }) => {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [inverse, setInverse] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showAboutText, setShowAboutText] = useState<boolean>(false);
  const [showAdvancedButtons, setShowAdvancedButtons] = useState(false);

  const historyRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const aboutRefText = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      historyRef.current &&
      !historyRef.current.contains(event.target as Node) &&
      showHistory
    ) {
      setShowHistory(false);
    }
    if (
      aboutRef.current &&
      !aboutRef.current.contains(event.target as Node) &&
      showAbout
    ) {
      setShowAbout(false);
    }
    if (
      aboutRefText.current &&
      !aboutRefText.current.contains(event.target as Node) &&
      showAboutText
    ) {
      setShowAboutText(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showHistory, showAbout, showAboutText]);

  const toggleAbout = () => {
    setShowAboutText(!showAboutText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleButtonClick = (value: string) => {
    setInput((prev) => prev + value);
  };

  const operators: Record<string, Operator> = {
    "+": { precedence: 1, associativity: "L" },
    "-": { precedence: 1, associativity: "L" },
    "*": { precedence: 2, associativity: "L" },
    "/": { precedence: 2, associativity: "L" },
    "^": { precedence: 3, associativity: "R" },
    mod: { precedence: 2, associativity: "L" },
  };

  const functions: Record<string, number> = {
    sin: 1,
    cos: 1,
    tan: 1,
    log: 1,
    "√": 1,
    "∛": 1,
    ln: 1,
    e: 0,
    π: 0,
    "!": 1,
    "|": 1,
    "%": 1,
    Rnd: 0,
    sinh: 1,
    cosh: 1,
    tanh: 1,
    acos: 1,
    asin: 1,
    atan: 1,
    asinh: 1,
    acosh: 1,
    atanh: 1,
    "²": 0,
    "³": 0,
    "-": 0,
    "+": 0,
    "^(-1)": 0,
    // EE: 0,
  };

  const processAbsoluteValue = (expression: string): string => {
    let result = expression;
    let startIndex = result.indexOf("|");
    while (startIndex !== -1) {
      const endIndex = result.indexOf("|", startIndex + 1);
      if (endIndex === -1) break;

      const number = parseFloat(result.slice(startIndex + 1, endIndex));
      if (!isNaN(number)) {
        const absoluteValue = Math.abs(number);
        result =
          result.slice(0, startIndex) +
          absoluteValue +
          result.slice(endIndex + 1);
      }

      startIndex = result.indexOf("|", endIndex + 1);
    }
    return result;
  };

  const replacePi = (expression: string): string => {
    return expression.replace(/π/g, Math.PI.toString());
  };

  const replaceE = (expression: string): string => {
    return expression.replace(/e/g, Math.E.toString());
  };

  const toPostfix = (infix: string): string[] => {
    const output: string[] = [];
    const stack: string[] = [];
    const processedInfix = replaceE(replacePi(processAbsoluteValue(infix)));
    const tokens = processedInfix.match(
      // /(\d+(\.\d+)?|[-+*/^()!|πe]|sin|cos|tan|sinh|cosh|tanh|log|√|∛|ln|%|mod|Rnd|³|EE|\^(-1))/g
      /(\d+(\.\d+)?|[-+*/^()!|πe]|sin|cos|tan|sinh|cosh|tanh|acos|asin|atan|sin⁻¹|cos⁻¹|tan⁻¹|asinh|acosh|atanh|log|√|∛|ln|%|mod|Rnd|³|²|EE|\^(-1))/g
    );

    if (tokens === null) return output;

    tokens.forEach((token) => {
      if (!isNaN(parseFloat(token))) {
        output.push(token);
      } else if (token in functions || token === "EE" || token === "^(-1)") {
        stack.push(token);
      } else if (token in operators) {
        while (
          stack.length &&
          stack[stack.length - 1] in operators &&
          ((operators[token].associativity === "L" &&
            operators[token].precedence <=
              operators[stack[stack.length - 1]].precedence) ||
            (operators[token].associativity === "R" &&
              operators[token].precedence <
                operators[stack[stack.length - 1]].precedence))
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      } else if (token === "(") {
        stack.push(token);
      } else if (token === ")") {
        while (stack.length && stack[stack.length - 1] !== "(") {
          output.push(stack.pop()!);
        }
        stack.pop();
      }
    });

    while (stack.length) {
      output.push(stack.pop()!);
      console.log(output);
    }

    return output;
  };

  const evaluatePostfix = (postfix: string[]): number => {
    const stack: number[] = [];
    const applyOperator = (op: string) => {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (op) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return a / b;
        case "^":
          return Math.pow(a, b);
        case "mod":
          return a % b;
        default:
          return NaN;
      }
    };

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const toDegrees = (rad: number) => (rad * 180) / Math.PI;

    postfix.forEach((token) => {
      if (!isNaN(parseFloat(token))) {
        stack.push(parseFloat(token));
      } else if (token in operators) {
        stack.push(applyOperator(token));
      } else if (token === "sin") {
        stack.push(Math.sin(toRadians(stack.pop()!)));
      } else if (token === "cos") {
        stack.push(Math.cos(toRadians(stack.pop()!)));
      } else if (token === "tan") {
        stack.push(Math.tan(toRadians(stack.pop()!)));
      } else if (token === "sin⁻¹") {
        stack.push(Math.asin(stack.pop()!));
      } else if (token === "cos⁻¹") {
        stack.push(Math.acos(stack.pop()!));
      } else if (token === "tan⁻¹") {
        stack.push(Math.atan(stack.pop()!));
      } else if (token === "asin") {
        stack.push(toDegrees(Math.asin(stack.pop()!)));
      } else if (token === "acos") {
        stack.push(toDegrees(Math.acos(stack.pop()!)));
      } else if (token === "atan") {
        stack.push(toDegrees(Math.atan(stack.pop()!)));
      } else if (token === "sinh") {
        stack.push(Math.sinh(stack.pop()!));
      } else if (token === "cosh") {
        stack.push(Math.cosh(stack.pop()!));
      } else if (token === "tanh") {
        stack.push(Math.tanh(stack.pop()!));
      } else if (token === "asinh") {
        stack.push(Math.asinh(stack.pop()!));
      } else if (token === "acosh") {
        stack.push(Math.acosh(stack.pop()!));
      } else if (token === "atanh") {
        stack.push(Math.atanh(stack.pop()!));
      } else if (token === "log") {
        stack.push(Math.log10(stack.pop()!));
      } else if (token === "√") {
        stack.push(Math.sqrt(stack.pop()!));
      } else if (token === "∛") {
        stack.push(Math.cbrt(stack.pop()!));
      } else if (token === "ln") {
        stack.push(Math.log(stack.pop()!));
      } else if (token === "Rnd") {
        stack.push(Math.random());
      } else if (token === "!") {
        const n = stack.pop()!;
        stack.push(factorial(n));
      } else if (token === "%") {
        const percentage = stack.pop()!;
        const base = stack.pop()!;
        stack.push(base * (percentage / 100));
      } else if (token === "²") {
        const a = stack.pop()!;
        stack.push(a * a);
      } else if (token === "³") {
        const a = stack.pop()!;
        stack.push(a * a * a);
      } else if (token === "^(-1)") {
        const a = stack.pop()!;
        stack.push(1 / a);
      } else if (token === "EE") {
        const exp = stack.pop()!;
        const mantissa = stack.pop()!;
        stack.push(mantissa * Math.pow(10, exp));
      }
    });

    return stack[0];
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    return n <= 1 ? 1 : n * factorial(n - 1);
  };

  const handleEvaluate = () => {
    try {
      const postfix = toPostfix(input);
      const result = evaluatePostfix(postfix);
      if (isNaN(result)) {
        setInput("Invalid expression");
      } else {
        setHistory([...history, `${input} = ${result}`]);
        setInput(result.toString());
      }
    } catch (error) {
      setInput("Error");
    }
  };

  const handleClear = () => {
    setInput("");
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleDeleteItem = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
  };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" || e.key === "=") {
  //     handleEvaluate();
  //     e.preventDefault();
  //   }
  // };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "=") {
      handleEvaluate();
      e.preventDefault();
    } else if (e.key === "Backspace") {
      handleDelete(); // متد حذف کاراکتری
      e.preventDefault(); // جلوگیری از عملکرد پیش‌فرض
    } else if (e.key === "Delete") {
      handleClear(); // متد حذف کل
      e.preventDefault(); // جلوگیری از عملکرد پیش‌فرض
    }
  };

  const handleDeleteAll = () => {
    setHistory([]);
  };
  const toggleInverse = () => {
    setInverse((prev) => !prev);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("متن با موفقیت کپی شد!");
      })
      .catch((err) => {
        toast.error("خطایی در کپی کردن متن رخ داد.");
      });
  };

  return (
    <div
      className={`flex flex-col  p-4 mr-6 rounded-lg shadow-lg max-w-fit max-h-fit ${
        darkMode ? "bg-[#393939] text-white" : "bg-[#FAF6FD] text-black"
      }`}
    >
      <div className="flex items-center sm:text-base md:text-lg lg:text-xl bg-[#FAF6FD] text-black p-2 rounded-md mb-10">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          placeholder="0"
          className="flex-grow bg-transparent  placeholder-black focus:outline-none text-lg sm:text-xl md:text-2xl items-center lg:text-xl"
        />

        <div className="relative flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-black text-sm sm:text-base md:text-lg lg:text-xl items-center"
          >
            <GrHistory />
          </button>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-black text-sm sm:text-base md:text-lg lg:text-xl items-center"
          >
            <BsThreeDotsVertical />
          </button>
          {/* advance button */}
          <div className="mt-4 block ">
            <button
              className="text-black text-sm sm:text-base md:text-lg lg:text-xl items-center hidden sm:block"
              onClick={() => setShowAdvancedButtons(!showAdvancedButtons)}
            >
              {showAdvancedButtons ? (
                <CgArrowsExchangeAlt />
              ) : (
                <CgArrowsExchangeAlt />
              )}
            </button>
          </div>

          {showAbout && (
            <div
              ref={aboutRef}
              className="absolute right-0 mt-2 bg-white text-black shadow-lg w-40 sm:w-60 md:w-80 sm:text-2xl  md:text-2xl items-center lg:text-xl h-10 rounded-md p-2"
              onClick={toggleAbout}
            >
              <h2 className="mb-4 text-sm sm:text-base md:text-lg bg-[#d0c8d6] rounded-lg flex justify-center items-center">
                درباره ما
              </h2>
            </div>
          )}
          {showAboutText && (
            <div
              ref={aboutRefText}
              className="absolute right-2  mt-2 bg-white text-black shadow-lg w-60 sm:w-72 md:w-80 rounded-md p-4 sm:text-2x top-4  md:text-2xl items-center lg:text-xl"
            >
              <h2 className="text-sm  font-bold mb-2 text-center bg-fuchsia-200 rounded-md sm:text-2xl  md:text-2xl items-center lg:text-xl">
                درباره ما
              </h2>
              <p className="text-sm sm:text-base text-right  md:text-2xl  items-center lg:text-xl">
                قابلیت های پیشرفته ای دارند که محاسبات پیچیده مهندسی را تسهیل می
                کنند. ویژگی های اصلی ماشین حساب مهندسی شامل محاسبات علمی، مهندسی
                و تحلیلی پیشرفته است. این ماشین ها می توانند عملیات مهندسی همچون
                محاسبه زاویه، محاسبه بردارها، محاسبات آماری، تبدیل واحدها و غیره
                را انجام دهند. ماشین حساب های مهندسی به مهندسان اجازه می دهند تا
                با سرعت و دقت بالا محاسبات پیچیده را انجام دهند که این امر در
                پروژه های مهندسی و تحقیقاتی بسیار مفید است. امروزه اکثر مهندسان
                و دانشجویان مهندسی از این ابزار قدرتمند استفاده می کنند
              </p>
            </div>
          )}
          {showHistory && (
            <div
              ref={historyRef}
              className="absolute right-0 top-4  mt-2 bg-white text-black shadow-lg w-60 sm:w-60 md:w-80 h-80 sm:h-72 md:h-[30rem] rounded-md p-2 sm:text-2xl  md:text-2xl items-center lg:text-xl"
            >
              <h2 className="mb-4 text-sm sm:text-base md:text-lg bg-[#d0c8d6] rounded-lg flex justify-center items-center  lg:text-xl">
                تاریخچه
              </h2>
              <ul className="text-sm sm:text-base">
                {history.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => setInput(item.split(" = ")[0])}
                    >
                      {item}
                    </span>
                    <button
                      className="ml-2 text-purple-950"
                      onClick={() => handleDeleteItem(index)}
                    >
                      <MdDelete />
                    </button>
                    <button
                      className="ml-2 text-purple-950"
                      onClick={() => handleCopyToClipboard(item)}
                    >
                      <MdFileCopy />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleDeleteAll}
                className="w-[13rem] sm:w-48 md:w-72 ml-2 bottom-0 absolute mb-4 flex justify-center items-center text-sm sm:text-base md:text-lg bg-[#d0c8d6] rounded-lg lg:text-xl"
              >
                حذف تاریخچه
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex">
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-4 w-full mt-4">
          <button
            className="p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-[#D3C9DA] text-violet-950 text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={handleClear}
          >
            C
          </button>

          <button
            className="p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-[#D3C9DA] text-violet-950 text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={handleDelete}
          >
            DEL
          </button>
          <button
            key="%"
            className="bg-[#D3C9DA] text-violet-950  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick("%")}
          >
            %
          </button>
          <button
            key="/"
            className=" bg-purple-700 text-white  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick("/")}
          >
            /
          </button>
          {["7", "8", "9"].map((value) => (
            <button
              key={value}
              className="  bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </button>
          ))}
          <button
            key="*"
            className=" bg-purple-700 text-white p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick("*")}
          >
            *
          </button>

          {["4", "5", "6"].map((value) => (
            <button
              key={value}
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </button>
          ))}
          <button
            key="-"
            className=" bg-purple-700 text-white p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick("-")}
          >
            -
          </button>

          {["1", "2", "3"].map((value) => (
            <button
              key={value}
              className=" bg-violet-100	 text-violet-900 p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
              onClick={() => handleButtonClick(value)}
            >
              {value}
            </button>
          ))}
          <button
            key="+"
            className=" bg-purple-700 text-white  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick("+")}
          >
            +
          </button>

          <button
            key="0"
            className="col-span-2 p-6 text-start bg-violet-100 text-violet-900 flex items-center justify-center rounded-full shadow-lg sm:p-4 h-12 md:h-20 text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick("0")}
          >
            <span className="block w-full text-center">0</span>
          </button>
          <button
            key="."
            className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={() => handleButtonClick(".")}
          >
            .
          </button>
          <button
            className=" bg-purple-700 text-white p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl"
            onClick={handleEvaluate}
          >
            =
          </button>
        </div>
        {showAdvancedButtons && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-5 gap-2 sm:gap-5 w-full mt-4"
          >
            <button
              className=" bg-violet-100	 text-violet-900   p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick("mod")}
            >
              mod
            </button>

            <button
              key="("
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick("(")}
            >
              {"("}
            </button>

            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "asin(" : "sin(")}
            >
              {inverse ? "asin" : "sin"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "³" : "²")}
            >
              {inverse ? "x³" : "x²"}
            </button>

            <button
              className=" bg-violet-100	 text-violet-900 p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick("^")}
            >
              ^
            </button>
            <button
              key=")"
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(")")}
            >
              {")"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "atan(" : "tan(")}
            >
              {inverse ? "atan" : "tan"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block "
              onClick={() => handleButtonClick(inverse ? "tan⁻¹" : "1/")}
            >
              {inverse ? "tan⁻¹" : "1/X"}
              {}
            </button>

            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block "
              onClick={() => handleButtonClick(inverse ? "ln(" : "log(")}
            >
              {inverse ? "ln" : "log"}
            </button>

            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block "
              onClick={() => handleButtonClick(inverse ? "e" : "π")}
            >
              {inverse ? "e" : "π"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "acos(" : "cos(")}
            >
              {inverse ? "acos" : "cos"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900 p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block "
              onClick={() => handleButtonClick(inverse ? "sin⁻¹(" : "cos⁻¹(")}
            >
              {inverse ? "sin⁻¹" : "cos⁻¹"}
            </button>

            <button
              className=" bg-violet-100	 text-violet-900 p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick("|")}
            >
              |x|
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "∛(" : "√(")}
            >
              {inverse ? "∛" : "√"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-sm sm:text-base  md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "acosh(" : "cosh(")}
            >
              {inverse ? "acosh" : "cosh"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900 p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "atanh(" : "tanh(")}
            >
              {inverse ? "atanh" : "tanh"}
            </button>

            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick("!")}
            >
              x!
            </button>
            <button
              className=" bg-violet-100	 text-violet-900 p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "+" : "-")}
            >
              {inverse ? "+" : "-/+"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base  md:text-lg lg:text-xl hidden sm:block"
              onClick={() => handleButtonClick(inverse ? "asinh(" : "sinh(")}
            >
              {inverse ? "asinh" : "sinh"}
            </button>
            <button
              className=" bg-violet-100	 text-violet-900  p-2 sm:p-4 rounded-full shadow-lg w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20  text-sm sm:text-base md:text-lg lg:text-xl hidden sm:block"
              onClick={toggleInverse}
            >
              inv
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
