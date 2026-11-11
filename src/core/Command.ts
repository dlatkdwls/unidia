import type { DiagramModel, NodeLayout } from './DiagramModel';
import { Observable } from './Observable';

/** Command 패턴: 편집 동작을 객체로 만들어 실행 취소/재실행을 지원한다 (REQ-11). */
export interface Command {
  execute(): void;
  undo(): void;
}

/**
 * 실행 취소/재실행 기록.
 * 스택이 바뀔 때마다 구독자에게 알린다 (버튼 활성화 상태 갱신용).
 * 알림은 스택을 모두 갱신한 "뒤"에 보내므로, 구독자는 항상 최신 canUndo/canRedo를 본다.
 */
export class CommandHistory extends Observable<void> {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
    this.emit();
  }

  undo(): boolean {
    const command = this.undoStack.pop();
    if (!command) return false;
    command.undo();
    this.redoStack.push(command);
    this.emit();
    return true;
  }

  redo(): boolean {
    const command = this.redoStack.pop();
    if (!command) return false;
    command.execute();
    this.undoStack.push(command);
    this.emit();
    return true;
  }

  get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

export class SetCodeCommand implements Command {
  constructor(
    private model: DiagramModel,
    private prev: string,
    private next: string,
  ) {}

  execute(): void {
    this.model.setCode(this.next);
  }

  undo(): void {
    this.model.setCode(this.prev);
  }
}

/** 노드 이동·크기 조절 (GUI 편집도 실행 취소 대상, REQ-02·REQ-11). */
export class MoveNodeCommand implements Command {
  private prev: NodeLayout | undefined;

  constructor(
    private model: DiagramModel,
    private nodeId: string,
    private next: NodeLayout,
  ) {
    this.prev = model.getState().nodeLayouts[nodeId];
  }

  execute(): void {
    this.model.setNodeLayout(this.nodeId, this.next);
  }

  undo(): void {
    this.model.setNodeLayout(this.nodeId, this.prev);
  }
}
