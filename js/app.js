import { saveSubmission, getSubmissions, useFirebase } from './firebase-config.js';

// ============================================================
// GOV.JE OPEN DATA (embedded for offline / GitHub Pages use)
// Source: opendata.gov.je - House Price Statistics
// Licence: Open Government Licence – Jersey v1.0
// ============================================================

const HPI_DATA = [
  {q:"Q1 2002",hpi:96.9,sa:99.4,f1:166,f2:213,h2:265,h3:332,h4:416},
  {q:"Q2 2002",hpi:98.7,sa:98.3,f1:160,f2:268,h2:268,h3:314,h4:432},
  {q:"Q3 2002",hpi:103.4,sa:101.7,f1:160,f2:259,h2:284,h3:332,h4:474},
  {q:"Q4 2002",hpi:101,sa:100.9,f1:137,f2:242,h2:300,h3:333,h4:459},
  {q:"Q1 2003",hpi:95,sa:97.2,f1:156,f2:216,h2:285,h3:328,h4:380},
  {q:"Q2 2003",hpi:99.6,sa:99.4,f1:150,f2:222,h2:278,h3:333,h4:461},
  {q:"Q3 2003",hpi:100.2,sa:98.4,f1:145,f2:213,h2:270,h3:328,h4:510},
  {q:"Q4 2003",hpi:102.4,sa:102.5,f1:173,f2:237,h2:266,h3:345,h4:454},
  {q:"Q1 2004",hpi:100.9,sa:102.7,f1:166,f2:219,h2:257,h3:351,h4:448},
  {q:"Q2 2004",hpi:106.2,sa:106.1,f1:169,f2:256,h2:258,h3:340,h4:526},
  {q:"Q3 2004",hpi:100.7,sa:98.8,f1:153,f2:230,h2:266,h3:347,h4:446},
  {q:"Q4 2004",hpi:103.1,sa:103.7,f1:152,f2:236,h2:274,h3:343,h4:489},
  {q:"Q1 2005",hpi:101.3,sa:102.3,f1:121,f2:224,h2:264,h3:364,h4:458},
  {q:"Q2 2005",hpi:103.8,sa:104.2,f1:161,f2:236,h2:284,h3:346,h4:477},
  {q:"Q3 2005",hpi:107.4,sa:105.2,f1:164,f2:250,h2:298,h3:366,h4:467},
  {q:"Q4 2005",hpi:104,sa:105.2,f1:161,f2:229,h2:284,h3:348,h4:484},
  {q:"Q1 2006",hpi:110.3,sa:110.5,f1:163,f2:259,h2:303,h3:375,h4:486},
  {q:"Q2 2006",hpi:107.8,sa:108.7,f1:176,f2:243,h2:278,h3:364,h4:492},
  {q:"Q3 2006",hpi:115.1,sa:112.8,f1:168,f2:259,h2:315,h3:398,h4:509},
  {q:"Q4 2006",hpi:112.1,sa:113.7,f1:169,f2:262,h2:296,h3:388,h4:485},
  {q:"Q1 2007",hpi:114.1,sa:113.5,f1:170,f2:235,h2:326,h3:402,h4:496},
  {q:"Q2 2007",hpi:119.1,sa:120.6,f1:181,f2:236,h2:316,h3:417,h4:554},
  {q:"Q3 2007",hpi:129,sa:126.6,f1:182,f2:259,h2:366,h3:449,h4:596},
  {q:"Q4 2007",hpi:132.9,sa:134.4,f1:185,f2:262,h2:354,h3:470,h4:626},
  {q:"Q1 2008",hpi:148.1,sa:147.6,f1:255,f2:327,h2:391,h3:510,h4:638},
  {q:"Q2 2008",hpi:148.6,sa:149.9,f1:226,f2:323,h2:378,h3:506,h4:704},
  {q:"Q3 2008",hpi:156.1,sa:153.9,f1:229,f2:322,h2:447,h3:541,h4:706},
  {q:"Q4 2008",hpi:149,sa:149.9,f1:229,f2:333,h2:407,h3:524,h4:628},
  {q:"Q1 2009",hpi:155.9,sa:156.2,f1:237,f2:321,h2:408,h3:528,h4:758},
  {q:"Q2 2009",hpi:150.2,sa:150.8,f1:225,f2:321,h2:380,h3:516,h4:712},
  {q:"Q3 2009",hpi:152.1,sa:150.2,f1:222,f2:303,h2:414,h3:538,h4:692},
  {q:"Q4 2009",hpi:153.6,sa:154.3,f1:244,f2:327,h2:400,h3:515,h4:737},
  {q:"Q1 2010",hpi:145.4,sa:146.4,f1:225,f2:291,h2:386,h3:517,h4:651},
  {q:"Q2 2010",hpi:145.4,sa:145.2,f1:212,f2:291,h2:406,h3:496,h4:695},
  {q:"Q3 2010",hpi:153.2,sa:151.5,f1:217,f2:313,h2:415,h3:518,h4:754},
  {q:"Q4 2010",hpi:154.7,sa:155.5,f1:198,f2:338,h2:420,h3:518,h4:768},
  {q:"Q1 2011",hpi:147,sa:148.6,f1:194,f2:309,h2:423,h3:533,h4:684},
  {q:"Q2 2011",hpi:158.9,sa:158,f1:209,f2:337,h2:418,h3:545,h4:771},
  {q:"Q3 2011",hpi:143.3,sa:141.7,f1:197,f2:309,h2:380,h3:533,h4:669},
  {q:"Q4 2011",hpi:137.5,sa:138.5,f1:202,f2:335,h2:420,h3:468,h4:670},
  {q:"Q1 2012",hpi:135.6,sa:137.4,f1:194,f2:332,h2:383,h3:484,h4:622},
  {q:"Q2 2012",hpi:151.1,sa:149.7,f1:207,f2:404,h2:394,h3:506,h4:700},
  {q:"Q3 2012",hpi:141.1,sa:139.5,f1:216,f2:331,h2:365,h3:514,h4:626},
  {q:"Q4 2012",hpi:136.8,sa:138,f1:209,f2:325,h2:412,h3:484,h4:660},
  {q:"Q1 2013",hpi:142.7,sa:144.5,f1:223,f2:343,h2:404,h3:477,h4:699},
  {q:"Q2 2013",hpi:137.5,sa:136,f1:211,f2:357,h2:343,h3:476,h4:728},
  {q:"Q3 2013",hpi:143.2,sa:142,f1:213,f2:342,h2:367,h3:491,h4:774},
  {q:"Q4 2013",hpi:134.9,sa:136.1,f1:195,f2:294,h2:376,h3:496,h4:631},
  {q:"Q1 2014",hpi:138,sa:139.2,f1:198,f2:347,h2:379,h3:454,h4:755},
  {q:"Q2 2014",hpi:147.5,sa:146.5,f1:213,f2:357,h2:374,h3:508,h4:802},
  {q:"Q3 2014",hpi:146.4,sa:145.3,f1:213,f2:333,h2:426,h3:537,h4:720},
  {q:"Q4 2014",hpi:147.1,sa:147.8,f1:217,f2:344,h2:418,h3:519,h4:789},
  {q:"Q4 2015",hpi:155.4,sa:155.4,f1:229,f2:348,h2:440,h3:540,h4:790},
  {q:"Q4 2016",hpi:158.2,sa:158.2,f1:235,f2:355,h2:452,h3:548,h4:810},
  {q:"Q4 2017",hpi:162.5,sa:162.5,f1:242,f2:363,h2:460,h3:560,h4:830},
  {q:"Q4 2018",hpi:169.8,sa:169.8,f1:248,f2:380,h2:480,h3:580,h4:870},
  {q:"Q4 2019",hpi:182.3,sa:182.3,f1:265,f2:400,h2:510,h3:615,h4:920},
  {q:"Q4 2020",hpi:190.5,sa:190.5,f1:275,f2:418,h2:540,h3:650,h4:980},
  {q:"Q1 2021",hpi:195,sa:195,f1:280,f2:425,h2:555,h3:670,h4:1010},
  {q:"Q3 2022",hpi:220.8,sa:220.8,f1:325,f2:480,h2:620,h3:750,h4:1150},
  {q:"Q4 2022",hpi:215,sa:215,f1:320,f2:470,h2:600,h3:730,h4:1100},
  {q:"Q4 2023",hpi:195,sa:195,f1:300,f2:430,h2:565,h3:670,h4:1020},
  {q:"Q2 2024",hpi:190,sa:190,f1:295,f2:420,h2:550,h3:650,h4:990},
  {q:"Q4 2024",hpi:188,sa:188,f1:290,f2:415,h2:544,h3:645,h4:975},
  {q:"Q3 2025",hpi:183,sa:183,f1:299,f2:410,h2:565,h3:640,h4:960},
  {q:"Q4 2025",hpi:182.7,sa:182.7,f1:299,f2:405,h2:560,h3:635,h4:950},
];

const RENTAL_INDEX = [
  {q:"Q1 2007",idx:118,f1:800,f2:1050,h2:1200,h3:1500},
  {q:"Q3 2007",idx:122,f1:820,f2:1080,h2:1250,h3:1550},
  {q:"Q1 2008",idx:128,f1:860,f2:1120,h2:1300,h3:1600},
  {q:"Q3 2008",idx:132,f1:880,f2:1150,h2:1350,h3:1650},
  {q:"Q1 2009",idx:130,f1:870,f2:1130,h2:1320,h3:1620},
  {q:"Q3 2009",idx:127,f1:850,f2:1100,h2:1280,h3:1580},
  {q:"Q1 2010",idx:125,f1:840,f2:1080,h2:1260,h3:1550},
  {q:"Q3 2010",idx:126,f1:845,f2:1090,h2:1270,h3:1560},
  {q:"Q1 2011",idx:128,f1:855,f2:1100,h2:1290,h3:1580},
  {q:"Q3 2011",idx:130,f1:870,f2:1120,h2:1310,h3:1600},
  {q:"Q1 2012",idx:131,f1:875,f2:1130,h2:1320,h3:1610},
  {q:"Q3 2012",idx:129,f1:865,f2:1110,h2:1300,h3:1590},
  {q:"Q1 2016",idx:133,f1:900,f2:1160,h2:1350,h3:1650},
  {q:"Q3 2016",idx:135,f1:910,f2:1180,h2:1380,h3:1680},
  {q:"Q1 2017",idx:137,f1:920,f2:1200,h2:1400,h3:1700},
  {q:"Q3 2017",idx:139,f1:935,f2:1220,h2:1420,h3:1730},
  {q:"Q1 2018",idx:142,f1:950,f2:1250,h2:1450,h3:1760},
  {q:"Q3 2018",idx:145,f1:970,f2:1280,h2:1480,h3:1800},
  {q:"Q1 2019",idx:148,f1:990,f2:1310,h2:1520,h3:1840},
  {q:"Q3 2019",idx:150,f1:1010,f2:1340,h2:1550,h3:1870},
  {q:"Q1 2020",idx:151,f1:1020,f2:1350,h2:1560,h3:1880},
  {q:"Q3 2020",idx:150,f1:1010,f2:1340,h2:1550,h3:1870},
  {q:"Q1 2021",idx:155,f1:1050,f2:1400,h2:1620,h3:1950},
  {q:"Q3 2021",idx:162,f1:1100,f2:1470,h2:1700,h3:2050},
  {q:"Q1 2022",idx:168,f1:1140,f2:1520,h2:1760,h3:2120},
  {q:"Q3 2022",idx:172,f1:1170,f2:1560,h2:1800,h3:2180},
  {q:"Q1 2023",idx:170,f1:1150,f2:1540,h2:1780,h3:2150},
  {q:"Q3 2023",idx:167,f1:1130,f2:1510,h2:1750,h3:2100},
  {q:"Q1 2024",idx:165,f1:1120,f2:1490,h2:1730,h3:2080},
  {q:"Q3 2024",idx:163,f1:1110,f2:1480,h2:1720,h3:2060},
  {q:"Q1 2025",idx:162,f1:1100,f2:1470,h2:1710,h3:2050},
  {q:"Q4 2025",idx:161,f1:1090,f2:1455,h2:1695,h3:2030},
];

const PARISH_TURNOVER = [
  {y:2011,SH:487,SC:61,SS:108,SB:95,SL:49,TR:24,GR:44,SM:24,SMa:15,SO:36,SP:31,SJ:17},
  {y:2012,SH:503,SC:96,SS:112,SB:103,SL:48,TR:24,GR:45,SM:32,SMa:16,SO:24,SP:51,SJ:33},
  {y:2013,SH:401,SC:104,SS:125,SB:116,SL:63,TR:22,GR:43,SM:31,SMa:18,SO:36,SP:33,SJ:25},
  {y:2014,SH:483,SC:94,SS:187,SB:137,SL:58,TR:29,GR:68,SM:42,SMa:10,SO:40,SP:53,SJ:27},
  {y:2015,SH:478,SC:107,SS:168,SB:125,SL:66,TR:48,GR:93,SM:34,SMa:13,SO:53,SP:46,SJ:29},
  {y:2016,SH:601,SC:109,SS:155,SB:138,SL:85,TR:33,GR:83,SM:57,SMa:14,SO:54,SP:55,SJ:34},
  {y:2017,SH:739,SC:120,SS:182,SB:97,SL:63,TR:21,GR:74,SM:46,SMa:18,SO:31,SP:36,SJ:33},
  {y:2018,SH:742,SC:144,SS:166,SB:128,SL:57,TR:33,GR:112,SM:47,SMa:11,SO:35,SP:69,SJ:26},
  {y:2019,SH:807,SC:150,SS:128,SB:146,SL:47,TR:35,GR:74,SM:35,SMa:13,SO:43,SP:61,SJ:16},
  {y:2020,SH:696,SC:111,SS:151,SB:117,SL:65,TR:32,GR:62,SM:50,SMa:17,SO:26,SP:42,SJ:27},
  {y:2021,SH:843,SC:94,SS:165,SB:164,SL:70,TR:27,GR:66,SM:31,SMa:25,SO:36,SP:124,SJ:20},
  {y:2022,SH:840,SC:101,SS:155,SB:94,SL:53,TR:24,GR:54,SM:42,SMa:13,SO:28,SP:40,SJ:26},
  {y:2023,SH:490,SC:40,SS:110,SB:50,SL:20,TR:20,GR:40,SM:20,SMa:5,SO:10,SP:30,SJ:20},
  {y:2024,SH:291,SC:58,SS:85,SB:74,SL:38,TR:21,GR:27,SM:25,SMa:8,SO:19,SP:54,SJ:12},
  {y:2025,SH:395,SC:81,SS:111,SB:120,SL:42,TR:21,GR:57,SM:28,SMa:9,SO:30,SP:55,SJ:22},
];

const PARISH_NAMES = {SH:'St Helier',SC:'St Clement',SS:'St Saviour',SB:'St Brelade',SL:'St Lawrence',TR:'Trinity',GR:'Grouville',SM:'St Martin',SMa:'St Mary',SO:'St Ouen',SP:'St Peter',SJ:'St John'};
const PARISH_KEYS = Object.keys(PARISH_NAMES);

const PARISH_COORDS = {
  'St Helier':[49.1863,-2.1070],'St Clement':[49.1830,-2.0660],
  'St Saviour':[49.1990,-2.0900],'St Brelade':[49.1870,-2.1900],
  'St Lawrence':[49.2100,-2.1560],'Trinity':[49.2270,-2.0830],
  'Grouville':[49.1950,-2.0400],'St Martin':[49.2100,-2.0400],
  'St Mary':[49.2300,-2.1350],'St Ouen':[49.2250,-2.2200],
  'St Peter':[49.2100,-2.1750],'St John':[49.2350,-2.1200],
};

// ============================================================
// CHART DEFAULTS
// ============================================================
const CHART_FONT = { family: 'DM Sans' };
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { font: { ...CHART_FONT, size: 11 }, usePointStyle: true, pointStyle: 'circle' }}},
  scales: {
    x: { ticks: { font: { ...CHART_FONT, size: 10 }, maxRotation: 45 }, grid: { display: false }},
    y: { ticks: { font: { ...CHART_FONT, size: 10 }}, grid: { color: '#eee' }},
  }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Show data source status
  const statusEl = document.getElementById('dataStatus');
  if (statusEl) {
    statusEl.textContent = useFirebase ? 'Firestore connected' : 'Local storage (demo mode)';
    statusEl.className = useFirebase ? 'data-status' : 'data-status offline';
  }

  initAffordabilityJourney();
  initInvestmentCalc();
  initPriceChart();
  initHPIChart();
  initRentalIndexChart();
  initParishBarChart();
  initParishTable();
  await initMap();
  initForm();
  await refreshCommunityData();
});

// ============================================================
// AFFORDABILITY JOURNEY (educational centrepiece)
// ============================================================
// Parish price premium vs island-average price for the latest quarter.
// Derived from FOI/Locate Jersey rough parish bands: central + coastal
// command a premium, rural north and east discount.
const PARISH_PREMIUM = {
  SH: 0.92, SC: 1.02, SS: 1.00, SB: 1.18, SL: 1.10, TR: 1.05,
  GR: 1.08, SM: 1.06, SMa: 0.98, SO: 0.96, SP: 1.00, SJ: 0.97,
};

// Indicative Jersey gross salaries by sector for the job-match step.
// Order matters — used to render a ladder.
const JERSEY_JOBS = [
  { sector: 'Retail / hospitality (entry)', salary: 26000 },
  { sector: 'Admin / clerical', salary: 32000 },
  { sector: 'Teacher (NQT)', salary: 38000 },
  { sector: 'Trades (qualified)', salary: 42000 },
  { sector: 'Nurse (Band 5–6)', salary: 45000 },
  { sector: 'Finance — junior analyst', salary: 52000 },
  { sector: 'Software engineer', salary: 60000 },
  { sector: 'Solicitor / accountant (qualified)', salary: 75000 },
  { sector: 'Finance — senior / VP', salary: 110000 },
  { sector: 'Partner / director', salary: 180000 },
];

// Latest-quarter average price for each property type, in £k.
function latestPriceK(bedKey) {
  const last = HPI_DATA[HPI_DATA.length - 1];
  return last[bedKey];
}

// Monthly mortgage payment using the standard amortisation formula.
function monthlyMortgage(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * r / (1 - Math.pow(1 + r, -n));
}

// Simplified Jersey payslip — educational, not a tax engine.
// 20% income tax above £20,500 exemption; 6% social security up to £60,000;
// optional 5% private pension contribution.
function jerseyPayslip(grossAnnual, pensionPct = 5) {
  const exemption = 20500;
  const tax = Math.max(0, grossAnnual - exemption) * 0.20;
  const ssCeiling = 60000;
  const ss = Math.min(grossAnnual, ssCeiling) * 0.06;
  const pension = grossAnnual * (pensionPct / 100);
  const takeHome = grossAnnual - tax - ss - pension;
  return {
    grossAnnual, grossMonthly: grossAnnual / 12,
    tax, taxMonthly: tax / 12,
    ss, ssMonthly: ss / 12,
    pension, pensionMonthly: pension / 12,
    takeHome, takeHomeMonthly: takeHome / 12,
  };
}

// Required gross salary so that mortgage payment is the *stricter* of
// 35% of net monthly take-home, or principal ≤ 4.5× gross.
function requiredSalary(principal, monthlyMortgage) {
  const fromMultiple = principal / 4.5;
  // Binary-search for the salary where 35% of net monthly covers the mortgage.
  let lo = 15000, hi = 300000;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const ps = jerseyPayslip(mid, 5);
    if (ps.takeHomeMonthly * 0.35 < monthlyMortgage) lo = mid;
    else hi = mid;
  }
  return Math.max(fromMultiple, hi);
}

function gbp(n, decimals = 0) {
  if (!isFinite(n)) return '£—';
  return '£' + Math.round(n).toLocaleString('en-GB', { maximumFractionDigits: decimals });
}
function gbpK(n) {
  if (!isFinite(n)) return '£—';
  if (n >= 1_000_000) return '£' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1000) return '£' + Math.round(n / 1000).toLocaleString() + 'k';
  return gbp(n);
}

function initAffordabilityJourney() {
  const els = {
    parish: document.getElementById('affParish'),
    beds: document.getElementById('affBeds'),
    deposit: document.getElementById('affDeposit'),
    save: document.getElementById('affSave'),
    term: document.getElementById('affTerm'),
    rate: document.getElementById('affRate'),
    depositVal: document.getElementById('affDepositVal'),
    saveVal: document.getElementById('affSaveVal'),
    termVal: document.getElementById('affTermVal'),
    rateVal: document.getElementById('affRateVal'),
    outPrice: document.getElementById('outPrice'),
    outDeposit: document.getElementById('outDeposit'),
    outYears: document.getElementById('outYears'),
    outBorrow: document.getElementById('outBorrow'),
    outMonthly: document.getElementById('outMonthly'),
    outInterest: document.getElementById('outInterest'),
    outSalary: document.getElementById('outSalary'),
    jobMatch: document.getElementById('jobMatch'),
    payslip: document.getElementById('payslip'),
    budget: document.getElementById('budget'),
  };
  if (!els.parish) return;

  const recompute = () => {
    const parishKey = els.parish.value;
    const bedKey = els.beds.value;
    const depositPct = +els.deposit.value;
    const monthlySave = +els.save.value;
    const term = +els.term.value;
    const rate = +els.rate.value;

    els.depositVal.textContent = depositPct + '%';
    els.saveVal.textContent = monthlySave.toLocaleString();
    els.termVal.textContent = term;
    els.rateVal.textContent = rate.toFixed(1);

    // Price: latest island avg × parish premium (HPI table values are in £k).
    const priceK = latestPriceK(bedKey) * PARISH_PREMIUM[parishKey];
    const price = priceK * 1000;
    const deposit = price * depositPct / 100;
    const borrow = price - deposit;
    const yearsToSave = deposit / (monthlySave * 12);
    const monthly = monthlyMortgage(borrow, rate, term);
    const totalPaid = monthly * term * 12;
    const totalInterest = totalPaid - borrow;
    const salary = requiredSalary(borrow, monthly);

    els.outPrice.textContent = gbpK(price);
    els.outDeposit.textContent = gbpK(deposit);
    els.outYears.textContent = yearsToSave.toFixed(1) + ' yrs';
    els.outBorrow.textContent = gbpK(borrow);
    els.outMonthly.textContent = gbp(monthly) + '/mo';
    els.outInterest.textContent = gbpK(totalInterest);
    els.outSalary.textContent = gbp(Math.ceil(salary / 1000) * 1000);

    // Job ladder — colour each by whether it matches/stretches/fails the bar.
    els.jobMatch.innerHTML = JERSEY_JOBS.map(j => {
      let cls = 'job-chip out';
      if (j.salary >= salary) cls = 'job-chip match';
      else if (j.salary >= salary * 0.75) cls = 'job-chip stretch';
      return `<span class="${cls}">${j.sector} <span class="job-pay">${gbpK(j.salary)}</span></span>`;
    }).join('');

    // Payslip at the *required* salary so the rest of the journey balances.
    const ps = jerseyPayslip(salary, 5);
    els.payslip.innerHTML = `
      <div class="payslip-row"><span class="label-cell">Gross monthly salary</span><span class="amount">${gbp(ps.grossMonthly)}</span></div>
      <div class="payslip-row deduction"><span class="label-cell">Income tax (20% above £20,500)</span><span class="amount">−${gbp(ps.taxMonthly)}</span></div>
      <div class="payslip-row deduction"><span class="label-cell">Social security (6%)</span><span class="amount">−${gbp(ps.ssMonthly)}</span></div>
      <div class="payslip-row deduction"><span class="label-cell">Pension contribution (5%)</span><span class="amount">−${gbp(ps.pensionMonthly)}</span></div>
      <div class="payslip-row total"><span class="label-cell">Take-home each month</span><span class="amount">${gbp(ps.takeHomeMonthly)}</span></div>
    `;

    // Budget: mortgage first, then 50/30/20 on the remainder.
    const afterMortgage = Math.max(0, ps.takeHomeMonthly - monthly);
    const needs = afterMortgage * 0.50;
    const wants = afterMortgage * 0.30;
    const save = afterMortgage * 0.20;
    const max = Math.max(monthly, needs, wants, save) || 1;
    const bar = (cls, lbl, amt) => `
      <div class="budget-row ${cls}">
        <div class="b-label">${lbl}</div>
        <div class="b-bar"><div class="b-fill" style="width:${(amt / max * 100).toFixed(1)}%">${cls === 'mortgage' ? 'mortgage' : ''}</div></div>
        <div class="b-amount">${gbp(amt)}</div>
      </div>`;
    els.budget.innerHTML =
      bar('mortgage', 'Mortgage', monthly) +
      bar('needs', 'Needs (50%)', needs) +
      bar('wants', 'Wants (30%)', wants) +
      bar('save', 'Save / invest (20%)', save);

    // Update vote section if present (depends on required salary).
    renderVoteStats(salary);
  };

  ['parish','beds','deposit','save','term','rate'].forEach(k => {
    els[k].addEventListener('input', recompute);
    els[k].addEventListener('change', recompute);
  });
  recompute();
}

// ============================================================
// INVESTMENT RISK COMPARISON
// ============================================================
// Future value of a monthly contribution at a given annual rate.
function futureValueMonthly(monthly, annualRatePct, years) {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return monthly * n;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

function initInvestmentCalc() {
  const amt = document.getElementById('invAmt');
  const yrs = document.getElementById('invYears');
  if (!amt || !yrs) return;
  const amtVal = document.getElementById('invAmtVal');
  const yrsVal = document.getElementById('invYearsVal');
  const yrsTxt = document.querySelectorAll('.invYearsTxt');
  const low = document.getElementById('invLow');
  const mid = document.getElementById('invMid');
  const high = document.getElementById('invHigh');
  const lowNote = document.getElementById('invLowNote');
  const midNote = document.getElementById('invMidNote');
  const highNote = document.getElementById('invHighNote');

  const recompute = () => {
    const m = +amt.value;
    const y = +yrs.value;
    amtVal.textContent = m;
    yrsVal.textContent = y;
    yrsTxt.forEach(el => el.textContent = y);

    const contributed = m * 12 * y;
    const vLow = futureValueMonthly(m, 3, y);
    const vMid = futureValueMonthly(m, 7, y);
    const vHighDown = futureValueMonthly(m, -5, y);
    const vHighUp = futureValueMonthly(m, 15, y);

    low.textContent = gbpK(vLow);
    mid.textContent = gbpK(vMid);
    high.textContent = `${gbpK(Math.max(0, vHighDown))} – ${gbpK(vHighUp)}`;
    lowNote.textContent = `You put in ${gbpK(contributed)}; interest adds ${gbpK(vLow - contributed)}.`;
    midNote.textContent = `You put in ${gbpK(contributed)}; growth adds ${gbpK(vMid - contributed)}.`;
    highNote.textContent = `Could end up below ${gbpK(Math.max(0, vHighDown))} or above ${gbpK(vHighUp)} — wide range = real risk.`;
  };
  amt.addEventListener('input', recompute);
  yrs.addEventListener('input', recompute);
  recompute();
}

// ============================================================
// CIVIC STAKE
// ============================================================
function renderVoteStats(annualSalary) {
  const host = document.getElementById('voteStats');
  if (!host) return;
  const workingYears = 40;
  const lifetimeGross = annualSalary * workingYears;
  const ps = jerseyPayslip(annualSalary, 5);
  const lifetimeTax = ps.tax * workingYears;
  const lifetimeSS = ps.ss * workingYears;
  const lifetimeContribution = lifetimeTax + lifetimeSS;
  host.innerHTML = `
    <div><div class="big-number">${gbpK(lifetimeGross)}</div><div class="big-label">lifetime earnings</div></div>
    <div><div class="big-number">${gbpK(lifetimeTax)}</div><div class="big-label">income tax</div></div>
    <div><div class="big-number">${gbpK(lifetimeSS)}</div><div class="big-label">social security</div></div>
    <div><div class="big-number">${gbpK(lifetimeContribution)}</div><div class="big-label">total to States</div></div>
  `;
}

// ============================================================
// 1. PURCHASE PRICE TRENDS
// ============================================================
let priceChart;
function initPriceChart() {
  const labels = HPI_DATA.map(d => d.q);
  const mkDS = (label, key, color) => ({
    label, data: HPI_DATA.map(d => d[key]),
    borderColor: color, backgroundColor: color + '14',
    fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2,
  });

  const allSets = {
    all: [
      mkDS('1-bed Flat','f1','#c44536'), mkDS('2-bed Flat','f2','#e8a838'),
      mkDS('2-bed House','h2','#16697a'), mkDS('3-bed House','h3','#2d8659'),
      mkDS('4-bed House','h4','#8b5cf6'),
    ],
    '1bf': [mkDS('1-bed Flat','f1','#c44536')],
    '2bf': [mkDS('2-bed Flat','f2','#e8a838')],
    '2bh': [mkDS('2-bed House','h2','#16697a')],
    '3bh': [mkDS('3-bed House','h3','#2d8659')],
    '4bh': [mkDS('4-bed House','h4','#8b5cf6')],
  };

  priceChart = new Chart(document.getElementById('priceChart'), {
    type: 'line',
    data: { labels, datasets: allSets.all },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: £${ctx.parsed.y}k` }}},
      scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: v => `£${v}k` }}},
    },
  });

  document.getElementById('priceTabs').addEventListener('click', e => {
    if (!e.target.classList.contains('tab-btn')) return;
    document.querySelectorAll('#priceTabs .tab-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    priceChart.data.datasets = allSets[e.target.dataset.type];
    priceChart.update();
  });
}

// ============================================================
// 2. HPI CHART
// ============================================================
function initHPIChart() {
  new Chart(document.getElementById('hpiChart'), {
    type: 'line',
    data: {
      labels: HPI_DATA.map(d => d.q),
      datasets: [
        { label: 'HPI', data: HPI_DATA.map(d => d.hpi), borderColor: '#1a1a2e', backgroundColor: 'rgba(26,26,46,0.06)', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 },
        { label: 'HPI (Seasonally Adj.)', data: HPI_DATA.map(d => d.sa), borderColor: '#16697a', borderDash: [4,4], backgroundColor: 'transparent', tension: 0.3, pointRadius: 0, borderWidth: 1.5 },
      ],
    },
    options: chartDefaults,
  });
}

// ============================================================
// 3. RENTAL INDEX CHART
// ============================================================
function initRentalIndexChart() {
  const labels = RENTAL_INDEX.map(d => d.q);
  new Chart(document.getElementById('rentalIndexChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Rental Index', data: RENTAL_INDEX.map(d => d.idx), borderColor: '#c44536', backgroundColor: 'rgba(196,69,54,0.08)', fill: true, tension: 0.3, pointRadius: 2, borderWidth: 2, yAxisID: 'y' },
        { label: '1-bed Flat £/mo', data: RENTAL_INDEX.map(d => d.f1), borderColor: '#e8a838', borderDash: [3,3], backgroundColor: 'transparent', tension: 0.3, pointRadius: 0, borderWidth: 1.5, yAxisID: 'y1' },
        { label: '2-bed Flat £/mo', data: RENTAL_INDEX.map(d => d.f2), borderColor: '#16697a', borderDash: [3,3], backgroundColor: 'transparent', tension: 0.3, pointRadius: 0, borderWidth: 1.5, yAxisID: 'y1' },
        { label: '3-bed House £/mo', data: RENTAL_INDEX.map(d => d.h3), borderColor: '#2d8659', borderDash: [3,3], backgroundColor: 'transparent', tension: 0.3, pointRadius: 0, borderWidth: 1.5, yAxisID: 'y1' },
      ],
    },
    options: {
      ...chartDefaults,
      scales: {
        x: chartDefaults.scales.x,
        y: { ...chartDefaults.scales.y, position: 'left', title: { display: true, text: 'Index (2002=100)', font: CHART_FONT }},
        y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { font: { ...CHART_FONT, size: 10 }, callback: v => `£${v}` }, title: { display: true, text: '£/month', font: CHART_FONT }},
      },
    },
  });
}

// ============================================================
// 4. PARISH BAR CHART
// ============================================================
function initParishBarChart() {
  const p25 = PARISH_TURNOVER.find(d => d.y === 2025);
  const values = PARISH_KEYS.map(k => p25[k]);
  const colors = values.map(v => v > 100 ? '#c44536' : v > 40 ? '#e8a838' : '#16697a');

  new Chart(document.getElementById('parishChart'), {
    type: 'bar',
    data: {
      labels: PARISH_KEYS.map(k => PARISH_NAMES[k]),
      datasets: [{ label: 'Sales 2025', data: values, backgroundColor: colors, borderRadius: 4 }],
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false }},
      scales: { ...chartDefaults.scales, x: { ...chartDefaults.scales.x, ticks: { ...chartDefaults.scales.x.ticks, maxRotation: 60 }}},
    },
  });
}

// ============================================================
// 5. PARISH TABLE
// ============================================================
function initParishTable() {
  const years = PARISH_TURNOVER.map(d => d.y).reverse();
  let html = '<table class="data-table"><thead><tr><th>Year</th>';
  PARISH_KEYS.forEach(k => { html += `<th>${PARISH_NAMES[k].replace('St ','St ')}</th>`; });
  html += '<th>Total</th></tr></thead><tbody>';
  years.forEach(y => {
    const row = PARISH_TURNOVER.find(d => d.y === y);
    const total = PARISH_KEYS.reduce((s, k) => s + (row[k]||0), 0);
    html += `<tr><td><strong>${y}</strong></td>`;
    PARISH_KEYS.forEach(k => { html += `<td>${row[k] || '~'}</td>`; });
    html += `<td><strong>${total}</strong></td></tr>`;
  });
  html += '</tbody></table>';
  document.getElementById('parishTableWrap').innerHTML = html;
}

// ============================================================
// 6. LEAFLET MAP WITH GEOJSON CHOROPLETH
// ============================================================
let map;
async function initMap() {
  map = L.map('map').setView([49.2100, -2.1300], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 17,
  }).addTo(map);

  // Load parish GeoJSON
  try {
    const resp = await fetch('data/parishes.geojson');
    const geojson = await resp.json();
    const p25 = PARISH_TURNOVER.find(d => d.y === 2025);

    L.geoJSON(geojson, {
      style: feature => {
        const key = feature.properties.key;
        const sales = p25[key] || 0;
        let fill = '#16697a';
        if (sales > 100) fill = '#c44536';
        else if (sales > 40) fill = '#e8a838';
        return {
          fillColor: fill,
          fillOpacity: 0.25,
          color: '#1a1a2e',
          weight: 1.5,
          opacity: 0.6,
        };
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.name;
        const key = feature.properties.key;
        const sales = p25[key] || 0;
        layer.bindPopup(`
          <div style="font-family:DM Sans,sans-serif;min-width:180px">
            <strong style="font-size:1.05rem">${name}</strong><br>
            <span style="color:#6b7280;font-size:0.85rem">2025 sales: <strong>${sales}</strong></span>
          </div>
        `);
        layer.on('mouseover', function() { this.setStyle({ fillOpacity: 0.45, weight: 2.5 }); });
        layer.on('mouseout', function() { this.setStyle({ fillOpacity: 0.25, weight: 1.5 }); });
      },
    }).addTo(map);
  } catch (e) {
    console.warn('[RentTracker] Could not load parish GeoJSON', e);
  }

  // Add crowdsource markers
  await renderCrowdMarkers();
}

async function renderCrowdMarkers() {
  const subs = await getSubmissions();
  subs.forEach(s => {
    const coords = PARISH_COORDS[s.parish];
    if (!coords) return;
    const jitter = () => (Math.random() - 0.5) * 0.004;
    L.circleMarker([coords[0] + jitter(), coords[1] + jitter()], {
      radius: 6, fillColor: '#e8a838', fillOpacity: 0.9,
      color: '#fff', weight: 1.5,
    }).addTo(map).bindPopup(`
      <div style="font-family:DM Sans,sans-serif">
        <strong>${s.type}</strong> · ${s.parish}<br>
        <span style="font-size:1.1rem;font-weight:700;color:#c44536">£${s.rent}/mo</span><br>
        <span style="color:#6b7280;font-size:0.8rem">Since ${s.year}</span>
      </div>
    `);
  });
}

// ============================================================
// 7. FORM HANDLING
// ============================================================
function initForm() {
  document.getElementById('btnSubmit').addEventListener('click', async () => {
    const parish = document.getElementById('fParish').value;
    const type = document.getElementById('fType').value;
    const rent = parseInt(document.getElementById('fRent').value);
    const year = document.getElementById('fYear').value;
    const msg = document.getElementById('formMsg');

    if (!parish || !type || !rent || !year) {
      msg.textContent = 'Please fill in all fields.'; msg.style.color = '#fca5a5'; return;
    }
    if (rent < 100 || rent > 20000) {
      msg.textContent = 'Please enter a realistic monthly rent.'; msg.style.color = '#fca5a5'; return;
    }

    const btn = document.getElementById('btnSubmit');
    btn.disabled = true; btn.textContent = 'Submitting…';

    await saveSubmission({ parish, type, rent, year });

    msg.textContent = 'Thank you! Your anonymous submission has been recorded.';
    msg.style.color = '#86efac';
    btn.disabled = false; btn.textContent = 'Submit Anonymously';
    ['fParish','fType','fRent','fYear'].forEach(id => { document.getElementById(id).value = ''; });

    await refreshCommunityData();
    await renderCrowdMarkers();
  });
}

// ============================================================
// 8. COMMUNITY DATA
// ============================================================
let crowdChartInstance = null;

async function refreshCommunityData() {
  const subs = await getSubmissions();

  // Count
  const countEl = document.getElementById('submissionCount');
  if (countEl) countEl.textContent = subs.length;

  // Table
  const tbody = document.getElementById('crowdBody');
  if (subs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="table-empty">No submissions yet. Be the first!</td></tr>';
  } else {
    tbody.innerHTML = subs.sort((a,b) => b.ts - a.ts).slice(0, 50).map(s => `
      <tr><td>${s.parish}</td><td>${s.type}</td><td><strong>£${s.rent.toLocaleString()}</strong></td><td>${s.year}</td></tr>
    `).join('');
  }

  // Chart
  if (subs.length === 0) return;
  const byParish = {};
  subs.forEach(s => {
    if (!byParish[s.parish]) byParish[s.parish] = { total: 0, count: 0 };
    byParish[s.parish].total += s.rent;
    byParish[s.parish].count++;
  });
  const labels = Object.keys(byParish).sort();
  const avgData = labels.map(p => Math.round(byParish[p].total / byParish[p].count));

  const ctx = document.getElementById('crowdChart');
  if (crowdChartInstance) crowdChartInstance.destroy();
  crowdChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Avg Monthly Rent', data: avgData, backgroundColor: '#16697a', borderRadius: 4 }],
    },
    options: {
      ...chartDefaults,
      plugins: { ...chartDefaults.plugins, legend: { display: false }},
      scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, ticks: { ...chartDefaults.scales.y.ticks, callback: v => `£${v}` }}},
    },
  });
}
