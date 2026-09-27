import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import phaserConfig from './game/main';

const Game: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current && !phaserRef.current) {
      phaserRef.current = new Phaser.Game({ ...phaserConfig, parent: gameRef.current });
    }
    return () => {
      phaserRef.current?.destroy(true);
      phaserRef.current = null;
    };
  }, []);

  return <div id="game-container" ref={gameRef} style={{ width: 800, height: 600 }} />;
};

export default Game;
