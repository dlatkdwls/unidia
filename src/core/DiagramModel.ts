import { Observable } from './Observable';

export interface Point {
  x: number;
  y: number;
}

export interface NodeLayout {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

/**
 * 다이어그램 상태.
 * - code: 논리 구조 (Mermaid 코드)
 * - nodeLayouts / edgePaths: GUI에서 편집한 시각 정보. 코드와 별도로 관리하며
 *   코드를 수정해도 유지된다 (REQ-03, SRS 3.4).
 */
export interface DiagramState {
  code: string;
  nodeLayouts: Record<string, NodeLayout>;
  edgePaths: Record<string, Point[]>;
}

export class DiagramModel extends Observable<Readonly<DiagramState>> {
  private state: DiagramState;

  constructor(initial?: Partial<DiagramState>) {
    super();
    this.state = {
      code: initial?.code ?? '',
      nodeLayouts: { ...(initial?.nodeLayouts ?? {}) },
      edgePaths: { ...(initial?.edgePaths ?? {}) },
    };
  }

  getState(): Readonly<DiagramState> {
    return this.state;
  }

  setCode(code: string): void {
    if (code === this.state.code) return;
    this.state = { ...this.state, code };
    this.emit(this.state);
  }

  /** layout이 undefined면 해당 노드의 시각 정보를 지운다. */
  setNodeLayout(nodeId: string, layout: NodeLayout | undefined): void {
    const nodeLayouts = { ...this.state.nodeLayouts };
    if (layout) nodeLayouts[nodeId] = layout;
    else delete nodeLayouts[nodeId];
    this.state = { ...this.state, nodeLayouts };
    this.emit(this.state);
  }

  setEdgePath(edgeId: string, points: Point[] | undefined): void {
    const edgePaths = { ...this.state.edgePaths };
    if (points) edgePaths[edgeId] = points;
    else delete edgePaths[edgeId];
    this.state = { ...this.state, edgePaths };
    this.emit(this.state);
  }

  /** 저장 (REQ-12). */
  toJSON(): string {
    return JSON.stringify({ version: 1, ...this.state }, null, 2);
  }

  /** 불러오기 (REQ-12). 형식이 맞지 않으면 예외를 던진다. */
  static fromJSON(json: string): DiagramModel {
    const data = JSON.parse(json) as Partial<DiagramState> & { version?: number };
    if (typeof data.code !== 'string') {
      throw new Error('올바른 UniDia 파일이 아닙니다: code 필드가 없습니다');
    }
    return new DiagramModel({
      code: data.code,
      nodeLayouts: data.nodeLayouts ?? {},
      edgePaths: data.edgePaths ?? {},
    });
  }
}
