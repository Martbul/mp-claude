import { eventTypeColors } from "~/app/_constants/constants";


export function formatDate(date: Date) {
	return date.toISOString().split("T")[0]
}


export const getEventTypeColor = (type: string): string => {
	return type in eventTypeColors
		? eventTypeColors[type as keyof typeof eventTypeColors]
		: eventTypeColors.other;
};

export function formatDisplayDate(date: Date) {
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	})
}


