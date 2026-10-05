import React, { useState } from 'react';

export default function App() {
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth' | 'dashboard'
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'create'
  const [selectedLang, setSelectedLang] = useState('English'); // 'English' | 'தமிழ்' | 'සිංහල'
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Dynamic Translations Dictionary
  const translations = {
    English: {
      timeGreeting: 'Good Afternoon',
      subtitle: 'EARLY WARNING SYSTEM',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      username: 'Username',
      usernameOrEmail: 'Username / Email',
      shopName: 'Shop Name',
      ownerName: 'Owner Full Name',
      whatsapp: 'WhatsApp Number',
      password: 'Password',
      tagline: 'KNOW YOUR CASH FLOW • GROW YOUR BUSINESS',
      todaysSales: "Today's Sales",
      totalOrders: 'Total Orders',
      lowStock: 'Low Stock',
      logout: 'Logout'
    },
    தமிழ்: {
      timeGreeting: 'மதிய வணக்கம்',
      subtitle: 'முன்னெச்சரிக்கை அமைப்பு',
      signIn: 'உள்நுழைக',
      createAccount: 'கணக்கை உருவாக்கு',
      username: 'பயனர் பெயர்',
      usernameOrEmail: 'பயனர் பெயர் / மின்னஞ்சல்',
      shopName: 'கடைப் பெயர்',
      ownerName: 'உரிமையாளரின் முழுப் பெயர்',
      whatsapp: 'வாட்ஸ்அப் எண்',
      password: 'கடவுச்சொல்',
      tagline: 'பணப்புழக்கத்தை அறிவோம் • வணிகத்தை வளர்ப்போம்',
      todaysSales: 'இன்றைய விற்பனை',
      totalOrders: 'மொத்த ஆர்டர்கள்',
      lowStock: 'குறைந்த இருப்பு',
      logout: 'வெளியேறு'
    },
    සිංහල: {
      timeGreeting: 'සුබ පස්වරුවක්',
      subtitle: 'පූර්ව අනතුරු ඇඟවීමේ පද්ධතිය',
      signIn: 'ඇතුළු වන්න',
      createAccount: 'ගිණුමක් සාදන්න',
      username: 'පරිශීලක නාමය',
      usernameOrEmail: 'පරිශීලක නාමය / විද්‍යුත් තැපෑල',
      shopName: 'සාප්පුවේ නම',
      ownerName: 'හිමිකරුගේ සම්පූර්ණ නම',
      whatsapp: 'වට්ස්ඇප් අංකය',
      password: 'මුරපදය',
      tagline: 'මුදල් ප්‍රවාහය දැනගන්න • ව්‍යාපාරය වර්ධනය කරන්න',
      todaysSales: 'අද දින විකුණුම්',
      totalOrders: 'මුළු ඇණවුම්',
      lowStock: 'අඩු තොග',
      logout: 'නික්මෙන්න'
    }
  };

  const t = translations[selectedLang];

  // Form State
  const [formData, setFormData] = useState({
    username: 'mala_stores',
    shopName: 'Mala Stores',
    ownerName: 'Mala',
    whatsapp: '7712134565',
    password: '••••••••',
    shopCategory: 'Retail Grocery'
  });

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setCurrentStep('dashboard');
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setCurrentStep('dashboard');
  };

  // LOGOUT FUNCTION - Resets back to Auth Page
  const handleLogout = () => {
    setCurrentStep('auth');
    setActiveTab('signin');
  };

  return (
      <div className="neomorphic-app-bg">
        <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Space Grotesk', 'Inter', 'Noto Sans Tamil', 'Noto Sans Sinhala', sans-serif;
        }

        .neomorphic-app-bg {
          min-height: 100vh;
          background: #0f121d;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          color: #e2e8f0;
        }

        .mobile-frame {
          width: 100%;
          max-width: 410px;
          height: 840px;
          background: #141824;
          border-radius: 40px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          box-shadow: 
            20px 20px 50px #0b0d14, 
            -20px -20px 50px #1d2334,
            inset 0 0 2px rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow-y: auto;
        }

        /* TOP BAR */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          z-index: 20;
        }

        .time-badge {
          font-size: 12px;
          font-weight: 700;
          color: #38bdf8;
          text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        }

        .greeting-text {
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
        }

        /* LANGUAGE SELECTOR */
        .lang-wrapper {
          position: relative;
        }

        .neomorphic-lang-btn {
          background: #141824;
          border: none;
          outline: none;
          color: #38bdf8;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 
            4px 4px 10px #0b0d14, 
            -4px -4px 10px #1d2334;
        }

        .lang-dropdown {
          position: absolute;
          right: 0;
          top: 40px;
          background: #141824;
          border-radius: 14px;
          padding: 6px;
          width: 110px;
          box-shadow: 
            8px 8px 20px #0b0d14, 
            -8px -8px 20px #1d2334;
          z-index: 50;
          border: 1px solid rgba(56, 189, 248, 0.2);
        }

        .lang-item {
          padding: 8px 10px;
          font-size: 12px;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .lang-item:hover, .lang-item.active {
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          font-weight: 700;
        }

        /* BIGGER & CENTERED HERO BRAND TITLE */
        .hero-brand-section {
          text-align: center;
          margin: 25px 0 15px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hero-brand-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 38px;
          font-weight: 900;
          letter-spacing: 5px;
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 25px rgba(56, 189, 248, 0.45);
          line-height: 1.1;
        }

        .hero-brand-subtitle {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: #64748b;
          margin-top: 6px;
          text-transform: uppercase;
        }

        /* NEOMORPHIC CARD SURFACE */
        .neo-card {
          background: #141824;
          border-radius: 28px;
          padding: 22px 18px;
          margin: auto 0;
          box-shadow: 
            12px 12px 30px #0b0d14, 
            -12px -12px 30px #1d2334;
        }

        .neo-tab-group {
          display: flex;
          background: #141824;
          padding: 5px;
          border-radius: 16px;
          margin-bottom: 18px;
          box-shadow: 
            inset 5px 5px 10px #0b0d14, 
            inset -5px -5px 10px #1d2334;
        }

        .neo-tab-btn {
          flex: 1;
          padding: 10px 0;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .neo-tab-btn.active {
          color: #38bdf8;
          background: #141824;
          box-shadow: 
            5px 5px 12px #0b0d14, 
            -5px -5px 12px #1d2334;
          text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
        }

        .input-group {
          margin-bottom: 11px;
        }

        .input-group label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .neo-input-box {
          display: flex;
          align-items: center;
          background: #141824;
          border-radius: 14px;
          padding: 2px 12px;
          box-shadow: 
            inset 4px 4px 8px #0b0d14, 
            inset -4px -4px 8px #1d2334;
          border: 1px solid transparent;
        }

        .neo-input-box input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 9px 0;
          color: #f1f5f9;
          font-size: 13px;
        }

        .phone-prefix {
          font-size: 13px;
          font-weight: 700;
          color: #38bdf8;
          margin-right: 10px;
        }

        /* SINGLE FULL WIDTH SUBMIT BUTTON */
        .btn-neo-submit {
          width: 100%;
          padding: 14px;
          margin-top: 16px;
          background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
          border: none;
          border-radius: 14px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 
            6px 6px 16px #0b0d14, 
            -6px -6px 16px #1d2334,
            0 0 15px rgba(56, 189, 248, 0.3);
        }

        .btn-neo-logout {
          width: 100%;
          padding: 14px;
          margin-top: 20px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          border-radius: 14px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 
            6px 6px 16px #0b0d14, 
            -6px -6px 16px #1d2334,
            0 0 15px rgba(239, 68, 68, 0.3);
        }

        /* DASHBOARD STYLES */
        .dash-card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
          margin-bottom: 14px;
        }

        .dash-metric-box {
          background: #141824;
          padding: 14px;
          border-radius: 18px;
          box-shadow: 5px 5px 12px #0b0d14, -5px -5px 12px #1d2334;
        }

        .metric-title {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
        }

        .metric-val {
          font-size: 16px;
          font-weight: 700;
          color: #38bdf8;
          margin-top: 6px;
        }

        .bottom-tagline {
          text-align: center;
          padding-top: 10px;
        }

        .motto-text {
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

        <div className="mobile-frame">
          {/* TOP BAR */}
          <header className="top-nav">
            <div>
              <span className="time-badge">15:02</span>
              <div className="greeting-text">{t.timeGreeting}</div>
            </div>

            <div className="lang-wrapper">
              <button
                  className="neomorphic-lang-btn"
                  onClick={() => setIsLangOpen(!isLangOpen)}
              >
                🌐 {selectedLang}
              </button>
              {isLangOpen && (
                  <div className="lang-dropdown">
                    <div
                        className={`lang-item ${selectedLang === 'English' ? 'active' : ''}`}
                        onClick={() => { setSelectedLang('English'); setIsLangOpen(false); }}
                    >
                      English
                    </div>
                    <div
                        className={`lang-item ${selectedLang === 'தமிழ்' ? 'active' : ''}`}
                        onClick={() => { setSelectedLang('தமிழ்'); setIsLangOpen(false); }}
                    >
                      தமிழ்
                    </div>
                    <div
                        className={`lang-item ${selectedLang === 'සිංහල' ? 'active' : ''}`}
                        onClick={() => { setSelectedLang('සිංහල'); setIsLangOpen(false); }}
                    >
                      සිංහල
                    </div>
                  </div>
              )}
            </div>
          </header>

          {/* HERO NEXFI TITLE BANNER */}
          <div className="hero-brand-section">
            <h1 className="hero-brand-title">NEXFI</h1>
            <p className="hero-brand-subtitle">{t.subtitle}</p>
          </div>

          {/* STEP 1: AUTHENTICATION SCREEN */}
          {currentStep === 'auth' && (
              <div className="neo-card">
                <div className="neo-tab-group">
                  <button
                      className={`neo-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                      onClick={() => setActiveTab('signin')}
                  >
                    {t.signIn}
                  </button>
                  <button
                      className={`neo-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                      onClick={() => setActiveTab('create')}
                  >
                    {t.createAccount}
                  </button>
                </div>

                {activeTab === 'signin' ? (
                    <form onSubmit={handleSignInSubmit}>
                      <div className="input-group">
                        <label>{t.usernameOrEmail}</label>
                        <div className="neo-input-box">
                          <input type="text" defaultValue="mala_stores" required />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>{t.password}</label>
                        <div className="neo-input-box">
                          <input type="password" defaultValue="••••••••" required />
                        </div>
                      </div>

                      <button type="submit" className="btn-neo-submit">
                        {t.signIn}
                      </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit}>
                      <div className="input-group">
                        <label>{t.username}</label>
                        <div className="neo-input-box">
                          <input
                              type="text"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label>{t.shopName}</label>
                        <div className="neo-input-box">
                          <input
                              type="text"
                              value={formData.shopName}
                              onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                              required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label>{t.ownerName}</label>
                        <div className="neo-input-box">
                          <input
                              type="text"
                              value={formData.ownerName}
                              onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                              required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label>{t.whatsapp}</label>
                        <div className="neo-input-box">
                          <span className="phone-prefix">+94</span>
                          <input
                              type="text"
                              value={formData.whatsapp}
                              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                              required
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label>{t.password}</label>
                        <div className="neo-input-box">
                          <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              required
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn-neo-submit">
                        {t.createAccount}
                      </button>
                    </form>
                )}
              </div>
          )}

          {/* STEP 2: DIRECT DASHBOARD DETAILS */}
          {currentStep === 'dashboard' && (
              <div className="neo-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', color: '#f8fafc' }}>{formData.shopName}</h3>
                      <span style={{ fontSize: '11px', color: '#38bdf8' }}>@{formData.username} • {formData.shopCategory}</span>
                    </div>
                  </div>

                  <div className="dash-card-grid">
                    <div className="dash-metric-box">
                      <span className="metric-title">{t.todaysSales}</span>
                      <div className="metric-val">Rs. 18,450</div>
                    </div>
                    <div className="dash-metric-box">
                      <span className="metric-title">{t.totalOrders}</span>
                      <div className="metric-val" style={{ color: '#818cf8' }}>34</div>
                    </div>
                    <div className="dash-metric-box">
                      <span className="metric-title">{t.lowStock}</span>
                      <div className="metric-val" style={{ color: '#f59e0b' }}>3 Items</div>
                    </div>
                  </div>
                </div>

                <button type="button" className="btn-neo-logout" onClick={handleLogout}>
                  {t.logout}
                </button>
              </div>
          )}

          {/* BOTTOM BRAND FOOTER */}
          <footer className="bottom-tagline">
            <p className="motto-text">{t.tagline}</p>
          </footer>
        </div>
      </div>
  );
}