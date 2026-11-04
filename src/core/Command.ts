import type { DiagramModel, NodeLayout } from './DiagramModel';

/** Command 패턴: 편집 동작을 객체로 만들어 실행 취소/재실행을 지원한다 (REQ-11). */
export interface Command {
  execute(): void;
  undo(): void;
}

export class CommandHistory {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo(): boolean {
    const command = this.undoStack.pop();
    if (!command) return false;
    command.undo();
    this.redoStack.push(command);
    return true;
  }

  redo(): boolean {
    const command = this.redoStack.pop();
    if (!command) return false;
    command.execute();
    this.undoStack.push(command);
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
