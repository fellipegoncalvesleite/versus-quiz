const PHOTO_CREDITS = [
  {
    quiz: "Brazilian States",
    description: "NASA satellite photograph of the Amazon in northern Brazil.",
    author: "Jacques Descloitres, MODIS Land Rapid Response Team, NASA/GSFC",
    source: "https://commons.wikimedia.org/wiki/File:Amazon.A2002182.1405.1km.jpg",
    license: "Public domain (NASA)",
    licenseUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
  },
  {
    quiz: "Capitals of Brazilian States",
    description: "Brasília's Monumental Axis, cropped and resized for the quiz card.",
    author: "Arturdiasr",
    source: "https://commons.wikimedia.org/wiki/File:Planalto_Central_(cropped).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    quiz: "Champions League Winners & Runners-up",
    description: "European Champion Clubs' Cup photograph, resized and presented over a blurred crop of the same photograph.",
    author: "David Flores",
    source: "https://commons.wikimedia.org/wiki/File:Trofeo_UEFA_Champions_League.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    quiz: "Brasileirão Winners & Runners-up",
    description: "Maracanã Stadium, cropped and resized for the quiz card.",
    author: "Alvoradaking",
    source: "https://commons.wikimedia.org/wiki/File:2010-12-15-Maracana-Central.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  {
    quiz: "Copa do Brasil Winners & Runners-up",
    description: "Mineirão Stadium during the 2014 FIFA World Cup, cropped and resized for the quiz card.",
    author: "dronepicr",
    source: "https://commons.wikimedia.org/wiki/File:Stadion_Belo_Horizonte_Halbfinale_WM_2014_(22117986076).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
] as const;

export default function CreditsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Versus Quiz
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Photo credits</h1>
        <p className="mt-3 max-w-2xl text-neutral-400">
          The quiz thumbnails below are real photographs from reusable public-domain
          or Creative Commons sources. No generated illustrations are used for these modes.
        </p>
      </div>

      <div className="grid gap-4">
        {PHOTO_CREDITS.map((photo) => (
          <article
            key={photo.quiz}
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5"
          >
            <h2 className="font-semibold text-white">{photo.quiz}</h2>
            <p className="mt-2 text-sm text-neutral-400">{photo.description}</p>
            <p className="mt-3 text-sm text-neutral-300">
              Photo by {photo.author}.{" "}
              <a
                href={photo.source}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Source
              </a>
              {" · "}
              <a
                href={photo.licenseUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300"
              >
                {photo.license}
              </a>
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
