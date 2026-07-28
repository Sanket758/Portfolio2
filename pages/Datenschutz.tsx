import React from 'react'

const Datenschutz: React.FC = () => {
  return (
    <section id="datenschutz" className="section">
      <div className="container max-w-3xl">
        <h1 className="h1 mb-8">Datenschutz · DSGVO</h1>
        <div className="card-flat stack" style={{ gap: 24 }}>
          <p className="lead">Diese Seite ist datenschutzoptimiert — ohne Tracking, ohne Cookies, ohne Server-seitige Logs.</p>
          <div className="stack" style={{ gap: 16 }}>
            <div>
              <h2 className="h3 mb-2">1. Keine Datenerfassung</h2>
              <p className="text-sm text-muted">Diese statische Website sammelt keinerlei personenbezogene Daten. Es gibt kein Kontaktformular mit Backend-Anbindung und keine Analyse-Tools.</p>
            </div>
            <div>
              <h2 className="h3 mb-2">2. Kein Cookie-Einsatz</h2>
              <p className="text-sm text-muted">Es werden keine Cookies gesetzt — weder technisch notwendige noch Tracking-Cookies. Der DE/EN Sprachtoggle speichert die Präferenz lokal in Ihrem Browser (localStorage) und sendet keine Daten an einen Server.</p>
            </div>
            <div>
              <h2 className="h3 mb-2">3. Keine Server-Logs</h2>
              <p className="text-sm text-muted">Da es sich um ein statisches Projekt handelt (deployed via Vercel), werden von der Plattform keine Zugriffs-Logs dauerhaft gespeichert. Die DSGVO-konfigurierten Vercel Logs werden innerhalb von 48 Stunden automatisch gelöscht.</p>
            </div>
            <div>
              <h2 className="h3 mb-2">4. Drittanbieter</h2>
              <p className="text-sm text-muted">Diese Seite nutzt keine externen Dienste für Analyse, Werbung, oder Social-Media-Plugins. Ausnahme: Vercel als Cloud-Hosting und Google Fonts (Geist) zur Darstellung der Typografie.</p>
            </div>
            <div>
              <h2 className="h3 mb-2">5. Datenlöschung</h2>
              <p className="text-sm text-muted">Da keine Daten erfasst werden, gibt es auch keine Löschpflicht. Auf Anfrage werden sämtliche Logs (falls vorhanden) innerhalb von 48 Stunden durch Vercel automatisch entfernt.</p>
            </div>
            <div>
              <h2 className="h3 mb-2">6. Kontakt</h2>
              <p className="text-sm text-muted">Bei Fragen zum Datenschutz: gadgesanket75@gmail.com</p>
            </div>
          </div>
          <p className="text-xs text-muted" style={{marginTop: 32}}>
            <strong>Letzte Aktualisierung:</strong> Juli 2025 · Erstellt im Einklang mit DSGVO und dem deutschen Telemediengesetz (TMG).
          </p>
        </div>
      </div>
    </section>
  )
}

export default Datenschutz
