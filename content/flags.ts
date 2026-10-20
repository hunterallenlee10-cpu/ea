/**
 * Claims on the live site that Erik must confirm (KICKSTART section 11 / OPEN-QUESTIONS.md).
 * The renderer shows a visible placeholder right after any paragraph, list item or FAQ answer that matches.
 * `remove: true` hides the text entirely (the spec says it stays out unless Erik confirms it).
 * At LAUNCH every unanswered flag means: keep the live wording (drop the placeholder) or remove the element.
 */
export type Flag = { paths?: string[]; match: RegExp; note: string; remove?: boolean };

export const FLAGS: Flag[] = [
  { paths: ["/decks-and-fences-painting"], match: /Mark Thompson/, note: "Removed until Erik confirms team leader Mark Thompson (#6)", remove: true },
  { paths: ["/faqs"], match: /Dallas, TX/, note: "CONFIRM WITH ERIK: is Dallas, TX still served? (#4)" },
  { match: /warranty protected 4 years/, note: "CONFIRM WITH ERIK: warranty 4 or 2 years (#1)" },
  { paths: ["/painting-company/mill-creek"], match: /top three highest-ranked/, note: "CONFIRM WITH ERIK: can this ranking be backed up? (#7)" },
  { paths: ["/painting-company/mill-creek"], match: /five years in a row/, note: "CONFIRM WITH ERIK: HomeAdvisor claims (#7)" },
  { paths: ["/kirkland"], match: /11624 NE 155th|206\.312\.3292/, note: "CONFIRM WITH ERIK: is this a real second location and phone? (#3)" },
  { paths: ["/kirkland"], match: /Saturday/, note: "CONFIRM WITH ERIK: Saturday hours (#5)" },
  { paths: ["/painting-company/mercer-island"], match: /Lead-Safe Renovation/, note: "CONFIRM WITH ERIK: is EA Pro EPA lead-safe (RRP) certified? (#14)" },
];

export function flagsFor(path: string, text: string) {
  return FLAGS.filter((f) => (!f.paths || f.paths.includes(path)) && f.match.test(text));
}
