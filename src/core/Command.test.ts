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

  it('구독자는 스택이 갱신된 뒤에 알림을 받는다 (다시 실행 버튼이 켜져야 함)', () => {
    const model = new DiagramModel({ code: 'a' });
    const history = new CommandHistory();
    const seen: { canUndo: boolean; canRedo: boolean }[] = [];
    history.subscribe(() => seen.push({ canUndo: history.canUndo, canRedo: history.canRedo }));
    // 예전 버그: 모델 구독자가 undo 도중(redo 스택에 넣기 전)에 버튼을 갱신해서 다시 실행이 꺼진 채 남았다
    let canRedoSeenByModelListener: boolean | null = null;
    model.subscribe(() => (canRedoSeenByModelListener = history.canRedo));

    history.execute(new SetCodeCommand(model, 'a', 'b'));
    history.undo();

    expect(canRedoSeenByModelListener).toBe(false); // 모델 알림 시점에는 아직 갱신 전
    expect(seen.at(-1)).toEqual({ canUndo: false, canRedo: true }); // 기록 알림은 갱신 후
  });
});
