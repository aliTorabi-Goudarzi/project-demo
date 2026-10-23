import Link from 'next/link';

type CtaLink = {
  label: string;
  href: string;
};

type CtaPanelProps = {
  title: string;
  description: string;
  primary: CtaLink;
  secondary?: CtaLink;
};

export function CtaPanel({ title, description, primary, secondary }: CtaPanelProps) {
  return (
    <section className="section">
      <div className="cta reveal">
        <h2 className="h-2">{title}</h2>
        <p>{description}</p>
        <div className="cta__actions">
          <Link className="btn btn--on-deep btn--lg" href={primary.href}>
            {primary.label}
          </Link>
          {secondary && (
            <Link className="btn btn--ghost-deep btn--lg" href={secondary.href}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
