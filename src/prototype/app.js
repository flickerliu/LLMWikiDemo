const app = document.querySelector("#app");
const { mockData } = window;

const state = {
  view: "overview",
  pages: structuredClone(mockData.wikiPages),
  sourceDocuments: structuredClone(mockData.sourceDocuments),
  ingestJobs: structuredClone(mockData.ingestJobs),
  approvals: structuredClone(mockData.approvals),
  auditEvents: structuredClone(mockData.auditEvents),
  query: "",
  domain: "All",
  status: "All",
  sort: "confidence-asc",
  selectedPageId: mockData.wikiPages[1].id,
  selectedApprovalId: mockData.approvals[0].id,
  editing: false,
  editOwner: "",
  editSensitivity: "",
  qaQuestion: mockData.qaSuggestions[0],
  qaResult: null,
  qaError: "",
  degradedMode: false,
  confirm: null,
  toast: ""
};

const navItems = [
  ["overview", "Overview"],
  ["pages", "Wiki Pages"],
  ["wiki", "Wiki Search"],
  ["ask", "Q&A"],
  ["ingest", "Ingestion"],
  ["governance", "Governance"],
  ["operations", "Audit & Cost"]
];

const statusTone = {
  Published: "good",
  "Needs Review": "warn",
  Draft: "blue",
  Blocked: "bad",
  Waiting: "warn",
  Complete: "good",
  Running: "blue",
  Failed: "bad",
  Indexed: "good",
  Conflict: "bad",
  Queued: "blue",
  "OCR Complete": "good",
  "Password Protected": "bad"
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" }[char]));
}

function pageById(id) {
  return state.pages.find(page => page.id === id) || state.pages[0];
}

function approvalById(id) {
  return state.approvals.find(approval => approval.id === id) || state.approvals[0];
}

function extractionByPageId(pageId) {
  return mockData.extractionExamples.find(example => example.pageId === pageId);
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function badge(label, tone = "") {
  return `<span class="badge ${tone}">${escapeHtml(label)}</span>`;
}

function metricCards() {
  const published = state.pages.filter(page => page.status === "Published").length;
  const review = state.pages.filter(page => page.status === "Needs Review" || page.status === "Blocked").length;
  const stale = state.pages.filter(page => page.freshness === "Stale").length;
  const avgConfidence = state.pages.reduce((sum, page) => sum + page.confidence, 0) / state.pages.length;
  const runningJobs = state.ingestJobs.filter(job => job.status === "Running" || job.status === "Needs Review").length;
  const weeklySpend = mockData.costDays.reduce((sum, day) => sum + day.spend, 0);

  return [
    [state.pages.length, "LLM-maintained Wiki pages", `${published} published, ${review} pending review`],
    [pct(avgConfidence), "Average confidence", `${stale} stale page requires owner attention`],
    [runningJobs, "Active ingest jobs", "Delta query and OCR queue are simulated"],
    [`$${weeklySpend.toLocaleString()}`, "Weekly LLM spend", "Small-model routing average above 70%"]
  ].map(([value, label, trend]) => `
    <section class="metric">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
      <div class="trend">${trend}</div>
    </section>
  `).join("");
}

function shell(content) {
  const user = mockData.currentUser;
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand-block">
          <h1>Enterprise LLM Wiki</h1>
          <p>Mock-data prototype for validating knowledge workflows, governance, and demo storytelling.</p>
        </div>
        <div class="user-block">
          <strong>${escapeHtml(user.name)}</strong>
          <span>${escapeHtml(user.role)}</span><br>
          <span>${escapeHtml(user.groups.join(" / "))}</span>
        </div>
        <nav class="nav">
          ${navItems.map(([id, label]) => `<button class="${state.view === id ? "active" : ""}" data-action="nav" data-view="${id}"><span class="mark"></span>${label}</button>`).join("")}
        </nav>
      </aside>
      <main class="main">${content}</main>
      ${state.toast ? `<div class="toast">${escapeHtml(state.toast)}</div>` : ""}
    </div>
  `;
}

function pageHeader(title, copy, actions = "") {
  return `
    <header class="page-head">
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(copy)}</p>
      </div>
      <div class="toolbar">${actions}</div>
    </header>
  `;
}

function renderOverview() {
  const pending = state.approvals.filter(approval => approval.status !== "Approved" && approval.status !== "Rejected");
  const selected = pageById(state.selectedPageId);
  return shell(`
    ${pageHeader("Demo command center", "A presenter can walk from OneDrive ingest to generated Wiki page, permission-aware answer, human approval, and audit evidence without relying on a backend.", `<button class="primary" data-action="demo-path">Start guided demo</button>`)}
    <section class="grid four">${metricCards()}</section>
    <section class="grid two" style="margin-top:14px">
      <div class="panel">
        <div class="section-title"><h3>End-to-end workflow</h3>${badge("Stateful mock actions", "blue")}</div>
        <div class="timeline">
          ${[
            ["OneDrive delta detects a changed source file", "Graph notification creates an idempotent ingest job and records ACL metadata."],
            ["Agent compiles a Wiki page", "Small model routes content, large model integrates Markdown, eval model scores consistency."],
            ["Governance handles risky changes", "Sensitive or low-confidence edits move into an owner approval queue."],
            ["Employees ask permission-aware questions", "Search filters by captured OneDrive ACLs before model context assembly."],
            ["Audit and cost evidence stays visible", "Prompt hashes, citations, model routing, and token spend are tracked for review."]
          ].map(([title, copy]) => `<div class="timeline-item"><span class="timeline-dot"></span><p><strong>${title}</strong><br>${copy}</p></div>`).join("")}
        </div>
      </div>
      <div class="detail-panel">
        <div class="section-title"><h3>Current validation page</h3>${badge(selected.status, statusTone[selected.status])}</div>
        ${pageSummary(selected)}
        <div class="split-line"></div>
        <button class="primary" data-action="nav" data-view="pages">Open Wiki Pages</button>
        <button data-action="nav" data-view="wiki">Inspect page detail</button>
        <button data-action="nav" data-view="governance">Review approvals (${pending.length})</button>
      </div>
    </section>
    <section class="grid three" style="margin-top:14px">
      ${state.pages.filter(page => page.warnings.length).slice(0, 3).map(page => `
        <article class="record-card">
          <div class="badge-row">${badge(page.domain, "blue")} ${badge(page.freshness, page.freshness === "Stale" ? "bad" : "warn")}</div>
          <h4>${escapeHtml(page.title)}</h4>
          <p>${escapeHtml(page.warnings[0])}</p>
          <button data-action="select-page" data-id="${page.id}" data-next="wiki">Open issue</button>
        </article>
      `).join("")}
    </section>
  `);
}

function pageSummary(page) {
  return `
    <div class="badge-row">
      ${badge(page.domain, "blue")}
      ${badge(page.sensitivity, page.sensitivity === "Restricted" ? "bad" : page.sensitivity === "Confidential" ? "purple" : "")}
      ${badge(`${pct(page.confidence)} confidence`, page.confidence >= .9 ? "good" : page.confidence >= .75 ? "warn" : "bad")}
      ${page.humanReviewed ? badge("Human reviewed", "good") : badge("AI draft", "warn")}
    </div>
    <p>${escapeHtml(page.summary)}</p>
    <ul class="detail-list">
      <li><strong>Owner:</strong> ${escapeHtml(page.owner)}</li>
      <li><strong>Updated:</strong> ${escapeHtml(page.lastUpdated)}</li>
      <li><strong>Sources:</strong> ${page.sourceCount} OneDrive documents</li>
    </ul>
  `;
}

function filteredPages() {
  const query = state.query.trim().toLowerCase();
  const pages = state.pages.filter(page => {
    const text = [page.title, page.summary, page.domain, page.owner, page.tags.join(" ")].join(" ").toLowerCase();
    return (!query || text.includes(query)) &&
      (state.domain === "All" || page.domain === state.domain) &&
      (state.status === "All" || page.status === state.status);
  });

  return pages.sort((left, right) => {
    if (state.sort === "confidence-asc") return left.confidence - right.confidence;
    if (state.sort === "confidence-desc") return right.confidence - left.confidence;
    if (state.sort === "updated-desc") return right.lastUpdated.localeCompare(left.lastUpdated);
    return left.title.localeCompare(right.title);
  });
}

function renderWiki() {
  const domains = ["All", ...new Set(state.pages.map(page => page.domain))];
  const statuses = ["All", ...new Set(state.pages.map(page => page.status))];
  const pages = filteredPages();
  const selected = pageById(state.selectedPageId);
  return shell(`
    ${pageHeader("Wiki browse and validation", "Search, filter, sort, select, edit metadata, and route generated pages to human review. All rows and detail content come from mock data.", `<button data-action="empty-filter">Show empty state</button><button data-action="clear-filters">Clear filters</button>`)}
    <section class="panel">
      <div class="filters">
        <input aria-label="Search wiki pages" placeholder="Search pages, owners, tags" value="${escapeHtml(state.query)}" data-field="query">
        <select aria-label="Domain filter" data-field="domain">${domains.map(domain => `<option ${state.domain === domain ? "selected" : ""}>${escapeHtml(domain)}</option>`).join("")}</select>
        <select aria-label="Status filter" data-field="status">${statuses.map(status => `<option ${state.status === status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}</select>
        <select aria-label="Sort pages" data-field="sort">
          <option value="confidence-asc" ${state.sort === "confidence-asc" ? "selected" : ""}>Lowest confidence first</option>
          <option value="confidence-desc" ${state.sort === "confidence-desc" ? "selected" : ""}>Highest confidence first</option>
          <option value="updated-desc" ${state.sort === "updated-desc" ? "selected" : ""}>Recently updated</option>
          <option value="title" ${state.sort === "title" ? "selected" : ""}>Title A-Z</option>
        </select>
        <button data-action="clear-filters">Reset</button>
      </div>
      <div class="grid two">
        <div>
          ${pages.length ? renderPageTable(pages) : `<div class="empty-box"><strong>No Wiki pages match these filters.</strong><br>Use this state to validate how customers want zero-result search guidance and recovery actions to behave.</div>`}
        </div>
        ${renderPageDetail(selected)}
      </div>
    </section>
  `);
}

function renderWikiPages() {
  const selected = pageById(state.selectedPageId);
  const extraction = extractionByPageId(selected.id);
  const pagesWithExamples = state.pages.filter(page => extractionByPageId(page.id)).length;

  return shell(`
    ${pageHeader("Wiki pages", "Dedicated view for generated Wiki pages. Select a page to inspect its generated content, source citations, extracted signals, and customer validation questions.", `<button data-action="nav" data-view="ingest">View ingestion source data</button><button data-action="nav" data-view="wiki">Search all pages</button>`)}
    <section class="grid two">
      <div class="panel">
        <div class="section-title"><h3>Generated page catalog</h3>${badge(`${pagesWithExamples} source-to-Wiki samples`, "blue")}</div>
        <table>
          <thead><tr><th>Wiki page</th><th>Status</th><th>Sources</th><th>Sample</th></tr></thead>
          <tbody>${state.pages.map(page => {
            const pageExtraction = extractionByPageId(page.id);
            return `<tr class="clickable ${state.selectedPageId === page.id ? "selected" : ""}" data-action="select-page" data-id="${page.id}" data-next="pages">
              <td><strong>${escapeHtml(page.title)}</strong><br><span class="muted small">${escapeHtml(page.domain)} / ${escapeHtml(page.owner)}</span></td>
              <td>${badge(page.status, statusTone[page.status])}</td>
              <td>${page.sourceCount}</td>
              <td>${pageExtraction ? badge("Source trace", "good") : badge("Page only", "")}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
      <aside class="detail-panel wiki-page-panel">
        <div class="section-title"><h3>${escapeHtml(selected.title)}</h3>${badge(selected.status, statusTone[selected.status])}</div>
        ${pageSummary(selected)}
        ${extraction ? renderExtractionExample(extraction) : `
          <div class="split-line"></div>
          <div class="empty-box"><strong>No source-to-Wiki sample for this page yet.</strong><br>Select Travel and Expense Policy or Sensitive Wiki Change Approval Matrix to inspect a full source extraction example.</div>
          <h3>Generated page sections</h3>
          <ul class="detail-list">${selected.sections.map(section => `<li>${escapeHtml(section)}</li>`).join("")}</ul>
          <h3>Source citations</h3>
          <div class="badge-row">${selected.citations.map(id => badge(sourceTitle(id), "blue")).join("")}</div>
        `}
      </aside>
    </section>
  `);
}

function renderPageTable(pages) {
  return `
    <table>
      <thead><tr><th>Page</th><th>Status</th><th>Owner</th><th>Confidence</th><th>Freshness</th></tr></thead>
      <tbody>
        ${pages.map(page => `
          <tr class="clickable ${state.selectedPageId === page.id ? "selected" : ""}" data-action="select-page" data-id="${page.id}">
            <td><strong>${escapeHtml(page.title)}</strong><br><span class="muted small">${escapeHtml(page.tags.join(", "))}</span></td>
            <td>${badge(page.status, statusTone[page.status])}</td>
            <td>${escapeHtml(page.owner)}</td>
            <td>${pct(page.confidence)}</td>
            <td>${badge(page.freshness, page.freshness === "Fresh" ? "good" : page.freshness === "Stale" ? "bad" : "warn")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderPageDetail(page) {
  const extraction = extractionByPageId(page.id);
  if (state.editing) {
    return `
      <aside class="detail-panel">
        <h3>Edit page metadata</h3>
        <label class="small muted">Owner</label>
        <input value="${escapeHtml(state.editOwner || page.owner)}" data-field="editOwner">
        <label class="small muted">Sensitivity</label>
        <select data-field="editSensitivity">
          ${["Internal", "Confidential", "Restricted"].map(value => `<option ${((state.editSensitivity || page.sensitivity) === value) ? "selected" : ""}>${value}</option>`).join("")}
        </select>
        <div class="split-line"></div>
        <button class="primary" data-action="save-metadata">Save metadata</button>
        <button data-action="cancel-edit">Cancel</button>
      </aside>
    `;
  }

  return `
    <aside class="detail-panel">
      <div class="section-title"><h3>${escapeHtml(page.title)}</h3>${badge(page.status, statusTone[page.status])}</div>
      ${pageSummary(page)}
      ${page.warnings.length ? `<div class="warning-box"><strong>Warning:</strong> ${escapeHtml(page.warnings.join(" "))}</div>` : ""}
      <div class="split-line"></div>
      <h3>Generated page sections</h3>
      <ul class="detail-list">${page.sections.map(section => `<li>${escapeHtml(section)}</li>`).join("")}</ul>
      <h3>Source citations</h3>
      <div class="badge-row">${page.citations.map(id => badge(sourceTitle(id), "blue")).join("")}</div>
      ${extraction ? renderExtractionExample(extraction) : ""}
      <div class="split-line"></div>
      <button data-action="edit-metadata">Edit metadata</button>
      <button class="primary" data-action="request-review" data-id="${page.id}">Request review</button>
    </aside>
  `;
}

function renderExtractionExample(example) {
  return `
    <div class="split-line"></div>
    <div class="section-title"><h3>${escapeHtml(example.title)}</h3>${badge("Mock extraction", "blue")}</div>
    <p>${escapeHtml(example.scenario)}</p>
    <div class="source-map">
      <div>
        <h4>Source documents</h4>
        <div class="source-list">
          ${example.sourceIds.map(id => {
            const source = state.sourceDocuments.find(item => item.id === id);
            return source ? `<div class="source-chip"><strong>${escapeHtml(source.title)}</strong><span>${escapeHtml(source.type)} / ${escapeHtml(source.sensitivity)} / ${escapeHtml(source.status)}</span></div>` : `<div class="source-chip"><strong>${escapeHtml(id)}</strong><span>External mock source</span></div>`;
          }).join("")}
        </div>
        <h4>Extracted signals</h4>
        <ul class="detail-list">${example.extractedSignals.map(signal => `<li><strong>${escapeHtml(signal.label)}:</strong> ${escapeHtml(signal.value)}</li>`).join("")}</ul>
      </div>
      <div class="wiki-preview">
        <h4>Generated Markdown preview</h4>
        <pre>${escapeHtml(example.generatedMarkdown.frontMatter.join("\n"))}</pre>
        ${example.generatedMarkdown.sections.map(section => `<article><strong>## ${escapeHtml(section.heading)}</strong><p>${escapeHtml(section.body)}</p></article>`).join("")}
      </div>
    </div>
    <h4>Customer validation points</h4>
    <ul class="detail-list">${example.validationPoints.map(point => `<li>${escapeHtml(point)}</li>`).join("")}</ul>
  `;
}

function sourceTitle(id) {
  return state.sourceDocuments.find(source => source.id === id)?.title || id;
}

function renderAsk() {
  return shell(`
    ${pageHeader("Permission-aware Q&A", "Ask against the curated Wiki layer. The simulation shows cited answers, validation errors, restricted-content warnings, and degraded search fallback.", `<button data-action="toggle-degraded">${state.degradedMode ? "Disable" : "Enable"} degraded mode</button>`)}
    <section class="grid two">
      <div class="panel">
        <h3>Ask a business question</h3>
        <textarea aria-label="Question" data-field="qaQuestion" placeholder="Type a question about internal policy, governance, or pipeline status">${escapeHtml(state.qaQuestion)}</textarea>
        <div class="toolbar" style="margin-top:10px">
          <button class="primary" data-action="ask-question">Ask</button>
          <button data-action="clear-answer">Clear</button>
        </div>
        <div class="split-line"></div>
        <h3>Suggested questions</h3>
        <div class="grid">
          ${mockData.qaSuggestions.map(question => `<button data-action="suggest-question" data-question="${escapeHtml(question)}">${escapeHtml(question)}</button>`).join("")}
        </div>
      </div>
      <div class="detail-panel">
        <div class="section-title"><h3>Answer result</h3>${state.degradedMode ? badge("LLM degraded", "warn") : badge("LLM available", "good")}</div>
        ${state.qaError ? `<div class="error-box">${escapeHtml(state.qaError)}</div>` : renderQaResult()}
      </div>
    </section>
  `);
}

function renderQaResult() {
  if (!state.qaResult) {
    return `<div class="empty-box">No answer yet. Ask a question to generate a cited response from mock Wiki pages.</div>`;
  }
  if (state.qaResult.mode === "degraded") {
    return `
      <div class="warning-box"><strong>Degraded result:</strong> Azure OpenAI is unavailable, so the UI falls back to permission-filtered Wiki search results.</div>
      <ul class="detail-list">${state.qaResult.pages.map(page => `<li><strong>${escapeHtml(page.title)}</strong><br>${escapeHtml(page.summary)}</li>`).join("")}</ul>
    `;
  }
  return `
    <div class="answer-box">${state.qaResult.answer}</div>
    <div class="split-line"></div>
    <h3>Citations</h3>
    <div class="badge-row">${state.qaResult.citations.map(id => badge(sourceTitle(id), "blue")).join("")}</div>
    ${state.qaResult.warning ? `<div class="warning-box" style="margin-top:12px">${escapeHtml(state.qaResult.warning)}</div>` : ""}
  `;
}

function renderIngest() {
  return shell(`
    ${pageHeader("OneDrive ingestion", "Validate how operators inspect delta jobs, extraction status, warnings, and retries for Office, PDF, Markdown, and protected files.", `<button class="primary" data-action="run-delta">Run delta sync</button><button data-action="nav" data-view="pages">Open generated Wiki pages</button>`) }
    <section class="grid two">
      <div class="panel">
        <div class="section-title"><h3>Pipeline jobs</h3>${badge(`${state.ingestJobs.length} jobs`, "blue")}</div>
        <table>
          <thead><tr><th>File</th><th>Stage</th><th>Status</th><th>Queue age</th></tr></thead>
          <tbody>${state.ingestJobs.map(job => `
            <tr>
              <td><strong>${escapeHtml(job.file)}</strong><br><span class="muted small">${escapeHtml(job.owner)}</span></td>
              <td>${escapeHtml(job.stage)}</td>
              <td>${badge(job.status, statusTone[job.status])}</td>
              <td>${escapeHtml(job.queueAge)}</td>
            </tr>
            ${job.warning ? `<tr><td colspan="4"><div class="warning-box">${escapeHtml(job.warning)}</div></td></tr>` : ""}
          `).join("")}</tbody>
        </table>
      </div>
      <div class="panel">
        <div class="section-title"><h3>Source document inventory</h3><button data-action="retry-failed">Retry failed document</button></div>
        <table>
          <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Sensitivity</th></tr></thead>
          <tbody>${state.sourceDocuments.map(source => `
            <tr>
              <td><strong>${escapeHtml(source.title)}</strong><br><span class="muted small">${escapeHtml(source.location)}</span></td>
              <td>${escapeHtml(source.type)}</td>
              <td>${badge(source.status, statusTone[source.status])}</td>
              <td>${badge(source.sensitivity, source.sensitivity === "Restricted" ? "bad" : source.sensitivity === "Confidential" ? "purple" : "")}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
    </section>
  `);
}

function renderGovernance() {
  const selected = approvalById(state.selectedApprovalId);
  const selectedPage = pageById(selected.pageId);
  return shell(`
    ${pageHeader("Governance and approvals", "Review sensitive changes, inspect generated diffs, confirm owners, and simulate approval or rejection decisions before publishing.", "")}
    ${state.confirm ? `<div class="confirm-bar"><p>${escapeHtml(state.confirm.message)}</p><div><button class="primary" data-action="confirm-yes">Confirm</button> <button data-action="confirm-no">Cancel</button></div></div>` : ""}
    <section class="grid two">
      <div class="panel">
        <div class="section-title"><h3>Approval queue</h3>${badge(`${state.approvals.filter(a => a.status === "Waiting" || a.status === "Blocked").length} open`, "warn")}</div>
        <table>
          <thead><tr><th>Page</th><th>Type</th><th>Status</th><th>Due</th></tr></thead>
          <tbody>${state.approvals.map(approval => {
            const page = pageById(approval.pageId);
            return `<tr class="clickable ${state.selectedApprovalId === approval.id ? "selected" : ""}" data-action="select-approval" data-id="${approval.id}">
              <td><strong>${escapeHtml(page.title)}</strong><br><span class="muted small">${escapeHtml(approval.reason)}</span></td>
              <td>${escapeHtml(approval.type)}</td>
              <td>${badge(approval.status, statusTone[approval.status] || "")}</td>
              <td>${escapeHtml(approval.due)}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
      <aside class="detail-panel">
        <div class="section-title"><h3>${escapeHtml(selectedPage.title)}</h3>${badge(selected.priority, selected.priority === "High" ? "bad" : "warn")}</div>
        <p>${escapeHtml(selected.reason)}</p>
        <div class="answer-box"><strong>Proposed diff</strong><br>${escapeHtml(selected.diff)}</div>
        <ul class="detail-list">
          <li><strong>Approver:</strong> ${escapeHtml(selected.approver)}</li>
          <li><strong>Created:</strong> ${escapeHtml(selected.created)}</li>
          <li><strong>Due:</strong> ${escapeHtml(selected.due)}</li>
        </ul>
        <button class="primary" data-action="approve-selected" ${selected.status === "Approved" ? "disabled" : ""}>Approve update</button>
        <button class="danger" data-action="reject-selected" ${selected.status === "Rejected" ? "disabled" : ""}>Reject update</button>
      </aside>
    </section>
    <section class="grid three" style="margin-top:14px">
      ${[
        ["Rule: cite every generated fact", "Every LLM edit must include source IDs and prompt hash metadata."],
        ["Rule: preserve OneDrive ACLs", "Derived Wiki chunks inherit captured source permissions for query-time filtering."],
        ["Rule: route low confidence", "Pages below 0.85 confidence or with sensitivity conflicts require owner approval."]
      ].map(([title, copy]) => `<article class="record-card"><h4>${title}</h4><p>${copy}</p></article>`).join("")}
    </section>
  `);
}

function renderOperations() {
  const maxSpend = Math.max(...mockData.costDays.map(day => day.spend));
  const smallModelAvg = mockData.costDays.reduce((sum, day) => sum + day.smallModelShare, 0) / mockData.costDays.length;
  return shell(`
    ${pageHeader("Audit and cost evidence", "Use this view to validate operational trust signals: permission denials, ingestion warnings, prompt audit events, and model routing cost controls.", `<button data-action="cost-warning">Simulate cost warning</button>`)}
    <section class="grid two">
      <div class="panel">
        <div class="section-title"><h3>Audit events</h3>${badge("12 month retention target", "blue")}</div>
        <table>
          <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Result</th></tr></thead>
          <tbody>${state.auditEvents.map(event => `
            <tr>
              <td>${escapeHtml(event.time)}</td>
              <td>${escapeHtml(event.actor)}</td>
              <td><strong>${escapeHtml(event.action)}</strong><br><span class="muted small">${escapeHtml(event.target)}</span></td>
              <td>${badge(event.result, event.risk === "High" ? "bad" : event.risk === "Medium" ? "warn" : "good")}</td>
            </tr>
          `).join("")}</tbody>
        </table>
      </div>
      <div class="panel">
        <div class="section-title"><h3>LLM spend and routing</h3>${badge(`${pct(smallModelAvg)} small model`, smallModelAvg >= .7 ? "good" : "bad")}</div>
        <div class="bars">
          ${mockData.costDays.map(day => `<div class="bar-wrap"><div class="bar ${day.smallModelShare < .72 ? "warn" : ""}" style="height:${Math.round((day.spend / maxSpend) * 150)}px"></div><span>${day.day}</span><span>$${day.spend}</span></div>`).join("")}
        </div>
        <div class="split-line"></div>
        <p class="muted">Token volume is shown in millions per day. The prototype highlights the acceptance criterion that at least 70 percent of pipeline steps should use the small model tier.</p>
      </div>
    </section>
  `);
}

function render() {
  const views = {
    overview: renderOverview,
    pages: renderWikiPages,
    wiki: renderWiki,
    ask: renderAsk,
    ingest: renderIngest,
    governance: renderGovernance,
    operations: renderOperations
  };
  app.innerHTML = views[state.view]();
}

function showToast(message) {
  state.toast = message;
  render();
  window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2400);
}

function addAudit(action, target, result, risk = "Low") {
  state.auditEvents.unshift({
    id: `evt-${Math.floor(Math.random() * 9000)}`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    actor: mockData.currentUser.name,
    action,
    target,
    result,
    risk
  });
}

function requestReview(pageId) {
  const page = pageById(pageId);
  page.status = "Needs Review";
  page.humanReviewed = false;
  const existing = state.approvals.some(approval => approval.pageId === pageId && approval.status === "Waiting");
  if (!existing) {
    state.approvals.unshift({
      id: `apr-${Math.floor(Math.random() * 9000)}`,
      pageId,
      type: "Presenter requested review",
      requester: mockData.currentUser.name,
      approver: page.owner,
      status: "Waiting",
      priority: page.sensitivity === "Restricted" ? "High" : "Medium",
      reason: "Manual validation requested during customer walkthrough",
      diff: "+ Presenter flagged this page for owner confirmation",
      created: "2026-05-16",
      due: "2026-05-23"
    });
  }
  addAudit("Review requested", page.title, "Waiting", "Medium");
  showToast("Review request added to governance queue.");
}

function askQuestion() {
  const question = state.qaQuestion.trim();
  state.qaError = "";
  if (!question) {
    state.qaError = "Question is required before the Q&A workflow can run.";
    render();
    return;
  }

  const lower = question.toLowerCase();
  if (state.degradedMode || lower.includes("outage")) {
    state.qaResult = { mode: "degraded", pages: filteredPages().slice(0, 3) };
    addAudit("Q&A degraded fallback", question, "Warning", "Medium");
    render();
    return;
  }

  if (lower.includes("restricted") || lower.includes("evidence")) {
    const page = pageById("wiki-audit-retention");
    state.qaResult = {
      mode: "answer",
      answer: "The available Wiki layer says audit events include user identity, prompt hash, model deployment, citations, and result status. Restricted evidence is trimmed unless the user has matching source ACLs.",
      citations: page.citations,
      warning: "Some restricted source material was excluded because the current demo user does not belong to Legal Restricted or Compliance Office groups."
    };
    addAudit("Permission trimmed answer", page.title, "Blocked", "High");
    render();
    return;
  }

  const candidates = state.pages
    .filter(page => lower.split(/\s+/).some(term => [page.title, page.summary, page.tags.join(" ")].join(" ").toLowerCase().includes(term)))
    .slice(0, 2);
  const pages = candidates.length ? candidates : state.pages.slice(0, 2);
  state.qaResult = {
    mode: "answer",
    answer: `The Wiki answer is assembled from ${pages.map(page => `<strong>${escapeHtml(page.title)}</strong>`).join(" and ")}. ${escapeHtml(pages[0].summary)} The system would stream this response and keep the citations attached for audit review.`,
    citations: [...new Set(pages.flatMap(page => page.citations))].slice(0, 4),
    warning: pages.some(page => page.warnings.length) ? "One cited page has unresolved validation warnings and should be confirmed with the owner." : ""
  };
  addAudit("Answered question", question, "Allowed", "Low");
  render();
}

app.addEventListener("input", event => {
  const field = event.target.dataset.field;
  if (!field) return;
  state[field] = event.target.value;
  if (["query", "editOwner", "qaQuestion"].includes(field)) render();
});

app.addEventListener("change", event => {
  const field = event.target.dataset.field;
  if (!field) return;
  state[field] = event.target.value;
  render();
});

app.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "nav") {
    state.view = target.dataset.view;
    state.editing = false;
    render();
  }
  if (action === "select-page") {
    state.selectedPageId = target.dataset.id;
    state.editing = false;
    if (target.dataset.next) state.view = target.dataset.next;
    render();
  }
  if (action === "select-approval") {
    state.selectedApprovalId = target.dataset.id;
    render();
  }
  if (action === "clear-filters") {
    Object.assign(state, { query: "", domain: "All", status: "All", sort: "confidence-asc" });
    render();
  }
  if (action === "empty-filter") {
    Object.assign(state, { query: "does-not-exist", domain: "Risk", status: "Published" });
    render();
  }
  if (action === "edit-metadata") {
    const page = pageById(state.selectedPageId);
    state.editing = true;
    state.editOwner = page.owner;
    state.editSensitivity = page.sensitivity;
    render();
  }
  if (action === "cancel-edit") {
    state.editing = false;
    render();
  }
  if (action === "save-metadata") {
    const page = pageById(state.selectedPageId);
    page.owner = state.editOwner || page.owner;
    page.sensitivity = state.editSensitivity || page.sensitivity;
    page.status = "Needs Review";
    state.editing = false;
    addAudit("Metadata edited", page.title, "Waiting", "Medium");
    showToast("Metadata saved and routed to review.");
  }
  if (action === "request-review") requestReview(target.dataset.id);
  if (action === "suggest-question") {
    state.qaQuestion = target.dataset.question;
    state.qaError = "";
    render();
  }
  if (action === "ask-question") askQuestion();
  if (action === "clear-answer") {
    state.qaResult = null;
    state.qaError = "";
    state.qaQuestion = "";
    render();
  }
  if (action === "toggle-degraded") {
    state.degradedMode = !state.degradedMode;
    render();
  }
  if (action === "run-delta") {
    state.ingestJobs.unshift({ id: `job-${Math.floor(Math.random() * 9000)}`, file: "Delta batch from OneDrive", owner: "Graph Webhook", stage: "Scan", status: "Running", queueAge: "0 min", updated: "2026-05-16 10:30", warning: "New simulated delta event created for demo." });
    addAudit("Delta sync started", "OneDrive changes", "Running", "Low");
    showToast("Delta sync job created.");
  }
  if (action === "retry-failed") {
    const job = state.ingestJobs.find(item => item.status === "Failed");
    const source = state.sourceDocuments.find(item => item.status === "Password Protected");
    if (job) Object.assign(job, { status: "Needs Review", stage: "Owner follow-up", queueAge: "0 min", warning: "Retry requires owner-provided password or metadata-only approval." });
    if (source) source.status = "Queued";
    addAudit("Retry requested", "Vendor Security Addendum.pdf", "Warning", "Medium");
    showToast("Failed document moved to owner follow-up.");
  }
  if (action === "approve-selected" || action === "reject-selected") {
    const approval = approvalById(state.selectedApprovalId);
    state.confirm = {
      kind: action === "approve-selected" ? "approve" : "reject",
      approvalId: approval.id,
      message: `${action === "approve-selected" ? "Approve" : "Reject"} ${pageById(approval.pageId).title}? This will update visible mock state.`
    };
    render();
  }
  if (action === "confirm-no") {
    state.confirm = null;
    render();
  }
  if (action === "confirm-yes") {
    const approval = approvalById(state.confirm.approvalId);
    const page = pageById(approval.pageId);
    if (state.confirm.kind === "approve") {
      approval.status = "Approved";
      page.status = "Published";
      page.humanReviewed = true;
      page.confidence = Math.max(page.confidence, 0.89);
      page.warnings = page.warnings.filter(warning => !warning.includes("Conflicting"));
      addAudit("Approval completed", page.title, "Allowed", "Low");
      showToast("Approval completed and page published.");
    } else {
      approval.status = "Rejected";
      page.status = "Blocked";
      page.confidence = Math.min(page.confidence, 0.68);
      addAudit("Approval rejected", page.title, "Blocked", "High");
      showToast("Approval rejected and page blocked.");
    }
    state.confirm = null;
  }
  if (action === "cost-warning") {
    addAudit("Cost threshold warning", "Token budget at 80 percent", "Warning", "Medium");
    showToast("Cost warning event added to audit log.");
  }
  if (action === "demo-path") {
    state.view = "ingest";
    render();
  }
});

render();