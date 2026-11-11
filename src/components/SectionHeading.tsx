interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light }: SectionHeadingProps) => (
  <div className="mb-12 text-center md:mb-16">
    <div className="mx-auto mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-primary md:w-12" />
      <span className="font-heading text-sm font-medium uppercase tracking-[0.3em] text-primary">
        ॐ
      </span>
      <span className="h-px w-8 bg-primary md:w-12" />
    </div>
    <h2
      className={`font-display text-3xl font-bold md:text-4xl lg:text-5xl ${
        light ? "text-primary-foreground" : "text-foreground"
      }`}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        className={`mx-auto mt-4 max-w-2xl font-heading text-lg md:text-xl ${
          light ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeading;
