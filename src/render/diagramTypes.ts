/** 지원하는 다이어그램 유형 (REQ-07: 클래스, 시퀀스 2종). */
export type DiagramType = 'class' | 'sequence';

/**
 * Mermaid 코드의 첫 유효 줄로 다이어그램 유형을 판별한다.
 * 주석(%%)과 빈 줄은 건너뛴다. 지원하지 않는 유형이면 null.
 * 참고: frontmatter(---) 블록은 아직 처리하지 않는다.
 */
export function detectDiagramType(code: string): DiagramType | null {
  const first = code
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line !== '' && !line.startsWith('%%'));
  if (!first) return null;
  if (first.startsWith('classDiagram')) return 'class';
  if (first.startsWith('sequenceDiagram')) return 'sequence';
  return null;
}
