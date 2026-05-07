import { useState } from 'react'
import Header from './components/Header'
import EcosystemHero from './components/EcosystemHero'
import TabNav from './components/TabNav'
import DoctorTab from './components/tabs/DoctorTab'
import HospitalTab from './components/tabs/HospitalTab'
import PharmacyTab from './components/tabs/PharmacyTab'
import LabTab from './components/tabs/LabTab'
import StatsStrip from './components/StatsStrip'
import CampaignStrip from './components/CampaignStrip'
import LandingContent from './components/LandingContent'
import Footer from './components/Footer'
import FortisPodPage from './pages/FortisPodPage'
import AdminPage from './pages/AdminPage'
import ContactPage from './pages/ContactPage'
import AboutPage   from './pages/AboutPage'
import './App.css'

const TABS = [
  { id: 'doctor',   label: 'Doctor'           },
  { id: 'hospital', label: 'Hospital'          },
  { id: 'pharmacy', label: 'Pharmacy'          },
  { id: 'lab',      label: 'Lab & Diagnostics' },
]

const TAB_COMPONENTS = {
  doctor:   <DoctorTab />,
  hospital: <HospitalTab />,
  pharmacy: <PharmacyTab />,
  lab:      <LabTab />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [page, setPage] = useState('home') // 'home' | 'contact' | 'about' | 'fortis-pod' | 'admin'

  function navigate(p) {
    setPage(p)
    if (p === 'home') setActiveTab('overview')
    window.scrollTo(0, 0)
  }

  const sharedHeader = (
    <Header
      onTabChange={setActiveTab}
      activePage={page}
      onNavigate={navigate}
      onAdmin={() => { setPage('admin'); window.scrollTo(0, 0) }}
    />
  )

  if (page === 'admin') {
    return <AdminPage onBack={() => navigate('home')} />
  }

  if (page === 'fortis-pod') {
    return (
      <>
        {sharedHeader}
        <FortisPodPage onBack={() => navigate('home')} />
        <Footer />
      </>
    )
  }

  if (page === 'contact') {
    return (
      <>
        {sharedHeader}
        <ContactPage />
        <Footer />
      </>
    )
  }

  if (page === 'about') {
    return (
      <>
        {sharedHeader}
        <AboutPage />
        <Footer />
      </>
    )
  }

  return (
    <>
      {sharedHeader}
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />
      <main className="tab-content">
        {activeTab === 'overview' ? (
          <>
            <EcosystemHero onTabChange={t => { setActiveTab(t); window.scrollTo(0, 0) }} />
            <StatsStrip />
            <CampaignStrip />
            <LandingContent />
          </>
        ) : (
          TAB_COMPONENTS[activeTab]
        )}
      </main>
      <Footer />
    </>
  )
}
