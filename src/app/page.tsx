"use client";

import { useCallback, useEffect, useState } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";

const GRID_SIZE = 30;

export default function Home() {
  const [grid, setGrid] = useState(() => {
    return Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(false)
    );
  });

  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!isRunning) return;

    // シミュレーションの速度を適度に設定
    const simulationSpeed = 200; // ミリ秒
    setTimeout(() => {
      setGrid((currentGrid) => {
        const nextGrid = currentGrid.map((row, i) =>
          row.map((cell, j) => {
            let neighbors = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const newI = i + di;
                const newJ = j + dj;
                if (newI >= 0 && newI < GRID_SIZE && newJ >= 0 && newJ < GRID_SIZE) {
                  neighbors += currentGrid[newI][newJ] ? 1 : 0;
                }
              }
            }

            // Conway's Game of Life rules
            if (cell) {
              return neighbors === 2 || neighbors === 3;
            } else {
              return neighbors === 3;
            }
          })
        );
        return nextGrid;
      });
    }, simulationSpeed);
  }, [isRunning]);

  useEffect(() => {
    const interval = setInterval(runSimulation, 100);
    return () => clearInterval(interval);
  }, [runSimulation]);

  const handleCellClick = (i: number, j: number) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        rowIndex === i && colIndex === j ? !cell : cell
      )
    );
    setGrid(newGrid);
  };

  const resetGrid = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(false)
    ));
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Conway&apos;s Game of Life</h1>
        
        <div className="flex justify-center gap-4 mb-8">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? "一時停止" : "開始"}
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-md"
            onClick={resetGrid}
          >
            <RefreshCw className="w-5 h-5" />
            リセット
          </button>
        </div>

        <div className="grid grid-cols-30 gap-px bg-gray-300 p-px w-fit mx-auto">
          {grid.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-6 h-6 cursor-pointer transition-colors border border-gray-300 ${
                  cell ? "bg-foreground" : "bg-background"
                }`}
                onClick={() => handleCellClick(i, j)}
              />
            ))
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>セルをクリックして生命を配置し、開始ボタンを押してシミュレーションを実行します。</p>
          <p>黒いセルは生きているセル、白いセルは死んでいるセルを表します。</p>
        </div>
      </div>
    </div>
  );
}
