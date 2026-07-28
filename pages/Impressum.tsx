import React from 'react'

const Impressum: React.FC = () => {
  return (
    <section id="impressum" className="section">
      <div className="container max-w-3xl">
        <h1 className="h1 mb-8">Impressum · §5 TMG</h1>
        <div className="card-flat stack" style={{ gap: 24 }}>
          <p className="lead">
            <strong>Sanket Gadge</strong><br />
            c/o BSBI Berlin<br />
            Berlin, Deutschland<br />
            E-Mail: gadgesanket75@gmail.com
          </p>
          <p className="text-sm text-muted">
            <strong>Verantwortlich für den Inhalt nach §55 RStV:</strong> Sanket Gadge, Berlin.
          </p>
          <p className="text-sm text-muted">
            Diese Portfolio-Website ist ein statisches HTML/TypeScript-Projekt ohne Tracking, ohne Cookies und ohne Server-seitige Datenerfassung. 
            Es gibt kein Kontaktformular mit Backend-Anbindung — alle Formulare leiten direkt an die E-Mail-Adresse oben weiter.
          </p>
          <p className="text-sm text-muted">
            <strong>Streitbeilegung:</strong> Der Betreiber dieser Seite ist nicht bereit oder verpflichtet, an einem 
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle gemäß VSBG teilzunehmen.
          </p>
          <p className="text-sm text-muted">
            Dieses Impressum erfüllt die Anforderungen von <strong>§5 TMG</strong> und 
            <strong>§18 DDG</strong> (Digitale-Dienste-Gesetz).
          </p>
        </div>
      </div>
    </section>
  )
}

export default Impressum
