interface Env {
  ZEFFY_API_KEY?: string;
}

type Campaign = {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  slug?: string;
  url?: string;
  campaign_url?: string;
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  starts_at?: string;
  ends_at?: string;
  image_url?: string;
  cover_image_url?: string;
  location?: string | { name?: string; address?: string };
};

const apiBase = 'https://api.zeffy.com/api/v1';
const christieCupUrl = 'https://www.zeffy.com/en-GB/donation-form/christie-cup-donations';
const christieCupImage = '/christie-cup.png';
const eventLogo = 'https://raw.githubusercontent.com/DanOrm94/ManchesterSelect/main/logo.png';

const manualEvents: Campaign[] = [
  {
    id: 'christie-cup-manual',
    title: 'Christie Cup',
    description: 'Cricket T20 match supporting The Christie Charity. Family fun day with live DJ, bouncy castle and artisan stalls.',
    url: christieCupUrl,
    type: 'event',
    start_date: '2026-09-13T11:00:00+01:00',
    location: 'Staley Cricket Club, SK15 3JJ',
    cover_image_url: christieCupImage,
  },
  {
    id: 'khusanov-shirt-manual',
    title: 'Signed & Framed Khusanov Shirt with Certificate',
    description: 'Win a signed and framed Khusanov shirt, complete with certificate.',
    url: 'https://www.zeffy.com/en-GB/ticketing/signed-and-framed-khusanov-shirt-with-certificate',
    type: 'event',
    start_date: '2026-08-25T16:00:00+01:00',
    end_date: '2026-09-13T16:00:00+01:00',
    cover_image_url: eventLogo,
  },
  {
    id: 'england-sri-lanka-green-room-manual',
    title: 'England vs Sri Lanka ODI – Green Room x2',
    description: 'Opportunity to attend England vs Sri Lanka in the Green Room with two places.',
    url: 'https://www.zeffy.com/en-GB/ticketing/270926-england-vs-sri-lanka-odi-green-room-x2',
    type: 'event',
    start_date: '2026-09-27T00:00:00+01:00',
    cover_image_url: eventLogo,
  },
];

const parseDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getEventDate = (campaign: Campaign) => campaign.start_date || campaign.starts_at || campaign.end_date || campaign.ends_at;

const getUrl = (campaign: Campaign) => campaign.url || campaign.campaign_url || (campaign.slug ? `https://www.zeffy.com/en-GB/ticketing/${campaign.slug}` : 'https://www.zeffy.com/en-GB/organizations/manchester-select');

const isLiveEvent = (campaign: Campaign, now: Date) => {
  const type = (campaign.type || '').toLowerCase();
  const start = parseDate(campaign.start_date || campaign.starts_at);
  const end = parseDate(campaign.end_date || campaign.ends_at);
  const isEventType = !type || type.includes('event') || type.includes('ticket');
  if (!isEventType) return false;
  if (end) return end >= now;
  return !start || start >= now;
};

const dedupeAndSort = (campaigns: Campaign[]) => {
  const seen = new Set<string>();
  return campaigns
    .filter((campaign) => {
      const key = campaign.id || campaign.url || campaign.campaign_url || campaign.slug || campaign.title || campaign.name || '';
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const aDate = parseDate(getEventDate(a))?.getTime() || Number.MAX_SAFE_INTEGER;
      const bDate = parseDate(getEventDate(b))?.getTime() || Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    });
};

const getZeffyEvents = async (apiKey: string): Promise<Campaign[]> => {
  const campaigns: Campaign[] = [];
  let cursor = '';

  for (let page = 0; page < 10; page += 1) {
    const url = new URL(`${apiBase}/campaigns`);
    if (cursor) url.searchParams.set('starting_after', cursor);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) throw new Error(`Zeffy API returned ${response.status}`);

    const payload = await response.json() as {
      data?: Campaign[];
      campaigns?: Campaign[];
      has_more?: boolean;
      next_cursor?: string;
    } | Campaign[];

    const batch = Array.isArray(payload) ? payload : payload.data || payload.campaigns || [];
    campaigns.push(...batch);

    if (Array.isArray(payload) || !payload.has_more || !payload.next_cursor) break;
    cursor = payload.next_cursor;
  }

  const now = new Date();
  return campaigns.filter((campaign) => isLiveEvent(campaign, now));
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const liveEvents = env.ZEFFY_API_KEY ? await getZeffyEvents(env.ZEFFY_API_KEY) : [];
    const events = dedupeAndSort([...liveEvents, ...manualEvents]);

    return new Response(JSON.stringify({ events, live: Boolean(env.ZEFFY_API_KEY) }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ events: dedupeAndSort(manualEvents), live: false }), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  }
};
