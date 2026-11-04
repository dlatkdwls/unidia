/** Strategy 패턴: 내보내기 형식별 알고리즘을 교체 가능하게 한다 (REQ-08). */
export interface ExportInput {
  /** 현재 렌더링된 SVG */
  svg: string;
  /** 현재 Mermaid 코드 */
  code: string;
}

export interface ExportStrategy {
  readonly id: 'png' | 'jpg' | 'mermaid';
  readonly extension: string;
  readonly mimeType: string;
  export(input: ExportInput): Promise<Blob>;
}

/** Mermaid 코드(.mmd) 내보내기 */
export class MermaidCodeExport implements ExportStrategy {
  readonly id = 'mermaid' as const;
  readonly extension = 'mmd';
  readonly mimeType = 'text/plain';

  async export({ code }: ExportInput): Promise<Blob> {
    return new Blob([code], { type: this.mimeType });
  }
}

/**
 * PNG/JPG 내보내기 — 아직 구현 전.
 * REQ-08 기준(잠정): 폭 2000px 이상, 객체·텍스트 잘림 0건.
 * 알려진 주의점: Mermaid의 htmlLabels(foreignObject)가 canvas로 그릴 때 문제를
 * 일으킬 수 있으므로 구현 시 브라우저별로 확인한다.
 */
class NotImplementedImageExport implements ExportStrategy {
  readonly mimeType: string;

  constructor(
    readonly id: 'png' | 'jpg',
    readonly extension: string,
    mimeType: string,
  ) {
    this.mimeType = mimeType;
  }

  async export(_input: ExportInput): Promise<Blob> {
    throw new Error(`${this.id.toUpperCase()} 내보내기는 아직 구현되지 않았습니다 (REQ-08)`);
  }
}

export const exportStrategies: ExportStrategy[] = [
  new MermaidCodeExport(),
  new NotImplementedImageExport('png', 'png', 'image/png'),
  new NotImplementedImageExport('jpg', 'jpg', 'image/jpeg'),
];
