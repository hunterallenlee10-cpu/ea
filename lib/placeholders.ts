/**
 * Show the yellow [CONFIRM WITH ERIK …] / [ERIK TO PROVIDE …] boxes on the site?
 * Hunter asked to hide them for now (he'll confirm the facts with Erik later). Every open item is still
 * listed in OPEN-QUESTIONS.md, and each hidden placeholder leaves an invisible data-ph marker in the HTML
 * so scripts/qa.ts can count what is still unanswered. Set to true to show them again.
 */
export const SHOW_PLACEHOLDERS = false;

/** True when a content value is still a placeholder string like "[ERIK TO PROVIDE: …]". */
export const isPlaceholder = (v: string | null | undefined) => !v || v.trim().startsWith("[");
