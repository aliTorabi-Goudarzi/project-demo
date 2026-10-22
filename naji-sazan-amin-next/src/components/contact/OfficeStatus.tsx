'use client';

import { useEffect, useState } from 'react';

const FALLBACK_TEXT = 'هم‌اکنون دفتر باز است • ۸:۰۰ تا ۱۷:۰۰';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WORK_DAYS = [0, 1, 2, 3, 6];
const OPENING_MINUTES = 8 * 60;
const CLOSING_MINUTES = 17 * 60;

type OfficeStatus = {
  text: string;
  closed: boolean;
};

function getTehranClock(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tehran',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';

  const day = WEEKDAYS.indexOf(part('weekday'));
  const hour = Number(part('hour'));
  const minute = Number(part('minute'));

  return { day, minutes: hour * 60 + minute };
}

function getOfficeStatus(now: Date): OfficeStatus {
  const { day, minutes } = getTehranClock(now);
  const isWorkDay = WORK_DAYS.includes(day);

  if (isWorkDay && minutes >= OPENING_MINUTES && minutes < CLOSING_MINUTES) {
    return { text: 'هم‌اکنون دفتر باز است • پذیرش تا ۱۷:۰۰', closed: false };
  }

  if (isWorkDay && minutes < OPENING_MINUTES) {
    return { text: 'دفتر اکنون تعطیل است • آغاز کار: امروز ۸:۰۰', closed: true };
  }

  if (day === 3 || day === 4 || day === 5) {
    return { text: 'دفتر اکنون تعطیل است • آغاز کار: شنبه ۸:۰۰', closed: true };
  }

  return { text: 'دفتر اکنون تعطیل است • آغاز کار: فردا ۸:۰۰', closed: true };
}

export function OfficeStatus() {
  const [status, setStatus] = useState<OfficeStatus>({ text: FALLBACK_TEXT, closed: false });

  useEffect(() => {
    const update = () => setStatus(getOfficeStatus(new Date()));

    update();
    const timer = setInterval(update, 60_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="officeStatus" className={`office-status-pill${status.closed ? ' is-closed' : ''}`}>
      <span className="office-status-dot" />
      <span id="officeStatusText">{status.text}</span>
    </div>
  );
}
