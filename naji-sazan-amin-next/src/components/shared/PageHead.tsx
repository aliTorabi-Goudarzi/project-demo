import type { ReactNode } from 'react';

type PageHeadProps = {
  title: string;
  lead?: string;
  children?: ReactNode;
};

export function PageHead({ title, lead, children }: PageHeadProps) {
  return (
    <section className="page-head">
      <div className="container">
        <h1 className="page-head__title h-hero reveal">{title}</h1>
        {lead && (
          <p className="lead reveal" data-delay="1">
            {lead}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
