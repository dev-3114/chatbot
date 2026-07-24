// Initialize PDFJS
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Application State
const DEFAULT_API_KEY = 'PAQ.Ab8RN6KxaI4fR-pztsNdYgSx3NDiy23BiMXUaE9LfnAsNS_cOA'; // Paste your API key here if you later connect a remote model.
const state = {
    apiKey: localStorage.getItem('papermind_api_key') || DEFAULT_API_KEY,
    model: localStorage.getItem('papermind_model') || 'gemini-2.5-flash',
    documentText: '',
    documentName: '',
    chatHistory: [],
    customSuggestions: []
};

// UI Elements
const els = {
    statusIndicator: document.getElementById('status-indicator'),
    statusText: document.getElementById('status-text'),
    clearChatBtn: document.getElementById('clear-chat-btn'),
    chatMessages: document.getElementById('chat-messages'),
    welcomeState: document.getElementById('welcome-state'),
    suggestionsBox: document.getElementById('suggestions-box'),
    suggestionsList: document.getElementById('suggestions-list'),
    chatInput: document.getElementById('chat-input'),
    sendBtn: document.getElementById('send-btn'),
    tokenCounter: document.getElementById('token-counter')
};

// Pre-trained Research Paper Text (Neuro-Symbolic Landing Framework)
const SAMPLE_PAPER = `# Neuro-Symbolic AI Framework for Intelligent Landing of Autonomous Aerial Vehicles

## Authors
- **Dr. K. Ashok Kumar** (Professor, Department of Computer Science and Engineering, Sathyabama Institute of Science and Technology, Chennai, India)
- **Harimahadevan D** (UG Student, Specialization in AI, Sathyabama Institute of Science and Technology)
- **Deepak T** (UG Student, Specialization in AI, Sathyabama Institute of Science and Technology)

## Abstract
Autonomous aerial vehicles have matured from research curiosities to indispensable tools for humanitarian relief, public safety, and commercial logistics. Yet the final seconds of any mission—identifying a trustworthy landing site, justifying that choice, and touching down safely—remain fraught with uncertainty when conditions shift suddenly. Perception-heavy neural pipelines respond quickly but rarely articulate why they favor a location, while purely symbolic stacks reason cleanly yet falter when sensor feeds are noisy or incomplete. This work presents a neuro-symbolic landing framework that blends the best of both paradigms. Multi-modal sensor fusion provides timely situational awareness, neural perception highlights feasible touchdown zones, and symbolic logic checks every option against codified safety doctrine before a decision is released. The architecture delivers traceable recommendations, adapts to diverse airframes, and is lightweight enough for embedded deployment, offering a practical path toward safe and transparent autonomous landings.

**Index Terms**—Autonomous aerial vehicles, neuro-symbolic AI, trusted landing, multi-sensor fusion, explainable autonomy, symbolic safety checks, embedded deep learning

## I. Introduction
Autonomous aerial vehicles (AAVs) now map floodplains before rescuers arrive, ferry medical supplies when roads are impassable, and inspect infrastructure without exposing technicians to risk. These successes mask a lingering vulnerability: a mission still ends with a complex negotiation between perception, safety policy, and control authority during landing. When a gust lifts debris across the pad or first responders request an urgent diversion, operators expect the aircraft to reason through the trade-offs instantly and to justify its choice afterward. Meeting that expectation requires more than raw perception accuracy—it demands an intelligence that can both sense and explain.

Conventional landing stacks typically split along two lines. Systems grounded in deep neural networks master visual cues and can recognize suitable terrain faster than any human observer [1]. Yet those same systems rarely expose what cues triggered their decision, making it difficult for pilots or regulators to trust them in turbulent airspace. The opposite lineage encodes aviation doctrine and operational constraints as symbolic rules [8]. These rules deliver crisp explanations but depend heavily on pre-processed, low-noise sensor feeds and thus falter the moment the operating theater grows chaotic. The resulting capability gap surfaces in diverse ways: a neural controller may propose a landing ellipse that conflicts with temporary flight restrictions; a rule-based planner may reject every option because sensor alignment lagged by a few milliseconds; neither can convincingly argue why a compromise is safe. A neuro-symbolic approach, where perception and logic cross-validate each other in real time, is a natural progression toward trustworthy autonomy.

### A. Motivation
Our motivation stems from practical deployments in disaster drills and delivery pilots where crews repeatedly asked two questions: “Can the drone adapt to surprise obstacles?” and “Can it tell us why it picked that rooftop?” A fused neuro-symbolic pipeline addresses both. Neural perception continues to ingest raw, high-bandwidth imagery and point clouds, ensuring responsiveness. Symbolic reasoning layers mission knowledge, airspace regulations, and operator preferences on top, filtering every candidate site through the same policy lens a human controller would apply. The outcome is a landing decision that is not only safe but defensible, providing written or visual traces that supervisors can audit minutes or months later.

Beyond operational assurance, the hybrid philosophy improves lifecycle efficiency. Rule sets capture institutional knowledge once and can be reused across fleets, while perception models learn from heterogeneous field data. Together they shorten certification cycles, reduce manual overrides, and open the door for scaled deployments in civilian and defense domains.

### B. Contributions
This paper advances the state of the art through five contributions:
1. A neuro-symbolic landing framework that couples lightweight convolutional backbones with rule-based safety envelopes to maintain trust under resource constraints.
2. A multi-modal fusion pipeline that synchronizes camera, LiDAR, GPS, and IMU feeds so the world model stays consistent even when individual sensors degrade.
3. An explanation layer that links neural activations with symbolic rule evaluations to produce articulate narratives for every accepted or rejected landing site.
4. Adaptive safeguards that tune rule priorities according to mission phase, letting the UAV negotiate between urgency and conservatism without breaching policy.
5. A set of implementation guidelines that show how the architecture slots into ROS-based UAV stacks while remaining deployable on embedded compute modules.

## II. Related Work

### A. Vision-Based UAV Landing
Chen et al. [1] demonstrated that carefully tuned convolutional networks can sift through dense aerial imagery and highlight rooftop segments or clearing patches suitable for landing with impressive precision. Patel and Kumar [6] extended the idea by aligning LiDAR sweeps with camera frames, producing richer geometric cues that helped their platform avoid protruding obstacles in tight alleyways. Both efforts underscore how far perception pipelines have progressed, yet they stop short of translating detections into auditable decisions that mission commanders can question or override.

### B. Hybrid AI Approaches
The first wave of hybrid experiments appears in the navigation literature. Das and Singh [2] layered symbolic mission rules atop neural perception to temper aggressive maneuvers in cluttered corridors, while Garcia et al. [3] advocated a modular architecture that lets logic modules veto neural suggestions when safety clauses are violated. Li and Zhang [4] focused on sensor reliability, proposing alignment strategies that ensure symbolic layers never reason over stale data. These studies confirm that perception and reasoning can coexist but leave open questions about how to explain the final landing call in language that satisfies regulators and operators alike.

### C. Explainable AI for UAVs
Kumar and Mehta [5] catalogued techniques such as Grad-CAM overlays and rule tracebacks that help pilots understand what their autonomy stack “saw.” Sharma and Verma [7] further illustrated that these explanations can be generated in real time without derailing system latency, hinting that transparency does not have to be traded for responsiveness.

### D. Research Gaps
Despite significant advances, existing systems still suffer from limited integration of perception and reasoning in unified frameworks, insufficient adaptability to dynamic and unstructured environments, a lack of comprehensive multi-modal sensor fusion, constrained real-time performance on resource-limited platforms, and inadequate explainability or transparency when critical decisions must be justified.

Our proposed framework addresses these gaps by providing a comprehensive neuro-symbolic solution optimized for practical deployment.

## III. System Architecture

### A. Overview
Our architecture revolves around five cooperating modules: data preprocessing, neural perception, symbolic reasoning, decision synthesis, and explainability. Each module exposes clean interfaces so avionics teams can swap implementations without destabilizing the whole pipeline, and every decision artifact is logged for traceability.

### B. Data Preprocessing Module
The preprocessing layer curates raw sensor streams before they ever reach learning or logic blocks. Techniques such as bilateral filtering for visual noise suppression, probabilistic outlier rejection for LiDAR, and tight timestamp synchronization keep the downstream models from fighting inconsistent inputs. Feature extractors summarize terrain roughness, surface normal variance, and motion cues, ensuring the symbolic layer receives both raw evidence and compact descriptors.

### C. Neural Perception Module
Perception relies on lightweight convolutional backbones augmented with attention layers so they can highlight critical obstacles while staying within the power envelope of embedded GPUs. The networks emit probabilistic heatmaps of viable landing ellipses, semantic segmentations of obstacles, and confidence scores that explicitly quantify uncertainty. These products, rather than hard classifications, provide fertile ground for follow-on reasoning.

### D. Symbolic Reasoning Module
The reasoning core encodes mission policies, civil aviation guidelines, and situational heuristics as first-order logic and constraint satisfaction problems. Rules express concepts such as “maintain five meters from human clusters” or “prefer surfaces with slope less than seven degrees when battery is low.” When neural outputs conflict with these clauses, the module either requests new perception samples or escalates to the operator. This bidirectional communication keeps both worlds aligned.

### E. Decision-Making Module
The decision layer fuses perception evidence with rule evaluations using a scoring function that weighs safety margins, mission urgency, and system health. A reinforcement learning policy, trained in simulation, selects descent trajectories that minimize risk while exploiting the symbolic safety envelope as a guardrail. If scores degrade mid-descent—say, due to sudden obstacle detection—the module can roll back to a holding pattern while symbolic logic generates alternative candidates.

### F. Explainability Module
To maintain operator trust, every accepted or rejected landing site is paired with an explanation artifact. Grad-CAM visualizations show which pixels or point-cloud cells influenced the neural suggestion, while rule traces identify which policies were invoked, satisfied, or violated. These artifacts populate an “explainability buffer” that ground crews can review live or archive for audits.

## IV. Implementation Details

### A. Hardware Requirements
The reference implementation targets modest quad-rotor platforms so that labs and field teams can reproduce the results without exotic hardware. A representative build includes an embedded AI compute module such as a Jetson Nano, Xavier NX, or Qualcomm RB5; a 4K RGB camera with a global shutter for blur-free imagery; a lightweight LiDAR or, in budget builds, a depth camera paired with an ultrasonic altimeter; redundant GPS and IMU packages to survive magnetic or multipath disturbances; a telemetry radio or LTE/5G modem for supervisory overrides; and swappable battery packs sized for at least twenty minutes of endurance.

### B. Software Stack
We built the stack entirely on open tooling so that academic groups and startups can adapt it quickly: Ubuntu Server with ROS 2 Humble provides deterministic messaging; PyTorch supports model development while TensorRT handles deployment; OpenCV, PCL, and custom CUDA layers deliver fast point-cloud projections; Gazebo and AirSim supply high-fidelity landing rehearsals; and Python orchestrates experiments while C++ nodes manage latency-critical logic.

### C. System Workflow
A workflow begins with sensors streaming synchronized packets into the preprocessing layer, which filters noise and interpolates missing data. Perception networks then run in parallel, outputting dense maps and uncertainty measures. A candidate generator identifies specific touchdown ellipses and passes them, along with supporting evidence, to the reasoning core. Symbolic rules score or discard each candidate, requesting additional perception sweeps whenever confidence is low. The decision layer selects a landing plan, computes a descent trajectory that respects vehicle dynamics, and hands it to the controller. The controller executes the plan while continuously monitoring for anomalies that would trigger replanning, and the explainability buffer logs neural saliency maps, rule activations, and actuator histories for later review.

## V. Simulation and Testing Infrastructure
Before flight trials, we invested heavily in simulation fidelity so that edge cases could be rehearsed without risking hardware. The architecture integrates Gazebo-ROS environments enriched with stochastic weather plug-ins and urban assets derived from drone photogrammetry, alongside AirSim scenes optimized for photorealistic rendering of glass reflections and dust plumes. We further layered a digital-twin service that mirrors every onboard topic, allowing engineers to “rewind” missions frame by frame. The simulator streams synchronized sensor feeds into the exact same perception and reasoning stack used in field deployments, ensuring parity between lab and flight behavior. To stress-test communications, we embedded edge middleware that emulates bandwidth drops, packet reorderings, and remote update pushes that commonly occur during long-duration sorties.

Edge nodes in the simulation cluster run the identical containerized stack planned for aircraft deployment. Each run logs compute usage, memory pressure, and thermal load so we can verify that the neuro-symbolic pipeline remains within the thermal design limits of hardware like Jetson Xavier NX. This approach shortens certification time because every software change must first pass regression suites that replay historical missions under randomized perturbations. By the time a build reaches the airfield, most faults have already been surfaced, categorized, and mitigated.

## VI. Operational Case Study

### A. Disaster-Relief Deployment
To illustrate how the framework behaves end-to-end, we executed a disaster-relief drill in a mock urban-block environment. The UAV launched from a safe corridor, received updated casualty locations mid-flight, and was instructed to land on whichever rooftop provided the fastest access route for paramedics. Dense smoke generators and reflective tarps were used to simulate degraded visibility and GPS multipath.

During descent, neural perception flagged three potential landing pads with associated confidence intervals. The symbolic layer immediately disqualified the closest pad because crowd-control rules detected human silhouettes inside the five-meter exclusion zone. A second pad exhibited acceptable geometry but violated a “no landings near open flames” constraint triggered by thermal imagery. The third pad satisfied all policies; the decision module chose it and produced a trajectory that skirted a crane boom identified only after the first perception sweep. Post-flight logs helped commanders understand why the nearer pad was rejected despite appearing empty to the naked eye.

### B. Logistics Scenario
We also ran an autonomous parcel delivery mission in a suburban cul-de-sac. The framework ingested municipal no-fly advisories from a symbolic knowledge base, fusing them with perception outputs so that temporary construction cranes were avoided even before they entered the camera frame. When a child unexpectedly ran toward the planned landing zone, the perception module raised the risk score, triggering the symbolic layer to activate an emergency loiter rule. The aircraft held position at 15 meters until the area cleared, then resumed descent. Operators later reviewed the explanation packet, which merged Grad-CAM overlays with explicit policy citations, demonstrating accountability to local residents.

### C. Lessons Learned
These case studies surfaced practical insights:
1. Maintaining a buffer of alternate landing sites reduces re-planning stress.
2. Human operators favor explanations that link sensor cues with policy names.
3. Telemetry links benefit from streaming compressed saliency maps rather than raw camera feeds.

## VII. Ethical, Regulatory, and Human Factors Considerations

### A. Ethical Guardrails
Embedding symbolic rules allows mission planners to encode ethical no-go zones such as schools, hospitals, or wildlife habitats directly into the decision core. We advocate maintaining a signed rulebook that stakeholders can audit, ensuring that humanitarian corridors or privacy buffers are never crossed without deliberate human authorization. Continuous logging also supports post-mission accountability in the event of community complaints or incident investigations.

### B. Regulatory Compliance
Different jurisdictions impose unique requirements on autonomous landings, including maximum descent rates, mandatory visual observers, and geofencing. Our framework stores these directives as parameterized templates that can be swapped per geography. Before each flight, the planner fetches the relevant template (e.g., DGCA RPAS 2025, FAA Part 107 waivers) and fuses it with mission-specific constraints. This approach shortens compliance checks and streamlines documentation for certification audits.

### C. Human Factors Integration
Even highly autonomous operations retain a human supervisor. To ease workload, we designed the explainability interface around concise “reason-action” summaries that can be acknowledged with a single command. Operators can also inject temporary symbolic rules—for example, “avoid sector C until fire crew clears”—without retraining neural models. Training programs should emphasize how to interpret confidence scores, rule citations, and anomaly alerts so that crews remain in the loop without micromanaging the platform. These design choices align with Fernandez and Roy [15], who highlight that supervisory teams adopt autonomy faster when interfaces explicitly show alignment with mission doctrine.

### D. Data Governance and Privacy
Humanitarian and commercial deployments alike must respect data minimization principles, particularly when onboard sensors capture personally identifiable information. Every image buffer in our pipeline carries metadata describing retention windows, provenance, and permitted downstream uses. Symbolic rules enforce those policies by, for example, masking faces before footage leaves the aircraft or deleting raw video if a mission’s legal basis expires. Audit trails document every policy evaluation, giving compliance officers a verifiable history of what data was accessed, processed, or purged.

## VIII. Deployment and Maintenance Guidelines

### A. Commissioning Checklist
Before fielding the framework on a new airframe, teams should validate sensor calibration for every payload combination (including temperature-stress tests), run the perception models through synthetic datasets that mirror anticipated terrain and lighting, review and localize symbolic rules to reflect airspace classifications plus community guidelines, conduct tethered hover tests where symbolic overrides are triggered manually to confirm fail-safe responses, and finally progress from supervised flights to fully autonomous landings once the earlier steps have passed.

### B. Lifecycle Maintenance
Sustaining performance requires quarterly retraining of neural models using recent sortie logs to capture seasonal changes, routine audits of the rulebase so regulatory amendments and incident lessons are incorporated, proactive health monitoring of compute modules to preempt thermal throttling or memory wear-out, and regression testing in simulation whenever ROS nodes or firmware receive updates.

### C. Risk Mitigation Strategies
To further reduce operational risk, we recommend dual redundant communication links, geographically distributed log servers for tamper resistance, and clear escalation procedures that empower human operators to seize manual control with minimal latency. These strategies complement the neuro-symbolic safeguards and help organizations build layered defenses.

## IX. Evaluation Framework

### A. Performance Metrics
We evaluate the framework using landing accuracy measured as the distance between commanded and actual touchdown points, safety compliance expressed as the percentage of landings that satisfy every encoded rule, decision latency recorded as the time from candidate creation to final approval, robustness captured through success rates across variations in weather, GPS quality, and obstacle density, and explainability usefulness based on whether human evaluators judge the logged rationales to be actionable.

### B. Testing Scenarios
We validated the system in simulation and limited outdoor trials that spanned dense urban environments with obstacles, rural and open terrain, GPS-denied areas, a range of weather and lighting conditions, scenes featuring dynamic obstacles or moving objects, and scripted emergency landing situations.

### C. Ablation Studies
To understand how each module contributes to overall safety, we performed ablation studies where components were disabled selectively. Removing symbolic reasoning increased policy violations by 18%, while disabling neural perception forced the system to rely on pre-mapped terrain, reducing landing accuracy to 71%. Eliminating the explainability buffer did not affect raw performance but reduced operator trust scores in human-subject evaluations by 35%, underscoring the soft benefits of transparency.

### D. Safety and Compliance
Safety is enforced at multiple layers: encrypted links prevent command spoofing, watchdog timers reset subsystems that stall, and the symbolic module contains explicit encodings of DGCA/FAA operational rules relevant to low-altitude UAV flights. Redundancy in inertial sensing and cross-checks between GPS and visual odometry guard against spoofing or multipath errors. Real-time anomaly detectors monitor actuator currents and vibration signatures to trigger aborts before a hardware fault cascades.

## X. Failure Mode Analysis and Mitigation
To make the framework resilient beyond nominal scenarios, we performed structured failure mode and effects analysis. Each subsystem—sensing, perception, reasoning, control, communications—was evaluated for potential single-point failures, cascading risks, and detection latency. For example, a partial loss of LiDAR returns in rain could bias the perception module toward optimistic obstacle distances. Our mitigation couples sensor health monitors with symbolic “sanity checks” that compare expected surface roughness against prior records. If discrepancies exceed a threshold, the aircraft enters a verification hover and requests operator guidance. Another failure case involves symbolic rules entering contradictory states after multiple human edits; to prevent that, we apply satisfiability checks before uploading rule bundles, ensuring the reasoning layer cannot deadlock mid-flight.

We also catalogued lessons around recovery. When communications drop below 30 kbps, the system automatically degrades explanation packets to textual summaries, preserving accountability without saturating the link. Should both GNSS receivers report inconsistent fixes, a visual-inertial odometry fallback takes over, and symbolic rules shrink the allowable landing radius until confidence is restored. These playbooks are rehearsed in the simulator so crews know exactly how the aircraft will respond, reinforcing trust during live incidents.

## XI. Cost Analysis

| Component | Cost (INR) |
| :--- | :---: |
| UAV Platform | 20,000 – 50,000 |
| Camera Module | 2,000 – 5,000 |
| LiDAR/Sensors | 10,000 – 25,000 |
| GPS and IMU | 2,000 – 6,000 |
| Embedded Processor | 8,000 – 20,000 |
| Communication | 1,000 – 3,000 |
| Power Supply | 2,000 – 5,000 |
| Software (Open-source) | Free |
| Miscellaneous | 2,000 – 5,000 |
| **Total Estimated** | **47,000 – 119,000** |

## XII. Results and Discussion

### A. Expected Outcomes
Based on hardware-in-the-loop trials and high-fidelity simulations, the framework is expected to deliver landing-zone identification accuracy above 92% in cluttered urban mockups, safety compliance exceeding 99% when measured against encoded rulesets, decision latency below 90 ms on Jetson Xavier NX hardware, explanation packets delivered within one second of touchdown for operator review, and stable performance despite moderate sensor dropouts or wind gusts up to 8 m/s.

### B. Advantages Over Existing Systems
The hybrid approach provides several key advantages:
1. **Interpretability**: Symbolic reasoning delivers transparent decision traces rather than black-box outputs.
2. **Safety Assurance**: Stronger safety assurance through logic-based validation and runtime monitors.
3. **Adaptability**: Neural perception handles novel situations while symbolic rules ensure consistency.
4. **Trust**: High trust thanks to explainable decisions and logged rationales that increase operator confidence.
5. **Scalability**: Modular design supports varied UAV platforms and mission profiles without rewriting core logic.

### C. Limitations and Challenges
Several challenges remain, including computational overhead from running both neural and symbolic modules, the complexity of engineering rules that cover safety requirements across jurisdictions, limited labeled training data for fringe weather or rare terrain types, integration overhead when retrofitting legacy autopilots that lack ROS or modern middleware, and the need for extensive real-world validation before regulators will clear fully autonomous landings.

## XIII. Future Enhancements

### A. Technical Extensions
We envision integrating thermal and hyperspectral payloads to detect heat signatures or crop stress before landing, growing the symbolic knowledge base with machine-readable regulatory updates sourced directly from aviation authorities, coordinating swarms so that multiple aircraft negotiate landing slots while sharing symbolic context, training meta-reinforcement learning policies that adapt descent strategies in-flight based on inferred turbulence levels, and applying compiler-level optimizations plus sparsity-aware pruning to push inference below 50 ms on lower-end hardware.

### B. Application Domains
The same decision stack can support urban air mobility and delivery services, search and rescue operations, agricultural monitoring and precision farming, infrastructure inspection and maintenance, and mission sets relevant to military or defense agencies.

### C. Research Directions
Promising avenues for the research community include developing transfer-learning protocols that bootstrap models for new airframes with minimal data, building continual learning loops where operational flights update both neural weights and symbolic priorities, delivering human-in-the-loop tooling for rapid rule authoring and validation, leveraging 5G network slices for resilient command and control with cloud-offloaded explanations, and creating formal verification suites that jointly reason about neural approximations and symbolic constraints.

## XIV. Conclusion
We have described a landing stack that treats perception, reasoning, and explanation as peer responsibilities rather than afterthoughts. Neural networks keep the vehicle situationally aware, symbolic rules uphold the discipline of aviation practice, and an explanation layer stitches the two into narratives that humans can interrogate. This balance produced safe, timely, and auditable landings in the scenarios we tested, all while running on modest embedded compute.

Because the modules expose clean interfaces, integrators can adopt the entire stack or lift individual components into existing autopilots. The reliance on affordable hardware and open-source tooling lowers the barrier for research labs, startups, and public agencies. The next phase involves expanding field trials, enriching the rule base with region-specific regulations, and validating swarm behaviors. Taken together, these steps move autonomous aerial vehicles closer to the level of trust and transparency that society expects before sharing crowded skies with them.

## Acknowledgment
The authors express sincere gratitude to Dr. K. Ashok Kumar, Professor of Computer Science and Engineering, for valuable guidance and support. We thank Dr. L. Lakshmanan, Dean, School of Computing, and Dr. P. Ajitha, Head of Department, for providing necessary resources and encouragement. We also acknowledge the support of the faculty and staff at Sathyabama Institute of Science and Technology.`;

// Default questions for this specific research paper
const DEFAULT_SUGGESTIONS = [
    "Explain the 5 cooperating modules of the Neuro-Symbolic architecture.",
    "What were the findings of the ablation studies in Section IX-C?",
    "What are the target hardware requirements for deploying this landing stack?"
];

// Initialize UI
function init() {
    updateStatus();
    setupEventListeners();
    lucide.createIcons();

    // Auto-load pre-trained research paper on startup
    loadDocumentText("Neuro_Symbolic_Landing_Framework.md", SAMPLE_PAPER);
}

// Update app status styling
function updateStatus() {
    const hasDoc = state.documentText && state.documentText.trim().length > 0;

    if (hasDoc) {
        els.statusIndicator.className = 'status-indicator connected';
        els.statusText.textContent = `Ready to chat with: ${state.documentName}`;
        els.chatInput.disabled = false;
        els.sendBtn.disabled = false;
        els.clearChatBtn.disabled = state.chatHistory.length === 0;
    } else {
        els.statusIndicator.className = 'status-indicator disconnected';
        els.chatInput.disabled = true;
        els.sendBtn.disabled = true;
        els.clearChatBtn.disabled = true;
        els.statusText.textContent = 'Using the built-in demo paper';
    }
}

// Event Listeners
function setupEventListeners() {
    els.clearChatBtn.addEventListener('click', () => {
        state.chatHistory = [];
        resetChatToEmptyState();
        updateStatus();
    });

    els.sendBtn.addEventListener('click', sendUserMessage);
    els.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserMessage();
        }
    });

    els.chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// Load parsed text into state and UI
function loadDocumentText(name, text) {
    state.documentText = text;
    state.documentName = name;
    state.chatHistory = []; // Reset history for new document

    const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = text.length;
    const estimatedTokens = Math.round(charCount / 4); // Standard approximation: 1 token ≈ 4 chars

    els.tokenCounter.textContent = `Context Size: ~${estimatedTokens.toLocaleString()} tokens`;
    els.tokenCounter.classList.remove('hidden');

    resetChatToEmptyState();
    updateStatus();

    generateSmartSuggestions(text.slice(0, 4000));
}

// Setup chat welcome state/empty state with suggestions
function resetChatToEmptyState() {
    els.chatMessages.innerHTML = '';
    
    if (!state.documentText) {
        // Return to greeting setup
        els.chatMessages.appendChild(els.welcomeState);
        els.welcomeState.classList.remove('hidden');
        els.suggestionsBox.classList.add('hidden');
        return;
    }

    // Creating document welcome message
    els.welcomeState.classList.add('hidden');
    
    const docWelcome = document.createElement('div');
    docWelcome.className = 'welcome-state';
    docWelcome.innerHTML = `
        <div class="welcome-icon">
            <i data-lucide="file-check"></i>
        </div>
        <h2>Ready to Query: ${state.documentName}</h2>
        <p>You can now ask questions about the loaded research paper. Our assistant has ingested the content (~${Math.round(state.documentText.length / 4).toLocaleString()} tokens) and will answer precisely using the paper's contents.</p>
    `;
    els.chatMessages.appendChild(docWelcome);
    
    // Setup suggestions container inside chat
    const sugBox = document.createElement('div');
    sugBox.id = 'suggestions-box';
    sugBox.className = 'suggestions-box';
    sugBox.innerHTML = `
        <h4>Suggested Questions</h4>
        <div id="suggestions-list" class="suggestions-list">
            <!-- Loading indicator/text -->
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    docWelcome.appendChild(sugBox);
    els.suggestionsBox = sugBox;
    els.suggestionsList = sugBox.querySelector('#suggestions-list');
    
    // If we already have custom suggestions generated, show them, otherwise fallback to defaults
    if (state.customSuggestions && state.customSuggestions.length > 0) {
        showSuggestions(state.customSuggestions);
    } else {
        showSuggestions(DEFAULT_SUGGESTIONS);
    }
    
    lucide.createIcons();
}

// Display suggestions in the suggestions panel
function showSuggestions(suggestions) {
    if (!els.suggestionsList) return;
    els.suggestionsList.innerHTML = '';
    els.suggestionsBox.classList.remove('hidden');
    
    suggestions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-item';
        btn.innerHTML = `<span>${q}</span>`;
        btn.addEventListener('click', () => {
            els.chatInput.value = q;
            els.chatInput.style.height = 'auto';
            els.chatInput.style.height = (els.chatInput.scrollHeight) + 'px';
            sendUserMessage();
        });
        els.suggestionsList.appendChild(btn);
    });
}

// Make a dynamic API call to fetch suggestions based on document content
async function generateSmartSuggestions(sampleContent) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: `Generate exactly 3 concise and specific questions about this research paper. Return them as a JSON array of strings.\n\nCONTENT:\n${sampleContent}`,
                documentText: sampleContent,
                model: state.model
            })
        });

        if (!response.ok) throw new Error('Suggestion retrieval failed');

        const data = await response.json();
        const rawText = data.reply || '';
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const suggestions = cleanedText.match(/\[(.*?)\]/s);

        if (suggestions && suggestions[1]) {
            const parsed = suggestions[1]
                .split(',')
                .map(item => item.trim().replace(/^"|"$/g, ''))
                .filter(Boolean);
            if (parsed.length > 0) {
                state.customSuggestions = parsed.slice(0, 3);
                showSuggestions(state.customSuggestions);
                return;
            }
        }
    } catch (e) {
        console.warn('Could not generate custom suggestions. Falling back to default questions.', e);
    }

    showSuggestions(DEFAULT_SUGGESTIONS);
}

// Append message node to DOM
function appendMessage(role, text, isMarkdown = false) {
    // Hide suggestions inside chat-messages if any
    const allSuggestBoxes = els.chatMessages.querySelectorAll('.suggestions-box');
    allSuggestBoxes.forEach(b => b.classList.add('hidden'));

    const msg = document.createElement('div');
    msg.className = `message ${role}`;
    
    const avatarIcon = role === 'user' ? 'user' : 'bot';
    const senderName = role === 'user' ? 'You' : 'PaperMind Assistant';
    
    let htmlContent = text;
    if (isMarkdown) {
        try {
            htmlContent = marked.parse(text);
        } catch (e) {
            console.error("Markdown parsing failed, rendering text instead", e);
        }
    } else {
        // Escape HTML for safety
        const div = document.createElement('div');
        div.textContent = text;
        htmlContent = div.innerHTML;
        // Format newlines
        htmlContent = htmlContent.replace(/\n/g, '<br>');
    }

    msg.innerHTML = `
        <div class="message-avatar">
            <i data-lucide="${avatarIcon}"></i>
        </div>
        <div class="message-body">
            <div class="message-sender">${senderName}</div>
            <div class="message-content">${htmlContent}</div>
        </div>
    `;

    els.chatMessages.appendChild(msg);
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    
    // Add copy button logic for pre code blocks
    if (isMarkdown) {
        msg.querySelectorAll('pre').forEach(pre => {
            const btn = document.createElement('button');
            btn.className = 'icon-btn border-btn copy-code-btn';
            btn.style.position = 'absolute';
            btn.style.right = '10px';
            btn.style.top = '10px';
            btn.style.padding = '4px 8px';
            btn.style.fontSize = '0.7rem';
            btn.innerHTML = `<i data-lucide="copy" style="width:12px;height:12px"></i> Copy`;
            
            // Set style positioning on pre wrapper
            pre.style.position = 'relative';
            pre.appendChild(btn);

            btn.addEventListener('click', () => {
                const codeText = pre.querySelector('code').innerText;
                navigator.clipboard.writeText(codeText).then(() => {
                    btn.innerHTML = `<i data-lucide="check" style="width:12px;height:12px"></i> Copied!`;
                    lucide.createIcons();
                    setTimeout(() => {
                        btn.innerHTML = `<i data-lucide="copy" style="width:12px;height:12px"></i> Copy`;
                        lucide.createIcons();
                    }, 2000);
                });
            });
        });
    }
    
    lucide.createIcons();
}

// Append temporary typing indicator
function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator-wrapper';
    indicator.className = 'message assistant';
    indicator.innerHTML = `
        <div class="message-avatar">
            <i data-lucide="bot"></i>
        </div>
        <div class="message-body">
            <div class="message-sender">PaperMind Assistant</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    els.chatMessages.appendChild(indicator);
    els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
    lucide.createIcons();
    return indicator;
}

// Send user message and request Gemini API
async function sendUserMessage() {
    const text = els.chatInput.value.trim();
    if (!text) return;
    
    if (!state.documentText) {
        alert("Please upload a research paper to query.");
        return;
    }

    // Lock UI input during request
    els.chatInput.value = '';
    els.chatInput.style.height = 'auto';
    els.chatInput.disabled = true;
    els.sendBtn.disabled = true;

    // Add message to chat screen and history
    appendMessage('user', text, false);
    state.chatHistory.push({
        role: 'user',
        parts: [{ text: text }]
    });

    // Trigger clear chat button availability
    els.clearChatBtn.disabled = false;

    // Show indicator
    const typingIndicator = showTypingIndicator();

    try {
        const responseText = await callGeminiAPI();
        
        // Remove typing indicator and append actual answer
        typingIndicator.remove();
        appendMessage('assistant', responseText, true);
        
        // Save back into state history
        state.chatHistory.push({
            role: 'model',
            parts: [{ text: responseText }]
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        typingIndicator.remove();
        appendMessage('assistant', `⚠️ **Error communicating with Gemini API**\n\n_${error.message}_\n\nPlease double check your API key, ensure the model name is correct, and try again.`, true);
    } finally {
        els.chatInput.disabled = false;
        els.sendBtn.disabled = false;
        els.chatInput.focus();
        updateStatus();
    }
}

// Core Fetch to built API
async function callGeminiAPI() {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: state.chatHistory[state.chatHistory.length - 1]?.parts?.[0]?.text || '',
            documentText: state.documentText,
            model: state.model
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response.json();
    if (!data.reply) {
        throw new Error('Empty response received from the built API');
    }

    return data.reply;
}

// Run app init on DOM load
window.addEventListener('DOMContentLoaded', init);
