import brazilStates from "@/data/quizzes/brazil_states.json";
import worldCountries from "@/data/quizzes/world_countries.json";

type QuizSeed = {
  items: Array<{ id: string; answer: string; group?: string }>;
};

export type GroupDefinition = {
  label: string;
  itemIds: string[];
};

export type SeasonHistoryRow = {
  season: string;
  winnerId: string;
  runnerUp: string;
  runnerUpId?: string;
  score?: string;
  venue?: string;
};

const WORLD_GROUP_ORDER = ["North America", "South America", "Europe", "Africa", "Asia", "Oceania"];
const BRAZIL_GROUP_ORDER = ["North", "Northeast", "Central-West", "Southeast", "South"];

function buildGroups(seed: QuizSeed, order: string[]): GroupDefinition[] {
  return order
    .map((label) => ({
      label,
      itemIds: (seed.items ?? [])
        .filter((item) => item.group === label)
        .map((item) => item.id.toUpperCase()),
    }))
    .filter((group) => group.itemIds.length > 0);
}

export const WORLD_COUNTRY_GROUPS = buildGroups(worldCountries as QuizSeed, WORLD_GROUP_ORDER);
export const BRAZIL_STATE_GROUPS = buildGroups(brazilStates as QuizSeed, BRAZIL_GROUP_ORDER);

export const US_STATE_GROUPS: GroupDefinition[] = [
  {
    label: "Northeast",
    itemIds: ["CT", "ME", "MA", "NH", "NJ", "NY", "PA", "RI", "VT"],
  },
  {
    label: "Midwest",
    itemIds: ["IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "SD", "WI"],
  },
  {
    label: "South",
    itemIds: ["AL", "AR", "DE", "FL", "GA", "KY", "LA", "MD", "MS", "NC", "OK", "SC", "TN", "TX", "VA", "WV"],
  },
  {
    label: "West",
    itemIds: ["AK", "AZ", "CA", "CO", "HI", "ID", "MT", "NV", "NM", "OR", "UT", "WA", "WY"],
  },
];

export const UCL_FINALS: SeasonHistoryRow[] = [
  { season: "1955-56", winnerId: "real_madrid", runnerUp: "Reims", score: "4–3", venue: "Parc des Princes, Paris, France" },
  { season: "1956-57", winnerId: "real_madrid", runnerUp: "Fiorentina", score: "2–0", venue: "Santiago Bernabeu, Madrid, Spain" },
  { season: "1957-58", winnerId: "real_madrid", runnerUp: "Milan", score: "3–2†", venue: "Heysel Stadium, Brussels, Belgium" },
  { season: "1958-59", winnerId: "real_madrid", runnerUp: "Reims", score: "2–0", venue: "Neckarstadion, Stuttgart, West Germany" },
  { season: "1959-60", winnerId: "real_madrid", runnerUp: "Eintracht Frankfurt", score: "7–3", venue: "Hampden Park, Glasgow, Scotland" },
  { season: "1960-61", winnerId: "benfica", runnerUp: "Barcelona", score: "3–2", venue: "Wankdorf Stadium, Bern, Switzerland" },
  { season: "1961-62", winnerId: "benfica", runnerUp: "Real Madrid", score: "5–3", venue: "Olympisch Stadion, Amsterdam, Netherlands" },
  { season: "1962-63", winnerId: "ac_milan", runnerUp: "Benfica", score: "2–1", venue: "Wembley Stadium, London, England" },
  { season: "1963-64", winnerId: "inter_milan", runnerUp: "Real Madrid", score: "3–1", venue: "Praterstadion, Vienna, Austria" },
  { season: "1964-65", winnerId: "inter_milan", runnerUp: "Benfica", score: "1–0", venue: "San Siro, Milan, Italy" },
  { season: "1965-66", winnerId: "real_madrid", runnerUp: "Partizan", score: "2–1", venue: "Heysel Stadium, Brussels, Belgium" },
  { season: "1966-67", winnerId: "celtic", runnerUp: "Inter Milan", score: "2–1", venue: "Estadio Nacional, Lisbon, Portugal" },
  { season: "1967-68", winnerId: "manchester_united", runnerUp: "Benfica", score: "4–1†", venue: "Wembley Stadium, London, England" },
  { season: "1968-69", winnerId: "ac_milan", runnerUp: "Ajax", score: "4–1", venue: "Santiago Bernabeu, Madrid, Spain" },
  { season: "1969-70", winnerId: "feyenoord", runnerUp: "Celtic", score: "2–1†", venue: "San Siro, Milan, Italy" },
  { season: "1970-71", winnerId: "ajax", runnerUp: "Panathinaikos", score: "2–0", venue: "Wembley Stadium, London, England" },
  { season: "1971-72", winnerId: "ajax", runnerUp: "Inter Milan", score: "2–0", venue: "De Kuip, Rotterdam, Netherlands" },
  { season: "1972-73", winnerId: "ajax", runnerUp: "Juventus", score: "1–0", venue: "Red Star Stadium, Belgrade, SFR Yugoslavia" },
  { season: "1973-74", winnerId: "bayern_munich", runnerUp: "Atletico Madrid", score: "1–1", venue: "Heysel Stadium, Brussels, Belgium" },
  { season: "1974-75", winnerId: "bayern_munich", runnerUp: "Leeds United", score: "2–0", venue: "Parc des Princes, Paris, France" },
  { season: "1975-76", winnerId: "bayern_munich", runnerUp: "Saint-Etienne", score: "1–0", venue: "Hampden Park, Glasgow, Scotland" },
  { season: "1976-77", winnerId: "liverpool", runnerUp: "Borussia Monchengladbach", score: "3–1", venue: "Stadio Olimpico, Rome, Italy" },
  { season: "1977-78", winnerId: "liverpool", runnerUp: "Club Brugge", score: "1–0", venue: "Wembley Stadium, London, England" },
  { season: "1978-79", winnerId: "nottingham_forest", runnerUp: "Malmo FF", score: "1–0", venue: "Olympiastadion, Munich, West Germany" },
  { season: "1979-80", winnerId: "nottingham_forest", runnerUp: "Hamburger SV", score: "1–0", venue: "Santiago Bernabeu, Madrid, Spain" },
  { season: "1980-81", winnerId: "liverpool", runnerUp: "Real Madrid", score: "1–0", venue: "Parc des Princes, Paris, France" },
  { season: "1981-82", winnerId: "aston_villa", runnerUp: "Bayern Munich", score: "1–0", venue: "De Kuip, Rotterdam, Netherlands" },
  { season: "1982-83", winnerId: "hamburg", runnerUp: "Juventus", score: "1–0", venue: "Olympic Stadium, Athens, Greece" },
  { season: "1983-84", winnerId: "liverpool", runnerUp: "Roma", score: "1–1*", venue: "Stadio Olimpico, Rome, Italy" },
  { season: "1984-85", winnerId: "juventus", runnerUp: "Liverpool", score: "1–0", venue: "Heysel Stadium, Brussels, Belgium" },
  { season: "1985-86", winnerId: "steaua", runnerUp: "Barcelona", score: "0–0*", venue: "Ramon Sanchez Pizjuan, Seville, Spain" },
  { season: "1986-87", winnerId: "porto", runnerUp: "Bayern Munich", score: "2–1", venue: "Praterstadion, Vienna, Austria" },
  { season: "1987-88", winnerId: "psv", runnerUp: "Benfica", score: "0–0*", venue: "Neckarstadion, Stuttgart, West Germany" },
  { season: "1988-89", winnerId: "ac_milan", runnerUp: "Steaua Bucuresti", score: "4–0", venue: "Camp Nou, Barcelona, Spain" },
  { season: "1989-90", winnerId: "ac_milan", runnerUp: "Benfica", score: "1–0", venue: "Praterstadion, Vienna, Austria" },
  { season: "1990-91", winnerId: "red_star", runnerUp: "Marseille", score: "0–0*", venue: "Stadio San Nicola, Bari, Italy" },
  { season: "1991-92", winnerId: "barcelona", runnerUp: "Sampdoria", score: "1–0†", venue: "Wembley Stadium, London, England" },
  { season: "1992-93", winnerId: "marseille", runnerUp: "Milan", score: "1–0", venue: "Olympiastadion, Munich, Germany" },
  { season: "1993-94", winnerId: "ac_milan", runnerUp: "Barcelona", score: "4–0", venue: "Olympic Stadium, Athens, Greece" },
  { season: "1994-95", winnerId: "ajax", runnerUp: "Milan", score: "1–0", venue: "Ernst-Happel-Stadion, Vienna, Austria" },
  { season: "1995-96", winnerId: "juventus", runnerUp: "Ajax", score: "1–1*", venue: "Stadio Olimpico, Rome, Italy" },
  { season: "1996-97", winnerId: "dortmund", runnerUp: "Juventus", score: "3–1", venue: "Olympiastadion, Munich, Germany" },
  { season: "1997-98", winnerId: "real_madrid", runnerUp: "Juventus", score: "1–0", venue: "Amsterdam Arena, Amsterdam, Netherlands" },
  { season: "1998-99", winnerId: "manchester_united", runnerUp: "Bayern Munich", score: "2–1", venue: "Camp Nou, Barcelona, Spain" },
  { season: "1999-2000", winnerId: "real_madrid", runnerUp: "Valencia", score: "3–0", venue: "Stade de France, Saint-Denis, France" },
  { season: "2000-01", winnerId: "bayern_munich", runnerUp: "Valencia", score: "1–1*", venue: "San Siro, Milan, Italy" },
  { season: "2001-02", winnerId: "real_madrid", runnerUp: "Bayer Leverkusen", score: "2–1", venue: "Hampden Park, Glasgow, Scotland" },
  { season: "2002-03", winnerId: "ac_milan", runnerUp: "Juventus", score: "0–0*", venue: "Old Trafford, Manchester, England" },
  { season: "2003-04", winnerId: "porto", runnerUp: "Monaco", score: "3–0", venue: "Arena AufSchalke, Gelsenkirchen, Germany" },
  { season: "2004-05", winnerId: "liverpool", runnerUp: "Milan", score: "3–3*", venue: "Ataturk Olympic Stadium, Istanbul, Turkey" },
  { season: "2005-06", winnerId: "barcelona", runnerUp: "Arsenal", score: "2–1", venue: "Stade de France, Saint-Denis, France" },
  { season: "2006-07", winnerId: "ac_milan", runnerUp: "Liverpool", score: "2–1", venue: "Olympic Stadium, Athens, Greece" },
  { season: "2007-08", winnerId: "manchester_united", runnerUp: "Chelsea", score: "1–1*", venue: "Luzhniki Stadium, Moscow, Russia" },
  { season: "2008-09", winnerId: "barcelona", runnerUp: "Manchester United", score: "2–0", venue: "Stadio Olimpico, Rome, Italy" },
  { season: "2009-10", winnerId: "inter_milan", runnerUp: "Bayern Munich", score: "2–0", venue: "Santiago Bernabeu, Madrid, Spain" },
  { season: "2010-11", winnerId: "barcelona", runnerUp: "Manchester United", score: "3–1", venue: "Wembley Stadium, London, England" },
  { season: "2011-12", winnerId: "chelsea", runnerUp: "Bayern Munich", score: "1–1*", venue: "Allianz Arena, Munich, Germany" },
  { season: "2012-13", winnerId: "bayern_munich", runnerUp: "Borussia Dortmund", score: "2–1", venue: "Wembley Stadium, London, England" },
  { season: "2013-14", winnerId: "real_madrid", runnerUp: "Atletico Madrid", score: "4–1†", venue: "Estadio da Luz, Lisbon, Portugal" },
  { season: "2014-15", winnerId: "barcelona", runnerUp: "Juventus", score: "3–1", venue: "Olympiastadion, Berlin, Germany" },
  { season: "2015-16", winnerId: "real_madrid", runnerUp: "Atletico Madrid", score: "1–1*", venue: "San Siro, Milan, Italy" },
  { season: "2016-17", winnerId: "real_madrid", runnerUp: "Juventus", score: "4–1", venue: "Millennium Stadium, Cardiff, Wales" },
  { season: "2017-18", winnerId: "real_madrid", runnerUp: "Liverpool", score: "3–1", venue: "NSC Olimpiyskiy Stadium, Kyiv, Ukraine" },
  { season: "2018-19", winnerId: "liverpool", runnerUp: "Tottenham Hotspur", score: "2–0", venue: "Metropolitano Stadium, Madrid, Spain" },
  { season: "2019-20", winnerId: "bayern_munich", runnerUp: "Paris Saint-Germain", score: "1–0", venue: "Estadio da Luz, Lisbon, Portugal" },
  { season: "2020-21", winnerId: "chelsea", runnerUp: "Manchester City", score: "1–0", venue: "Estadio do Dragao, Porto, Portugal" },
  { season: "2021-22", winnerId: "real_madrid", runnerUp: "Liverpool", score: "1–0", venue: "Stade de France, Saint-Denis, France" },
  { season: "2022-23", winnerId: "manchester_city", runnerUp: "Inter Milan", score: "1–0", venue: "Ataturk Olympic Stadium, Istanbul, Turkey" },
  { season: "2023-24", winnerId: "real_madrid", runnerUp: "Borussia Dortmund", score: "2–0", venue: "Wembley Stadium, London, England" },
  { season: "2024-25", winnerId: "psg", runnerUp: "Inter Milan", score: "5–0", venue: "Allianz Arena, Munich, Germany" },
];

export const BRASILEIRAO_FINALS: SeasonHistoryRow[] = [
  { season: "1937", winnerId: "atletico_mineiro", runnerUpId: "fluminense", runnerUp: "Fluminense" },
  { season: "1959", winnerId: "bahia", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "1960", winnerId: "palmeiras", runnerUpId: "fortaleza", runnerUp: "Fortaleza" },
  { season: "1961", winnerId: "santos", runnerUpId: "bahia", runnerUp: "Bahia" },
  { season: "1962", winnerId: "santos", runnerUpId: "botafogo", runnerUp: "Botafogo" },
  { season: "1963", winnerId: "santos", runnerUpId: "bahia", runnerUp: "Bahia" },
  { season: "1964", winnerId: "santos", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "1965", winnerId: "santos", runnerUpId: "vasco", runnerUp: "Vasco da Gama" },
  { season: "1966", winnerId: "cruzeiro", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "1967", winnerId: "palmeiras", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "1967-B", winnerId: "palmeiras", runnerUpId: "nautico", runnerUp: "Náutico" },
  { season: "1968", winnerId: "botafogo", runnerUpId: "fortaleza", runnerUp: "Fortaleza" },
  { season: "1968-B", winnerId: "santos", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "1969", winnerId: "palmeiras", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "1970", winnerId: "fluminense", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
  { season: "1971", winnerId: "atletico_mineiro", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "1972", winnerId: "palmeiras", runnerUpId: "botafogo", runnerUp: "Botafogo" },
  { season: "1973", winnerId: "palmeiras", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "1974", winnerId: "vasco", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "1975", winnerId: "internacional", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "1976", winnerId: "internacional", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "1977", winnerId: "sao_paulo", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "1978", winnerId: "guarani", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
  { season: "1979", winnerId: "internacional", runnerUpId: "vasco", runnerUp: "Vasco da Gama" },
  { season: "1980", winnerId: "flamengo", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "1981", winnerId: "gremio", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "1982", winnerId: "flamengo", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "1983", winnerId: "flamengo", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "1984", winnerId: "fluminense", runnerUpId: "vasco", runnerUp: "Vasco da Gama" },
  { season: "1985", winnerId: "coritiba", runnerUpId: "bangu", runnerUp: "Bangu" },
  { season: "1986", winnerId: "sao_paulo", runnerUpId: "guarani", runnerUp: "Guarani" },
  { season: "1987", winnerId: "sport", runnerUpId: "guarani", runnerUp: "Guarani" },
  { season: "1988", winnerId: "bahia", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "1989", winnerId: "vasco", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "1990", winnerId: "corinthians", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "1991", winnerId: "sao_paulo", runnerUpId: "bragantino", runnerUp: "Bragantino" },
  { season: "1992", winnerId: "flamengo", runnerUpId: "botafogo", runnerUp: "Botafogo" },
  { season: "1993", winnerId: "palmeiras", runnerUpId: "vitoria", runnerUp: "Vitória" },
  { season: "1994", winnerId: "palmeiras", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "1995", winnerId: "botafogo", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "1996", winnerId: "gremio", runnerUpId: "portuguesa", runnerUp: "Portuguesa" },
  { season: "1997", winnerId: "vasco", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
  { season: "1998", winnerId: "corinthians", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "1999", winnerId: "corinthians", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "2000", winnerId: "vasco", runnerUpId: "sao_caetano", runnerUp: "São Caetano" },
  { season: "2001", winnerId: "athletico_paranaense", runnerUpId: "sao_caetano", runnerUp: "São Caetano" },
  { season: "2002", winnerId: "santos", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "2003", winnerId: "cruzeiro", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "2004", winnerId: "santos", runnerUpId: "athletico_paranaense", runnerUp: "Athletico Paranaense" },
  { season: "2005", winnerId: "corinthians", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2006", winnerId: "sao_paulo", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2007", winnerId: "sao_paulo", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "2008", winnerId: "sao_paulo", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "2009", winnerId: "flamengo", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2010", winnerId: "fluminense", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "2011", winnerId: "corinthians", runnerUpId: "vasco", runnerUp: "Vasco da Gama" },
  { season: "2012", winnerId: "fluminense", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "2013", winnerId: "cruzeiro", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "2014", winnerId: "cruzeiro", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "2015", winnerId: "corinthians", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "2016", winnerId: "palmeiras", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "2017", winnerId: "corinthians", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
  { season: "2018", winnerId: "palmeiras", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "2019", winnerId: "flamengo", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "2020", winnerId: "flamengo", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2021", winnerId: "atletico_mineiro", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "2022", winnerId: "palmeiras", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2023", winnerId: "palmeiras", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "2024", winnerId: "botafogo", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
  { season: "2025", winnerId: "flamengo", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
];

export const COPA_DO_BRASIL_FINALS: SeasonHistoryRow[] = [
  { season: "1989", winnerId: "gremio", runnerUpId: "sport", runnerUp: "Sport" },
  { season: "1990", winnerId: "flamengo", runnerUpId: "goias", runnerUp: "Goiás" },
  { season: "1991", winnerId: "criciuma", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "1992", winnerId: "internacional", runnerUpId: "fluminense", runnerUp: "Fluminense" },
  { season: "1993", winnerId: "cruzeiro", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "1994", winnerId: "gremio", runnerUpId: "ceara", runnerUp: "Ceará" },
  { season: "1995", winnerId: "corinthians", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "1996", winnerId: "cruzeiro", runnerUpId: "palmeiras", runnerUp: "Palmeiras" },
  { season: "1997", winnerId: "gremio", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "1998", winnerId: "palmeiras", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "1999", winnerId: "juventude", runnerUpId: "botafogo", runnerUp: "Botafogo" },
  { season: "2000", winnerId: "cruzeiro", runnerUpId: "sao_paulo", runnerUp: "São Paulo" },
  { season: "2001", winnerId: "gremio", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "2002", winnerId: "corinthians", runnerUpId: "brasiliense", runnerUp: "Brasiliense" },
  { season: "2003", winnerId: "cruzeiro", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "2004", winnerId: "santo_andre", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "2005", winnerId: "paulista", runnerUpId: "fluminense", runnerUp: "Fluminense" },
  { season: "2006", winnerId: "flamengo", runnerUpId: "vasco", runnerUp: "Vasco da Gama" },
  { season: "2007", winnerId: "fluminense", runnerUpId: "figueirense", runnerUp: "Figueirense" },
  { season: "2008", winnerId: "sport", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "2009", winnerId: "corinthians", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2010", winnerId: "santos", runnerUpId: "vitoria", runnerUp: "Vitória" },
  { season: "2011", winnerId: "vasco", runnerUpId: "coritiba", runnerUp: "Coritiba" },
  { season: "2012", winnerId: "palmeiras", runnerUpId: "coritiba", runnerUp: "Coritiba" },
  { season: "2013", winnerId: "flamengo", runnerUpId: "athletico_paranaense", runnerUp: "Athletico Paranaense" },
  { season: "2014", winnerId: "atletico_mineiro", runnerUpId: "cruzeiro", runnerUp: "Cruzeiro" },
  { season: "2015", winnerId: "palmeiras", runnerUpId: "santos", runnerUp: "Santos" },
  { season: "2016", winnerId: "gremio", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "2017", winnerId: "cruzeiro", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "2018", winnerId: "cruzeiro", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "2019", winnerId: "athletico_paranaense", runnerUpId: "internacional", runnerUp: "Internacional" },
  { season: "2020", winnerId: "palmeiras", runnerUpId: "gremio", runnerUp: "Grêmio" },
  { season: "2021", winnerId: "atletico_mineiro", runnerUpId: "athletico_paranaense", runnerUp: "Athletico Paranaense" },
  { season: "2022", winnerId: "flamengo", runnerUpId: "corinthians", runnerUp: "Corinthians" },
  { season: "2023", winnerId: "sao_paulo", runnerUpId: "flamengo", runnerUp: "Flamengo" },
  { season: "2024", winnerId: "flamengo", runnerUpId: "atletico_mineiro", runnerUp: "Atlético Mineiro" },
  { season: "2025", winnerId: "corinthians", runnerUpId: "vasco", runnerUp: "Vasco da Gama" },
];

const UCL_FINALIST_IDS = new Map<string, string>([
  ["AC Milan", "ac_milan"],
  ["Ajax", "ajax"],
  ["Arsenal", "arsenal"],
  ["Aston Villa", "aston_villa"],
  ["Atletico Madrid", "atletico_madrid"],
  ["Bayer Leverkusen", "bayer_leverkusen"],
  ["Bayern Munich", "bayern_munich"],
  ["Benfica", "benfica"],
  ["Borussia Dortmund", "dortmund"],
  ["Borussia Monchengladbach", "gladbach"],
  ["Barcelona", "barcelona"],
  ["Celtic", "celtic"],
  ["Chelsea", "chelsea"],
  ["Club Brugge", "club_brugge"],
  ["Eintracht Frankfurt", "eintracht_frankfurt"],
  ["Feyenoord", "feyenoord"],
  ["Fiorentina", "fiorentina"],
  ["Hamburger SV", "hamburg"],
  ["Inter Milan", "inter_milan"],
  ["Juventus", "juventus"],
  ["Leeds United", "leeds_united"],
  ["Liverpool", "liverpool"],
  ["Malmo FF", "malmo"],
  ["Manchester City", "manchester_city"],
  ["Manchester United", "manchester_united"],
  ["Marseille", "marseille"],
  ["Milan", "ac_milan"],
  ["Monaco", "monaco"],
  ["Nottingham Forest", "nottingham_forest"],
  ["PSV Eindhoven", "psv"],
  ["Panathinaikos", "panathinaikos"],
  ["Paris Saint-Germain", "psg"],
  ["Partizan", "partizan"],
  ["Porto", "porto"],
  ["Real Madrid", "real_madrid"],
  ["Red Star Belgrade", "red_star"],
  ["Reims", "reims"],
  ["Roma", "roma"],
  ["Saint-Etienne", "saint_etienne"],
  ["Sampdoria", "sampdoria"],
  ["Steaua Bucuresti", "steaua"],
  ["Tottenham Hotspur", "tottenham"],
  ["Valencia", "valencia"],
]);

export function getUclFinalistId(name: string): string | null {
  return UCL_FINALIST_IDS.get(name) ?? null;
}

const countryNameByCode = new Map(
  ((worldCountries as QuizSeed).items ?? []).map((item) => [item.id.toUpperCase(), item.answer]),
);

const brazilStateNameByCode = new Map(
  ((brazilStates as QuizSeed).items ?? []).map((item) => [item.id.toUpperCase(), item.answer]),
);

export function getCountryName(code: string): string {
  return countryNameByCode.get(code.toUpperCase()) ?? code.toUpperCase();
}

export function getBrazilStateName(code: string): string {
  return brazilStateNameByCode.get(code.toUpperCase()) ?? code.toUpperCase();
}
