// Demo data for the MVP. Replace with a real database when going live.

export type ListingType = "rent" | "sale" | "land" | "shortlet";
export type Badge = "verified" | "documents" | "pending";

export type Agent = {
  id: string;
  name: string;
  company: string;
  email: string;
  ext: string; // extension on the U-properties phone line; the agent's own number stays hidden
  registered: boolean; // NIESV / ESVARBON member
  since: string;
};

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  area: string;
  address: string;
  price: number; // naira: per year (rent), per night (shortlet), total (sale, land)
  yearsUpfront?: number;
  beds?: number;
  baths?: number;
  plotSqm?: number;
  titleDoc?: string;
  fees: { agency?: number; legal?: number; caution?: number; service?: number };
  badge: Badge;
  docs: string[];
  agentId: string;
  description: string;
  features: string[];
  hue: number; // colour for the placeholder photo
};

// The registered U-properties line. Calls are routed to the agent by extension.
// shortcut: placeholder number, replace with the real line from the telephony provider.
export const PHONE_LINE = "+234 201 330 0000";
export const PHONE_LINE_TEL = "+2342013300000";

export const AREAS = [
  "Lekki Phase 1", "Ikoyi", "Victoria Island", "Ajah", "Yaba", "Surulere",
  "Ikeja GRA", "Magodo", "Gbagada", "Ibeju-Lekki", "Epe", "Festac",
];

export const AGENTS: Agent[] = [
  { id: "a1", name: "Adaeze Okafor", company: "Okafor Realty", email: "adaeze@okaforrealty.ng", ext: "1021", registered: true, since: "2026" },
  { id: "a2", name: "Tunde Bakare", company: "Bakare & Co Estate Surveyors", email: "tunde@bakareco.ng", ext: "1034", registered: true, since: "2026" },
  { id: "a3", name: "Mrs. Folake Adeyemi", company: "Private landlord", email: "folake.adeyemi@mail.ng", ext: "1047", registered: false, since: "2026" },
  { id: "a4", name: "Chinedu Eze", company: "Eze Homes", email: "chinedu@ezehomes.ng", ext: "1052", registered: false, since: "2026" },
];

const RENT_DOCS = ["Owner's letter of authority", "Owner's ID", "Utility bill"];
const SALE_DOCS = ["Certificate of Occupancy", "Registered survey plan", "Building approval", "Sale mandate"];
const LAND_DOCS = ["Governor's Consent", "Registered survey plan", "Excision / gazette", "Land registry search"];
const LET_DOCS = ["Owner's ID", "Proof of ownership"];

export const LISTINGS: Listing[] = [
  { id: "UP-1001", type: "rent", title: "2 bedroom flat with BQ", area: "Lekki Phase 1", address: "Off Admiralty Way, Lekki Phase 1", price: 6_500_000, yearsUpfront: 1, beds: 2, baths: 3, fees: { agency: 650_000, legal: 650_000, caution: 500_000, service: 1_200_000 }, badge: "verified", docs: RENT_DOCS, agentId: "a1", description: "Serviced 2 bedroom flat in a gated estate with 24-hour power, water treatment and security. All rooms en suite, fitted kitchen, BQ.", features: ["24h power", "Gated estate", "Fitted kitchen", "Parking for 2"], hue: 150 },
  { id: "UP-1002", type: "rent", title: "Mini flat (1 bedroom)", area: "Yaba", address: "Herbert Macaulay Way, Yaba", price: 1_800_000, yearsUpfront: 1, beds: 1, baths: 1, fees: { agency: 180_000, legal: 180_000, caution: 100_000 }, badge: "verified", docs: RENT_DOCS, agentId: "a4", description: "Newly renovated mini flat close to UNILAG and the tech hubs. Prepaid meter, borehole.", features: ["Prepaid meter", "Borehole", "Tiled floors"], hue: 200 },
  { id: "UP-1003", type: "rent", title: "3 bedroom terrace duplex", area: "Ikeja GRA", address: "Isaac John Street, Ikeja GRA", price: 9_000_000, yearsUpfront: 1, beds: 3, baths: 4, fees: { agency: 900_000, legal: 900_000, caution: 750_000, service: 1_500_000 }, badge: "documents", docs: RENT_DOCS, agentId: "a2", description: "Spacious terrace duplex with family lounge, study and private garden in a quiet GRA close.", features: ["Study", "Garden", "Security", "Inverter"], hue: 30 },
  { id: "UP-1004", type: "rent", title: "Self-contain", area: "Surulere", address: "Adeniran Ogunsanya, Surulere", price: 750_000, yearsUpfront: 1, beds: 1, baths: 1, fees: { agency: 75_000, legal: 75_000, caution: 50_000 }, badge: "verified", docs: RENT_DOCS, agentId: "a3", description: "Clean self-contain on the first floor, owner lives in the compound. No agent fee to pay beyond what is listed.", features: ["Owner on site", "Water", "Tiled"], hue: 270 },
  { id: "UP-1005", type: "rent", title: "4 bedroom detached house", area: "Ikoyi", address: "Bourdillon Road, Ikoyi", price: 45_000_000, yearsUpfront: 2, beds: 4, baths: 5, fees: { agency: 4_500_000, legal: 4_500_000, caution: 3_000_000, service: 5_000_000 }, badge: "verified", docs: RENT_DOCS, agentId: "a1", description: "Luxury detached home with pool, gym access and staff quarters. Two years upfront.", features: ["Pool", "Gym", "Staff quarters", "24h power"], hue: 180 },
  { id: "UP-1006", type: "rent", title: "2 bedroom flat", area: "Gbagada", address: "Gbagada Phase 2", price: 3_200_000, yearsUpfront: 1, beds: 2, baths: 2, fees: { agency: 320_000, legal: 320_000, caution: 200_000 }, badge: "documents", docs: RENT_DOCS, agentId: "a4", description: "Good-sized 2 bedroom flat with easy access to the Third Mainland Bridge.", features: ["Parking", "Borehole", "POP ceilings"], hue: 90 },
  { id: "UP-2001", type: "sale", title: "4 bedroom semi-detached duplex", area: "Ajah", address: "Abraham Adesanya Estate, Ajah", price: 120_000_000, beds: 4, baths: 5, titleDoc: "Governor's Consent", fees: { agency: 6_000_000, legal: 6_000_000 }, badge: "verified", docs: SALE_DOCS, agentId: "a2", description: "Newly built semi-detached duplex with BQ in a fully built-up estate. Title checked by our partner lawyer.", features: ["BQ", "Fitted kitchen", "Estate security"], hue: 10 },
  { id: "UP-2002", type: "sale", title: "3 bedroom apartment", area: "Victoria Island", address: "Ahmadu Bello Way, Victoria Island", price: 210_000_000, beds: 3, baths: 4, titleDoc: "Certificate of Occupancy", fees: { agency: 10_500_000, legal: 10_500_000 }, badge: "documents", docs: SALE_DOCS, agentId: "a1", description: "High-rise apartment with ocean view, pool, gym and backup power.", features: ["Ocean view", "Pool", "Lift"], hue: 210 },
  { id: "UP-2003", type: "sale", title: "5 bedroom detached house", area: "Magodo", address: "Magodo GRA Phase 2", price: 350_000_000, beds: 5, baths: 6, titleDoc: "Certificate of Occupancy", fees: { agency: 17_500_000, legal: 17_500_000 }, badge: "pending", docs: SALE_DOCS, agentId: "a2", description: "Detached house on a 700 sqm plot with cinema room and large compound.", features: ["Cinema room", "700 sqm plot", "BQ"], hue: 330 },
  { id: "UP-3001", type: "land", title: "600 sqm residential plot", area: "Ibeju-Lekki", address: "Eleko Junction, Ibeju-Lekki", price: 18_000_000, plotSqm: 600, titleDoc: "Governor's Consent", fees: { agency: 900_000, legal: 900_000 }, badge: "verified", docs: LAND_DOCS, agentId: "a2", description: "Dry, fenced plot in a gazetted area. Surveyor charting confirmed it is free from government acquisition.", features: ["Gazetted", "Dry land", "Fenced"], hue: 60 },
  { id: "UP-3002", type: "land", title: "1,200 sqm commercial plot", area: "Epe", address: "Epe–Lekki Expressway", price: 25_000_000, plotSqm: 1200, titleDoc: "Excision", fees: { agency: 1_250_000, legal: 1_250_000 }, badge: "documents", docs: LAND_DOCS, agentId: "a4", description: "Road-facing plot suited to a filling station or warehouse. Documents checked; site visit booked.", features: ["Road-facing", "Excised"], hue: 45 },
  { id: "UP-3003", type: "land", title: "450 sqm plot", area: "Ajah", address: "Sangotedo, Ajah", price: 30_000_000, plotSqm: 450, titleDoc: "Certificate of Occupancy", fees: { agency: 1_500_000, legal: 1_500_000 }, badge: "verified", docs: LAND_DOCS, agentId: "a1", description: "Plot in an estate with good road network. Registry search done.", features: ["Estate", "Good road"], hue: 75 },
  { id: "UP-4001", type: "shortlet", title: "Studio short-let", area: "Lekki Phase 1", address: "Fola Osibo, Lekki Phase 1", price: 65_000, beds: 1, baths: 1, fees: { caution: 50_000 }, badge: "verified", docs: LET_DOCS, agentId: "a3", description: "Cosy studio with Wi-Fi, Netflix and 24-hour power. Minimum 2 nights.", features: ["Wi-Fi", "24h power", "Netflix"], hue: 300 },
  { id: "UP-4002", type: "shortlet", title: "3 bedroom penthouse short-let", area: "Victoria Island", address: "Eko Atlantic axis, Victoria Island", price: 250_000, beds: 3, baths: 3, fees: { caution: 200_000 }, badge: "documents", docs: LET_DOCS, agentId: "a1", description: "Penthouse with rooftop terrace and views of the Atlantic. Ideal for families and groups.", features: ["Rooftop", "Sea view", "Chef on request"], hue: 240 },
];

export const TYPE_LABEL: Record<ListingType, string> = {
  rent: "To rent", sale: "For sale", land: "Land", shortlet: "Short-let",
};

export const BADGE_LABEL: Record<Badge, string> = {
  verified: "Verified (inspected)",
  documents: "Documents checked",
  pending: "Checks in progress",
};

export const agentById = (id: string) => AGENTS.find((a) => a.id === id);
