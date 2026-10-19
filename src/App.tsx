/**
 * PIP.EXE — The Midnight Internet
 * Official haX.baby "Baby's First Website" Hackathon Entry
 * 
 * Interactive Retro Desktop Operating System (Midnight Nursery OS)
 * Separate draggable application windows, layering, boot screen, and pixel-art aesthetic.
 */

import React, { useState } from 'react';
import { BootScreen } from './components/BootScreen';
import { BrowserChrome } from './components/BrowserChrome';
import { DesktopHeader } from './components/DesktopHeader';
import { DesktopWallpaper } from './components/DesktopWallpaper';
import { DesktopIcons } from './components/DesktopIcons';
import { DesktopFooter } from './components/DesktopFooter';

// The Windows & Floating Widget
import { StoryLogWindow } from './components/windows/StoryLogWindow';
import { SlumberVaultWindow } from './components/windows/SlumberVaultWindow';
import { NightlightStudioWindow } from './components/windows/NightlightStudioWindow';
import { PipBioWindow } from './components/windows/PipBioWindow';
import { DreamEngineWindow } from './components/windows/DreamEngineWindow';
import { DreamRoutesWindow } from './components/windows/DreamRoutesWindow';
import { LullabyLabWindow } from './components/windows/LullabyLabWindow';
import { FloatingPipCard } from './components/windows/FloatingPipCard';

// Modals
import { StoryReaderModal } from './components/modals/StoryReaderModal';
import { CreditsModal } from './components/CreditsModal';
import { AssetInspectorModal } from './components/modals/AssetInspectorModal';

import { AppId, WindowState } from './types/os';
import { sound } from './utils/audio';

export default function App() {
  const [isBooted, setIsBooted] = useState(false); // Play charming boot sequence first, with instant skip/enter
  const [isMuted, setIsMuted] = useState(false);
  const [topZ, setTopZ] = useState(30);

  // Modals state
  const [isStoryReaderOpen, setIsStoryReaderOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isAssetInspectorOpen, setIsAssetInspectorOpen] = useState(false);

  // Separate, interactive application window registry
  const [windows, setWindows] = useState<Record<AppId, WindowState>>({
    'pip-profile': {
      id: 'pip-profile',
      title: 'PIP — JUNIOR DREAM ENGINEER',
      icon: '🌙',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 25,
      position: { x: 260, y: 35 },
      size: { width: 440, height: 440 },
      minSize: { width: 320, height: 350 }
    },
    'slumber-vault': {
      id: 'slumber-vault',
      title: 'SECRET.DAT — THE SLUMBER VAULT',
      icon: '🗝️',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 24,
      position: { x: 130, y: 65 },
      size: { width: 460, height: 420 },
      minSize: { width: 320, height: 350 }
    },
    'dream-engine': {
      id: 'dream-engine',
      title: 'DREAM ENGINE',
      icon: '🧪',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 23,
      position: { x: 220, y: 85 },
      size: { width: 500, height: 280 },
      minSize: { width: 340, height: 260 }
    },
    'lullaby-lab': {
      id: 'lullaby-lab',
      title: 'LULLABY LAB.MP3 — MUSIC BOX CHIMES',
      icon: '🔔',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 22,
      position: { x: 300, y: 55 },
      size: { width: 480, height: 430 },
      minSize: { width: 340, height: 380 }
    },
    'nightlight-studio': {
      id: 'nightlight-studio',
      title: 'NIGHTLIGHT STUDIO',
      icon: '💡',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 21,
      position: { x: 150, y: 120 },
      size: { width: 450, height: 260 },
      minSize: { width: 320, height: 240 }
    },
    'dream-routes': {
      id: 'dream-routes',
      title: 'DREAM ROUTES.MAP',
      icon: '📍',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      position: { x: 240, y: 170 },
      size: { width: 480, height: 220 },
      minSize: { width: 320, height: 180 }
    },
    'pip-story': {
      id: 'pip-story',
      title: 'STORY.LOG — ORIGIN OF PIP',
      icon: '📖',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 26,
      position: { x: 160, y: 90 },
      size: { width: 420, height: 220 },
      minSize: { width: 320, height: 200 }
    },
    'asset-inspector': {
      id: 'asset-inspector',
      title: 'ASSETS.CFG — OFFICIAL AUDIT',
      icon: '📁',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 27,
      position: { x: 200, y: 80 },
      size: { width: 460, height: 400 },
      minSize: { width: 320, height: 300 }
    },
    credits: {
      id: 'credits',
      title: 'CREDITS.TXT',
      icon: '🏆',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 28,
      position: { x: 220, y: 100 },
      size: { width: 440, height: 360 },
      minSize: { width: 300, height: 300 }
    }
  });

  const focusWindow = (id: AppId) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex: newZ
      }
    }));
  };

  const openWindow = (id: AppId) => {
    focusWindow(id);
  };

  const closeWindow = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false
      }
    }));
  };

  const minimizeWindow = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true
      }
    }));
  };

  const toggleMaximizeWindow = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized
      }
    }));
  };

  const toggleWindowFromTaskbar = (id: AppId) => {
    const win = windows[id];
    if (!win.isOpen) {
      focusWindow(id);
    } else if (win.isMinimized) {
      focusWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  const toggleMute = () => {
    sound.playClick();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const handleOpenApp = (id: AppId) => {
    sound.playClick();
    if (id === 'asset-inspector') {
      setIsAssetInspectorOpen(true);
    } else if (id === 'credits') {
      setIsCreditsOpen(true);
    } else {
      focusWindow(id);
    }
  };

  // Find currently active top window
  const activeAppId = Object.values(windows)
    .filter((w) => w.isOpen && !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null;

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#f5eaf4] text-[#fdfaf3] select-none font-sans">
      {/* Boot Screen Transition (if not booted) */}
      {!isBooted && (
        <BootScreen
          onEnter={() => {
            sound.playBootChime();
            setIsBooted(true);
          }}
        />
      )}

      {/* 1. Top Nostalgic Browser Chrome */}
      <BrowserChrome
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onRefresh={() => {
          sound.playBootChime();
          setIsBooted(false);
        }}
      />

      {/* 2. Desktop Operating System Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top OS Navigation Header */}
        <DesktopHeader
          onOpenApp={handleOpenApp}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          activeAppId={activeAppId}
        />

        {/* Central Desktop Environment */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Distinct Celestial Desktop Wallpaper with Crescent Moon & Pastel Clouds */}
          <DesktopWallpaper />

          {/* Left Desktop Icons Sidebar (always visible on desktop) */}
          <DesktopIcons
            onOpenApp={handleOpenApp}
            activeAppId={activeAppId}
          />

          {/* Desktop Window Manager Viewport (Free Floating Area) */}
          <main className="flex-1 relative overflow-hidden">
            {/* Window 1: STORY.LOG */}
            <StoryLogWindow
              isOpen={windows['pip-story'].isOpen}
              isMinimized={windows['pip-story'].isMinimized}
              isMaximized={windows['pip-story'].isMaximized}
              zIndex={windows['pip-story'].zIndex}
              initialPos={windows['pip-story'].position}
              initialSize={windows['pip-story'].size}
              onClose={() => closeWindow('pip-story')}
              onMinimize={() => minimizeWindow('pip-story')}
              onToggleMaximize={() => toggleMaximizeWindow('pip-story')}
              onFocus={() => focusWindow('pip-story')}
              onOpenStoryReader={() => setIsStoryReaderOpen(true)}
            />

            {/* Window 2: SECRET.DAT */}
            <SlumberVaultWindow
              isOpen={windows['slumber-vault'].isOpen}
              isMinimized={windows['slumber-vault'].isMinimized}
              isMaximized={windows['slumber-vault'].isMaximized}
              zIndex={windows['slumber-vault'].zIndex}
              initialPos={windows['slumber-vault'].position}
              initialSize={windows['slumber-vault'].size}
              onClose={() => closeWindow('slumber-vault')}
              onMinimize={() => minimizeWindow('slumber-vault')}
              onToggleMaximize={() => toggleMaximizeWindow('slumber-vault')}
              onFocus={() => focusWindow('slumber-vault')}
            />

            {/* Window 3: NIGHTLIGHT STUDIO */}
            <NightlightStudioWindow
              isOpen={windows['nightlight-studio'].isOpen}
              isMinimized={windows['nightlight-studio'].isMinimized}
              isMaximized={windows['nightlight-studio'].isMaximized}
              zIndex={windows['nightlight-studio'].zIndex}
              initialPos={windows['nightlight-studio'].position}
              initialSize={windows['nightlight-studio'].size}
              onClose={() => closeWindow('nightlight-studio')}
              onMinimize={() => minimizeWindow('nightlight-studio')}
              onToggleMaximize={() => toggleMaximizeWindow('nightlight-studio')}
              onFocus={() => focusWindow('nightlight-studio')}
            />

            {/* Window 4: PIP — JUNIOR DREAM ENGINEER */}
            <PipBioWindow
              isOpen={windows['pip-profile'].isOpen}
              isMinimized={windows['pip-profile'].isMinimized}
              isMaximized={windows['pip-profile'].isMaximized}
              zIndex={windows['pip-profile'].zIndex}
              initialPos={windows['pip-profile'].position}
              initialSize={windows['pip-profile'].size}
              onClose={() => closeWindow('pip-profile')}
              onMinimize={() => minimizeWindow('pip-profile')}
              onToggleMaximize={() => toggleMaximizeWindow('pip-profile')}
              onFocus={() => focusWindow('pip-profile')}
              onOpenAssetInspector={() => setIsAssetInspectorOpen(true)}
            />

            {/* Window 5: DREAM ENGINE */}
            <DreamEngineWindow
              isOpen={windows['dream-engine'].isOpen}
              isMinimized={windows['dream-engine'].isMinimized}
              isMaximized={windows['dream-engine'].isMaximized}
              zIndex={windows['dream-engine'].zIndex}
              initialPos={windows['dream-engine'].position}
              initialSize={windows['dream-engine'].size}
              onClose={() => closeWindow('dream-engine')}
              onMinimize={() => minimizeWindow('dream-engine')}
              onToggleMaximize={() => toggleMaximizeWindow('dream-engine')}
              onFocus={() => focusWindow('dream-engine')}
            />

            {/* Window 6: DREAM ROUTES.MAP */}
            <DreamRoutesWindow
              isOpen={windows['dream-routes'].isOpen}
              isMinimized={windows['dream-routes'].isMinimized}
              isMaximized={windows['dream-routes'].isMaximized}
              zIndex={windows['dream-routes'].zIndex}
              initialPos={windows['dream-routes'].position}
              initialSize={windows['dream-routes'].size}
              onClose={() => closeWindow('dream-routes')}
              onMinimize={() => minimizeWindow('dream-routes')}
              onToggleMaximize={() => toggleMaximizeWindow('dream-routes')}
              onFocus={() => focusWindow('dream-routes')}
            />

            {/* Window 7: LULLABY LAB.MP3 */}
            <LullabyLabWindow
              isOpen={windows['lullaby-lab'].isOpen}
              isMinimized={windows['lullaby-lab'].isMinimized}
              isMaximized={windows['lullaby-lab'].isMaximized}
              zIndex={windows['lullaby-lab'].zIndex}
              initialPos={windows['lullaby-lab'].position}
              initialSize={windows['lullaby-lab'].size}
              onClose={() => closeWindow('lullaby-lab')}
              onMinimize={() => minimizeWindow('lullaby-lab')}
              onToggleMaximize={() => toggleMaximizeWindow('lullaby-lab')}
              onFocus={() => focusWindow('lullaby-lab')}
            />

            {/* Desktop Companion Widget: Floating Pip Card in Bottom-Right */}
            <div className="absolute bottom-4 right-6 pointer-events-auto z-10">
              <FloatingPipCard
                onSpinDream={() => {
                  sound.playDreamShimmer();
                  openWindow('dream-engine');
                }}
                onPlayLullaby={() => {
                  sound.playClick();
                  openWindow('lullaby-lab');
                }}
                onOpenAssetInspector={() => setIsAssetInspectorOpen(true)}
              />
            </div>
          </main>
        </div>

        {/* 3. Bottom Pink/Lavender Taskbar */}
        <DesktopFooter
          onToggleWindow={toggleWindowFromTaskbar}
          onOpenCredits={() => setIsCreditsOpen(true)}
          onReboot={() => setIsBooted(false)}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          activeAppId={activeAppId}
        />
      </div>

      {/* Interactive Modals */}
      <StoryReaderModal
        isOpen={isStoryReaderOpen}
        onClose={() => setIsStoryReaderOpen(false)}
      />

      <CreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      />

      <AssetInspectorModal
        isOpen={isAssetInspectorOpen}
        onClose={() => setIsAssetInspectorOpen(false)}
      />
    </div>
  );
}
