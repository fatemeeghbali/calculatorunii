import React, { useState, useEffect } from "react";
import { GrHistory } from "react-icons/gr";
import { MdDelete, MdFileCopy } from "react-icons/md";
// import moment from "moment-jalaali";

import { toast } from "react-toastify";
interface Operator {
  precedence: number;
  associativity: "L" | "R";
}

const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [inverse, setInverse] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  // const [language, setLanguage] = useState<"fa" | "en">("fa");

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
      /(\d+(\.\d+)?|[-+*/^()!|πe]|sin|cos|tan|sinh|cosh|tanh|acos|asin|atan|sin⁻¹|cos⁻¹|tan⁻¹|asinh|acosh|atanh|log|√|∛|ln|%|mod|Rnd|³|EE|\^(-1))/g
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
    }

    return output;
  };

  // مثلثاتیش با رادیان حساب میشه تو این کد
  // const evaluatePostfix = (postfix: string[]): number => {
  //   const stack: number[] = [];
  //   const applyOperator = (op: string) => {
  //     const b = stack.pop()!;
  //     const a = stack.pop()!;
  //     switch (op) {
  //       case "+":
  //         return a + b;
  //       case "-":
  //         return a - b;
  //       case "*":
  //         return a * b;
  //       case "/":
  //         return a / b;
  //       case "^":
  //         return Math.pow(a, b);
  //       case "mod":
  //         return a % b;
  //       default:
  //         return NaN;
  //     }
  //   };

  //   postfix.forEach((token) => {
  //     if (!isNaN(parseFloat(token))) {
  //       stack.push(parseFloat(token));
  //     } else if (token in operators) {
  //       stack.push(applyOperator(token));
  //     } else if (token === "sin") {
  //       stack.push(Math.sin(stack.pop()!));
  //     } else if (token === "cos") {
  //       stack.push(Math.cos(stack.pop()!));
  //     } else if (token === "tan") {
  //       stack.push(Math.tan(stack.pop()!));
  //     } else if (token === "sinh") {
  //       stack.push(Math.sinh(stack.pop()!));
  //     } else if (token === "cosh") {
  //       stack.push(Math.cosh(stack.pop()!));
  //     } else if (token === "tanh") {
  //       stack.push(Math.tanh(stack.pop()!));
  //     } else if (token === "log") {
  //       stack.push(Math.log10(stack.pop()!));
  //     } else if (token === "√") {
  //       stack.push(Math.sqrt(stack.pop()!));
  //     } else if (token === "∛") {
  //       stack.push(Math.cbrt(stack.pop()!));
  //     } else if (token === "ln") {
  //       stack.push(Math.log(stack.pop()!));
  //     } else if (token === "Rnd") {
  //       stack.push(Math.random());
  //     } else if (token === "!") {
  //       const n = stack.pop()!;
  //       stack.push(factorial(n));
  //     } else if (token === "%") {
  //       const percentage = stack.pop()!;
  //       const base = stack.pop()!;
  //       stack.push(base * (percentage / 100));
  //     } else if (token === "acos") {
  //       stack.push(Math.acos(stack.pop()!));
  //     } else if (token === "asin") {
  //       stack.push(Math.asin(stack.pop()!));
  //     } else if (token === "atan") {
  //       stack.push(Math.atan(stack.pop()!));
  //     } else if (token === "asinh") {
  //       stack.push(Math.asinh(stack.pop()!));
  //     } else if (token === "acosh") {
  //       stack.push(Math.acosh(stack.pop()!));
  //     } else if (token === "atanh") {
  //       stack.push(Math.atanh(stack.pop()!));
  //     } else if (token === "²") {
  //       const a = stack.pop()!;
  //       stack.push(a * a);
  //     } else if (token === "³") {
  //       const a = stack.pop()!;
  //       stack.push(a * a * a);
  //     } else if (token === "^(-1)") {
  //       const a = stack.pop()!;
  //       stack.push(1 / a);
  //     } else if (token === "EE") {
  //       const exp = stack.pop()!;
  //       const mantissa = stack.pop()!;
  //       stack.push(mantissa * Math.pow(10, exp));
  //     }
  //   });

  //   return stack[0];
  // };

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
        // stack.push(Math.atan(1) * 180) / Math.PI;
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

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEvaluate();
    }
  };
  const handleDeleteAll = () => {
    setHistory([]);
  };
  const toggleInverse = () => {
    setInverse((prev) => !prev);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(input);
    toast("کپی شد", {
      type: "success",
      position: "bottom-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="bg-[#FAF6FD] w-full text-black p-4 rounded-lg shadow-lg max-w-fit mx-auto max-h-fit">
      <div className="flex items-center bg-[#FAF6FD] text-black  p-2 rounded-md mb-10">
        {/* <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtHlVCKEZjSlFXi2l1G-VXHFGyKkoUnek3Uw&s" // لینک تصویر فانتزی روباه را اینجا قرار دهید
          alt="Fox"
          className="h-8 w-8 mr-2"
          /> */}

        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="0"
          className="flex-grow bg-transparent text-black  placeholder-black focus:outline-none text-2xl"
        />

        <div className="relative">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-black text-2xl ml-2"
          >
            <GrHistory />
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="text-black text-2xl ml-4"
          >
            <MdFileCopy />
          </button>
          {showHistory && (
            <div className="absolute right-0 mt-2 bg-white text-black shadow-lg w-80 h-[30rem] rounded-md p-2">
              <h2 className="mb-4 text-lg bg-[#d0c8d6] rounded-lg flex justify-center items-center">
                تاریخچه
              </h2>
              <ul>
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
                  </li>
                ))}
              </ul>
              <button
                onClick={handleDeleteAll}
                className=" text-lg w-72 ml-2 bg-[#d0c8d6] rounded-lg bottom-0  absolute mb-4 flex justify-center items-center"
              >
                حذف تاریخچه
              </button>
            </div>
          )}
        </div>
      </div>
      {/* <div className="bg-[#f8f2fd] w-full h-full rounded-lg shadow-lg"> */}
      <div className="grid grid-cols-8 gap-4 w-full mt-4">
        <button
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-[#D3C9DA]  text-violet-950  text-xl"
          onClick={handleClear}
        >
          C
        </button>
        {/* <button
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-orange-400 text-white"
          // onClick={handleClear}
        >
          +/-
        </button> */}
        <button
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-[#D3C9DA]  text-violet-950  text-xl"
          onClick={handleDelete}
        >
          DEL
        </button>
        <button
          key="%"
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-[#D3C9DA]  text-violet-950 text-xl"
          onClick={() => handleButtonClick("%")}
        >
          %
        </button>
        <button
          key="/"
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-purple-700 text-white text-xl"
          onClick={() => handleButtonClick("/")}
        >
          /
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick("mod")}
        >
          mod
        </button>

        <button
          key="("
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick("(")}
        >
          {"("}
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "asin(" : "sin(")}
        >
          {inverse ? "asin" : "sin"}
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "³" : "²")}
        >
          {inverse ? "x³" : "x²"}
        </button>

        {["7", "8", "9"].map((value) => (
          <button
            key={value}
            className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900  text-xl"
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </button>
        ))}
        <button
          key="*"
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-purple-700 text-white  text-xl"
          onClick={() => handleButtonClick("*")}
        >
          *
        </button>
        <button
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick("^")}
        >
          ^
        </button>
        <button
          key=")"
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(")")}
        >
          {")"}
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "atan(" : "tan(")}
        >
          {inverse ? "atan" : "tan"}
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "tan⁻¹" : "1/")}
        >
          {inverse ? "tan⁻¹" : "1/X"}
          {}
        </button>

        {["4", "5", "6"].map((value) => (
          <button
            key={value}
            className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900  text-xl"
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </button>
        ))}
        <button
          key="-"
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-purple-700 text-white text-xl"
          onClick={() => handleButtonClick("-")}
        >
          -
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "ln(" : "log(")}
        >
          {inverse ? "ln" : "log"}
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "e" : "π")}
        >
          {inverse ? "e" : "π"}
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "acos(" : "cos(")}
        >
          {inverse ? "acos" : "cos"}
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "sin⁻¹(" : "cos⁻¹(")}
        >
          {inverse ? "sin⁻¹" : "cos⁻¹"}
        </button>
        {["1", "2", "3"].map((value) => (
          <button
            key={value}
            className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900 text-xl"
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </button>
        ))}
        <button
          key="+"
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-purple-700 text-white  text-xl"
          onClick={() => handleButtonClick("+")}
        >
          +
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick("|")}
        >
          |x|
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "∛(" : "√(")}
        >
          {inverse ? "∛" : "√"}
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "acosh(" : "cosh(")}
        >
          {inverse ? "acosh" : "cosh"}
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "atanh(" : "tanh(")}
        >
          {inverse ? "atanh" : "tanh"}
        </button>
        <button
          key="0"
          className="col-span-2 p-6 text-start rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick("0")}
        >
          0
        </button>
        <button
          key="."
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(".")}
        >
          .
        </button>
        <button
          className="p-4 rounded-full shadow-lg w-20 h-20 bg-purple-700 text-white text-xl"
          onClick={handleEvaluate}
        >
          =
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick("!")}
        >
          x!
        </button>
        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900 text-xl"
          onClick={() => handleButtonClick(inverse ? "+" : "-")}
        >
          {inverse ? "+" : "-/+"}
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={() => handleButtonClick(inverse ? "asinh(" : "sinh(")}
        >
          {inverse ? "asinh" : "sinh"}
        </button>

        <button
          className="p-4 rounded-full shadow-lg bg-violet-100	 text-violet-900  text-xl"
          onClick={toggleInverse}
        >
          inv
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Calculator;
