// src/components/ChartComponent.tsx
import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// 1️⃣ Register everything (controllers, elements, scales, plugins)
Chart.register(...registerables);

type ChartComponentProps = {
  data: any;
  options?: any;
  type?: "line" | "bar" | "pie" | string;
};

export default function ChartComponent({
  data,
  options = {},
  type = "line",
}: ChartComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 2️⃣ Destroy previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // 3️⃣ Create new chart
    chartRef.current = new Chart(ctx, {
      type,
      data,
      options,
    });

    // 4️⃣ Cleanup on unmount
    return () => {
      chartRef.current?.destroy();
    };
  }, [data, options, type]);

  return <canvas ref={canvasRef} />;
}
