import React from 'react'
import '../../styles/gt/site.css'
import Contact from './Contact'
import Evidence from './Evidence'
import Footer from './Footer'
import { GtProvider, useGt } from './GtContext'
import Lab from './Lab'
import Nav from './Nav'
import Stack from './Stack'
import Timeline from './Timeline'
import Work from './Work'
import Writing from './Writing'

/**
 * The page. Every section is a sibling in <main> so the nav's stage map, the
 * skip link and the anchors all point at real elements with stable ids
 * (#ingest, #perceive, #track, #work, #stack, #evidence, #contact).
 */
const Site: React.FC = () => {
  const { c } = useGt()
  return (
  <div className="gt">
    <a className="skip mono" href="#lab">
      {c.nav.skip}
    </a>
    <Nav />
    <main id="main">
      <Lab />
      <Timeline />
      <Work />
      <Stack />
      <Evidence />
      <Writing />
      <Contact />
    </main>
    <Footer />
  </div>
  )
}

const GtSite: React.FC = () => (
  <GtProvider>
    <Site />
  </GtProvider>
)

export default GtSite
