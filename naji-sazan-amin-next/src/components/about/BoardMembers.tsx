import { ResponsiveImage } from '@/components/shared/ResponsiveImage';

type BoardMember = {
  name: string;
  title: string;
  image: string;
};

// Right to left, as the row reads on the page: CEO / vice-chair, chairman
// (centre), board member.
const BOARD_MEMBERS: BoardMember[] = [
  {
    name: 'محمد منزوی',
    title: 'مدیرعامل و نائب رئیس هیئت مدیره',
    image: '/assets/team/ceo.webp',
  },
  {
    name: 'عادل سعادتی',
    title: 'رئیس هیئت مدیره',
    image: '/assets/team/adel-saadati.webp',
  },
  {
    name: 'محمد بنی مصطفی',
    title: 'عضو هیئت مدیره',
    image: '/assets/team/mohammad-bani-mostafa-portrait.webp',
  },
];

export function BoardMembers() {
  return (
    <div className="board-row">
      {BOARD_MEMBERS.map((member) => (
        <div key={member.name} className="board-row__node">
          <article className="editorial-leader-card">
            <div className="editorial-leader-photo">
              <ResponsiveImage
                src={member.image}
                alt={member.name}
                width={600}
                height={800}
                widths={[300, 600]}
                sizes="(max-width: 600px) 90vw, (max-width: 960px) 44vw, 300px"
              />
            </div>
            <div className="editorial-leader-info">
              <h3 className="editorial-leader-name">{member.name}</h3>
              <div className="editorial-leader-title">{member.title}</div>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
