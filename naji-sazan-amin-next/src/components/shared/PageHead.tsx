type PageHeadProps = {
  title: string;
  lead?: string;
};

export function PageHead({ title, lead }: PageHeadProps) {
  return (
    <section className="page-head">
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
