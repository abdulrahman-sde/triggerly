export const extractSpreadsheetId = (input: string): string => {
  console.log("Extracting spreadsheet ID from input:", input);
  const urlMatch = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  console.log("URL match result:", urlMatch);
  if (urlMatch) return urlMatch[1];
  return input.trim();
};
