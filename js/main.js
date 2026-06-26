// ── Availability status ───────────────────────────────────────────
// Change this value to update the nav indicator everywhere.
// 'open'      → green pulse dot + "OPEN"
// 'busy'      → amber static dot + "BUILDING"
const AVAILABILITY_STATUS = 'open';

(function applyStatus() {
    const dot = document.getElementById('status-dot');
    const label = document.getElementById('status-label');
    if (!dot || !label) return;
    if (AVAILABILITY_STATUS === 'open') {
        dot.className = 'status-dot open';
        label.textContent = 'OPEN';
    } else {
        dot.className = 'status-dot busy';
        label.textContent = 'BUILDING';
    }
})();

// ── Theme ─────────────────────────────────────────────────────────
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
})();

// ── Content data ──────────────────────────────────────────────────
const content = {
    'diff-whisperer': {
        type: 'project', meta: 'MANIFEST_FILE.001',
        cat: 'Portfolio // SYSTEMS ENGINEERING · MCP', title: 'Diff-Whisperer',
        s1Label: '01 / THE_ARCHITECTURE',
        s1Body: 'Diff-Whisperer reads logs from Docker, Kubernetes, and local files (Layers 1-3), normalizes and compacts them into event signatures (synthesizer), and diffs two log windows against each other to surface new failure modes and frequency regressions (Layer 4) — the piece no existing log-reading MCP server does.',
        code: `# Core normalization patterns
_NORM_PATTERNS = [
    (re.compile(r'\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b'), '<UUID>'),
    (re.compile(r'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b'), '<IP>'),
    (re.compile(r'\\b\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})?\\b'), '<TS>'),
    (re.compile(r'0x[0-9a-fA-F]+'), '<HEX>'),
    (re.compile(r'(["\\'])(?:(?=(\\\\?))\\2.)*?\\1'), '<STR>'),
    (re.compile(r'/[\\w\\-./]*\\b(req|session|job)[-_][\\w]+\\b'), '<PATH_ID>'),
    (re.compile(r'\\b\\d+\\b'), '<N>'),  # must run last
]`,
        s2Label: '02 / THE_DESIGN_DECISIONS',
        s2Body: 'Three non-negotiable design rules: No mutating tools ever (only GET-equivalent operations). Every blocking syscall goes through run_in_executor. Every subprocess call uses create_subprocess_exec to neutralize shell injection. The diff engine rate-normalizes events to prevent window duration mismatches from biasing ratio results, using a heuristic 3.0x shift threshold to flag regressions.',
        s3Label: null, s3Body: null,
        tags: ['MCP', 'Docker', 'Kubernetes', 'AsyncIO', 'Python'],
        year: '2026', extra: 'STATUS: ACTIVE'
    },
    'agentvault': {
        type: 'project', meta: 'MANIFEST_FILE.002',
        cat: 'Portfolio // AI ENGINEERING · MULTI-AGENT', title: 'AgentVault',
        s1Label: '01 / THE_ARCHITECTURE',
        s1Body: 'A lightweight, stateless-by-design Python library for creating LLM-powered agents. Session state is externalized to a pluggable StateStore (like Redis), eliminating shared-actor race conditions. Built to orchestrate multi-agent setups with concurrent tool execution, structural output guarantees, and strict verification loops.',
        code: `# Stateless agent with pluggable backends
agent = Agent(
    name="analyst",
    model="gpt-4o",
    system_prompt="You are a data analyst.",
    tools=[query_db],
    state_store=RedisStore(url="redis://localhost:6379", ttl=3600),
    executor=RayExecutor(num_replicas=4),
    verifier=no_pii
)

# Async execution fans out concurrent tool calls
result = await agent.run("Analyze Q3 sales and fetch inventory")`,
        s2Label: '02 / THE_DESIGN_DECISIONS',
        s2Body: 'The core design philosophy is statelessness. By moving session history and context out of the agent actor and into Redis, agents can scale horizontally without sticky sessions. Tool calls naturally fan out concurrently via asyncio.gather unless sequential dependency is mandated by the LLM response grouping. Verification callbacks intercept responses before they reach the user, explicitly breaking the loop if PII or hallucinated data is detected.',
        s3Label: null, s3Body: null,
        tags: ['Agents', 'Ray', 'Redis', 'Python', 'OpenTelemetry'],
        year: '2026', extra: 'STATUS: ACTIVE'
    },
    'mt': {
        type: 'project', meta: 'MANIFEST_FILE.004',
        cat: 'Research // MULTILINGUAL NLP · EDGE DEPLOYMENT', title: 'Culturally Aware MT Pipeline',
        s1Label: '01 / THE_PROBLEM',
        s1Body: 'Standard machine translation models fail on Indian language pairs for compounding reasons. Cultural context evaporates in direct translation: idiomatic expressions, honorifics, and social registers have no one-to-one mapping. Named entity handling breaks because models trained on Indo-European data misidentify Indian proper nouns. And morphologically rich languages like Kannada and Tamil expose tokenizer assumptions that produce subword splits that destroy semantic units. Off-the-shelf models produce grammatically valid but culturally incoherent output — correct enough to pass automated metrics, wrong enough to mislead a native speaker.',
        code: `# LoRA fine-tuning config for edge-deployable inference
lora_config = LoraConfig(
    r=16,           # Low rank — keeps parameter count small
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
)
model = get_peft_model(base_model, lora_config)

def translate_with_context(text: str, src: str, tgt: str) -> str:
    entities = ner_pipeline(text)
    sentiment = sentiment_model(text)
    cultural_ctx = adapter.extract(text, entities, sentiment)
    return model.generate(text, context=cultural_ctx, src=src, tgt=tgt)`,
        s2Label: '02 / THE_RESULTS',
        s2Body: 'LoRA fine-tuning reduced computational requirements enough to enable deployment on edge devices without meaningful quality regression compared to full fine-tuning. The NER and sentiment pipeline components preserved named entity fidelity across language pairs where off-the-shelf models failed. Evaluation used both BLEU and chrF++ — chrF++ is the more meaningful metric for morphologically rich target languages because character n-gram overlap handles inflected forms better than word-level matching. Manuscript submitted for review, 2025.',
        s3Label: null, s3Body: null,
        tags: ['IndicTrans2', 'LoRA', 'PyTorch', 'BLEU', 'chrF++', 'PEFT'],
        year: '2025', extra: 'STATUS: UNDER REVIEW'
    },
    'absa': {
        type: 'project', meta: 'MANIFEST_FILE.005',
        cat: 'Research // SENTIMENT ANALYSIS · NLP', title: 'Aspect-Based Sentiment Analysis',
        s1Label: '01 / THE_PROBLEM',
        s1Body: 'Sentence-level sentiment classification is too coarse for most real applications. A product review that says "the camera is excellent but the battery life is terrible" has positive and negative sentiment in the same sentence — sentence-level models flatten this to a single score, losing the signal that actually drives product decisions. ABSA requires identifying which aspects are being discussed and what sentiment is expressed toward each aspect independently. The challenge: the sentiment of a word depends heavily on which aspect it\'s associated with, and that association often spans multiple tokens in non-obvious ways.',
        code: `# Attention-based Bi-LSTM for aspect-level sentiment
class ABSAModel(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim):
        super().__init__()
        self.embed = nn.Embedding(vocab_size, embed_dim)
        self.bilstm = nn.LSTM(embed_dim, hidden_dim,
                              bidirectional=True, batch_first=True)
        self.attention = nn.Linear(hidden_dim * 2, 1)
        self.classifier = nn.Linear(hidden_dim * 2, 3)

    def forward(self, x, aspect_mask):
        h, _ = self.bilstm(self.embed(x))
        scores = torch.softmax(self.attention(h).squeeze(-1), dim=1)
        scores = scores * aspect_mask
        context = (scores.unsqueeze(-1) * h).sum(dim=1)
        return self.classifier(context)`,
        s2Label: '02 / THE_ARCHITECTURE',
        s2Body: 'The bidirectional LSTM processes text in both forward and backward directions simultaneously — critical for aspect-dependent sentiment where polarity depends on what follows the aspect term, not just what precedes it. The attention mechanism learns to concentrate the context representation around the specific aspect token being evaluated, rather than treating the full sentence uniformly. This gives the model a form of interpretability as a side effect: you can inspect the attention weights to see which tokens the model weighted for a given aspect prediction.',
        s3Label: null, s3Body: null,
        tags: ['Bi-LSTM', 'Attention', 'PyTorch', 'NLP'],
        year: '2024', extra: 'STATUS: COMPLETE'
    }
};

// ── Panel Management ──────────────────────────────────────────────
function togglePanel(id) {
    const panel = document.getElementById('slide-panel');
    if (id) {
        const data = content[id];
        if (!data) return;

        document.getElementById('panel-meta-id').innerHTML =
            `<span class="inline-block w-3 h-3" style="background:var(--accent-color)"></span> ${data.meta}`;
        document.getElementById('panel-category').textContent = data.cat;
        document.getElementById('panel-title').textContent = data.title;

        document.getElementById('panel-s1-label').innerHTML =
            `<span class="inline-block w-10 h-0.5" style="background:var(--accent-color)"></span> ${data.s1Label}`;
        document.getElementById('panel-s1-body').textContent = data.s1Body;

        const codeBlock = document.getElementById('panel-code-block');
        if (data.code) {
            document.getElementById('panel-code').textContent = data.code;
            codeBlock.style.display = 'block';
        } else {
            codeBlock.style.display = 'none';
        }

        document.getElementById('panel-s2-label').innerHTML =
            `<span class="inline-block w-10 h-0.5" style="background:var(--accent-color)"></span> ${data.s2Label}`;
        document.getElementById('panel-s2-body').textContent = data.s2Body;

        const s3Section = document.getElementById('panel-s3-section');
        if (data.s3Label) {
            document.getElementById('panel-s3-label').innerHTML =
                `<span class="inline-block w-10 h-0.5" style="background:var(--accent-color)"></span> ${data.s3Label}`;
            document.getElementById('panel-s3-body').textContent = data.s3Body;
            s3Section.classList.add('visible');
        } else {
            s3Section.classList.remove('visible');
        }

        const tagsLabel = document.getElementById('panel-tags-label');
        tagsLabel.textContent = data.type === 'blog' ? 'TOPICS' : 'TECHNOLOGIES';
        document.getElementById('panel-tags').innerHTML =
            data.tags.map(t => `<span>${t}</span>`).join('');
        document.getElementById('panel-year').textContent = data.year;

        const extraRow = document.getElementById('panel-extra-row');
        const extraLabel = document.getElementById('panel-extra-label');
        const extra = document.getElementById('panel-extra');
        if (data.extra) {
            extraLabel.textContent = data.type === 'blog' ? 'READ TIME' : 'STATUS';
            extra.textContent = data.extra;
            extraRow.classList.add('visible');
        } else {
            extraRow.classList.remove('visible');
        }

        panel.classList.add('active');
        panel.scrollTop = 0;
        document.body.style.overflow = 'hidden';
    } else {
        panel.classList.remove('active');
        document.body.style.overflow = '';
    }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') togglePanel(); });

// ── Scroll Spy ────────────────────────────────────────────────────
const spySections = ['about', 'experience', 'work', 'writing'];

function updateScrollSpy() {
    const highlighter = document.getElementById('nav-highlighter');
    if (!highlighter) return;

    let activeSectionId = null;
    const scrollY = window.pageYOffset;
    const viewportMiddle = scrollY + window.innerHeight * 0.4; // 40% from top

    spySections.forEach(id => {
        const section = document.getElementById(id);
        if (!section) return;
        const top = section.offsetTop;
        const height = section.offsetHeight;
        
        if (viewportMiddle >= top && viewportMiddle <= top + height) {
            activeSectionId = id;
        }
    });

    // Fade out highlighter if at very top (Hero section)
    if (scrollY < 200) activeSectionId = null;

    document.querySelectorAll('.nav-spy-link').forEach(link => {
        if (link.dataset.section === activeSectionId) {
            link.style.color = 'var(--accent-color)'; 
            highlighter.style.opacity = '1';
            highlighter.style.transform = `translate(${link.offsetLeft}px, -50%)`;
            highlighter.style.width = link.offsetWidth + 'px';
        } else {
            link.style.color = ''; // Reset to inherit
        }
    });
    
    if (!activeSectionId) {
        highlighter.style.opacity = '0';
    }
}

// ── Writing section: adaptive grid/scroll ─────────────────────────
function initWritingSection() {
    const writingSection = document.getElementById('writing');
    if (!writingSection) return;
    const writingTrack = document.getElementById('horizontal-track-writing');
    const writingSpacer = document.getElementById('writing-spacer');
    const header = writingSection.querySelector('.section-header');
    const tiles = writingTrack ? writingTrack.querySelectorAll('.writing-tile') : [];
    const threshold = 4;

    if (tiles.length < threshold && writingTrack && writingSpacer && header) {
        writingSection.classList.add('writing-container-grid');
        writingSection.classList.remove('horizontal-scroll-container');
        writingSpacer.classList.add('hidden');
        header.classList.remove('absolute', 'top-20');
        header.style.width = '';
        header.classList.add('mb-12', 'px-4', 'md:px-8', 'max-w-screen-2xl', 'mx-auto');
    } else if (writingTrack && writingSpacer && header) {
        writingSection.classList.remove('writing-container-grid');
        writingSection.classList.add('horizontal-scroll-container');
        writingSpacer.classList.remove('hidden');
        header.classList.add('absolute', 'top-20');
        header.classList.remove('mb-12', 'px-4', 'md:px-8', 'max-w-screen-2xl', 'mx-auto');
    }
}

// ── Horizontal scroll ─────────────────────────────────────────────
const scrollSections = [
    { containerId: '#work', trackId: '#horizontal-track-work', container: null, track: null },
    { containerId: '#writing', trackId: '#horizontal-track-writing', container: null, track: null }
];
let scrollTicking = false;

function initScrollElements() {
    scrollSections.forEach(sec => {
        sec.container = document.querySelector(sec.containerId);
        sec.track = document.querySelector(sec.trackId);
    });
}

function performHorizontalScroll() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;

    scrollSections.forEach(sec => {
        if (!sec.container || !sec.track) return;
        if (sec.container.classList.contains('writing-container-grid')) return;

        const containerTop = sec.container.offsetTop;
        const containerHeight = sec.container.offsetHeight;
        
        // Calculate scroll percentage and clamp it between 0 and 1
        let scrollPercent = (scrollY - containerTop) / (containerHeight - windowHeight);
        if (scrollPercent < 0) scrollPercent = 0;
        if (scrollPercent > 1) scrollPercent = 1;

        const translateAmount = scrollPercent * (sec.track.scrollWidth - window.innerWidth + 64);
        sec.track.style.transform = `translateX(-${translateAmount}px)`;
    });
    
    updateScrollSpy();
    scrollTicking = false;
}

function handleHorizontalScroll() {
    if (!scrollTicking) {
        window.requestAnimationFrame(performHorizontalScroll);
        scrollTicking = true;
    }
}
window.addEventListener('scroll', handleHorizontalScroll, { passive: true });
window.addEventListener('resize', initWritingSection);

// ── Scroll reveal ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Dynamic year ──────────────────────────────────────────────────
const copy = document.getElementById('footer-copyright');
if (copy) copy.textContent = `© ${new Date().getFullYear()} SHREYAS PATIL`;

// ── Mobile: disable JS horizontal scroll on touch devices ─────────────────
if (window.innerWidth < 768) {
    window.removeEventListener('scroll', handleHorizontalScroll);
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initWritingSection();
    initScrollElements();
    updateScrollSpy();
});
