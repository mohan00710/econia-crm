// export const convertToIst = (isoDate: string): string => {
//     // Parse the input ISO 8601 string to a Date object
//     const date = new Date(isoDate);

//     // IST is UTC + 5:30
//     const IST_OFFSET = 5 * 60 + 30; // in minutes

//     // Get the UTC time in milliseconds since epoch
//     const utcTime = date.getTime();

//     // Convert the offset to milliseconds
//     const istOffsetInMilliseconds = IST_OFFSET * 60 * 1000;

//     // Calculate the IST time in milliseconds
//     const istTime = new Date(utcTime + istOffsetInMilliseconds);

//     // Manually extract and format the fractional seconds from the input string
//     const fractionalSeconds = isoDate.split('.')[1]?.slice(0, 6) || '000000';

//     // Format the date to the required string format
//     const istYear = istTime.getUTCFullYear();
//     const istMonth = (istTime.getUTCMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
//     const istDate = istTime.getUTCDate().toString().padStart(2, "0");
//     const istHours = istTime.getUTCHours().toString().padStart(2, "0");
//     const istMinutes = istTime.getUTCMinutes().toString().padStart(2, "0");
//     const istSeconds = istTime.getUTCSeconds().toString().padStart(2, "0");

//     // Construct the IST timestamp string with fractional seconds
//     const istTimestamp = `${istYear}-${istMonth}-${istDate}T${istHours}:${istMinutes}:${istSeconds}.${fractionalSeconds}+05:30`;

//     return istTimestamp;
// };

export function convertToIst(dateTimeString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const dateTimeUtc = new Date(dateTimeString);
  const dateTimeIst = dateTimeUtc.toLocaleString("en-IN", options);

  return dateTimeIst;
}
