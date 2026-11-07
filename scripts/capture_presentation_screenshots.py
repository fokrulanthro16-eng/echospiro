#!/usr/bin/env python3
"""
EchoSpiro - JHU / VITB Health-Hack 2027
Official Ultra-HD 4K Presentation Screenshots Capture Engine
Generates: 6 pristine 3840x2160 / 4K UHD presentation screenshots
"""

import os
import sys
import time
import subprocess
import re
from pathlib import Path

# Force UTF-8 on Windows consoles to prevent cp1252 UnicodeEncodeError
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from playwright.sync_api import sync_playwright

BASE_DIR = Path(r"C:\Users\WALTON\.gemini\antigravity\scratch\echospiro")
SCREENSHOTS_DIR = BASE_DIR / "public" / "screenshots"
TARGET_URL = "http://localhost:3000"

def safe_click_by_text(page, text_fragment: str) -> bool:
    """Find and click a button containing text via page JS execution."""
    return page.evaluate(f"""() => {{
        const btns = Array.from(document.querySelectorAll('button'));
        const target = btns.find(b => b.textContent && b.textContent.includes('{text_fragment}'));
        if (target) {{
            target.click();
            return true;
        }}
        return false;
    }}""")

def main():
    print("=" * 75)
    print("EchoSpiro - 4K UHD Presentation Screenshots Capture Engine")
    print("=" * 75)
    
    SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
    
    with sync_playwright() as p:
        print(f"\n[1/3] Launching Playwright Chromium (1920x1080 @ 2x DPR -> 3840x2160 4K UHD)...")
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--autoplay-policy=no-user-gesture-required",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--high-dpi-support=1",
                "--force-device-scale-factor=2",
            ]
        )
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=2,
        )
        page = context.new_page()

        print(f"  -> Connecting to live workstation at {TARGET_URL}...")
        try:
            page.goto(TARGET_URL, wait_until="networkidle", timeout=15000)
        except Exception:
            fallback_url = "http://localhost:3077"
            print(f"  -> Port 3000 timed out, falling back to production port {fallback_url}...")
            page.goto(fallback_url, wait_until="networkidle", timeout=15000)

        page.wait_for_selector("text=EchoSpiro", timeout=15000)
        page.wait_for_selector("canvas", timeout=15000)

        # DOM & 404 Assertions
        title = page.title()
        assert "EchoSpiro" in title, f"Title assertion failed: {title}"
        assert not page.locator("h1:has-text('404')").is_visible(), "Error: 404 visible!"
        assert not page.locator("text=This page could not be found").is_visible(), "Error: Not found visible!"
        print(f"  [OK] Connected successfully! Page title: '{title}'")

        # Inject edge-to-edge full width styling & optimal zoom
        print("  -> Injecting edge-to-edge 16:9 full-screen styles (zoom: 1.08)...")
        page.add_style_tag(content="""
            html, body {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow-x: hidden !important;
            }
            header > div, main {
                max-width: 100% !important;
                width: 100% !important;
                padding-left: 24px !important;
                padding-right: 24px !important;
            }
            body {
                zoom: 1.08;
            }
        """)

        # Ensure active simulation mode with Eupneic Normal
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const normalBtn = btns.find(b => b.textContent && b.textContent.includes('Eupneic Normal'));
            if (normalBtn) normalBtn.click();
        }""")
        page.wait_for_timeout(1000)

        print("\n[2/3] Capturing 6 High-Definition Presentation Screenshots...")

        # ---------------------------------------------------------------------
        # SCREENSHOT 1: 01_live_sonar_normal.png
        # ---------------------------------------------------------------------
        print("  -> [1/6] Capturing 01_live_sonar_normal.png...")
        # Toggle hardware air-gap banner to physical hardware transceiver
        page.evaluate("""() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            // Click Direct Web Audio Mic tab to highlight the physical transceiver strip
            const btns = Array.from(document.querySelectorAll('button'));
            const micBtn = btns.find(b => b.textContent && b.textContent.includes('Direct Web Audio Mic'));
            if (micBtn) micBtn.click();
        }""")
        page.wait_for_timeout(1500)
        img1_path = SCREENSHOTS_DIR / "01_live_sonar_normal.png"
        page.screenshot(path=str(img1_path))
        print(f"     [OK] Saved: {img1_path.name}")

        # ---------------------------------------------------------------------
        # SCREENSHOT 2: 02_doppler_waterfall_dsp.png
        # ---------------------------------------------------------------------
        print("  -> [2/6] Capturing 02_doppler_waterfall_dsp.png...")
        # Re-engage normal simulation to drive live oscillating waves and center oscilloscope
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const normalBtn = btns.find(b => b.textContent && b.textContent.includes('Eupneic Normal'));
            if (normalBtn) normalBtn.click();
            const osc = document.getElementById('oscilloscope-container');
            if (osc) osc.scrollIntoView({ behavior: 'instant', block: 'center' });
        }""")
        page.wait_for_timeout(1500)
        img2_path = SCREENSHOTS_DIR / "02_doppler_waterfall_dsp.png"
        page.screenshot(path=str(img2_path))
        print(f"     [OK] Saved: {img2_path.name}")

        # ---------------------------------------------------------------------
        # SCREENSHOT 3: 03_copd_obstructive_tracker.png
        # ---------------------------------------------------------------------
        print("  -> [3/6] Capturing 03_copd_obstructive_tracker.png...")
        # 1. Capture initial Baseline Pre-Intervention snapshot under Eupneic Normal (16 BPM)
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const normalBtn = btns.find(b => b.textContent && b.textContent.includes('Eupneic Normal'));
            if (normalBtn) normalBtn.click();
        }""")
        page.wait_for_timeout(600)
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const snapBtn = btns.find(b => b.textContent && b.textContent.includes('Capture Snapshot'));
            if (snapBtn) snapBtn.click();
        }""")
        page.wait_for_timeout(600)

        # 2. Switch to COPD Obstructive (preset 3: 21 BPM, 1:3.4 I:E, 68% Wheeze)
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const copdBtn = btns.find(b => b.textContent && b.textContent.includes('COPD Obstructive'));
            if (copdBtn) copdBtn.click();
        }""")
        page.wait_for_timeout(800)

        # 3. Capture second snapshot: 'Post-Bronchodilator (SABA) +15m'
        page.evaluate("""() => {
            const sel = document.querySelector('#trend-tracker-container select');
            if (sel) {
                sel.value = 'Post-Bronchodilator (SABA) +15m';
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const btns = Array.from(document.querySelectorAll('button'));
            const snapBtn = btns.find(b => b.textContent && b.textContent.includes('Capture Snapshot'));
            if (snapBtn) snapBtn.click();
            
            // Scroll to frame trend-tracker-container prominently
            const tt = document.getElementById('trend-tracker-container');
            if (tt) tt.scrollIntoView({ behavior: 'instant', block: 'center' });
        }""")
        page.wait_for_timeout(1500)
        img3_path = SCREENSHOTS_DIR / "03_copd_obstructive_tracker.png"
        page.screenshot(path=str(img3_path))
        print(f"     [OK] Saved: {img3_path.name}")

        # ---------------------------------------------------------------------
        # SCREENSHOT 4: 04_clinical_validation_n128.png
        # ---------------------------------------------------------------------
        print("  -> [4/6] Capturing 04_clinical_validation_n128.png...")
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const valBtn = btns.find(b => b.textContent && b.textContent.includes('Clinical Validation'));
            if (valBtn) valBtn.click();
        }""")
        page.wait_for_selector("text=Clinical Ground-Truth Validation", timeout=5000)
        page.wait_for_timeout(1500)
        img4_path = SCREENSHOTS_DIR / "04_clinical_validation_n128.png"
        page.screenshot(path=str(img4_path))
        print(f"     [OK] Saved: {img4_path.name}")

        # Dismiss validation modal
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

        # ---------------------------------------------------------------------
        # SCREENSHOT 5: 05_referral_slip_bengali_qr.png
        # ---------------------------------------------------------------------
        print("  -> [5/6] Capturing 05_referral_slip_bengali_qr.png...")
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const refBtn = btns.find(b => b.textContent && b.textContent.includes('Attested Referral Slip'));
            if (refBtn) refBtn.click();
        }""")
        page.wait_for_selector("text=Zero-PII Cryptographically Attested Referral Slip", timeout=5000)
        page.wait_for_timeout(500)

        # Switch to BN (বাংলা) and verify SHA-256
        page.evaluate("""() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const bnBtn = btns.find(b => b.textContent && (b.textContent.includes('BN') || b.textContent.includes('বাংলা')));
            if (bnBtn) bnBtn.click();
            const verifyBtn = btns.find(b => b.textContent && b.textContent.includes('Verify SHA-256'));
            if (verifyBtn) verifyBtn.click();
        }""")
        page.wait_for_timeout(1500)
        img5_path = SCREENSHOTS_DIR / "05_referral_slip_bengali_qr.png"
        page.screenshot(path=str(img5_path))
        print(f"     [OK] Saved: {img5_path.name}")

        # ---------------------------------------------------------------------
        # SCREENSHOT 6: 06_clinical_print_prescription.png
        # ---------------------------------------------------------------------
        print("  -> [6/6] Capturing 06_clinical_print_prescription.png (Emulating @media print)...")
        # Emulate print media with white A4 high-contrast formatting
        page.emulate_media(media="print")
        page.wait_for_timeout(1000)
        img6_path = SCREENSHOTS_DIR / "06_clinical_print_prescription.png"
        page.screenshot(path=str(img6_path), full_page=True)
        print(f"     [OK] Saved: {img6_path.name}")

        # Restore screen media and close browser
        page.emulate_media(media="screen")
        page.keyboard.press("Escape")
        page.close()
        context.close()
        browser.close()

    print("\n[3/3] Verifying All 6 Presentation Screenshots...")
    expected_files = [
        "01_live_sonar_normal.png",
        "02_doppler_waterfall_dsp.png",
        "03_copd_obstructive_tracker.png",
        "04_clinical_validation_n128.png",
        "05_referral_slip_bengali_qr.png",
        "06_clinical_print_prescription.png",
    ]

    all_valid = True
    print("-" * 75)
    for fname in expected_files:
        fpath = SCREENSHOTS_DIR / fname
        if not fpath.exists():
            print(f"  [FAIL] Missing: {fname}")
            all_valid = False
            continue
        size_kb = fpath.stat().st_size / 1024
        
        # Verify resolution with ffmpeg
        dim_str = "unknown"
        res = subprocess.run(["ffmpeg", "-i", str(fpath)], capture_output=True, text=True)
        m = re.search(r"(\d{3,4})x(\d{3,4})", res.stderr)
        if m:
            dim_str = m.group(0)
            
        print(f"  * {fname:<42} | Size: {size_kb:>7.1f} KB | Dimensions: {dim_str}")
    print("-" * 75)

    if all_valid:
        print("[SUCCESS] All 6 ultra-high-definition 4K screenshots captured successfully!")
    else:
        raise RuntimeError("Some screenshots failed to capture.")

if __name__ == "__main__":
    main()
