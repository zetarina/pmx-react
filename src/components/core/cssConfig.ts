// cssConfig.ts

const cssConfig = {
  baseClasses: "px-4 pr-6 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed",
  errorClass: "text-red-500 text-sm",
  labelClass: "text-sm font-medium text-gray-700",
};

const countToColorClass: Record<number, string> = {
  1: "lightest-green",
  2: "light-green",
  3: "green",
  4: "dark-green",
  5: "darker-green",
  6: "darkest-green",
};

enum ButtonType {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset",
}

export { cssConfig, countToColorClass, ButtonType };
