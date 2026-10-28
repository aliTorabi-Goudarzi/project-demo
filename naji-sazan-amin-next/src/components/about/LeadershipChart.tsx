import { ResponsiveImage } from '@/components/shared/ResponsiveImage';

import { ChartConnectors } from './ChartConnectors';

type Leader = {
  name: string;
  image?: string;
  title: string;
  sub: string;
  ceo?: boolean;
};

const CEO: Leader = {
  name: 'محمد منزوی',
  image: '/assets/team/ceo.webp',
  title: 'مدیر عامل',
  sub: 'بنیان‌گذار و راهبر ارشد مجموعه',
  ceo: true,
};

const VP: Leader = {
  name: 'احمد نادری',
  image: '/assets/team/vp-engineering.webp',
  title: 'معاونت فنی و نظارت',
  sub: 'راهبری محاسبات سازه، زلزله و ژئوتکنیک',
};

const TECHNICAL_MANAGERS: Leader[] = [
  {
    name: 'مهدی نوری',
    image: '/assets/team/head-design.webp',
    title: 'مدیر مطالعات و طراحی',
    sub: 'مدیریت طراحی مفهومی، فاز یک و دو و BIM',
  },
  {
    name: 'سعید رفیعی',
    image: '/assets/team/lead-structure.webp',
    title: 'مدیر نظارت و امور کارگاهی',
    sub: 'هدایت کادر ناظران مقیم و پایش HSE کارگاه‌ها',
  },
  {
    name: 'امیر ربیعی فر',
    image: '/assets/team/lead-mep.webp',
    title: 'مدیر آزمایشگاه مقاومت مصالح',
    sub: 'مدیریت آزمون‌های کیفی بتن، خاک و مصالح',
  },
];

const STAFF_MANAGERS: Leader[] = [
  {
    name: 'حامد یزدان پناه',
    image: '/assets/team/project-manager.webp',
    title: 'مدیر طرح و برنامه',
    sub: 'کنترل پروژه، زمان‌بندی و برنامه‌ریزی اجرایی',
  },
  {
    name: 'کامیار بینا',
    title: 'مدیر مالی',
    sub: 'راهبری بودجه، گزارش‌های مالی و انضباط مالی',
  },
  {
    name: 'محمد رحیمی',
    title: 'مدیر اداری و پشتیبانی',
    sub: 'مدیریت منابع انسانی، امور اداری و پشتیبانی',
  },
  {
    name: 'وحید جمالی',
    image: '/assets/team/qa-qc.webp',
    title: 'مدیر امور قراردادها',
    sub: 'رسیدگی به امور حقوقی، قراردادها و اسناد مناقصه',
  },
];

function LeaderCard({ leader }: { leader: Leader }) {
  return (
    <div className="org-chart__node">
      <article
        className={
          leader.ceo ? 'editorial-leader-card editorial-leader-card--ceo' : 'editorial-leader-card'
        }
      >
        {leader.image ? (
          <div className="editorial-leader-photo">
            <ResponsiveImage
              src={leader.image}
              alt={leader.name}
              width={600}
              height={800}
              widths={[300, 600]}
              sizes="(max-width: 600px) 90vw, (max-width: 960px) 44vw, 280px"
            />
          </div>
        ) : (
          <div className="editorial-leader-photo editorial-leader-photo--placeholder" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" />
            </svg>
          </div>
        )}
        <div className="editorial-leader-info">
          <h3 className="editorial-leader-name">{leader.name}</h3>
          <div className="editorial-leader-title">{leader.title}</div>
          <p className="editorial-leader-sub">{leader.sub}</p>
        </div>
      </article>
    </div>
  );
}

export function LeadershipChart() {
  return (
    <div className="org-chart">
      <ChartConnectors />

      <div
        className="org-chart__row org-chart__row--single org-chart__row--ceo reveal"
        data-tier="ceo"
      >
        <LeaderCard leader={CEO} />
      </div>

      <div
        className="org-chart__row org-chart__row--single reveal"
        data-tier="vp"
        data-delay="1"
      >
        <LeaderCard leader={VP} />
      </div>

      <div
        className="org-chart__row org-chart__row--branched org-chart__row--managers reveal"
        data-tier="managers"
        data-delay="2"
      >
        {TECHNICAL_MANAGERS.map((leader) => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </div>

      <div
        className="org-chart__row org-chart__row--branched org-chart__row--staff reveal"
        data-tier="staff"
        data-delay="3"
      >
        {STAFF_MANAGERS.map((leader) => (
          <LeaderCard key={leader.name} leader={leader} />
        ))}
      </div>
    </div>
  );
}
