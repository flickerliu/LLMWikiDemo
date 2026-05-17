window.mockData = {
  currentUser: {
    name: "Lina Chen",
    role: "Knowledge Operations Lead",
    groups: ["All Employees", "Finance Readers", "Pilot Business Unit"],
    region: "Approved Azure Geo TBD"
  },
  wikiPages: [
    {
      id: "wiki-travel-expense",
      title: "Travel and Expense Policy",
      type: "Policy",
      domain: "Finance",
      sensitivity: "Internal",
      owner: "Finance Operations",
      status: "Published",
      freshness: "Fresh",
      confidence: 0.96,
      humanReviewed: true,
      lastUpdated: "2026-05-14 09:20",
      nextReviewDue: "2026-08-14",
      sourceCount: 8,
      tags: ["expense", "travel", "approval", "finance"],
      summary: "Employees can submit standard travel expenses within 30 days. Flights above policy threshold require manager approval before booking.",
      sections: [
        "Meal and taxi limits are summarized from the Finance FY26 policy pack.",
        "International travel requires approval from the cost center owner and Security for high-risk destinations.",
        "The page is safe for general internal use and has passed source consistency checks."
      ],
      citations: ["src-expense-policy", "src-travel-faq", "src-finance-q2"],
      related: ["wiki-approval-matrix", "wiki-cost-guardrails"],
      metrics: { views: 1284, unanswered: 7, searchHits: 412 },
      history: [
        "May 14: LLM merged updated airfare threshold from Finance FAQ.",
        "May 13: Human reviewer approved policy wording.",
        "May 10: Initial page generated from OneDrive policy bundle."
      ],
      warnings: []
    },
    {
      id: "wiki-approval-matrix",
      title: "Sensitive Wiki Change Approval Matrix",
      type: "Governance",
      domain: "Security",
      sensitivity: "Confidential",
      owner: "Information Security",
      status: "Needs Review",
      freshness: "Due Soon",
      confidence: 0.74,
      humanReviewed: false,
      lastUpdated: "2026-05-15 16:42",
      nextReviewDue: "2026-05-18",
      sourceCount: 5,
      tags: ["approval", "security", "governance", "sensitivity"],
      summary: "Low-confidence or sensitive LLM-generated edits must route to designated approvers before becoming visible to broad audiences.",
      sections: [
        "Restricted pages require two approvers: data owner and security reviewer.",
        "Confidential pages can be approved by the mapped owner group when confidence is at least 0.85.",
        "The current page needs human review because source documents disagree on the escalation SLA."
      ],
      citations: ["src-security-approval", "src-data-classification", "src-old-approval-sla"],
      related: ["wiki-permission-trimming", "wiki-audit-retention"],
      metrics: { views: 646, unanswered: 22, searchHits: 251 },
      history: [
        "May 15: Quality gate detected SLA conflict between old and new guidance.",
        "May 15: Routed to Information Security approval queue.",
        "May 12: First generated from governance schema."
      ],
      warnings: ["Conflicting source values: 2 business days vs. 5 business days for security escalation."]
    },
    {
      id: "wiki-permission-trimming",
      title: "Query-Time Permission Trimming",
      type: "Architecture",
      domain: "Platform",
      sensitivity: "Internal",
      owner: "Cloud and AI Engineering",
      status: "Published",
      freshness: "Fresh",
      confidence: 0.91,
      humanReviewed: true,
      lastUpdated: "2026-05-13 11:12",
      nextReviewDue: "2026-07-30",
      sourceCount: 6,
      tags: ["acl", "search", "entra", "security"],
      summary: "Search and answer generation must filter Wiki chunks by the user's Entra groups and captured OneDrive ACLs before model context is assembled.",
      sections: [
        "The search index stores aclGroupSids as a filterable collection field.",
        "The API resolves user groups through Entra and caches group membership for short durations.",
        "No answer may cite a source document the current user cannot access."
      ],
      citations: ["src-solution-design", "src-identity-notes", "src-search-schema"],
      related: ["wiki-approval-matrix", "wiki-audit-retention"],
      metrics: { views: 914, unanswered: 4, searchHits: 333 },
      history: [
        "May 13: Human reviewer confirmed no broad application permission in MVP.",
        "May 11: Added search.in filter example."
      ],
      warnings: []
    },
    {
      id: "wiki-cost-guardrails",
      title: "LLM Cost Guardrails and Model Routing",
      type: "Operations",
      domain: "FinOps",
      sensitivity: "Internal",
      owner: "Platform Operations",
      status: "Published",
      freshness: "Due Soon",
      confidence: 0.88,
      humanReviewed: false,
      lastUpdated: "2026-05-10 14:05",
      nextReviewDue: "2026-05-24",
      sourceCount: 7,
      tags: ["cost", "llm", "routing", "budget"],
      summary: "The platform routes at least 70 percent of pipeline steps to small models and stops noncritical processing when monthly token spend crosses the configured hard cap.",
      sections: [
        "Classification, routing, and most lint tasks should use the small model tier.",
        "Large model calls are reserved for synthesis, complex merge, and user-facing answers.",
        "The final monthly budget value remains TBD and must be approved by Finance."
      ],
      citations: ["src-finops-plan", "src-solution-design", "src-budget-email"],
      related: ["wiki-travel-expense", "wiki-ingestion-pipeline"],
      metrics: { views: 522, unanswered: 18, searchHits: 201 },
      history: ["May 10: Added budget breaker note from solution design.", "May 08: Generated first draft."],
      warnings: ["Monthly budget threshold is not confirmed."]
    },
    {
      id: "wiki-ingestion-pipeline",
      title: "OneDrive Ingestion Pipeline Runbook",
      type: "Runbook",
      domain: "Platform",
      sensitivity: "Internal",
      owner: "Cloud and AI Engineering",
      status: "Published",
      freshness: "Fresh",
      confidence: 0.93,
      humanReviewed: true,
      lastUpdated: "2026-05-16 08:30",
      nextReviewDue: "2026-06-16",
      sourceCount: 10,
      tags: ["onedrive", "graph", "service-bus", "pipeline"],
      summary: "Graph change notifications enqueue file events, workers extract text and OCR, small models classify content, and quality gates decide automatic commit or approval routing.",
      sections: [
        "Idempotency key is driveItemId@etag to avoid duplicate processing.",
        "Password-protected files are indexed as metadata only and surfaced as warnings.",
        "Graph 429 responses use exponential backoff and per-drive concurrency limits."
      ],
      citations: ["src-graph-webhook", "src-worker-runbook", "src-document-intel"],
      related: ["wiki-cost-guardrails", "wiki-stale-content"],
      metrics: { views: 735, unanswered: 9, searchHits: 287 },
      history: ["May 16: Added checkpoint and resume guidance.", "May 15: Linked Document Intelligence OCR step."],
      warnings: []
    },
    {
      id: "wiki-stale-content",
      title: "Stale Content and Conflict Report",
      type: "Report",
      domain: "Knowledge Quality",
      sensitivity: "Internal",
      owner: "Knowledge Management",
      status: "Needs Review",
      freshness: "Stale",
      confidence: 0.62,
      humanReviewed: false,
      lastUpdated: "2026-04-28 17:18",
      nextReviewDue: "2026-05-05",
      sourceCount: 12,
      tags: ["quality", "lint", "conflict", "freshness"],
      summary: "Daily lint found out-of-date pages and contradictory source guidance across Finance, HR, and Security content areas.",
      sections: [
        "Top stale area is policy ownership, where source owners changed but page metadata did not.",
        "The report recommends owner review for pages below 0.75 confidence.",
        "Several conflicts are blocked until source owners confirm the authoritative document."
      ],
      citations: ["src-lint-report", "src-owner-roster", "src-old-approval-sla"],
      related: ["wiki-approval-matrix", "wiki-audit-retention"],
      metrics: { views: 318, unanswered: 31, searchHits: 144 },
      history: ["Apr 28: Weekly lint report created.", "May 02: Owner mapping failed for two source files."],
      warnings: ["Five referenced source documents are older than 180 days.", "Owner mapping is missing for HR Benefits."
      ]
    },
    {
      id: "wiki-new-hire-onboarding",
      title: "New Hire Knowledge Onboarding",
      type: "FAQ",
      domain: "People",
      sensitivity: "Internal",
      owner: "People Experience",
      status: "Draft",
      freshness: "Fresh",
      confidence: 0.81,
      humanReviewed: false,
      lastUpdated: "2026-05-15 10:05",
      nextReviewDue: "2026-06-01",
      sourceCount: 9,
      tags: ["onboarding", "faq", "people", "new-hire"],
      summary: "A role-based onboarding landing page for new employees, compiled from People, IT, and Finance starter documents.",
      sections: [
        "The page links role-specific setup tasks and policy summaries.",
        "Low-risk FAQ answers can publish automatically after confidence passes 0.85.",
        "The current draft is waiting for People Experience to confirm manager checklist wording."
      ],
      citations: ["src-new-hire-guide", "src-it-checklist", "src-travel-faq"],
      related: ["wiki-travel-expense", "wiki-permission-trimming"],
      metrics: { views: 209, unanswered: 16, searchHits: 188 },
      history: ["May 15: Draft assembled from three onboarding folders.", "May 15: Missing owner detected for remote equipment policy."],
      warnings: ["Manager checklist source has no clear owner."]
    },
    {
      id: "wiki-audit-retention",
      title: "Audit Retention and Evidence Access",
      type: "Compliance",
      domain: "Risk",
      sensitivity: "Restricted",
      owner: "Compliance Office",
      status: "Blocked",
      freshness: "Due Soon",
      confidence: 0.69,
      humanReviewed: false,
      lastUpdated: "2026-05-09 13:40",
      nextReviewDue: "2026-05-20",
      sourceCount: 4,
      tags: ["audit", "retention", "worm", "compliance"],
      summary: "Audit logs for user queries, page access, and LLM edits are retained for at least 12 months, with WORM storage requirements still under review.",
      sections: [
        "Every answer stores prompt hash, model deployment, source citations, and user identity for audit.",
        "Compliance has not confirmed whether immutable export is required for MVP.",
        "Restricted data should remain hidden unless the user has matching OneDrive-derived ACLs."
      ],
      citations: ["src-audit-requirement", "src-worm-email", "src-solution-design"],
      related: ["wiki-permission-trimming", "wiki-approval-matrix"],
      metrics: { views: 172, unanswered: 12, searchHits: 97 },
      history: ["May 09: Page blocked due to unresolved WORM requirement.", "May 07: Compliance source added."],
      warnings: ["WORM retention decision is unresolved.", "Restricted page cannot publish without Compliance approval."]
    }
  ],
  sourceDocuments: [
    { id: "src-expense-policy", title: "FY26 Travel and Expense Policy.docx", owner: "Finance Operations", location: "OneDrive / Finance / Policies", type: "docx", lastModified: "2026-05-14", status: "Indexed", sensitivity: "Internal", acl: ["Finance Readers", "All Employees"], pageIds: ["wiki-travel-expense"] },
    { id: "src-travel-faq", title: "Travel FAQ.md", owner: "Finance Operations", location: "OneDrive / Finance / FAQ", type: "markdown", lastModified: "2026-05-13", status: "Indexed", sensitivity: "Internal", acl: ["All Employees"], pageIds: ["wiki-travel-expense", "wiki-new-hire-onboarding"] },
    { id: "src-finance-q2", title: "Q2 Finance Policy Change Email.eml", owner: "Finance Operations", location: "OneDrive / Finance / Announcements", type: "email", lastModified: "2026-05-11", status: "Indexed", sensitivity: "Internal", acl: ["Finance Readers", "All Employees"], pageIds: ["wiki-travel-expense", "wiki-cost-guardrails"] },
    { id: "src-security-approval", title: "Sensitive Update Approval Matrix.xlsx", owner: "Information Security", location: "OneDrive / Security / Governance", type: "xlsx", lastModified: "2026-05-15", status: "Indexed", sensitivity: "Confidential", acl: ["Security Reviewers"], pageIds: ["wiki-approval-matrix"] },
    { id: "src-data-classification", title: "Data Classification Standard.pdf", owner: "Compliance Office", location: "OneDrive / Risk / Standards", type: "pdf", lastModified: "2026-05-04", status: "OCR Complete", sensitivity: "Confidential", acl: ["Compliance Office", "Security Reviewers"], pageIds: ["wiki-approval-matrix", "wiki-audit-retention"] },
    { id: "src-old-approval-sla", title: "Legacy Approval SLA.pptx", owner: "Unknown", location: "OneDrive / Archive / Governance", type: "pptx", lastModified: "2025-10-18", status: "Conflict", sensitivity: "Internal", acl: ["All Employees"], pageIds: ["wiki-approval-matrix", "wiki-stale-content"] },
    { id: "src-worker-runbook", title: "Ingestion Worker Runbook.md", owner: "Cloud and AI Engineering", location: "OneDrive / Platform / Runbooks", type: "markdown", lastModified: "2026-05-16", status: "Indexed", sensitivity: "Internal", acl: ["Platform Operators"], pageIds: ["wiki-ingestion-pipeline"] },
    { id: "src-password-vendor", title: "Vendor Security Addendum.pdf", owner: "Legal", location: "OneDrive / Legal / Vendors", type: "pdf", lastModified: "2026-05-12", status: "Password Protected", sensitivity: "Restricted", acl: ["Legal Restricted"], pageIds: [] },
    { id: "src-new-hire-guide", title: "New Hire Guide.pdf", owner: "People Experience", location: "OneDrive / People / Onboarding", type: "pdf", lastModified: "2026-05-15", status: "Queued", sensitivity: "Internal", acl: ["All Employees"], pageIds: ["wiki-new-hire-onboarding"] }
  ],
  extractionExamples: [
    {
      id: "extract-approval-matrix",
      pageId: "wiki-approval-matrix",
      title: "Source-to-Wiki extraction sample",
      scenario: "A governance update is compiled from an Excel approval matrix, a PDF classification standard, and an older PowerPoint SLA reference.",
      sourceIds: ["src-security-approval", "src-data-classification", "src-old-approval-sla"],
      extractedSignals: [
        { label: "Sensitivity rule", value: "Restricted pages require data owner and security reviewer approval." },
        { label: "Confidence signal", value: "Two sources agree on sensitive update routing; one archived deck conflicts on SLA." },
        { label: "Conflict detected", value: "Security escalation SLA appears as 2 business days in current Excel and 5 business days in legacy PowerPoint." },
        { label: "Permission boundary", value: "Confidential sources are limited to Security Reviewers and Compliance Office groups." }
      ],
      generatedMarkdown: {
        frontMatter: [
          "title: Sensitive Wiki Change Approval Matrix",
          "owner: Information Security",
          "sensitivity: Confidential",
          "status: Needs Review",
          "confidence: 0.74",
          "sources: src-security-approval, src-data-classification, src-old-approval-sla"
        ],
        sections: [
          { heading: "When review is required", body: "Low-confidence or sensitive LLM-generated edits must route to designated approvers before becoming visible to broad audiences." },
          { heading: "Approval path", body: "Restricted pages require two approvers: the mapped data owner and a security reviewer. Confidential pages can be approved by the mapped owner group when confidence is at least 0.85." },
          { heading: "Open conflict", body: "The escalation SLA is unresolved because source documents disagree between 2 business days and 5 business days. The page remains in Needs Review until Information Security confirms the authoritative value." }
        ]
      },
      validationPoints: [
        "Confirm whether the customer wants to show extracted snippets, source metadata, or both in the generated Wiki page.",
        "Confirm if conflicting source values should block publishing or publish with a visible warning.",
        "Confirm which source ACL should govern a Wiki page compiled from mixed-permission documents."
      ]
    },
    {
      id: "extract-travel-policy",
      pageId: "wiki-travel-expense",
      title: "Published policy extraction sample",
      scenario: "Finance policy and FAQ content are compiled into a reviewed employee-facing travel policy page.",
      sourceIds: ["src-expense-policy", "src-travel-faq", "src-finance-q2"],
      extractedSignals: [
        { label: "Policy threshold", value: "Flights above policy threshold require manager approval before booking." },
        { label: "Employee action", value: "Standard travel expenses must be submitted within 30 days." },
        { label: "Review status", value: "Finance Operations approved the generated wording on May 13." }
      ],
      generatedMarkdown: {
        frontMatter: [
          "title: Travel and Expense Policy",
          "owner: Finance Operations",
          "sensitivity: Internal",
          "status: Published",
          "confidence: 0.96",
          "sources: src-expense-policy, src-travel-faq, src-finance-q2"
        ],
        sections: [
          { heading: "Expense submission", body: "Employees can submit standard travel expenses within 30 days of the trip or purchase date." },
          { heading: "Pre-approval", body: "Flights above the configured policy threshold require manager approval before booking." },
          { heading: "International travel", body: "International travel requires cost center approval and additional security review for high-risk destinations." }
        ]
      },
      validationPoints: [
        "Confirm whether policy thresholds should be displayed as exact values once production source documents are available.",
        "Confirm whether employee-facing pages should hide internal extraction confidence details."
      ]
    }
  ],
  ingestJobs: [
    { id: "job-8192", file: "New Hire Guide.pdf", owner: "People Experience", stage: "OCR extraction", status: "Running", queueAge: "12 min", updated: "2026-05-16 10:18", warning: "Large scanned PDF; Document Intelligence route selected." },
    { id: "job-8191", file: "Sensitive Update Approval Matrix.xlsx", owner: "Information Security", stage: "Quality gate", status: "Needs Review", queueAge: "24 min", updated: "2026-05-16 10:06", warning: "Conflicting SLA values detected." },
    { id: "job-8187", file: "Vendor Security Addendum.pdf", owner: "Legal", stage: "Scan", status: "Failed", queueAge: "2 hr", updated: "2026-05-16 08:12", warning: "Password protected; metadata-only fallback applied." },
    { id: "job-8175", file: "FY26 Travel and Expense Policy.docx", owner: "Finance Operations", stage: "Commit", status: "Complete", queueAge: "0 min", updated: "2026-05-14 09:20", warning: "" }
  ],
  approvals: [
    { id: "apr-1044", pageId: "wiki-approval-matrix", type: "Sensitive update", requester: "LLM Quality Gate", approver: "Information Security", status: "Waiting", priority: "High", reason: "Conflicting security escalation SLA", diff: "+ Escalation SLA changed from 5 business days to 2 business days", created: "2026-05-15", due: "2026-05-18" },
    { id: "apr-1041", pageId: "wiki-stale-content", type: "Owner confirmation", requester: "Weekly Lint", approver: "Knowledge Management", status: "Waiting", priority: "Medium", reason: "Missing owner mapping for HR Benefits", diff: "+ Owner changed from Unknown to People Experience", created: "2026-05-14", due: "2026-05-21" },
    { id: "apr-1039", pageId: "wiki-audit-retention", type: "Compliance decision", requester: "Governance Rule", approver: "Compliance Office", status: "Blocked", priority: "High", reason: "WORM retention requirement unresolved", diff: "+ Audit export mode marked TBD", created: "2026-05-09", due: "2026-05-20" }
  ],
  auditEvents: [
    { id: "evt-7781", time: "10:21", actor: "Lina Chen", action: "Viewed page", target: "Travel and Expense Policy", result: "Allowed", risk: "Low" },
    { id: "evt-7779", time: "10:18", actor: "Ingestion Worker", action: "OCR route selected", target: "New Hire Guide.pdf", result: "Running", risk: "Low" },
    { id: "evt-7776", time: "10:06", actor: "Quality Gate", action: "Approval routed", target: "Sensitive Wiki Change Approval Matrix", result: "Waiting", risk: "Medium" },
    { id: "evt-7764", time: "09:44", actor: "Query API", action: "Permission trimmed answer", target: "Restricted audit evidence", result: "Blocked", risk: "High" },
    { id: "evt-7752", time: "08:12", actor: "Ingestion Worker", action: "Metadata-only fallback", target: "Vendor Security Addendum.pdf", result: "Warning", risk: "Medium" }
  ],
  costDays: [
    { day: "Mon", tokens: 18.4, smallModelShare: 0.76, spend: 420 },
    { day: "Tue", tokens: 23.1, smallModelShare: 0.73, spend: 515 },
    { day: "Wed", tokens: 19.7, smallModelShare: 0.78, spend: 448 },
    { day: "Thu", tokens: 25.9, smallModelShare: 0.71, spend: 590 },
    { day: "Fri", tokens: 21.2, smallModelShare: 0.75, spend: 482 },
    { day: "Sat", tokens: 8.8, smallModelShare: 0.82, spend: 166 },
    { day: "Sun", tokens: 7.4, smallModelShare: 0.84, spend: 141 }
  ],
  qaSuggestions: [
    "What changed in the travel expense policy this week?",
    "Which wiki pages need security approval?",
    "Why did the ingestion pipeline mark a document as metadata-only?",
    "Show me audit retention requirements and unresolved risks"
  ]
};