import Image from 'next/image'
import logo from '../logo.png'

const sports = [
  { name: 'Rugby', href: '/sports/rugby', image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85', text: 'The original Manchester Select event — competitive rugby with a bigger purpose.' },
  { name: 'Football', href: '/sports/football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85', text: 'Bring clubs, players and supporters together for something that matters.' },
  { name: 'Netball', href: '/sports/netball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85', text: 'More sport. More voices. More opportunities to make an impact.' },
]

function Logo() {
  return <a className="brand" href="/" aria-label="Manchester Select home"><Image src={logo} alt="Manchester Select" priority /></a>
}

export default function Home() {
  return <main className="site">
    <div className="topbar">Sport for community. Sport for good.</div>
    <nav className="nav"><Logo /><div className="navlinks"><a href="#sports">Sports</a><a href="#mission">Our mission</a><a href="#impact">Impact</a><a href="#involved">Get involved</a></div><a className="navcta" href="#involved">Support the cause</a><span className="navmobile">Menu</span></nav>

    <section className="hero"><div className="hero-inner"><div className="eyebrow">Manchester Select Charity</div><h1>More than a game.</h1><p className="hero-copy">Manchester Select uses the power of sport to bring people together, create unforgettable events and raise money for causes that matter across our community.</p><div className="actions"><a className="btn primary" href="#sports">Explore our sports</a><a className="btn" href="#mission">Why we do it</a></div></div></section>

    <section id="impact" className="section"><div className="impact"><div><strong>£85k+</strong><span>Raised through events</span></div><div><strong>100%</strong><span>Built around community</span></div><div><strong>3+</strong><span>Sports and growing</span></div><div><strong>1</strong><span>Purpose: positive impact</span></div></div></section>

    <section id="mission" className="section split"><div><div className="eyebrow">Why Manchester Select exists</div><h2>Sport brings people together.</h2></div><div><p className="lead">Manchester Select is a charity built around a simple idea: create great sporting experiences that do something meaningful beyond the final whistle.</p><p className="lead">We connect athletes, clubs, businesses, supporters and volunteers across Manchester to raise funds, build relationships and create moments people remember.</p></div></section>

    <section id="sports" className="section"><div className="sports-head"><div><div className="eyebrow">Choose your arena</div><h2>Our sports</h2></div><p className="small">One charity. Different sports. One shared purpose.</p></div><div className="grid">{sports.map((sport) => <a className="card" href={sport.href} key={sport.name}><img src={sport.image} alt=""/><div className="card-body"><div className="card-tag">Manchester Select</div><h3>{sport.name}</h3><p>{sport.text}</p><span className="btn">View {sport.name}</span></div></a>)}</div></section>

    <section id="involved" className="red-panel"><div className="section"><div><div className="eyebrow" style={{color:'#111'}}>Be part of it</div><h2>Play. Partner. Give.</h2></div><div><p>Whether you are a player, supporter, local business, club or volunteer, there is a place for you at Manchester Select.</p><div className="actions"><a className="btn dark" href="mailto:hello@manchesterselectrl.co.uk">Get in touch</a><a className="btn dark" href="#sports">Explore events</a></div><div className="statline"><div><strong>Players</strong><span>Compete</span></div><div><strong>Partners</strong><span>Support</span></div><div><strong>Community</strong><span>Connect</span></div></div></div></div></section>

    <footer className="footer"><div className="footer-inner"><div className="footer-grid"><div><Logo /><p>Sport with purpose. A Manchester charity creating opportunities, raising funds and bringing people together through sport.</p></div><div><h3>Explore</h3><p><a href="#sports">Sports</a><br/><a href="#mission">Our mission</a><br/><a href="#impact">Our impact</a></p></div><div><h3>Connect</h3><p><a href="mailto:hello@manchesterselectrl.co.uk">hello@manchesterselectrl.co.uk</a><br/><a href="#involved">Get involved</a></p></div></div><div className="footer-bottom"><span>© 2026 Manchester Select</span><span>Sport for community. Sport for good.</span></div></div></footer>
  </main>
}
