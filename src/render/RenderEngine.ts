import mermaid from 'mermaid';

export interface RenderResult {
  svg: string;
}

/**
 * Facade 패턴: Mermaid.js API를 감싸 단순한 창구로 노출한다.
 * 렌더링 엔진을 교체해도 나머지 코드에 영향이 없도록 mermaid import는 이 파일에만 둔다.
 */
export class RenderEngine {
  private initialized = false;
  private counter = 0;

  private init(): void {
    if (this.initialized) return;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
    this.initialized = true;
  }

  /** 코드를 SVG 문자열로 렌더링한다. 문법 오류면 예외를 던진다. */
  async render(code: string): Promise<RenderResult> {
    this.init();
    const id = `unidia-render-${this.counter++}`;
    try {
      const { svg } = await mermaid.render(id, code);
      return { svg };
    } finally {
      // 렌더 실패 시 Mermaid가 body에 남기는 임시 요소를 정리한다.
      document.getElementById(`d${id}`)?.remove();
      document.getElementById(id)?.remove();
    }
  }
}
