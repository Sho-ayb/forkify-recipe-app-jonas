// This file contains utility functions needed in the app

// Helper function to return the whole and fractional part of the recipe quantities

export function decimalToFraction(decimal: number): string {
  if (Number.isInteger(decimal)) return decimal.toString();

  // Use destructuring to extract the whole and fractional part of decimal
  // Uses the modular operator % to return the remainder of the decimal

  const [wholePart, FractionalPart] = [Math.floor(decimal), decimal % 1];

  console.log("whole part:", wholePart, "fractional part: ", FractionalPart);

  switch (FractionalPart.toFixed(2)) {
    case "0.25":
      return wholePart > 0 ? `${wholePart} 1/4` : "1/4";
    case "0.33":
    case "0.34":
      return wholePart > 0 ? `${wholePart} 1/3` : "1/3";
    case "0.5":
    case "0.50":
      return wholePart > 0 ? `${wholePart} 1/2` : "1/2";
    case "0.75":
      return wholePart > 0 ? `${wholePart} 3/4` : "3/4";
    default:
      return decimal.toFixed(2);
  }
}
