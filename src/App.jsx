import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, Check,
  CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3, Cloud,
  Compass, CreditCard, Eye, FileText, Filter, Focus, Gauge, Heart,
  History, Home, Info, Layers3, Lightbulb, Menu, MessageCircle,
  MoreHorizontal, MoveRight, Package, Plus, Ruler, ScanLine, Search,
  Settings2, ShieldCheck, Shirt, Sparkles, Star, Target, UserRound,
  UsersRound, WandSparkles, X, Camera, CameraOff, RotateCcw,
} from 'lucide-react'
import './App.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, group: 'WORKSPACE' },
  { id: 'scan', label: 'Body scan', icon: ScanLine, group: 'WORKSPACE', badge: 'LIVE' },
  { id: 'profile', label: 'Fit profile', icon: UserRound, group: 'WORKSPACE' },
  { id: 'studio', label: 'Garment studio', icon: Shirt, group: 'DISCOVER' },
  { id: 'tailors', label: 'Find a tailor', icon: UsersRound, group: 'DISCOVER' },
  { id: 'orders', label: 'My orders', icon: Package, group: 'DISCOVER', count: '2' },
  { id: 'learning', label: 'Fit learning', icon: Sparkles, group: 'INSIGHTS' },
]

const defaultProfile = {
  name: 'Saif Rehman', email: 'saif.rehman@example.com', fit: 'Regular',
  bodyType: 'Athletic', chest: '102', waist: '86', hip: '100', shoulders: '46',
  sleeve: '62', kameez: '108', shalwar: '102', opening: '38',
}

const garments = [
  { id: 1, name: 'The Everyday Kameez', type: 'Shalwar Kameez', fabric: 'Premium cotton · breathable', price: 'PKR 8,500', category: 'Everyday', image: 'photo-1598033129183-c4f50c736f10', color: '#e8e1d5', tag: 'BESTSELLER' },
  { id: 2, name: 'Linen Eid Edit', type: 'Shalwar Kameez', fabric: 'Belgian linen · soft structure', price: 'PKR 14,800', category: 'Formal', image: 'photo-1617137968427-85924c800a22', color: '#d8e2df', tag: 'NEW' },
  { id: 3, name: 'Classic Waistcoat Set', type: 'Formal set', fabric: 'Cotton blend · occasion ready', price: 'PKR 18,200', category: 'Formal', image: 'photo-1618354691373-d851c5c3a990', color: '#e3d7ca', tag: 'TAILORED' },
  { id: 4, name: 'Soft Wash Kurta', type: 'Casual kurta', fabric: 'Washed cotton · easy comfort', price: 'PKR 6,900', category: 'Casual', image: 'photo-1603252110481-7ba873bf42ab', color: '#dce3ee', tag: 'LIGHTWEIGHT' },
]

const tailors = [
  { name: 'Ustad Hamza', shop: 'The Modern Darzi', area: 'Gulberg, Lahore', rating: '4.9', price: 'PKR 3,500', time: '5–7 days', initials: 'UH', color: 'lavender', specialty: 'Contemporary Shalwar Kameez' },
  { name: 'Sanaullah & Sons', shop: 'Heritage Stitch House', area: 'F-7, Islamabad', rating: '4.8', price: 'PKR 4,200', time: '7–9 days', initials: 'SS', color: 'mint', specialty: 'Classic and formal wear' },
  { name: 'Bilal Ahmed', shop: 'Thread & Thimble', area: 'DHA, Karachi', rating: '4.7', price: 'PKR 3,000', time: '4–6 days', initials: 'BA', color: 'peach', specialty: 'Everyday custom tailoring' },
]

const initialOrders = [
  { number: 'TX-24081', garment: 'Ivory Cotton Shalwar Kameez', tailor: 'Ustad Hamza', date: '12 Oct, 2026', due: '19 Oct, 2026', status: 'Stitching', step: 1, price: 'PKR 8,500', fit: 'Regular' },
  { number: 'TX-23954', garment: 'Midnight Blue Formal Set', tailor: 'Sanaullah & Sons', date: '02 Oct, 2026', due: '10 Oct, 2026', status: 'Ready for pickup', step: 2, price: 'PKR 14,800', fit: 'Relaxed' },
]

const defaultFeedback = [
  { area: 'Sleeve', type: 'Shortened', amount: '1.5 cm', comment: 'Slightly more ease at the cuff', date: '08 Oct, 2026', garment: 'Cotton Kameez' },
  { area: 'Waist', type: 'Taken in', amount: '2 cm', comment: 'Prefer a cleaner silhouette', date: '22 Sep, 2026', garment: 'Linen Kameez' },
]

const readSaved = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [page, setPage] = useState('dashboard')
  const [profile, setProfile] = useState(() => {
    const savedProfile = readSaved('tailorax-profile', defaultProfile)
    return ['Ayaan Malik', 'Saif Malik'].includes(savedProfile.name)
      ? { ...savedProfile, name: 'Saif Rehman', email: 'saif.rehman@example.com' }
      : savedProfile
  })
  const [feedback, setFeedback] = useState(() => readSaved('tailorax-feedback', defaultFeedback))
  const [orders, setOrders] = useState(() => readSaved('tailorax-orders', initialOrders))
  const [selectedGarment, setSelectedGarment] = useState(() => readSaved('tailorax-garment', garments[0]))
  const [selectedTailor, setSelectedTailor] = useState(() => readSaved('tailorax-tailor', ''))
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [orderDetail, setOrderDetail] = useState(null)

  useEffect(() => {
    localStorage.setItem('tailorax-profile', JSON.stringify(profile))
  }, [profile])
  useEffect(() => {
    localStorage.setItem('tailorax-feedback', JSON.stringify(feedback))
  }, [feedback])
  useEffect(() => {
    localStorage.setItem('tailorax-orders', JSON.stringify(orders))
  }, [orders])
  useEffect(() => {
    localStorage.setItem('tailorax-garment', JSON.stringify(selectedGarment))
  }, [selectedGarment])
  useEffect(() => {
    localStorage.setItem('tailorax-tailor', JSON.stringify(selectedTailor))
  }, [selectedTailor])

  const toast = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  const navigate = (next) => {
    setPage(next)
    setMobileNav(false)
    setOrderDetail(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleNavigation = (event) => navigate(event.detail)
    window.addEventListener('tailorax-nav', handleNavigation)
    return () => window.removeEventListener('tailorax-nav', handleNavigation)
  }, [])

  const chooseGarment = (item) => {
    setSelectedGarment(item)
    toast(`${item.name} added to your fitting selection`)
  }

  const selectTailor = (tailor) => {
    setSelectedTailor(tailor.name)
    toast(`${tailor.name} selected for your demo order`)
  }

  const addOrder = () => {
    if (!selectedTailor) {
      toast('Choose a demo tailor first to continue')
      navigate('tailors')
      return
    }
    const nextOrder = {
      number: `TX-${Math.floor(25000 + Math.random() * 700)}`,
      garment: selectedGarment.name, tailor: selectedTailor, date: 'Today',
      due: 'Estimated in 5–7 days', status: 'Confirmed', step: 0,
      price: selectedGarment.price, fit: profile.fit,
    }
    setOrders((current) => [nextOrder, ...current])
    toast('Demo order confirmed and saved on this device')
    navigate('orders')
  }

  const activeMeta = navItems.find((item) => item.id === page)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span>t</span><span className="brand-mark-dot" /></div>
          <div><strong>tailora<span>x</span></strong><small>FIT, MADE PERSONAL.</small></div>
          <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="demo-pill"><span /> DEMO ENVIRONMENT</div>
        <nav className="side-nav" aria-label="Main navigation">
          {['WORKSPACE', 'DISCOVER', 'INSIGHTS'].map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-label">{group}</div>
              {navItems.filter((item) => item.group === group).map(({ id, label, icon: Icon, badge, count }) => (
                <button key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => navigate(id)}>
                  <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                  {badge && <span className="nav-live">{badge}</span>}
                  {count && <span className="nav-count">{count}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <strong>New to TailoraX?</strong>
            <p>See how your fit profile works.</p>
            <button onClick={() => navigate('learning')}>Explore fit learning <ArrowRight size={13} /></button>
          </div>
          <button className="nav-item settings-item" onClick={() => toast('Demo settings are saved locally on this device')}><Settings2 size={18} /> Settings <span className="nav-count"><ChevronRight size={14} /></span></button>
          <div className="profile-mini">
            <div className="avatar avatar-user">AM</div>
            <div className="profile-mini-text"><strong>{profile.name}</strong><span>Demo customer</span></div>
            <MoreHorizontal size={18} className="muted-icon" />
          </div>
        </div>
      </aside>
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />}
      <main className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-toggle" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{activeMeta?.label ?? 'Dashboard'}</strong></div>
          </div>
          <div className="topbar-right">
            <span className="private-note"><ShieldCheck size={14} /> Private by design</span>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => toast('You’re all caught up!')}><Bell size={18} /><i /></button>
            <div className="topbar-user"><div className="avatar avatar-user">AM</div><ChevronDown size={14} /></div>
          </div>
        </header>
        <div className="page-wrap">
          {page === 'dashboard' && <Dashboard profile={profile} orders={orders} onNavigate={navigate} selectedGarment={selectedGarment} />}
          {page === 'scan' && <BodyScanner onContinue={() => { toast('Scan captured. Review your sample fit profile below.'); navigate('profile') }} />}
          {page === 'profile' && <ProfilePage profile={profile} setProfile={setProfile} toast={toast} feedback={feedback} onNavigate={navigate} />}
          {page === 'studio' && <StudioPage selected={selectedGarment} onSelect={chooseGarment} onCustomize={() => navigate('profile')} onOrder={addOrder} />}
          {page === 'tailors' && <TailorsPage selected={selectedTailor} onSelect={selectTailor} onOrder={addOrder} />}
          {page === 'orders' && <OrdersPage orders={orders} onDetail={setOrderDetail} />}
          {page === 'learning' && <LearningPage feedback={feedback} setFeedback={setFeedback} toast={toast} />}
        </div>
      </main>
      {notice && <div className="toast"><CheckCircle2 size={18} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
      {orderDetail && <OrderModal order={orderDetail} onClose={() => setOrderDetail(null)} />}
    </div>
  )
}

function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function Dashboard({ profile, orders, onNavigate, selectedGarment }) {
  const status = orders[0]?.status ?? 'No active order'
  return (
    <>
      <div className="welcome-strip"><Sparkles size={14} /> A MORE PERSONAL WAY TO GET DRESSED <span>DEMO MODE</span></div>
      <div className="dashboard-hero">
        <div className="hero-copy">
          <div className="hero-date">MONDAY, OCTOBER 19 <span>·</span> YOUR FIT SPACE</div>
          <h1>Good afternoon,<br /><em>{profile.name.split(' ')[0]}.</em></h1>
          <p>Your style, your measurements, your fit — all getting to know you a little better.</p>
          <div className="hero-actions"><button className="button button-primary" onClick={() => onNavigate('scan')}><ScanLine size={17} /> Start a body scan <ArrowRight size={16} /></button><button className="button button-link" onClick={() => onNavigate('profile')}>View fit profile <ArrowRight size={15} /></button></div>
          <div className="privacy-line"><ShieldCheck size={14} /> Your camera stays on this device. Always.</div>
        </div>
        <div className="hero-art">
          <div className="hero-sun" />
          <div className="hero-flower flower-one">✳</div><div className="hero-flower flower-two">✳</div>
          <div className="hero-garment"><img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=700&q=85" alt="Tailored menswear inspiration" /></div>
          <div className="fit-float"><div className="fit-float-icon"><Ruler size={16} /></div><div><b>Your fit profile</b><span>{profile.fit} fit · Sample profile</span></div><CheckCircle2 size={17} className="green-icon" /></div>
          <div className="hero-caption">MADE TO FEEL LIKE YOU <span>01 / 04</span></div>
        </div>
      </div>
      <section className="section-block workflow-block">
        <div className="section-heading"><div><div className="eyebrow">THE TAILORAX JOURNEY</div><h2>Good fit is a process.</h2></div><button className="text-action" onClick={() => onNavigate('learning')}>How fit learning works <ArrowRight size={15} /></button></div>
        <div className="journey-card">
          {[
            { icon: ScanLine, label: 'Body scan', note: 'Capture a starting point', tone: 'blue' },
            { icon: UserRound, label: 'Fit profile', note: 'Make the details yours', tone: 'violet' },
            { icon: WandSparkles, label: 'Fit suggestion', note: 'Explore a demo match', tone: 'amber' },
            { icon: Shirt, label: 'Tailoring', note: 'Choose a garment & tailor', tone: 'rose' },
            { icon: History, label: 'Your feedback', note: 'Capture what to adjust', tone: 'green' },
          ].map(({ icon: Icon, label, note, tone }, i) => <div className="journey-step" key={label}><div className={`journey-icon tone-${tone}`}><Icon size={19} /></div><div><strong>{label}</strong><span>{note}</span></div>{i < 4 && <MoveRight className="journey-arrow" size={17} />}</div>)}
        </div>
      </section>
      <div className="dashboard-grid">
        <section className="card profile-snapshot">
          <div className="card-heading"><div><div className="eyebrow">YOUR STARTING POINT</div><h3>Personal fit profile</h3></div><button className="round-arrow" aria-label="Edit fit profile" onClick={() => onNavigate('profile')}><ArrowUpRight size={17} /></button></div>
          <div className="snapshot-person"><div className="avatar avatar-large">AM</div><div><b>{profile.name}</b><span>{profile.bodyType} build <i /> {profile.fit} fit</span></div><span className="sample-tag">DEMO PROFILE</span></div>
          <div className="measure-row">{[['CHEST', profile.chest], ['WAIST', profile.waist], ['SHOULDER', profile.shoulders]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}<small> cm</small></strong></div>)}</div>
          <div className="card-footer"><span><Info size={14} /> Sample values · not calibrated</span><button onClick={() => onNavigate('profile')}>Edit profile <ArrowRight size={14} /></button></div>
        </section>
        <section className="card order-snapshot">
          <div className="card-heading"><div><div className="eyebrow">IN THE WORKROOM</div><h3>Latest order</h3></div><button className="text-action compact" onClick={() => onNavigate('orders')}>All orders <ArrowRight size={14} /></button></div>
          <div className="order-product"><div className="product-thumb"><img src={`https://images.unsplash.com/${garments[0].image}?auto=format&fit=crop&w=160&q=70`} alt="" /></div><div className="order-product-copy"><strong>{orders[0]?.garment ?? selectedGarment.name}</strong><span>Order {orders[0]?.number ?? 'Not placed yet'}</span></div></div>
          <div className="order-progress"><div className="order-progress-line"><span style={{ width: `${orders[0] ? (orders[0].step + 1) * 28 : 0}%` }} /></div><div><span className="progress-dot done" /><span className={orders[0]?.step >= 1 ? 'progress-dot done' : 'progress-dot'} /><span className={orders[0]?.step >= 2 ? 'progress-dot done' : 'progress-dot'} /><span className={orders[0]?.step >= 3 ? 'progress-dot done' : 'progress-dot'} /></div></div>
          <div className="status-row"><span className="status-pill"><i />{status}</span><span className="order-date"><Clock3 size={13} /> {orders[0]?.due ?? 'Choose a tailor to get started'}</span></div>
        </section>
        <section className="card recommendations">
          <div className="card-heading"><div><div className="eyebrow">A PLACE TO START</div><h3>Made for your mood</h3></div><span className="demo-chip"><Sparkles size={12} /> DEMO PICKS</span></div>
          <div className="recommendation-content"><div className="recommendation-img"><img src={`https://images.unsplash.com/${garments[1].image}?auto=format&fit=crop&w=360&q=75`} alt="Linen outfit inspiration" /><span>FIT PROFILE INSPIRED</span></div><div className="recommendation-info"><b>Linen, with room to move.</b><p>A breathable formal set to explore with your {profile.fit.toLowerCase()} fit preference.</p><button className="text-action" onClick={() => onNavigate('studio')}>Explore in studio <ArrowRight size={14} /></button></div></div>
        </section>
        <section className="learning-card">
          <div className="learning-card-top"><div className="learning-spark"><Sparkles size={18} /></div><span>THE IDEA BEHIND TAILORAX</span></div>
          <h3>Every fitting can teach us something.</h3><p>With your permission, future versions could learn from the small adjustments that make your next garment feel just right.</p>
          <button onClick={() => onNavigate('learning')}>Explore fit learning <ArrowRight size={15} /></button>
          <div className="learning-decoration">✳</div>
        </section>
      </div>
      <div className="demo-disclaimer"><Info size={15} /><span><strong>Prototype, not a trained AI.</strong> Demo suggestions are illustrative only. This experience does not produce calibrated measurements or ML predictions.</span><button onClick={() => onNavigate('learning')}>What’s in the demo? <ArrowRight size={14} /></button></div>
    </>
  )
}

function BodyScanner({ onContinue }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const landmarkerRef = useRef(null)
  const frameRef = useRef(0)
  const [view, setView] = useState('Front')
  const [cameraOn, setCameraOn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modelReady, setModelReady] = useState(false)
  const [detected, setDetected] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('Position yourself in the frame to begin.')
  const [landmarkCount, setLandmarkCount] = useState(0)

  const stopCamera = () => {
    cancelAnimationFrame(frameRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
    setDetected(false)
    setHint('Camera stopped. Your frames were not saved.')
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  useEffect(() => () => {
    cancelAnimationFrame(frameRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    landmarkerRef.current?.close()
  }, [])

  const drawPose = (landmarks, width, height, videoWidth, videoHeight) => {
    const canvas = canvasRef.current
    if (!canvas || !Array.isArray(landmarks) || landmarks.length === 0) return
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    const scale = Math.max(width / videoWidth, height / videoHeight)
    const offsetX = (width - videoWidth * scale) / 2
    const offsetY = (height - videoHeight * scale) / 2
    const point = (index) => {
      const item = landmarks[index]
      return { x: width - (item.x * videoWidth * scale + offsetX), y: item.y * videoHeight * scale + offsetY, visibility: item.visibility ?? 1 }
    }
    const bodyJoints = new Set([11,12,13,14,15,16,23,24,25,26,27,28,29,30,31,32])
    const connections = PoseLandmarker.POSE_CONNECTIONS
    const links = []
    if (Array.isArray(connections)) {
      connections.forEach((connection) => {
        if (!connection || typeof connection !== 'object') return
        const start = connection.start ?? connection[0]
        const end = connection.end ?? connection[1]
        if (bodyJoints.has(start) && bodyJoints.has(end)) links.push([start, end])
      })
    }
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    links.forEach((link) => {
      const a = link[0]
      const b = link[1]
      if (!landmarks[a] || !landmarks[b] || (landmarks[a].visibility ?? 1) < 0.35 || (landmarks[b].visibility ?? 1) < 0.35) return
      const p1 = point(a); const p2 = point(b)
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y)
      ctx.strokeStyle = 'rgba(99, 102, 241, .88)'; ctx.stroke()
    })
    landmarks.forEach((landmark, index) => {
      if (!landmark || (landmark.visibility ?? 1) < 0.35 || ![11,12,13,14,15,16,23,24,25,26,27,28,29,30,31,32].includes(index)) return
      const p = point(index)
      ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'; ctx.fill()
      ctx.lineWidth = 2.5; ctx.strokeStyle = '#6366f1'; ctx.stroke()
    })
  }

  const detectFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !landmarkerRef.current || video.readyState < 2) {
      frameRef.current = requestAnimationFrame(detectFrame)
      return
    }
    try {
      const result = landmarkerRef.current.detectForVideo(video, performance.now())
      const resultLandmarks = result && typeof result === 'object'
        ? (Array.isArray(result.poseLandmarks)
          ? result.poseLandmarks
          : Array.isArray(result.landmarks)
            ? result.landmarks
            : [])
        : []
      const firstPose = resultLandmarks[0]
      const pose = Array.isArray(firstPose) ? firstPose : resultLandmarks
      const hasPose = Array.isArray(pose) && pose.length > 0
        && pose.some((landmark) => landmark && typeof landmark === 'object')
      if (hasPose) {
        drawPose(pose, canvas.parentElement.clientWidth, canvas.parentElement.clientHeight, video.videoWidth, video.videoHeight)
        const visible = pose.filter((point) => point && (point.visibility ?? 1) > 0.35).length
        setLandmarkCount(visible)
        if (visible >= 8) {
          setDetected(true)
          setHint(view === 'Front' ? 'Great posture. Keep facing forward and hold still.' : 'Side profile detected. Keep your arms relaxed.')
        } else {
          setDetected(false)
          setHint('Step back a little so more of your body is visible.')
        }
      } else {
        setDetected(false)
        setLandmarkCount(0)
        setHint('No pose detected yet. Stand in the center of the frame.')
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
    } catch (detectionError) {
      setError(`Pose detection stopped: ${detectionError.message || 'unexpected frame error'}`)
      cancelAnimationFrame(frameRef.current)
      return
    }
    frameRef.current = requestAnimationFrame(detectFrame)
  }

  const startCamera = async () => {
    setError('')
    setLoading(true)
    setHint('Requesting camera access…')
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is unavailable. Open this page over HTTPS or localhost in a supported browser.')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      streamRef.current = stream
      if (!videoRef.current) throw new Error('Camera preview could not be initialized.')
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCameraOn(true)
      setHint('Loading the pose model for local detection…')
      if (!landmarkerRef.current) {
        const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm')
        const modelOptions = {
          baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task' },
          runningMode: 'VIDEO', numPoses: 1, minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5, minTrackingConfidence: 0.5,
        }
        try {
          landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, { ...modelOptions, baseOptions: { ...modelOptions.baseOptions, delegate: 'GPU' } })
        } catch {
          landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, modelOptions)
        }
      }
      setModelReady(true)
      setHint('Camera is ready. Move into the frame to detect your pose.')
      setLoading(false)
      frameRef.current = requestAnimationFrame(detectFrame)
    } catch (cameraError) {
      setLoading(false)
      stopCamera()
      let message = cameraError.message || 'The camera or pose model could not be started.'
      if (cameraError.name === 'NotAllowedError') message = 'Camera permission was denied. Allow camera access in your browser settings, then try again.'
      if (cameraError.name === 'NotFoundError') message = 'No camera was found. Connect a camera and retry.'
      if (cameraError.name === 'NotReadableError') message = 'Your camera may already be in use by another app. Close it there and retry.'
      if (cameraError.name === 'SecurityError') message = 'Camera access requires localhost or a secure HTTPS connection.'
      setError(message)
      setHint('Camera could not start. See the message above and try again.')
    }
  }

  const retryModel = () => {
    landmarkerRef.current?.close()
    landmarkerRef.current = null
    setModelReady(false)
    setError('')
    stopCamera()
    startCamera()
  }

  return (
    <>
      <PageHeading eyebrow="BODY SCAN · LOCAL PROCESSING" title="Let’s start with you." description="A live pose preview gives your fit profile a starting point. No images or camera frames leave this device." action={<span className="privacy-badge"><ShieldCheck size={15} /> Private & local</span>} />
      <div className="scan-layout">
        <div className="scan-main-column">
          <div className="card scan-card">
            <div className="scan-card-top"><div><div className="eyebrow">LIVE POSE PREVIEW</div><h3>Find your natural stance</h3></div><div className={`camera-state ${cameraOn ? (modelReady ? 'state-live' : 'state-loading') : ''}`}><i />{cameraOn ? (modelReady ? 'CAMERA LIVE' : 'CONNECTING') : 'CAMERA OFF'}</div></div>
            <div className="view-toggle"><span>Scan angle</span>{['Front', 'Side'].map((angle) => <button key={angle} className={view === angle ? 'selected' : ''} onClick={() => { setView(angle); setHint(angle === 'Front' ? 'Face the camera with your shoulders relaxed.' : 'Turn 90° to show a comfortable side profile.') }}>{angle} view</button>)}</div>
            <div className={`camera-stage ${cameraOn ? 'camera-active' : ''}`}>
              <video ref={videoRef} className="camera-video" playsInline muted />
              <canvas ref={canvasRef} className="pose-canvas" />
              {!cameraOn && <div className="camera-placeholder"><div className="scan-illustration"><div className="scan-orbit orbit-one" /><div className="scan-orbit orbit-two" /><div className="scan-person"><div className="scan-head" /><div className="scan-body" /><div className="scan-arms" /><div className="scan-legs" /></div><div className="scan-target target-a" /><div className="scan-target target-b" /><div className="scan-target target-c" /></div><strong>Your private fitting room</strong><span>Allow camera access when you’re ready to begin</span></div>}
              {cameraOn && <><div className="camera-corner corner-tl" /><div className="camera-corner corner-tr" /><div className="camera-corner corner-bl" /><div className="camera-corner corner-br" /><div className="camera-live-tag"><i /> LIVE · ON DEVICE</div><div className="pose-tip">{detected ? <CheckCircle2 size={15} /> : <Focus size={15} />}{hint}</div>{detected && <div className="landmark-counter">{landmarkCount} landmarks visible</div>}</>}
            </div>
            {error && <div className="scan-error"><Info size={17} /><div><strong>We couldn’t start the scan</strong><span>{error}</span></div><button onClick={retryModel}>Retry <RotateCcw size={14} /></button></div>}
            <div className="scan-controls">
              {cameraOn ? <button className="button button-outline" onClick={stopCamera}><CameraOff size={16} /> Stop camera</button> : <button className="button button-primary" onClick={startCamera} disabled={loading}>{loading ? <><span className="spinner" /> Connecting…</> : <><Camera size={16} /> Start camera</>}</button>}
              <button className="button button-primary scan-continue" disabled={!detected} onClick={() => { stopCamera(); onContinue() }}>Capture & continue <ArrowRight size={16} /></button>
            </div>
            <div className="scan-status"><span className={detected ? 'status-green' : ''}><Activity size={14} />{detected ? 'Pose detected' : modelReady ? 'Waiting for pose' : 'Pose detection idle'}</span><span><ShieldCheck size={14} /> Frames are never saved or uploaded</span></div>
          </div>
          <div className="measurement-note"><Info size={16} /><div><strong>A helpful distinction</strong><p>Landmarks show body position only. This demo does not turn them into calibrated centimetre measurements. Profile values remain editable sample values.</p></div></div>
        </div>
        <aside className="scan-aside">
          <div className="card scan-guide"><div className="guide-icon"><Focus size={18} /></div><div className="eyebrow">BEFORE YOU BEGIN</div><h3>A little space makes a big difference.</h3><ul>{['Stand 2–3 metres from your camera', 'Keep your full body inside the frame', 'Face a bright, even light source', 'Stand naturally, arms relaxed at your sides'].map((text, i) => <li key={text}><span>{String(i + 1).padStart(2, '0')}</span>{text}</li>)}</ul></div>
          <div className="card scan-privacy"><ShieldCheck size={19} /><div><strong>Your privacy comes first</strong><p>Camera access starts only when you choose. Pose detection runs in your browser. Frames are not recorded, stored or sent anywhere.</p></div></div>
          <div className="scan-step-note"><span className="step-number">01</span><div><b>This is step one.</b><p>You can review and edit all fit profile details before saving them.</p><button onClick={() => { stopCamera(); onContinue() }}>Skip scan for now <ArrowRight size={14} /></button></div></div>
        </aside>
      </div>
    </>
  )
}

function ProfilePage({ profile, setProfile, toast, feedback, onNavigate }) {
  const measurementFields = [
    ['chest', 'Chest', 'Across the fullest part'], ['waist', 'Waist', 'Around your natural waist'], ['hip', 'Hip', 'Around the fullest part'],
    ['shoulders', 'Shoulders', 'Shoulder point to point'], ['sleeve', 'Sleeve length', 'Shoulder to wrist'], ['kameez', 'Kameez length', 'Shoulder to desired hem'],
    ['shalwar', 'Shalwar length', 'Waist to ankle'], ['opening', 'Bottom opening', 'Around the ankle opening'],
  ]
  const update = (key, value) => setProfile((current) => ({ ...current, [key]: value }))
  return <>
    <PageHeading eyebrow="YOUR PERSONAL FIT PROFILE" title="The details that make it yours." description="Your fit preferences and measurements, all in one place. Everything here is a demo value you can edit." action={<span className="sample-tag large-tag"><Info size={13} /> SAMPLE PROFILE</span>} />
    <div className="profile-page-grid">
      <div className="profile-main">
        <section className="card profile-details-card"><div className="card-heading"><div><div className="eyebrow">ABOUT YOU</div><h3>A little about yourself</h3></div><span className="editable-label"><Check size={13} /> Editable demo info</span></div>
          <div className="profile-identity"><div className="avatar avatar-large">AM</div><div className="identity-fields"><label>Full name<input value={profile.name} onChange={(event) => update('name', event.target.value)} /></label><label>Email address<input value={profile.email} onChange={(event) => update('email', event.target.value)} /></label></div></div>
          <div className="profile-select-row"><label>Body type<select value={profile.bodyType} onChange={(event) => update('bodyType', event.target.value)}>{['Athletic', 'Average', 'Broad', 'Lean', 'Prefer not to say'].map((x) => <option key={x}>{x}</option>)}</select></label><label>Preferred fit<select value={profile.fit} onChange={(event) => update('fit', event.target.value)}>{['Slim', 'Regular', 'Loose'].map((x) => <option key={x}>{x}</option>)}</select></label></div>
        </section>
        <section className="card measurements-card"><div className="card-heading"><div><div className="eyebrow">BODY MEASUREMENTS</div><h3>Your sample measurements</h3><p className="subtle-copy">Centimetres · illustrative values, not measured or calibrated.</p></div><span className="unit-pill">CM</span></div>
          <div className="measurements-grid">{measurementFields.map(([key, label, help]) => <label className="measurement-field" key={key}><span>{label}</span><span className="measurement-input"><input type="number" min="1" max="300" value={profile[key]} onChange={(event) => update(key, event.target.value)} /><small>cm</small></span><em>{help}</em></label>)}</div>
          <div className="measurement-actions"><span><Info size={14} /> These are sample values to explore the experience.</span><button className="button button-primary" onClick={() => toast('Fit profile saved on this device')}><Check size={16} /> Save fit profile</button></div>
        </section>
      </div>
      <aside className="profile-side">
        <div className="profile-tip-card"><div className="tip-spark"><Lightbulb size={18} /></div><div className="eyebrow">A NOTE ON MEASUREMENTS</div><h3>Made for your tailor, not a tape measure.</h3><p>For real garments, have your tailor confirm each measurement. A camera-based pose is a useful starting point — never a centimetre-perfect measurement.</p><button onClick={() => onNavigate('scan')}>Visit body scan <ArrowRight size={14} /></button></div>
        <div className="card history-card"><div className="card-heading"><div><div className="eyebrow">YOUR FIT HISTORY</div><h3>Recent alterations</h3></div><History size={18} className="muted-icon" /></div>
          {feedback.slice(0, 3).map((item, i) => <div className="history-entry" key={`${item.date}-${i}`}><div className="history-dot" /><div><b>{item.area} · {item.type.toLowerCase()}</b><span>{item.amount} · {item.garment}</span><small>{item.date}</small></div></div>)}
          <button className="text-action" onClick={() => onNavigate('learning')}>See all fit feedback <ArrowRight size={14} /></button>
        </div>
        <div className="card previous-orders"><div className="eyebrow">GARMENT HISTORY</div><h3>Previous orders</h3><div className="previous-order-row"><div className="order-mini-thumb"><Shirt size={18} /></div><div><b>Classic Cotton Kameez</b><span>Everyday · Demo order</span></div><ChevronRight size={15} /></div><div className="previous-order-row"><div className="order-mini-thumb warm"><Shirt size={18} /></div><div><b>Linen Formal Set</b><span>Formal · Demo order</span></div><ChevronRight size={15} /></div></div>
      </aside>
    </div>
  </>
}

function StudioPage({ selected, onSelect, onCustomize, onOrder }) {
  const [filter, setFilter] = useState('All pieces')
  const [search, setSearch] = useState('')
  const categories = ['All pieces', 'Everyday', 'Formal', 'Casual']
  const shown = garments.filter((item) => (filter === 'All pieces' || item.category === filter) && `${item.name} ${item.type} ${item.fabric}`.toLowerCase().includes(search.toLowerCase()))
  return <>
    <PageHeading eyebrow="GARMENT STUDIO · DEMO CATALOG" title="Find a piece that feels like you." description="Explore a curated sample collection. Prices and products are illustrative demo data." action={<span className="demo-chip"><Sparkles size={13} /> SAMPLE COLLECTION</span>} />
    <div className="studio-toolbar"><div className="filter-tabs">{categories.map((category) => <button key={category} className={filter === category ? 'selected' : ''} onClick={() => setFilter(category)}>{category}</button>)}</div><label className="search-field"><Search size={16} /><input placeholder="Search garments" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
    <div className="garment-grid">{shown.map((item) => <article className={`garment-card ${selected?.id === item.id ? 'garment-selected' : ''}`} key={item.id}><div className="garment-image"><img src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=650&q=80`} alt={item.name} onError={(event) => { event.currentTarget.style.display = 'none' }} /><span className="garment-tag">{item.tag}</span><button className={`heart-button ${selected?.id === item.id ? 'hearted' : ''}`} onClick={() => onSelect(item)} aria-label={`Select ${item.name}`}><Heart size={17} fill={selected?.id === item.id ? 'currentColor' : 'none'} /></button></div><div className="garment-copy"><div className="garment-meta">{item.type}<span>·</span>{item.category}</div><h3>{item.name}</h3><p>{item.fabric}</p><div className="garment-swatches"><span style={{ background: item.color }} /><span style={{ background: '#e9e5df' }} /><span style={{ background: '#526675' }} /><small>3 demo shades</small></div><div className="garment-bottom"><strong>{item.price}</strong><span>Illustrative price</span></div><button className={`button ${selected?.id === item.id ? 'button-selected' : 'button-outline'} garment-cta`} onClick={() => onSelect(item)}>{selected?.id === item.id ? <><Check size={15} /> Selected</> : <>Customize fit <ArrowRight size={15} /></>}</button></div></article>)}</div>
    {shown.length === 0 && <div className="empty-state"><Search size={24} /><strong>No pieces found</strong><span>Try another search or category.</span></div>}
    <div className="studio-selection-bar"><div><div className="selected-check"><Check size={15} /></div><div><span>YOUR FITTING SELECTION</span><strong>{selected?.name ?? 'Choose a garment to begin'}</strong></div></div><div><button className="button button-outline" onClick={onCustomize}>Review fit profile</button><button className="button button-primary" onClick={onOrder}>Find a tailor <ArrowRight size={15} /></button></div></div>
  </>
}

function TailorsPage({ selected, onSelect, onOrder }) {
  return <>
    <PageHeading eyebrow="FIND A TAILOR · SAMPLE DIRECTORY" title="Good hands make great fits." description="Meet demo tailor profiles created for this prototype. Listings, ratings and prices are illustrative, not verified businesses." action={<div className="area-select"><Compass size={15} /><span>Lahore, Pakistan</span><ChevronDown size={14} /></div>} />
    <div className="tailor-intro"><div className="tailor-intro-icon"><UsersRound size={18} /></div><div><b>Your selected garment is ready to be brought to life.</b><span>{readSaved('tailorax-garment', garments[0]).name} · Illustrative garment pricing shown separately</span></div><button className="text-action" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Change garment <ArrowRight size={14} /></button></div>
    <div className="tailor-list">{tailors.map((tailor, i) => <article className={`tailor-card ${selected === tailor.name ? 'tailor-selected' : ''}`} key={tailor.name}><div className={`tailor-avatar ${tailor.color}`}>{tailor.initials}<span>{i === 0 ? '✦' : '✓'}</span></div><div className="tailor-info"><div className="tailor-name-row"><h3>{tailor.name}</h3><span className="rating"><Star size={14} fill="currentColor" />{tailor.rating} <small>demo</small></span></div><span className="tailor-shop">{tailor.shop}</span><p>{tailor.specialty}</p><div className="tailor-tags"><span><Compass size={13} />{tailor.area}</span><span><Clock3 size={13} />{tailor.time}</span></div></div><div className="tailor-price"><span>STITCHING FROM</span><strong>{tailor.price}</strong><small>Illustrative price</small><button className={`button ${selected === tailor.name ? 'button-selected' : 'button-outline'}`} onClick={() => onSelect(tailor)}>{selected === tailor.name ? <><Check size={15} /> Selected</> : <>Select tailor <ArrowRight size={14} /></>}</button></div></article>)}</div>
    <div className="demo-disclaimer"><Info size={15} /><span>All tailor profiles, service areas, sample ratings, turnaround times and stitching prices on this screen are fictional demonstration data.</span></div>
    <div className="tailor-footer"><span>{selected ? <><CheckCircle2 size={16} /> {selected} selected</> : <>Choose a tailor to continue with your demo order</>}</span><button className="button button-primary" disabled={!selected} onClick={onOrder}>Continue to demo order <ArrowRight size={15} /></button></div>
  </>
}

function OrdersPage({ orders, onDetail }) {
  const steps = ['Confirmed', 'Stitching', 'Ready for pickup', 'Completed']
  return <>
    <PageHeading eyebrow="YOUR TAILORING JOURNAL" title="A little progress, beautifully made." description="Follow your sample orders from first fitting to finished garment." action={<span className="sample-tag large-tag"><Package size={13} /> DEMO ORDERS</span>} />
    <div className="orders-summary"><div><span>ACTIVE IN THE WORKROOM</span><strong>{orders.filter((item) => item.step < 3).length.toString().padStart(2, '0')}</strong></div><div><span>YOUR TAILOR</span><strong>{new Set(orders.map((order) => order.tailor)).size.toString().padStart(2, '0')}</strong></div><div><span>FIT PREFERENCE</span><strong>{readSaved('tailorax-profile', defaultProfile).fit}</strong></div><div className="orders-summary-note"><Sparkles size={16} /><span>Illustrative demo history<br />saved on this device</span></div></div>
    <div className="orders-list">{orders.map((order) => <article className="card order-card" key={order.number}><div className="order-card-top"><div className="order-card-identity"><div className="order-icon"><Shirt size={20} /></div><div><div className="order-id">ORDER {order.number}</div><h3>{order.garment}</h3><span>With {order.tailor} <i /> Ordered {order.date}</span></div></div><span className={`order-status status-${order.status.toLowerCase().replaceAll(' ', '-')}`}><i />{order.status}</span></div><div className="order-card-progress">{steps.map((step, index) => <div className={`order-step ${index <= order.step ? 'complete' : ''}`} key={step}><span>{index < order.step ? <Check size={13} /> : index + 1}</span><small>{step}</small>{index < 3 && <i />}</div>)}</div><div className="order-card-bottom"><div><span><CalendarIcon /> EST. COMPLETION</span><strong>{order.due}</strong></div><div><span><Ruler size={13} /> FIT USED</span><strong>{order.fit} · sample profile</strong></div><div><span><CreditCard size={13} /> GARMENT PRICE</span><strong>{order.price} · demo</strong></div><button className="button button-outline" onClick={() => onDetail(order)}>View order details <ArrowRight size={14} /></button></div></article>)}</div>
    {orders.length === 0 && <div className="empty-state"><Package size={28} /><strong>Your workroom is quiet for now.</strong><span>Select a garment and tailor to start a demo order.</span></div>}
    <div className="orders-next-step"><div className="orders-next-icon"><MessageCircle size={18} /></div><div><b>Every fitting adds to your story.</b><span>Once a garment is finished, share what felt right and what could be adjusted.</span></div><button className="button button-outline" onClick={() => window.dispatchEvent(new CustomEvent('tailorax-nav', { detail: 'learning' }))}>Share fit feedback <ArrowRight size={14} /></button></div>
  </>
}

function CalendarIcon() { return <Clock3 size={13} /> }

function OrderModal({ order, onClose }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="order-modal" role="dialog" aria-modal="true" aria-label="Order details"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="eyebrow">DEMO ORDER · {order.number}</div><div className="modal-garment-icon"><Shirt size={24} /></div><h2>{order.garment}</h2><p>Sample tailoring order details for your TailoraX demonstration.</p><div className="modal-detail-grid"><div><span>Selected tailor</span><strong>{order.tailor}</strong></div><div><span>Current status</span><strong>{order.status}</strong></div><div><span>Order date</span><strong>{order.date}</strong></div><div><span>Estimated completion</span><strong>{order.due}</strong></div><div><span>Fit profile</span><strong>{order.fit} · sample</strong></div><div><span>Illustrative price</span><strong>{order.price}</strong></div></div><div className="modal-footnote"><Info size={15} /> Demo data only. No payment or real tailor booking is made.</div><button className="button button-primary modal-done" onClick={onClose}>Done <Check size={15} /></button></section></div>
}

function LearningPage({ feedback, setFeedback, toast }) {
  const [form, setForm] = useState({ area: 'Sleeve', type: 'Shortened', amount: '1 cm', comment: '' })
  const submit = (event) => {
    event.preventDefault()
    if (!form.amount.trim()) return
    const entry = { ...form, comment: form.comment.trim(), date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), garment: readSaved('tailorax-garment', garments[0]).name }
    setFeedback((current) => [entry, ...current])
    setForm({ area: 'Sleeve', type: 'Shortened', amount: '1 cm', comment: '' })
    toast('Alteration feedback added to your local demo history')
  }
  const steps = [
    ['01', 'Capture & verify', 'Start with a pose and confirm your measurements with a tailor.'],
    ['02', 'Build your fit profile', 'Keep body measurements and fit preferences together.'],
    ['03', 'Explore a first fit', 'See illustrative suggestions based on your profile.'],
    ['04', 'Record alterations', 'Note what your tailor adjusted after the fitting.'],
    ['05', 'Learn for next time', 'Use fitting history as context for future recommendations.'],
  ]
  return <>
    <PageHeading eyebrow="THE RESEARCH IDEA · FIT LEARNING" title={<>Better fit starts<br className="desktop-break" /> with listening.</>} description="TailoraX explores how a personal fitting history might help make future garment recommendations feel more like you." action={<span className="research-tag"><Lightbulb size={14} /> RESEARCH PROTOTYPE</span>} />
    <div className="learning-callout"><div className="learning-callout-icon"><Sparkles size={20} /></div><div><strong>The central idea</strong><p>Body measurements describe a starting point. Preferences describe how you like to wear a garment. Alteration history can capture what needed changing. Together, they could inform more personalized future fit recommendations.</p></div><span>AN EXPLORATION<br />NOT A TRAINED MODEL</span></div>
    <div className="learning-flow">{steps.map(([number, title, copy], index) => <div className="learning-flow-step" key={number}><div className={`flow-number flow-${index}`}>{number}</div><div><strong>{title}</strong><span>{copy}</span></div>{index < 4 && <ArrowRight size={16} className="flow-arrow" />}</div>)}</div>
    <div className="learning-content-grid">
      <section className="card feedback-form-card"><div className="card-heading"><div><div className="eyebrow">A FITTING IS A CONVERSATION</div><h3>What did your tailor adjust?</h3><p className="subtle-copy">Add sample feedback to see how history could be captured.</p></div><div className="feedback-icon"><MessageCircle size={18} /></div></div><form onSubmit={submit}><label>Garment area<select value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })}>{['Sleeve', 'Chest', 'Waist', 'Shoulder', 'Kameez length', 'Shalwar length', 'Hip', 'Bottom opening', 'Other'].map((x) => <option key={x}>{x}</option>)}</select></label><div className="form-split"><label>Alteration<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>{['Shortened', 'Lengthened', 'Taken in', 'Let out', 'Adjusted', 'Other'].map((x) => <option key={x}>{x}</option>)}</select></label><label>Amount<input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="e.g. 1.5 cm" required /></label></div><label>Anything else? <span className="optional-label">OPTIONAL</span><textarea rows="3" maxLength="240" value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} placeholder="A note about how the fit felt…" /></label><div className="feedback-form-bottom"><span><ShieldCheck size={14} /> Kept in this browser only</span><button className="button button-primary" type="submit"><Plus size={16} /> Add to fit history</button></div></form></section>
      <section className="card feedback-history-card"><div className="card-heading"><div><div className="eyebrow">LOCAL DEMO HISTORY</div><h3>Fitting notes</h3></div><span className="history-count">{feedback.length} ENTRIES</span></div>{feedback.length ? <div className="feedback-history-list">{feedback.map((entry, index) => <article className="feedback-entry" key={`${entry.date}-${entry.area}-${index}`}><div className="feedback-entry-icon"><Ruler size={16} /></div><div className="feedback-entry-content"><div><strong>{entry.area} <span>·</span> {entry.type}</strong><b>{entry.amount}</b></div><p>{entry.comment || 'No additional note added.'}</p><small>{entry.garment} <i /> {entry.date}</small></div></article>)}</div> : <div className="empty-state compact-empty"><History size={22} /><strong>No fitting notes yet.</strong><span>Add a note to see your local history.</span></div>}<div className="history-explainer"><Info size={14} /><span>Entries demonstrate local history only; no adaptive model runs in this prototype.</span></div></section>
    </div>
    <section className="approach-section"><div className="section-heading"><div><div className="eyebrow">A PROGRESSION OF CONTEXT</div><h2>From measurements to memory.</h2></div><span className="demo-chip"><Info size={12} /> CONCEPTUAL COMPARISON</span></div><div className="approach-grid"><div className="approach-card"><span className="approach-index">01</span><div className="approach-icon approach-blue"><Ruler size={19} /></div><h3>Measurement-only</h3><p>A starting fit suggestion based on body measurements. Helpful, but doesn't know your personal preferences.</p><span className="approach-footer">FOUNDATION · CONCEPT</span></div><div className="approach-card"><span className="approach-index">02</span><div className="approach-icon approach-violet"><Heart size={19} /></div><h3>Preference-aware</h3><p>Adds the way you like clothes to feel — slim, regular or loose — to the initial fit context.</p><span className="approach-footer">MORE CONTEXT · CONCEPT</span></div><div className="approach-card approach-highlight"><span className="approach-index">03</span><div className="approach-icon approach-amber"><History size={19} /></div><h3>History-aware</h3><p>Could consider previous alterations and fitting feedback when exploring future recommendations.</p><span className="approach-footer">RESEARCH DIRECTION · NOT IMPLEMENTED</span></div></div><div className="honesty-note"><ShieldCheck size={16} /><span><strong>What this prototype actually does:</strong> displays sample recommendations and stores sample feedback locally. No trained model, accuracy score, MAE result or adaptive prediction engine is implemented.</span></div></section>
  </>
}

export default App
