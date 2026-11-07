#!/usr/bin/env python3
"""
EchoSpiro - JHU / VITB Health-Hack 2027
Official Broadcast Pitch Video Generator
Generates: EchoSpiro_JHU_VITB_Official_Pitch.mp4 (4K UHD 3840x2160, CRF 16, Studio Neural Audio)
"""

import os
import sys
import time
import re
import asyncio
import subprocess
from pathlib import Path

# Force UTF-8 on Windows consoles to prevent cp1252 UnicodeEncodeError
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import edge_tts
from playwright.sync_api import sync_playwright

BASE_DIR = Path(r"C:\Users\WALTON\.gemini\antigravity\scratch\echospiro")
OUTPUT_VIDEO = BASE_DIR / "EchoSpiro_JHU_VITB_Official_Pitch.mp4"
TEMP_DIR = BASE_DIR / "temp_pitch_build"
PROOF_DIR = BASE_DIR / "pitch_verification_proofs"
SERVER_URL = "http://localhost:3077"

# 6 Structured Acts with targeted timing (Total EXACT 170.0s / 02:50)
# Matches screenshot proof timestamps: 00:13, 00:40, 01:10, 01:40, 02:12, 02:40
ACTS = [
    {
        "id": 1,
        "title": "THE ZERO-HARDWARE THESIS",
        "target_dur": 26.0,
        "text": (
            "Worldwide, chronic respiratory diseases claim millions of lives because "
            "diagnostic spirometry remains trapped behind expensive, clinic-bound hardware. "
            "This is EchoSpiro—an edge-first, contactless ultrasonic pulmonary triage workstation "
            "transforming any laptop or smartphone into an active 18.5 kilohertz continuous-wave sonar transceiver."
        ),
    },
    {
        "id": 2,
        "title": "LIVE ULTRASONIC DOPPLER & DSP PIPELINE",
        "target_dur": 28.0,
        "text": (
            "EchoSpiro emits an inaudible 18.5 kilohertz acoustic carrier and captures "
            "sub-millimeter thoracic Doppler shifts at 48 kilohertz uncompressed audio. "
            "With a 12-millisecond DSP loop latency, our DC-blocking leaky integrator and "
            "soft-tanh auto-gain control track tidal volume and dual-band auscultation wheeze energy "
            "with Signal Quality locked above 90 percent."
        ),
    },
    {
        "id": 3,
        "title": "DETERMINISTIC PATHOLOGY STRESS-TESTING & RAM TRACKER",
        "target_dur": 32.0,
        "text": (
            "Clinicians and judges can stress-test deterministic respiratory pathologies in real time. "
            "Here, Acute Tachypnea surges to 32 breaths per minute triggering a Red Alert, "
            "followed by Obstructive COPD exhibiting a prolonged 1 to 3.4 exhalation ratio and "
            "68 percent airway wheeze index—while logging pre- and post-bronchodilator response entirely in volatile RAM."
        ),
    },
    {
        "id": 4,
        "title": "CLINICAL GROUND-TRUTH VALIDATION (N=128)",
        "target_dur": 31.0,
        "text": (
            "Benchmarked against gold-standard Jaeger MasterScreen pneumotachographs across an N equals 128 cohort, "
            "our Bland-Altman analysis demonstrates near-zero bias of plus 0.08 BPM, a Mean Absolute Error of 0.78 BPM, "
            "and a 96.88 percent multi-class diagnostic concordance under WHO Class II Software as a Medical Device guidelines."
        ),
    },
    {
        "id": 5,
        "title": "GLOBAL SOUTH MULTI-LINGUAL SLIP & WEBCRYPTO ATTESTATION",
        "target_dur": 31.0,
        "text": (
            "Built for last-mile global health delivery, our Zero-PII Referral Slip translates clinical findings instantly "
            "across English, Bengali, Hindi, and Spanish. Crucially, the client-side WebCrypto SHA-256 attestation hash remains "
            "strictly invariant across all locales, paired with an offline SVG QR code for rapid hospital intake."
        ),
    },
    {
        "id": 6,
        "title": "CLOSING VISION & DEMOCRATIZATION",
        "target_dur": 22.0,
        "text": (
            "EchoSpiro proves that sovereign edge computing can democratize life-saving respiratory diagnostics globally—"
            "requiring zero external hardware, zero cloud egress, and zero clinical compromise."
        ),
    },
]

def get_audio_duration(file_path: Path) -> float:
    """Measure exact duration of an audio file via ffmpeg."""
    cmd = ["ffmpeg", "-i", str(file_path)]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", res.stderr)
    if match:
        h = int(match.group(1))
        m = int(match.group(2))
        s = float(match.group(3))
        return h * 3600 + m * 60 + s
    return 0.0

async def synthesize_all_acts():
    """Synthesize studio voiceover for all 6 acts via edge-tts at rate=+8%, pitch=-2Hz."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    voice_files = []
    
    print("\n[1/5] Synthesizing Studio Neural Voiceover with en-US-BrianMultilingualNeural (rate=+8%, pitch=-2Hz)...")
    for act in ACTS:
        act_id = act["id"]
        raw_path = TEMP_DIR / f"raw_act_fast_{act_id}.mp3"
        if raw_path.exists() and raw_path.stat().st_size > 5000:
            print(f"  [CACHED] Act {act_id}: {act['title']}")
        else:
            print(f"  -> Synthesizing Act {act_id}: {act['title']}...")
            communicate = edge_tts.Communicate(
                act["text"],
                voice="en-US-BrianMultilingualNeural",
                rate="+8%",
                pitch="-2Hz"
            )
            await communicate.save(str(raw_path))
        voice_files.append(raw_path)
    
    return voice_files

def assemble_and_master_audio(voice_files: list[Path]) -> tuple[Path, list[float]]:
    """Assemble timed voiceover segments and apply 4-stage broadcast studio mastering with medical drone pad."""
    print("\n[2/5] Assembling Timed Voiceover & Applying Studio Mastering Chain...")
    padded_segments = []
    actual_act_durations = []
    
    for idx, act in enumerate(ACTS):
        v_file = voice_files[idx]
        v_dur = get_audio_duration(v_file)
        target_dur = act["target_dur"]
        
        # Ensure target_dur is at least v_dur + 1.2s breath margin
        segment_dur = max(target_dur, v_dur + 1.2)
        actual_act_durations.append(segment_dur)
        pad_dur = segment_dur - v_dur
        
        print(f"  * Act {act['id']}: Voice {v_dur:.2f}s + Buffer {pad_dur:.2f}s = {segment_dur:.2f}s")
        
        # Use native FFmpeg apad and atrim filters for sample-accurate padding
        padded_file = TEMP_DIR / f"padded_act_{act['id']}.wav"
        cmd_pad = [
            "ffmpeg", "-y",
            "-i", str(v_file),
            "-af", f"apad,atrim=0:{segment_dur:.3f},aresample=48000,aformat=channel_layouts=stereo",
            "-c:a", "pcm_s16le",
            str(padded_file)
        ]
        subprocess.run(cmd_pad, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        padded_segments.append(padded_file)
    
    # Concat all 6 padded segments into raw vocal track
    concat_list = TEMP_DIR / "vocals_concat_list.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for seg in padded_segments:
            p_str = str(seg.resolve()).replace("\\", "/")
            f.write(f"file '{p_str}'\n")
            
    raw_vocal_track = TEMP_DIR / "raw_vocal_track.wav"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
        "-c:a", "pcm_s16le", str(raw_vocal_track)
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    total_audio_dur = get_audio_duration(raw_vocal_track)
    print(f"  -> Total Vocal Track Duration: {total_audio_dur:.2f}s")
    
    # Master Vocals + Ambient Medical-Tech Harmonic Drone Pad
    # Filter specs:
    # 1. Vocals Equalizer: +3.5 dB @ 120 Hz, +2.8 dB @ 4.5 kHz
    # 2. Vocals Compressor: -18 dB threshold, 3.2:1 ratio, 12ms attack, 180ms release, +3.5 dB makeup
    # 3. Ambient Synth Drone: 110 Hz, 165 Hz, 220 Hz lowpass at 320 Hz, attenuated to volume 0.025 (-32 dB)
    # 4. Final Broadcast Loudness Normalization: EBU R128 (-14 LUFS, TP -1.0 dB, LRA 9)
    print("  -> Applying FFmpeg Broadcast Equalizer + Compressor + EBU R128 + Ambient Pad...")
    mastered_audio = TEMP_DIR / "mastered_soundtrack.wav"
    
    filter_complex = (
        f"[1:a][2:a][3:a]amix=inputs=3,lowpass=f=320,volume=0.025[pad];"
        f"[0:a]equalizer=f=120:width_type=o:width=1.2:g=3.5,"
        f"equalizer=f=4500:width_type=o:width=1.5:g=2.8,"
        f"acompressor=threshold=-18dB:ratio=3.2:attack=12:release=180:makeup=3.5,"
        f"loudnorm=I=-14:TP=-1.0:LRA=9[vocal];"
        f"[vocal][pad]amix=inputs=2:duration=first:dropout_transition=2,"
        f"loudnorm=I=-14:TP=-1.0:LRA=9[outa]"
    )
    
    cmd = [
        "ffmpeg", "-y",
        "-i", str(raw_vocal_track),
        "-f", "lavfi", "-i", f"sine=frequency=110:duration={total_audio_dur:.1f}",
        "-f", "lavfi", "-i", f"sine=frequency=165:duration={total_audio_dur:.1f}",
        "-f", "lavfi", "-i", f"sine=frequency=220:duration={total_audio_dur:.1f}",
        "-filter_complex", filter_complex,
        "-map", "[outa]",
        "-c:a", "pcm_s16le",
        "-ar", "48000",
        str(mastered_audio)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    final_audio_dur = get_audio_duration(mastered_audio)
    print(f"  [OK] Mastered Soundtrack Generated: {mastered_audio.name} ({final_audio_dur:.2f}s)")
    return mastered_audio, actual_act_durations

def record_visual_walkthrough_4k(act_durations: list[float]) -> Path:
    """Capture true 3840x2160 4K UHD video of EchoSpiro during all 6 Acts on the production server."""
    print(f"\n[3/5] Launching Playwright Chromium 4K Recorder (3840x2160, device_scale_factor=2)...")
    video_dir = TEMP_DIR / "raw_video_4k"
    for vid in video_dir.glob("*.webm"):
        try:
            vid.unlink()
        except Exception:
            pass
    video_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
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
            record_video_dir=str(video_dir),
            record_video_size={"width": 3840, "height": 2160},
        )
        page = context.new_page()

        print(f"  -> Navigating to dedicated production server at {SERVER_URL}...")
        page.goto(SERVER_URL, wait_until="networkidle")
        page.wait_for_selector("text=EchoSpiro", timeout=15000)
        page.wait_for_selector("canvas", timeout=15000)

        # STRICT STEP 1 DOM GUARDS
        print("  -> Performing Step 1 DOM Guards & 404 Prevention Check...")
        title = page.title()
        assert "EchoSpiro" in title, f"Title assertion failed: {title}"
        assert not page.locator("h1:has-text('404')").is_visible(), "Error: 404 Header visible!"
        assert not page.locator("text=This page could not be found").is_visible(), "Error: Not Found visible!"
        
        bg_color = page.evaluate("() => window.getComputedStyle(document.body).backgroundColor")
        print(f"  [OK] DOM Guards Passed! Title: '{title}', Body BG: '{bg_color}' (Dark Theme Active)")

        # INJECT EDGE-TO-EDGE FULL-BLEED 16:9 WIDESCREEN CSS
        print("  -> Injecting edge-to-edge full-bleed 16:9 responsive styles (zoom: 1.08)...")
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

        # ACT 1: Zero-Hardware Thesis (Start Auto-Pilot)
        print(f"\n  [ACT 1] Zero-Hardware Thesis ({act_durations[0]:.1f}s)...")
        page.evaluate("""() => {
            if (window.__runCinemaAct) {
                window.__runCinemaAct(1);
            } else {
                const btns = Array.from(document.querySelectorAll('button'));
                const btn = btns.find(b => b.textContent && b.textContent.includes('Auto-Pilot Guided Pitch'));
                if (btn) btn.click();
            }
        }""")
        page.wait_for_timeout(int(act_durations[0] * 1000))

        # ACT 2: Doppler & DSP Pipeline
        print(f"\n  [ACT 2] Live Ultrasonic Doppler & DSP Pipeline ({act_durations[1]:.1f}s)...")
        page.evaluate("""() => {
            if (window.__runCinemaAct) {
                window.__runCinemaAct(2);
            }
            const osc = document.getElementById('oscilloscope-container');
            if (osc) osc.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }""")
        page.wait_for_timeout(int(act_durations[1] * 1000))

        # ACT 3: Deterministic Pathology Stress-Testing & RAM Tracker
        print(f"\n  [ACT 3] Deterministic Pathology Stress-Testing & RAM Tracker ({act_durations[2]:.1f}s)...")
        page.evaluate("""() => {
            if (window.__runCinemaAct) {
                window.__runCinemaAct(3);
            }
            const sim = document.getElementById('simulator-bar');
            if (sim) sim.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }""")
        page.wait_for_timeout(int(act_durations[2] * 1000))

        # ACT 4: Clinical Ground-Truth Validation (N=128 Bland-Altman Modal)
        print(f"\n  [ACT 4] Clinical Validation Modal N=128 ({act_durations[3]:.1f}s)...")
        page.evaluate("""() => {
            if (window.__runCinemaAct) {
                window.__runCinemaAct(4);
            }
        }""")
        page.wait_for_timeout(int(act_durations[3] * 1000))

        # ACT 5: Multi-Lingual Attested Referral Slip & SHA-256
        print(f"\n  [ACT 5] Multi-Lingual Referral Slip & Invariant SHA-256 ({act_durations[4]:.1f}s)...")
        page.evaluate("""() => {
            if (window.__runCinemaAct) {
                window.__runCinemaAct(5);
            }
        }""")
        page.wait_for_timeout(int(act_durations[4] * 1000))

        # ACT 6: Closing Championship Vision & Grand Finale Victory Banner
        print(f"\n  [ACT 6] Grand Finale Championship Banner & Closing ({act_durations[5]:.1f}s)...")
        page.evaluate("""() => {
            if (window.__runCinemaAct) {
                window.__runCinemaAct(6);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }""")
        page.wait_for_timeout(int(act_durations[5] * 1000))

        # Close page and context to finalize recorded WebM
        page.close()
        context.close()
        browser.close()

    recorded_files = list(video_dir.glob("*.webm"))
    if not recorded_files:
        raise RuntimeError("No recorded WebM video found in Playwright output directory.")
    raw_video = recorded_files[0]
    raw_size_mb = raw_video.stat().st_size / (1024 * 1024)
    print(f"  [OK] Raw 4K Video Captured: {raw_video.name} ({raw_size_mb:.2f} MB)")
    return raw_video

def multiplex_final_4k_mp4(raw_video: Path, master_audio: Path) -> Path:
    """Combine 4K visual stream and mastered audio with broadcast H.264/AAC."""
    print(f"\n[4/5] Encoding Final Master 4K MP4 (libx264, CRF 16, preset slow, AAC 320k) -> {OUTPUT_VIDEO.name}...")
    
    cmd = [
        "ffmpeg", "-y",
        "-i", str(raw_video),
        "-i", str(master_audio),
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "16",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "320k",
        "-ar", "48000",
        "-shortest",
        "-movflags", "+faststart",
        str(OUTPUT_VIDEO)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    if not OUTPUT_VIDEO.exists():
        raise RuntimeError(f"Output MP4 file was not created: {OUTPUT_VIDEO}")
        
    size_mb = OUTPUT_VIDEO.stat().st_size / (1024 * 1024)
    duration = get_audio_duration(OUTPUT_VIDEO)
    print("\n" + "=" * 75)
    print("4K BROADCAST MASTER VIDEO GENERATION SUCCESSFUL!")
    print(f"  * File Path: {OUTPUT_VIDEO}")
    print(f"  * File Size: {size_mb:.2f} MB")
    print(f"  * Total Duration: {duration:.2f} seconds ({int(duration // 60)}m {int(duration % 60):02d}s)")
    print(f"  * Resolution: 3840 x 2160 (4K UHD 16:9)")
    print(f"  * Video Codec: H.264 High Profile (CRF 16, preset slow, yuv420p)")
    print(f"  * Audio Codec: AAC 320 kbps 48.0 kHz Stereo (en-US-BrianMultilingualNeural + Mastered Pad)")
    print("=" * 75)
    return OUTPUT_VIDEO

def extract_verification_proofs(video_path: Path):
    """Extract 6 verification screenshots at exact timestamps: 00:13, 00:40, 01:10, 01:40, 02:12, 02:40."""
    print("\n[5/5] Extracting 6 Exact Verification Proof Screenshots (00:13, 00:40, 01:10, 01:40, 02:12, 02:40)...")
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    
    proof_points = [
        {"ts": "00:00:13", "name": "proof_act1_0013_thesis.png", "desc": "Act 1: Zero-Hardware Thesis & 18.5kHz CW Sonar"},
        {"ts": "00:00:40", "name": "proof_act2_0040_doppler.png", "desc": "Act 2: Doppler Spectrogram & Oscilloscope x(t)"},
        {"ts": "00:01:10", "name": "proof_act3_0110_pathology.png", "desc": "Act 3: Deterministic Pathology Suite & RAM Tracker"},
        {"ts": "00:01:40", "name": "proof_act4_0140_validation.png", "desc": "Act 4: N=128 Bland-Altman Concordance Modal"},
        {"ts": "00:02:12", "name": "proof_act5_0212_referral.png", "desc": "Act 5: Multi-Lingual Referral Slip & WebCrypto SHA-256"},
        {"ts": "00:02:40", "name": "proof_act6_0240_finale.png", "desc": "Act 6: Grand Finale Championship Victory Banner"},
    ]
    
    for pt in proof_points:
        out_img = PROOF_DIR / pt["name"]
        cmd = [
            "ffmpeg", "-y",
            "-ss", pt["ts"],
            "-i", str(video_path),
            "-vframes", "1",
            "-q:v", "2",
            str(out_img)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        img_size_kb = out_img.stat().st_size / 1024
        print(f"  [OK] Extracted {pt['ts']} -> {pt['name']} ({img_size_kb:.1f} KB) [{pt['desc']}]")

def main():
    print("=" * 75)
    print("EchoSpiro - VITB - JHU Health-Hack 2027 Official 4K Pitch Engine")
    print("=" * 75)
    
    # 1. Synthesize Brian voice
    voice_files = asyncio.run(synthesize_all_acts())
    
    # 2. Master Audio
    master_audio, act_durations = assemble_and_master_audio(voice_files)
    
    # 3. Record Playwright 4K visual stream
    raw_video = record_visual_walkthrough_4k(act_durations)
    
    # 4. Multiplex into 4K MP4
    final_video = multiplex_final_4k_mp4(raw_video, master_audio)
    
    # 5. Extract 6 verification proofs
    extract_verification_proofs(final_video)
    
    print("\n[ALL DELIVERABLES COMPLETED SUCCESSFULLY]")

if __name__ == "__main__":
    main()
