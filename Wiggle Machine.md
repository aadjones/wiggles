# **1\. Overview**

A browser‑based "harmonic console" that lets learners **see, hear, and manipulate** the spectral components of a periodic function, then watch those components evolve under simple PDE “scripts.” The MVP teaches amplitude, frequency, and phase; kills Gibbs ringing via Fejér; and introduces basic operator‑driven decay/rotation ‑ all before any heavy math.

# **2\. Objectives**

- **Pedagogical** – Make Fourier decomposition and operator evolution intuitive in \< 10 minutes.

- **Engagement** – \>70 % of first‑time users reach the PDE demo; median sandbox dwell ≥90 s.

- **Extensibility** – Architecture flexible enough to add Laplace "Pole Playground" without refactor.

# **3\. Target Audience**

- Curious creatives (artists, musicians, devs) with light math background.

- Undergrad STEM learners encountering Fourier/PDEs for the first time.

# **4\. User Journey (Core Track)**

| World                                       | New Idea                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Key Action |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 0 – **Pure Wiggle Primer** (Single Sine)    | Learner meets one sinusoid. Three knobs: Amplitude, Frequency (k = 1‑8), Phase. Task: dial the knobs to match a flashing target sine. Compression: “A, k, φ are the DNA of any wiggle.”                                                                                                                                                                                                                                                                              |            |
| 1 – **Soundboard Synth** (Build from Bands) | Console shows the first 8 harmonic strips — each with **Amplitude slider _and_ Phase knob**. Learner drags the controls to recreate a faint “ghost outline” target _and_ must fine‑tune the phase of one highlighted mid‑band harmonic so a bump aligns with a green marker (mini alignment drill built‑in). Live difference overlay \+ alignment error meter guide them. This nails **synthesis with phase awareness** in a single step.                            |            |
| 2 – **Magic Wiggle Splitter** (Analysis)    | Now reverse: learner draws any looping wave; hits **Split**. Wiggle machine cracks it into k \= 0‑15 components, rebuilding sequentially. Learner sees bars rise. Stop when Δ small. This is **wave analysis**—time wave → frequency bars.                                                                                                                                                                                                                           |            |
| 3 – **Solo Surgery** (Harmonic Inspector)   | Hover any bar to preview its sine overlay & hear its tone. Purple patch target → click matching harmonic. Five rounds, ≥ 80 % accuracy.                                                                                                                                                                                                                                                                                                                              |            |
| 4 – **Texture Layers** (Band Explorer)      | Group three bands – Low (0‑2), Mid (3‑6), High (7‑15). Solo/Mute to feel coarse vs edge detail. Quiz: "Which band sharpens edges?"                                                                                                                                                                                                                                                                                                                                   |            |
| 5 – Partial Sum Sculpt                      | Diminishing returns; scrub N; stop before tiny Δ.                                                                                                                                                                                                                                                                                                                                                                                                                    |            |
| 6 – **Phase Shifter** (Alignment Game)      | Purpose: **lock‑in that phase ⟺ horizontal shift** before we show advection PDEs. A mid‑band harmonic’s phase knob is unlocked; a green target marker is drawn on the composite waveform. Learner turns the knob until the bump (created mostly by that harmonic) lines up with the marker. Live readout: phase ° \+ position error. Exit when error \< 5 %. Compression: “Phase doesn’t change _how much_ texture you have, only _where_ it sits along the circle.” |            |
| 7 – Edge Tamer                              | Dirichlet vs Fejér toggle; spot ringing.                                                                                                                                                                                                                                                                                                                                                                                                                             |            |
| Sandbox                                     | Open console for free play.                                                                                                                                                                                                                                                                                                                                                                                                                                          |            |

# **5\. Scope**

## **Inclusions (MVP)**

- Periodic drawing pad

- 16 harmonic strips (amp \+ phase knob)

- Fejér toggle with micro Cesàro animation

- Worlds 0‑5 scripted tutorials with prediction prompts

- Adaptive difference heatmap, phase alignment marker

- Basic telemetry events

## **Exclusions (Phase 2+)**

- Laplace/pole playground

- Norm palette, orthogonality panel

- Audio poly‑voices, custom λ(k) editor

# **6\. Functional Requirements**

1. **Harmonic Build Engine** – FFT to extract complex coefficients; incremental partial‑sum recon.

2. **Group Toggle Logic** – Buckets {0‑2,3‑6,7‑15}. Solo/mute affects rendering & metric overlay.

3. **Difference Heatmap** – Per‑pixel |full – current| overlay updated each frame.

4. **Phase Knob Interaction** – Rotation updates single k’s phase; live alignment error metric.

5. **Fejér Mixer** – Triangular weights w\_{N,k}=1‑|k|/(N+1); smooth animation on toggle.

6. **Telemetry** – Event IDs per spec; payload JSON to analytics pipeline.

7. **Frequency Representation** – UI shows **one strip per |k| (k \= 0…15)**. Negative‑frequency information is folded into the **phase knob** (i.e., −k mode \= same magnitude, phase shifted by π). This avoids duplicate bars and keeps the console symmetric while retaining full expressiveness.. Tech Stack  
   | Layer | Choice | Rationale |  
   |-------|--------|-----------|  
   | Front‑end | **React \+ TypeScript** | Fast dev with Cursor; component model for Worlds |  
   | Canvas rendering | **HTML5 Canvas** (Pixi or plain) | High‑fps wave \+ bars; \<16 ms frame |  
   | Audio | **Web Audio API** | OscillatorNode per harmonic; mix via GainNode |  
   | State | **Zustand** (light) | Simple store without Redux overhead |  
   | Build | Vite | Instant reload, TS support |  
   | Analytics | Segment (or custom) | Track events JSON |

# **8\. Non‑functional**

- Target 60 fps on mid‑range laptop (MacBook Air).

- First paint \< 2 s over 4G.

- Accessibility – basic keyboard nav; captions for audio.

# **9\. Success Metrics (MVP)**

- Completion: ≥60 % finish Worlds 0‑3.

- Engagement: Sandbox dwell median ≥90 s.

- Learning: Post‑world MCQ ≥70 % correct on concept checks.

# **10\. Milestones & Timeline (tentative)**

| Week | Deliverable                          |
| ---- | ------------------------------------ |
| 1    | Harmonic build engine \+ drawing pad |
| 2    | Worlds 0‑2 interactions & UI polish  |
| 3    | Worlds 3‑4 \+ difference heatmap     |
| 4    | Fejér toggle & Edge Tamer world      |
| 5    | Telemetry, polish, pilot testing     |
| 6    | Launch \+ feedback gather            |

# **11\. Backlog (Phase 2\)**

- Laplace "Pole Playground" with s‑plane drag

- Wave & Schrödinger evolution worlds

- Norm palette \+ orthogonality panel

- Multi‑voice audio \+ export

- Custom λ(k) script editor

# **12\. Risks & Mitigations**

| Risk              | Likelihood | Impact | Mitigation                                      |
| ----------------- | ---------- | ------ | ----------------------------------------------- |
| UI overload       | Med        | High   | Progressive disclosure; hide advanced knobs     |
| Performance jank  | Med        | High   | Cap to 16 harmonics; requestAnimationFrame loop |
| Concept confusion | Low‑Med    | Med    | Forced predictions \+ feedback loops            |
| Scope creep       | High       | High   | Feature freeze at Week 3; backlog extras        |

# **13\. Glossary**

- **Harmonic k** – Non‑negative integer frequency index in UI. Negative frequencies are implicit via the phase knob (magnitude equal, phase offset π).

- **Residual** – |full – partial sum| metric.

- **Phase knob** – Rotatable control setting initial phase (encodes sign and shift).

- **Fejér weights** – Triangle taper 1‑|k|/(N+1).

- **World** – Self‑contained tutorial screen.
