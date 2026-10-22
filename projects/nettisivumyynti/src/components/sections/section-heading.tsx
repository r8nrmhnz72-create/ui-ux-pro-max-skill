interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium tracking-wide text-[var(--text-300)] uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-instrument-serif text-4xl leading-tight tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-[var(--text-300)] sm:text-lg">{description}</p>}
    </div>
  );
}
