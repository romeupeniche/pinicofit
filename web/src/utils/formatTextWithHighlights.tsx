export const formatTextWithHighlights = (text: string, twTextColor: string = 'text-brand-accent', variant: ("mono" | "black") = "mono") => {
    const parts = text.split(/({.*?})/g);

    return parts.map((part, index) => {
        if (part.startsWith('{') && part.endsWith('}')) {
            const content = part.slice(1, -1);
            return (
                <span key={index} className={`${twTextColor} ${variant === "black" ? "font-black" : "font-bold font-mono"}`}>
                    {content}
                </span>
            );
        }
        return part;
    });
};