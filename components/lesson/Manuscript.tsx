import type { ReactNode } from "react";

type ManuscriptProps = {
  text: string;
  answerLabel?: string;
};

const questionStart = /^\*\*(?:Pause and think|Try this|Түр бодоорой|Өөрөө бодоорой):\*\*/;
const answerStart = /^\*\*(?:Answer|Example answer|Хариу|Жишээ хариу):\*\*/;

function sourceUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : null;
  } catch {
    return null;
  }
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const tokens = /\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let cursor = 0;

  for (const match of text.matchAll(tokens)) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={match.index}>{inline(match[1])}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<code key={match.index}>{match[2]}</code>);
    } else if (match[3] !== undefined) {
      nodes.push(<em key={match.index}>{inline(match[3])}</em>);
    } else {
      const href = sourceUrl(match[5]);
      nodes.push(href
        ? <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">{inline(match[4])}</a>
        : match[0]);
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function blockElement(block: string, key: number): ReactNode {
  const heading = block.match(/^#{1,4} (.+)$/);
  if (heading) return <h3 key={key}>{inline(heading[1])}</h3>;
  if (/^---+$/.test(block)) return <hr key={key} />;

  const lines = block.split("\n");
  if (lines.every((line) => /^\d+\. /.test(line))) {
    return <ol key={key} start={Number(lines[0].match(/^\d+/)![0])}>
      {lines.map((line, index) => <li key={index}>{inline(line.replace(/^\d+\. /, ""))}</li>)}
    </ol>;
  }
  if (lines.every((line) => /^- /.test(line))) {
    return <ul key={key}>
      {lines.map((line, index) => <li key={index}>{inline(line.slice(2))}</li>)}
    </ul>;
  }

  return <p key={key}>{inline(block)}</p>;
}

export default function Manuscript({ text, answerLabel = "Show answer" }: ManuscriptProps) {
  const blocks = text.replaceAll("\r\n", "\n").trim().split(/\n\s*\n/).filter(Boolean);
  const content: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const next = blocks[index + 1];
    if (questionStart.test(block) && next && answerStart.test(next)) {
      content.push(<div className="p-reading-check" key={`${index}-${block}`}>
        <p>{inline(block)}</p>
        <details>
          <summary>{answerLabel}</summary>
          <p>{inline(next)}</p>
        </details>
      </div>);
      index += 1;
    } else {
      content.push(blockElement(block, index));
    }
  }

  return <div className="p-prose">{content}</div>;
}
