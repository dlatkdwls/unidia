import { describe, expect, it } from 'vitest';
import { detectDiagramType } from './diagramTypes';

describe('detectDiagramType (REQ-07)', () => {
  it('클래스·시퀀스 다이어그램을 판별한다', () => {
    expect(detectDiagramType('classDiagram\n  A <|-- B')).toBe('class');
    expect(detectDiagramType('sequenceDiagram\n  A->>B: hi')).toBe('sequence');
  });

  it('앞의 빈 줄과 주석은 건너뛴다', () => {
    expect(detectDiagramType('\n%% 주석\n  classDiagram\n')).toBe('class');
  });

  it('지원하지 않는 유형이나 빈 입력은 null', () => {
    expect(detectDiagramType('flowchart TD\n A-->B')).toBeNull();
    expect(detectDiagramType('')).toBeNull();
    expect(detectDiagramType('%% 주석만')).toBeNull();
  });
});
