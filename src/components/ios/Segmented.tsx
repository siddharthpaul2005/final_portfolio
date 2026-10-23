import { motion } from 'framer-motion';

// iOS segmented control with a sliding glass thumb.
type SegmentedProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  id: string;
};

const Segmented = <T extends string>({ options, value, onChange, id }: SegmentedProps<T>) => (
  <div className="lg-fill inline-flex max-w-full overflow-x-auto rounded-[12px] p-[3px] no-scrollbar">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className="relative whitespace-nowrap rounded-[9px] px-3.5 py-1.5 text-[13px] font-medium text-foreground"
      >
        {value === opt.value && (
          <motion.span
            layoutId={`seg-${id}`}
            transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            className="absolute inset-0 rounded-[9px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.12),0_1px_1px_rgba(0,0,0,0.04)] dark:bg-white/20"
          />
        )}
        <span className="relative">{opt.label}</span>
      </button>
    ))}
  </div>
);

export default Segmented;
