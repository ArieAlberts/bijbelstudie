# Parashah editorial standard — Arie Alberts

**Scope:** Default editorial workflow for new and revised weekly parashah readings on Parasja.nl, and for excerpts prepared from those readings for the channel. Apply this **before** publication and during every substantive revision. The user's established Dutch writing guideline, *Artikelen & Facebook — Schrijf- en Publicatierichtlijn*, is the voice reference. This protocol operationalises it for parashah readings.

> **Governing direction:** God initiates; people receive and respond. Let the order of the biblical account carry the order of the writing.

## 1. Read the complete source before editing

- Read the entire parashah, the associated haftarah, and the selected gospel reading. Check the boundaries, quotations, names, verse references, historical context, and actual sequence of events.
- Start with the grammatical and literary details of the text: who speaks first, who acts, which words recur, and what changes between scenes.
- Verify Hebrew/Greek claims where they do real interpretive work. Distinguish morphology and ordinary meaning from wordplay, alternative vocalisations, midrash, and application. No decorative Hebrew or etymological shortcuts.
- Classify reasoning internally as: **(1) textual observation/peshat, (2) canonical connection, (3) theological inference, (4) pastoral application.** Do not pass a later layer off as the earlier one.
- Preserve textual limits and anomalies. Do not force every figure or event into a predetermined contrast of receiving versus grasping. External commentators can help the study, but the reader-facing narrative must not become a running commentary on the commentator.

## 2. Build the argument out of Scripture

- Identify the passage's genuine centre rather than importing a prefabricated slogan.
- Compare the four Frame axes where useful: **Bron, Coherentie, Traject, Wil**. Use them primarily as editorial checks, not mandatory jargon in the finished reading.
- Test competing interpretations for textual support, internal coherence, explanatory breadth, and direction. Distinguish a strong text claim from a suggestive canonical or homiletical link.
- Keep the specific covenantal context of Israel visible; introduce Yeshua through a warranted canonical connection, not as a retroactive grammatical meaning imposed on Genesis.
- Where Scripture reports pain, failure, fear, or ethical harm (for example Hagar), keep the people and consequences visible. Do not reduce them to props illustrating a single theological slogan.
- Ask whether the ending grows from what the passages actually say, rather than turning the story into a moral about trying harder.

## 3. Write in Arie's voice, not in an editor's voice

**Voice:** warm, sober, earnest, Scripture-focused, reflective and pastoral; a fellow reader under the text. Generally write in **we/us** for shared application, with occasional first-person observation when it is natural. Use clear, ordinary Dutch and vary sentence length. Let the weight come from what is observed in Scripture.

**Avoid commentary about the quality of the interpretation itself**, such as:
- “Dat is te smal.”
- “Dat is te gemakkelijk.”
- “Ik wil deze lezing niet eindigen met …”
- “Hier ligt de kern van de hele parasja.”
- “Dat is geen toeval van het verhaal.”
- “Toch wil ik voorzichtig blijven.”
- Repeated “niet X maar Y” constructions, abrupt overstatements, slogan-like summaries, and unnatural stage directions to the reader.

Instead, **replace editorial judgement with the textual evidence itself**. Example:

- Avoid: “Ik zou deze lezing niet willen eindigen met: dus moeten wij net zo gehoorzaam zijn als Abraham. Dat is te smal.”
- Prefer: “Wat mij in deze parasja bijblijft, is dat het telkens bij God begint. Hij roept Abram en geeft hem een belofte. Daarna lezen we dat Abram ging, zoals de HEERE tot hem gesproken had.”

These are examples, not sentences to paste into every reading.

**Keep the focus positive and organic.** Do not build an article chiefly against another interpretation, tradition, individual, or denomination. When noting a contrast, let the text establish it. Avoid diagnosing hidden motives in people.

## 4. Shape the reading

1. **Opening:** a concrete detail of the passage (a spoken word, action, question, image or grammatical feature), not an explanation of how the article is going to proceed.
2. **Unfolding:** follow the sequence of the passage; explain the relevant grammar without a lecture or speculative etymology.
3. **Connections:** move to haftarah and gospel after the first passage has been allowed to speak; state when the step is a canonical reading rather than peshat.
4. **Application:** draw readers in with **we/us**; let their questions arise from the biblical story, not from invented psychological certainty.
5. **Ending:** rest in God's speaking, promise, faithfulness, grace, and the possibility of an honest response. Do not conclude with pressure, fear, a demand to imitate the biblical hero, or a string of tasks. One natural open question may remain.

For shorter channel/Facebook posts: choose the appropriate format from the writing guideline; keep mobile paragraphs short, use a strong textual opening, and avoid Markdown syntax in copy-ready Facebook text. Do not simply compress the entire long reading into slogans.

## 5. Mandatory editorial pass on the entire reading

Perform a **complete pass**, not just a rewrite of the last paragraph.

- **Source check:** Scripture references, quotes, names, reading ranges, Hebrew/Greek, factual claims, source attributions.
- **Meaning check:** peshat separated from canonical, theological and pastoral layers; no overclaims; no concealed circular argument.
- **Direction check:** God speaks/calls/finds/gives before human response where supported by the passage; God's grace remains the ground, not a reward for human performance.
- **Voice check:** remove editorial self-commentary, artificial contrasts, clichés, preachy imperatives, meta-instructions, unwarranted universals and mechanical AI cadence.
- **Cadence check:** concrete language, natural transitions, coherent paragraph sequence, no unnecessary repetition; no endless strings of rhetorical questions.
- **Pastoral check:** no unfair character reduction, hidden-motive attribution, sectarian polemic, or pressure on the reader.
- **Completeness check:** no meaningful text claim or nuance lost merely to make prose smoother. Keep distinct voices and audiences in Israel's history intact.
- **Consistency check:** if the Dutch reading changes substantively, update the corresponding English `body_en`, title/summary if needed, and any study sheet or worksheet statement that has become inconsistent. Do not rewrite technical teaching tools merely to sound conversational.

## 6. Repository and publication workflow

- Source of truth: `content/parasjot/<id>.md`. Read the current file before edits; do not work from an outdated cached version.
- Keep `body_nl`, `body_en`, summaries, `study_body_*`, and `worksheet_body_*` semantically consistent. Preserve frontmatter and passage/download metadata.
- Make a focused change on a feature branch and open a pull request, unless explicitly instructed to write directly to `main`.
- Before calling the result published, confirm the required build/test checks and the resulting public page. The build regenerates document downloads; do not claim they are updated until verified.
- Report what changed, what remained unchanged, and which checks or deployment steps are still unverified. Editing the source is **not** the same as verifying the live website.
- This is an editorial **default whenever work on a parashah is requested**, not a background or time-based automation.

## Final approval question

**Would this reading still make its point if every sentence about what the writer thinks of the reading were removed — because the reader can actually see it arising from the Scripture?** If not, revise again.
