"use client";

import { useCallback, useEffect, useState } from "react";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import ClearIcon from '@mui/icons-material/Clear';
import { Typography, Button, Select, MenuItem, Stack } from "@mui/material";
import { GLIDER, GLIDER_GUN, Pattern } from "./patterns";
import { notoSansJP } from "./ThemeRegistry";

// Theme is now defined in ThemeRegistry.tsx

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

  const clearGrid = () => {
    setIsRunning(false);
    setGrid(Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(false)
    ));
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
        <Typography
          variant="h1"
          component="h1"
          className={notoSansJP.className}
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            textAlign: 'center',
            color: '#1a1a1a',
            letterSpacing: '-0.03em',
            marginBottom: '2rem',
            textTransform: 'none'
          }}
        >
          Conway&apos;s Game of Life
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={8} 
          justifyContent="center" 
          alignItems="center" 
          sx={{ 
            mb: 4,
            '& .MuiButton-root': {
              borderRadius: 1,
              fontWeight: 500,
              minWidth: '144px',
              height: '40px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)'
              }
            },
            '& .MuiSelect-root': {
              borderRadius: 1,
              minWidth: '144px',
              height: '40px'
            }
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={isRunning ? <PauseIcon sx={{ fontSize: 20 }} /> : <PlayArrowIcon sx={{ fontSize: 20 }} />}
              onClick={() => setIsRunning(!isRunning)}
              sx={{
                '& .MuiButton-startIcon': {
                  marginRight: 1.5,
                  marginLeft: -0.5
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              {isRunning ? "一時停止" : "開始"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon sx={{ fontSize: 20 }} />}
              onClick={resetGrid}
              sx={{
                '& .MuiButton-startIcon': {
                  marginRight: 1.5,
                  marginLeft: -0.5
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              リセット
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ClearIcon sx={{ fontSize: 20 }} />}
              onClick={clearGrid}
              sx={{
                '& .MuiButton-startIcon': {
                  marginRight: 1.5,
                  marginLeft: -0.5
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              クリア
            </Button>
          </Stack>

          <Select
            value=""
            onChange={(e) => applyPattern(e.target.value)}
            variant="outlined"
            color="primary"
            displayEmpty
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                py: 1,
                px: 2
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2'
              }
            }}
          >
            <MenuItem value="">パターンを選択</MenuItem>
            <MenuItem value="GLIDER">グラインダー</MenuItem>
            <MenuItem value="GLIDER_GUN">グラインダーガン</MenuItem>
          </Select>
        </Stack>

        <div 
          className="grid gap-0 mx-auto overflow-hidden"
          style={{
            width: 'calc(80 * 16px)',
            maxWidth: '100%',
            height: 'calc(40 * 16px)',
            backgroundColor: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(80, 16px)',
            gridTemplateRows: 'repeat(40, 16px)',
            padding: '0 max(16px, calc((100% - (80 * 16px)) / 2))'
          }}
        >
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
