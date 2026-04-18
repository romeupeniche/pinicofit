import { format, isSameYear } from "date-fns";
import { ptBR, enUS, es, type Locale } from "date-fns/locale";

const locales: { [key: string]: Locale } = {
  br: ptBR,
  en: enUS,
  es: es,
};

export const formatDynamicDate = (
  dateISO: string,
  currentLanguage: string = "br",
) => {
  if (!dateISO) return "--";
  const dateParts = dateISO.slice(0, 10).split("-");
  const date = new Date(
    Number(dateParts[0]),
    Number(dateParts[1]) - 1,
    Number(dateParts[2]),
  );

  const now = new Date();
  const locale = locales[currentLanguage] || enUS;

  const isBR = currentLanguage === "br";
  const isES = currentLanguage === "es";
  const sameYear = isSameYear(date, now);
  let formatStr = "";

  if (isBR || isES) {
    formatStr = sameYear ? "d 'de' MMMM" : "d 'de' MMMM, yyyy";
  } else {
    formatStr = sameYear ? "MMMM d" : "MMMM d, yyyy";
  }

  const formatted = format(date, formatStr, { locale });

  if (isBR || isES) {
    return formatted.replace(/de (\w)/, (match, p1) =>
      match.replace(p1, p1.toUpperCase()),
    );
  }

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};
