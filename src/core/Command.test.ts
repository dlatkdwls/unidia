import { describe, expect, it } from 'vitest';
import { CommandHistory, MoveNodeCommand, SetCodeCommand } from './Command';
import { DiagramModel } from './DiagramModel';

describe('CommandHistory (REQ-11)', () => {
  it('코드 수정을 실행 취소하고 다시 실행한다', () => {
    const model = new DiagramModel({ code: 'a' });
    const history = new CommandHistory();
    history.execute(new SetCodeCommand(model, 'a', 'b'));
    expect(model.getState().code).toBe('b');

    expect(history.undo()).toBe(true);
    expect(model.getState().code).toBe('a');

    expect(history.redo()).toBe(true);
    expect(model.getState().code).toBe('b');
  });

  it('노드 이동을 실행 취소하면 이전 위치로, 처음 이동이면 시각 정보가 사라진다', () => {
    const model = new DiagramModel({ code: 'a' });
    const history = new CommandHistory();
    history.execute(new MoveNodeCommand(model, 'n1', { x: 1, y: 1 }));
    history.execute(new MoveNodeCommand(model, 'n1', { x: 5, y: 5 }));

    history.undo();
    expect(model.getState().nodeLayouts['n1']).toEqual({ x: 1, y: 1 });
    history.undo();
    expect(model.getState().nodeLayouts['n1']).toBeUndefined();
  });

  it('새 편집을 하면 다시 실행 기록이 지워진다', () => {
    const model = new DiagramModel({ code: 'a' });
    const history = new CommandHistory();
    history.execute(new SetCodeCommand(model, 'a', 'b'));
    history.undo();
    expect(history.canRedo).toBe(true);
    history.execute(new SetCodeCommand(model, 'a', 'c'));
    expect(history.canRedo).toBe(false);
  });

  it('기록이 없으면 undo/redo는 false를 돌려준다', () => {
    const history = new CommandHistory();
    expect(history.undo()).toBe(false);
    expect(history.redo()).toBe(false);
  });
});
