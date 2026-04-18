import sys

filepath = 'e:/MY_projects/Antigravity1/css/styles.css'
with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the start of our new section
start_idx = -1
for i, line in enumerate(lines):
    if '/* ========= ANWESHANE Premium Redesign Styles ========= */' in line:
        start_idx = i
        break

if start_idx != -1:
    # Keep everything before our section
    new_content = lines[:start_idx]
    
    # Append the corrected styles
    corrected_styles = """/* ========= ANWESHANE Premium Redesign Styles ========= */

/* New Loader Styles */
.page-loader {
  position: fixed;
  inset: 0;
  background: var(--bg-dark);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.loader-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.cpu-container {
  width: min(80vw, 400px);
  aspect-ratio: 2/1;
  position: relative;
}

.cpu-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 10px var(--primary-glow));
}

.cpu-chip {
  animation: cpu-flicker 2s infinite alternate ease-in-out;
}

.cpu-text {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.loader-fest-name {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 5vw, 3rem);
  color: var(--primary);
  letter-spacing: 0.2em;
  text-shadow: 0 0 15px var(--primary-glow);
  margin-bottom: 8px;
}

.loader-fest-subtitle {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Hero Section Updates */
.tech-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 100px;
}

.tech-hero .hero-title {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 900;
  color: var(--primary);
  text-shadow: 0 0 30px var(--primary-glow);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.tech-hero .hero-subtitle {
  font-family: var(--font-heading);
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--secondary);
  font-weight: 600;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  margin-bottom: 40px;
}

/* Countdown Timer Styles */
.countdown-container {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.countdown-num {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  color: var(--white);
  line-height: 1;
}

.countdown-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-top: 8px;
}

/* Animations */
@keyframes cpu-flicker {
  0%, 100% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 15px var(--primary-glow)); }
  5%, 10% { opacity: 0.8; filter: brightness(0.8); }
  7% { opacity: 1; filter: brightness(1.5); }
}

.pulse-btn {
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 var(--primary-glow); }
  70% { box-shadow: 0 0 0 20px rgba(0, 255, 204, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0); }
}

.cpu-light {
  offset-anchor: center;
  animation: path-move infinite linear;
}

.cpu-light-1 {
  offset-path: path("M 10 20 h 79.5 q 5 0 5 5 v 30");
  animation-duration: 4s;
}

.cpu-light-2 {
  offset-path: path("M 180 10 h -69.7 q -5 0 -5 5 v 30");
  animation-duration: 3s;
  animation-delay: -1s;
}

@keyframes path-move {
  0% { offset-distance: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { offset-distance: 100%; opacity: 0; }
}

.hero-event-meta {
  display: flex;
  gap: 32px;
  margin-top: 40px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.tech-orb {
  width: 400px;
  height: 400px;
  position: relative;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--primary-glow), transparent 70%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.orb-inner {
  width: 80%;
  height: 80%;
  border: 2px dashed var(--primary);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_content)
        f.write(corrected_styles)
    print("CSS file fixed successfully.")
else:
    print("Section not found.")
