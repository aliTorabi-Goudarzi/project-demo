'use client';

import { useEffect, useRef, useState } from 'react';

type NodeBox = {
  cx: number;
  top: number;
  bottom: number;
};

type Drawing = {
  width: number;
  height: number;
  paths: string[];
};

export function ChartConnectors() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState<Drawing>({ width: 0, height: 0, paths: [] });

  useEffect(() => {
    const svg = svgRef.current;
    const chart = svg?.closest('.org-chart') as HTMLElement | null;
    if (!chart || !svg) return;

    let frame = 0;

    const draw = () => {
      const chartRect = chart.getBoundingClientRect();
      const boxes = (tier: string): NodeBox[] =>
        Array.from(chart.querySelectorAll(`[data-tier="${tier}"] .org-chart__node`)).map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            cx: rect.left - chartRect.left + rect.width / 2,
            top: rect.top - chartRect.top,
            bottom: rect.bottom - chartRect.top,
          };
        });

      const ceo = boxes('ceo')[0];
      const vp = boxes('vp')[0];
      const managers = boxes('managers');
      const staff = boxes('staff');
      if (!ceo || !vp || managers.length === 0 || staff.length === 0) return;

      const railGap = 22;
      // Matches the 10px inset of the gold frame around the CEO card in main.css.
      const ceoFrameGap = 10;
      const managersRail = Math.min(...managers.map((box) => box.top)) - railGap;
      const staffRail = Math.min(...staff.map((box) => box.top)) - railGap;
      const paths: string[] = [];

      paths.push(`M ${ceo.cx} ${ceo.bottom + ceoFrameGap} L ${ceo.cx} ${vp.top}`);

      paths.push(`M ${vp.cx} ${vp.bottom} L ${vp.cx} ${managersRail}`);
      paths.push(
        `M ${managers[0]!.cx} ${managersRail} L ${managers[managers.length - 1]!.cx} ${managersRail}`,
      );
      for (const manager of managers) {
        paths.push(`M ${manager.cx} ${managersRail} L ${manager.cx} ${manager.top}`);
      }

      const spineX = chartRect.width - 18;
      const staffBranchY = ceo.bottom + (vp.top - ceo.bottom) / 2;
      paths.push(
        `M ${ceo.cx} ${staffBranchY} L ${spineX} ${staffBranchY} L ${spineX} ${staffRail}`,
      );
      paths.push(
        `M ${spineX} ${staffRail} L ${Math.min(...staff.map((box) => box.cx))} ${staffRail}`,
      );
      for (const member of staff) {
        paths.push(`M ${member.cx} ${staffRail} L ${member.cx} ${member.top}`);
      }

      setDrawing({ width: chartRect.width, height: chartRect.height, paths });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    observer.observe(chart);
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="org-chart__connectors"
      width={drawing.width || undefined}
      height={drawing.height || undefined}
      viewBox={drawing.width ? `0 0 ${drawing.width} ${drawing.height}` : undefined}
      aria-hidden="true"
    >
      {drawing.paths.map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
}
