import { describe, expect, it, vi } from 'vitest';
import { DiagramModel } from './DiagramModel';

describe('DiagramModel', () => {
  it('코드가 바뀌면 구독자에게 알린다', () => {
    const model = new DiagramModel({ code: 'a' });
    const listener = vi.fn();
    model.subscribe(listener);
    model.setCode('b');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].code).toBe('b');
  });

  it('같은 코드면 알리지 않는다', () => {
    const model = new DiagramModel({ code: 'a' });
    const listener = vi.fn();
    model.subscribe(listener);
    model.setCode('a');
    expect(listener).not.toHaveBeenCalled();
  });

  it('구독 해제 후에는 알리지 않는다', () => {
    const model = new DiagramModel();
    const listener = vi.fn();
    const unsubscribe = model.subscribe(listener);
    unsubscribe();
    model.setCode('x');
    expect(listener).not.toHaveBeenCalled();
  });

  it('코드를 수정해도 GUI 시각 정보가 유지된다 (REQ-03)', () => {
    const model = new DiagramModel({ code: 'a' });
    model.setNodeLayout('n1', { x: 10, y: 20 });
    model.setEdgePath('e1', [{ x: 0, y: 0 }, { x: 5, y: 5 }]);
    model.setCode('b');
    expect(model.getState().nodeLayouts['n1']).toEqual({ x: 10, y: 20 });
    expect(model.getState().edgePaths['e1']).toHaveLength(2);
  });

  it('JSON으로 저장하고 불러오면 동일하게 복원된다 (REQ-12)', () => {
    const model = new DiagramModel({ code: 'classDiagram' });
    model.setNodeLayout('n1', { x: 1, y: 2, width: 30, height: 40 });
    model.setEdgePath('e1', [{ x: 1, y: 1 }]);
    const restored = DiagramModel.fromJSON(model.toJSON());
    expect(restored.getState()).toEqual(model.getState());
  });

  it('형식이 맞지 않는 파일은 불러오기에 실패한다', () => {
    expect(() => DiagramModel.fromJSON('{"foo": 1}')).toThrow();
    expect(() => DiagramModel.fromJSON('not json')).toThrow();
  });
});
