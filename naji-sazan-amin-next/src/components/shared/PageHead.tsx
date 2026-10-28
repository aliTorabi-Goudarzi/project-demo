type PageHeadProps = {
  title: string;
  lead?: string;
  align?: 'start' | 'center';
};

export function PageHead({ title, lead, align = 'start' }: PageHeadProps) {
  return (
    <section className={align === 'center' ? 'page-head page-head--center' : 'page-head'}>
      <div className="container">
        <h1 className="page-head__title h-hero reveal">{title}</h1>
        {lead && (
          <p className="lead reveal" data-delay="1">
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
