# Contributing to EchoSpiro

[🌐 **Live Production Workstation**](https://echospiro-9a2u.vercel.app) • [🎬 **Watch 4K Video Pitch**](https://youtu.be/_lFlSE2TJYs) • [📖 **Project README**](README.md)

Thank you for your interest in contributing to **EchoSpiro**! We welcome contributions from biomedical engineers, DSP researchers, clinicians, and software developers committed to democratizing pulmonary healthcare at the sovereign edge.

---

## 1. Zero External Dependency Mandate

EchoSpiro is built on a **Zero External Runtime Dependency Mandate**. 
- **DO NOT** add third-party npm libraries for math, signal processing, charts, QR generation, or cryptography (e.g., no `mathjs`, `chart.js`, `qrcode`, `crypto-js`).
- All algorithms must be implemented using native **TypeScript, React, HTML5 Canvas 2D, SVG, and browser Web APIs (Web Audio API, WebCrypto API)**.
- Rationale: High reliability, zero supply-chain attack vectors, microsecond bundle sizes (<250 KB gzip), and immediate offline execution in low-bandwidth environments.

---

## 2. Development Workflow & Setup

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm 10+
- Modern Web Audio API compliant browser (Google Chrome, Microsoft Edge, Firefox, Safari)

### Local Setup
```bash
# Clone your fork
git clone https://github.com/<your-username>/echospiro.git
cd echospiro

# Install dependencies (only baseline Next.js / React / Tailwind)
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to interact with the workstation.

---

## 3. Pull Request Guidelines

1. **Branch Naming**:
   - `feat/feature-name` for new DSP or UI capabilities.
   - `fix/bug-name` for bug fixes or mathematical corrections.
   - `docs/doc-update` for documentation improvements.
2. **Type Checking & Linting**:
   Before submitting your PR, ensure that:
   ```bash
   npm run lint
   npm run build
   ```
   Both commands must pass with **0 errors and 0 warnings**.
3. **Commit Conventions**:
   Follow Conventional Commits:
   - `feat: add dual-microphone beamforming array support`
   - `fix: correct Doppler shift phase inversion in expiration waterfall`
   - `docs: update clinical validation Bland-Altman table`
   - `perf: optimize Float32Array ring buffer GC in AudioEngine`

---

## 4. Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for everyone. Please treat all contributors with respect, empathy, and professional integrity.

---

## 5. Clinical Safety & Ethics Notice

EchoSpiro is a medical software research platform. Any pull request that alters kinematic calculations, triage boundaries, or acoustic safety thresholds must include clinical rationale or peer-reviewed literature citations.
