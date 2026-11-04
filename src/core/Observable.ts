export type Listener<T> = (value: T) => void;

/** Observer 패턴: 모델이 바뀌면 구독자(렌더러, 코드 에디터 등)에게 알린다 (REQ-03). */
export class Observable<T> {
  private listeners = new Set<Listener<T>>();

  /** 구독하고, 구독 해제 함수를 돌려준다. */
  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  protected emit(value: T): void {
    for (const listener of [...this.listeners]) listener(value);
  }
}
