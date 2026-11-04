/**
 * 오버레이 레이어 (SRS 3.5: 마그네틱·엣지 경로·폰트 스케일링은 Mermaid 위의 별도 오버레이로 구현).
 *
 * 아직 구현 전. 가장 불확실한 부분이므로 전체 구현에 앞서 작은 프로토타입(spike)으로
 * 먼저 검증하는 것을 권장한다:
 *   1) Mermaid가 그린 SVG에서 노드/엣지 요소를 식별할 수 있는가
 *   2) 노드를 드래그할 때 연결된 엣지가 따라오게 만들 수 있는가 (REQ-04)
 *   3) 노드 30개에서 평균 55fps 이상이 나오는가 (SRS 3.3, 잠정)
 */
export interface OverlayLayer {
  /** 렌더링된 SVG 위에 오버레이를 붙인다. */
  attach(svgRoot: SVGSVGElement): void;
  /** 오버레이를 제거한다. 코드가 바뀌어 SVG가 다시 그려질 때 호출한다. */
  detach(): void;
}
