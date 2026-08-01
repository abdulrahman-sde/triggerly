import { formatDistance } from "date-fns";

export const formatDate = (date: Date): string => {
  return formatDistance(date, new Date(), { addSuffix: true });
};
