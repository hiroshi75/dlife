"use client";

import { useCallback, useEffect, useState } from "react";
import { Play, Pause, RefreshCw } from "lucide-react";
import { GLIDER, GLIDER_GUN, Pattern } from "./patterns";

const ROWS = 40;
const COLS = 80;

export default function Home() {
  const [grid, setGrid] = useState(() => {
    return Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(false)
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
                if (newI >= 0 && newI < ROWS && newJ >= 0 && newJ < COLS) {
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
    setGrid(Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(false)
    ));
    setIsRunning(false);
  };

  const applyPattern = (patternName: string) => {
    if (!patternName) return;
    let patternGrid: Pattern | null = null;
    
    if (patternName === "GLIDER") {
      patternGrid = GLIDER;
    } else if (patternName === "GLIDER_GUN") {
      patternGrid = GLIDER_GUN;
    }

    if (!patternGrid) return;

    setGrid((oldGrid) => {
      const newGrid = oldGrid.map(row => [...row]);
      for (let i = 0; i < patternGrid!.length; i++) {
        for (let j = 0; j < patternGrid![i].length; j++) {
          if (i < newGrid.length && j < newGrid[i].length) {
            newGrid[i][j] = patternGrid![i][j];
          }
        }
      }
      return newGrid;
    });
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

          <select
            className="px-4 py-3 rounded-lg bg-white text-black shadow-md"
            onChange={(e) => applyPattern(e.target.value)}
          >
            <option value="">パターンを選択</option>
            <option value="GLIDER">グラインダー</option>
            <option value="GLIDER_GUN">グラインダーガン</option>
          </select>
        </div>

        <div 
            className="grid gap-0 mx-auto overflow-hidden"
            style={{
              width: '1280px',
              height: '640px',
              backgroundColor: '#ff0000',
              display: 'grid',
              gridTemplateColumns: 'repeat(80, 16px)',
              gridTemplateRows: 'repeat(40, 16px)'
            }}>
          {grid.map((row, i) => 
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: cell ? '#000000' : '#ffffff',
                  border: '1px solid #cccccc'
                }}
                onClick={() => handleCellClick(i, j)}
              />
            ))
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>セルをクリックして生命を配置し、開始ボタンを押してシミュレーションを実行します。</p>
          <p>黒いセルは生きているセル、白いセルは死んでいるセルを表します。</p>
        </div>
      </div>
    </div>
  );
}
