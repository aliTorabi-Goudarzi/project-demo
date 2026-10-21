import Link from 'next/link';

type Member = {
  name: string;
  role: string;
  image: string;
  ceo?: boolean;
};

const TEAM_COLUMNS: Member[][] = [
  [
    { name: 'سعید رفیعی', role: 'مدیر نظارت', image: '/assets/team/lead-structure.jpg' },
    { name: 'حامد یزدان پناه', role: 'مدیر طرح و برنامه', image: '/assets/team/project-manager.jpg' },
  ],
  [
    { name: 'محمد منزوی', role: 'مدیر عامل', image: '/assets/team/ceo.jpg', ceo: true },
    { name: 'امیر ربیعی فر', role: 'مدیر آزمایشگاه', image: '/assets/team/lead-mep.jpg' },
    { name: 'وحید جمالی', role: 'مدیر امور قراردادها', image: '/assets/team/qa-qc.jpg' },
  ],
  [
    { name: 'احمد نادری', role: 'معاونت فنی و نظارت', image: '/assets/team/vp-engineering.jpg' },
    { name: 'مهدی نوری', role: 'مدیر مطالعات و طراحی', image: '/assets/team/head-design.jpg' },
  ],
];

export function Team() {
  return (
    <section className="section" id="team">
      <div className="container">
        <div className="teamshowcase">
          <div className="teamshowcase__intro reveal">
            <h2 className="h-2">سرمایه انسانی شرکت</h2>
            <p className="lead">
              تیمی از مهندسان مجرب که سال‌ها در کنار یکدیگر پروژه‌های بزرگ را به سرانجام رسانده‌اند؛ از طراحی و نظارت
              تا مدیریت طرح و کنترل کیفیت.
            </p>
            <Link className="btn btn--primary" href="/contact" prefetch={false}>
              درخواست مشاوره
            </Link>
          </div>

          <div className="teamshowcase__collage">
            {TEAM_COLUMNS.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="teamshowcase__col reveal"
                data-delay={columnIndex === 0 ? undefined : String(columnIndex)}
              >
                {column.map((member) => (
                  <article key={member.name} className={member.ceo ? 'tmember tmember--ceo' : 'tmember'}>
                    <div className="tmember__media">
                      <img
                        src={member.image}
                        alt={`${member.name} — ${member.role}`}
                        loading="lazy"
                        width={600}
                        height={800}
                      />
                      <div className="tmember__card">
                        <h3 className="tmember__name">{member.name}</h3>
                        <p className="tmember__role">{member.role}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
