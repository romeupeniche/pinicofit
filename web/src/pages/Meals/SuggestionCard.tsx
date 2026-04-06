interface SuggestionCardProps {
  title: string;
  desc: string;
  kcal: number;
  icon: React.ReactNode;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title,
  desc,
  kcal,
  icon,
}) => {
  return (
    <div className="min-w-65 bg-neutral-900 border border-white/5 rounded-4xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="bg-brand-accent/10 p-3 rounded-2xl text-brand-accent">
          {icon}
        </div>
        <div className="bg-brand-accent/20 p-3 flex justify-center items-center rounded-full">
          <span className="text-brand-accent text-[10px] font-black">
            {kcal} KCAL
          </span>
        </div>
      </div>
      <h3 className="font-bold text-lg text-white mb-1">{title}</h3>
      <p className="text-neutral-500 text-xs mb-4 line-clamp-1">{desc}</p>
      <button
        type="button"
        className="w-full cursor-pointer text-white bg-neutral-800 hover:bg-brand-accent hover:text-black py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
      >
        Quick Add +
      </button>
    </div>
  );
};

export default SuggestionCard;
