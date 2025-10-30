'use client';

import React, { useEffect } from 'react';
import { 
  Users,
} from 'lucide-react';

import { useMembersPageData } from '@/app/(dashboard-pages)/members/components/constantsFunctions';

import { DiscordDataLoader } from '@/components/discord-data-loader';
import WelcomeDiscordPreview from '@/components/welcome-discord-preview';

import EnhancedHeaderSection from '@/app/(dashboard-pages)/members/components/enhancedHeaderSection';
import WelcomeImageSection from '@/app/(dashboard-pages)/members/components/welcomeImageSection';
import WelcomeLeaveMessagesSection from '@/app/(dashboard-pages)/members/components/welcomeLeaveMessagesSection';
import AnalyticsSection from '@/app/(dashboard-pages)/members/components/analyticsSection';

export default function MembersPage() {

  const {
    discordData,
    user,
    members,
    humanMembers,
    botMembers,
    membersLoading,
    membersError,
    totalMembers,
    totalHumans,
    totalBots,
    refreshMembers,
    selectedElement,
    setSelectedElement,
    isDragging,
    setIsDragging,
    isResizing,
    setIsResizing,
    dragStart,
    setDragStart,
    previewMode,
    setPreviewMode,
    activeTab,
    setActiveTab,
    showDiscordPreview,
    setShowDiscordPreview,
    showDesignTip,
    setShowDesignTip,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    backgroundSettings,
    setBackgroundSettings,
    avatarSettings,
    setAvatarSettings,
    textSettings,
    setTextSettings,
    layers,
    setLayers,
    selectedLayer,
    setSelectedLayer,
    handleLayerVisibilityChange,
    handleLayerOrderChange,
    handleLayerAdd,
    handleLayerDelete,
    showGrid,
    setShowGrid,
    gridSize,
    setGridSize,
    snapToGrid,
    setSnapToGrid,
    canvasZoom,
    setCanvasZoom,
    canvasSize,
    setCanvasSize,
    customCanvasDimensions,
    setCustomCanvasDimensions,
    snapToGridPosition,
    getCanvasStyle,

    welcomeSettings,
    leaveSettings,
    autoRoleSettings,
    updateWelcomeSettings,
    updateLeaveSettings,
    updateAutoRoleSettings,
    saveSettings,
    saving,
    hasUnsavedChanges,
    lastSaved,
    autoRoleEnabled,
    selectedRole,
    setAutoRoleEnabled,
    setSelectedRole,
    availableRoles,
    getRoleColor,
    rolesLoading,
    hasSelectedServer,
    selectedServer,
    rolesError,
    refreshRoles,
    textChannels,
    channelsLoading,
    channelsError,
    refreshChannels,
    discordDataLoading,
    discordDataError,
    refreshData,
    keywordSuggestions,
    processText,
    memberGrowthData,
    resetBackground,
    resetAvatar,
    resetText,
    resetLayers,
    resetCanvas,
    handleElementClick,
    updateLayerSettings,
    getLayerSettings
  } = useMembersPageData();

  // Global mouse event handlers for dragging and resizing
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;
      if (!selectedElement) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      // Canvas dimensions
      const canvasWidth = 400;
      const canvasHeight = 256;

      if (selectedElement === 'text') {
        if (isResizing) {
          setTextSettings(prev => ({
            ...prev,
            fontSize: Math.max(8, Math.min(72, prev.fontSize + deltaX / 2))
          }));
        } else if (isDragging) {
          setTextSettings(prev => {
            const newX = prev.position.x + deltaX;
            const newY = prev.position.y + deltaY;
            
            // Use same boundaries as slider controls for consistency
            const maxX = 400; // Same as slider max
            const minX = -400; // Same as slider min
            const maxY = 200; // Same as slider max
            const minY = -200; // Same as slider min
            
            const position = {
              x: Math.max(minX, Math.min(maxX, newX)),
              y: Math.max(minY, Math.min(maxY, newY))
            };
            
            return {
              ...prev,
              position: snapToGrid ? snapToGridPosition(position) : position
            };
          });
        }
      } else if (selectedElement === 'avatar') {
        if (isResizing) {
          setAvatarSettings(prev => ({
            ...prev,
            size: Math.max(50, Math.min(200, prev.size + deltaX))
          }));
        } else if (isDragging) {
          setAvatarSettings(prev => {
            const newX = prev.position.x + deltaX;
            const newY = prev.position.y + deltaY;
            
            // Get actual canvas dimensions for global mouse events
            const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
            const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
            const canvasHeight = canvasElement ? canvasElement.clientHeight : 256;
            
            const avatarHalfSize = prev.size / 2;
            // Avatar is positioned at 50% horizontally and 30% vertically with transform translate(-50%, -50%)
            // So the reference point is at (50%, 30%) of the canvas
            const referenceX = canvasWidth * 0.5; // 50% of canvas width
            const referenceY = canvasHeight * 0.3; // 30% of canvas height
            
            // Calculate boundaries based on the reference point - reaching point zero
            const maxX = (canvasWidth - referenceX); // Allow reaching right edge completely (point zero)
            const minX = -referenceX; // Allow reaching left edge completely
            const maxY = (canvasHeight - referenceY); // Allow reaching bottom edge completely
            const minY = -referenceY; // Allow reaching top edge completely
            
            const position = {
              x: Math.max(minX, Math.min(maxX, newX)),
              y: Math.max(minY, Math.min(maxY, newY))
            };
            
            return {
              ...prev,
              position: snapToGrid ? snapToGridPosition(position) : position
            };
          });
        }
      }

      setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, selectedElement, dragStart, avatarSettings.size]);

  // Load settings from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedBackground = localStorage.getItem('backgroundSettings');
      if (savedBackground) {
        setBackgroundSettings(JSON.parse(savedBackground));
      }
      
      const savedAvatar = localStorage.getItem('avatarSettings');
      if (savedAvatar) {
        setAvatarSettings(JSON.parse(savedAvatar));
      }
      
      const savedText = localStorage.getItem('textSettings');
      if (savedText) {
        setTextSettings(JSON.parse(savedText));
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('backgroundSettings', JSON.stringify(backgroundSettings));
    }
  }, [backgroundSettings]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('avatarSettings', JSON.stringify(avatarSettings));
    }
  }, [avatarSettings]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('textSettings', JSON.stringify(textSettings));
    }
  }, [textSettings]);

  // Handle clicking outside design canvas to deselect element
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const designCanvas = document.querySelector('.design-canvas');
      if (designCanvas && !designCanvas.contains(event.target as Node)) {
        setSelectedElement(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">

      <DiscordDataLoader
        loading={discordDataLoading}
        error={discordDataError}
        hasSelectedServer={hasSelectedServer}
        selectedServer={selectedServer}
        onRefresh={refreshData}
        showServerInfo={true}
      >
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 lg:space-y-16">
        {/* User Welcome Section */}
        {discordData && (
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={discordData.avatarUrl}
                  alt={discordData.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/defaults/avatar.svg';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">مرحباً، {discordData.username}!</h2>
                <p className="text-gray-400">إدارة الأعضاء ورسائل الترحيب</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <EnhancedHeaderSection Users={Users} />

        {/* Welcome Cards Section - Side by side on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Welcome Image Designer */}
          <WelcomeImageSection
            setShowDiscordPreview={setShowDiscordPreview}
            resetBackground={resetBackground}
            resetAvatar={resetAvatar}
            resetText={resetText}
            resetLayers={resetLayers}
            resetCanvas={resetCanvas}
            selectedElement={selectedElement}
            getCanvasStyle={getCanvasStyle}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            setSelectedElement={setSelectedElement}
            setActiveTab={setActiveTab}
            showGrid={showGrid}
            gridSize={gridSize}
            layers={layers}
            backgroundSettings={backgroundSettings}
            handleMouseDown={handleMouseDown}
            handleElementClick={handleElementClick}
            avatarSettings={avatarSettings}
            setIsResizing={setIsResizing}
            setIsDragging={setIsDragging}
            setDragStart={setDragStart}
            textSettings={textSettings}
            processText={processText}
            customCanvasDimensions={customCanvasDimensions}
            selectedLayer={selectedLayer}
            setBackgroundSettings={setBackgroundSettings}
            setAvatarSettings={setAvatarSettings}
            setTextSettings={setTextSettings}
            setCustomCanvasDimensions={setCustomCanvasDimensions}
            handleLayerVisibilityChange={handleLayerVisibilityChange}
            handleLayerOrderChange={handleLayerOrderChange}
            handleLayerAdd={handleLayerAdd}
            handleLayerDelete={handleLayerDelete}
            setSelectedLayer={setSelectedLayer}
            showDesignTip={showDesignTip}
            setShowDesignTip={setShowDesignTip}
            updateLayerSettings={updateLayerSettings}
            getLayerSettings={getLayerSettings}
          />

          {/* Welcome & Leave Messages */}
          <WelcomeLeaveMessagesSection
            welcomeSettings={welcomeSettings}
            updateWelcomeSettings={updateWelcomeSettings}
            textChannels={textChannels}
            leaveSettings={leaveSettings}
            updateLeaveSettings={updateLeaveSettings}
            hasUnsavedChanges={hasUnsavedChanges}
            saveSettings={saveSettings}
            saving={saving}
            lastSaved={lastSaved}
            autoRoleEnabled={autoRoleEnabled}
            setAutoRoleEnabled={setAutoRoleEnabled}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            availableRoles={availableRoles}
            getRoleColor={getRoleColor}
            keywordSuggestions={keywordSuggestions}
          />
        </div>

        {/* Enhanced Advanced Analytics Section */}
        <AnalyticsSection 
          memberGrowthData={memberGrowthData}
          membersLoading={membersLoading}
          totalMembers={totalMembers}
          totalHumans={totalHumans}
          availableRoles={availableRoles}
          membersError={membersError}
          members={members}
          totalBots={totalBots}
          refreshMembers={refreshMembers}
        />
      </div>
      
      {/* Discord Preview Modal */}
      <WelcomeDiscordPreview
        isOpen={showDiscordPreview}
        onClose={() => setShowDiscordPreview(false)}
        backgroundSettings={backgroundSettings}
        avatarSettings={avatarSettings}
        textSettings={{
          fontSize: textSettings.fontSize,
          fontWeight: textSettings.fontWeight,
          color: textSettings.color,
          position: textSettings.position,
          textAlign: textSettings.textAlign,
          fontFamily: textSettings.fontFamily,
          textShadow: textSettings.textShadow,
          shadowColor: textSettings.shadowColor,
          shadowBlur: textSettings.shadowBlur,
          shadowOffsetX: textSettings.shadowOffsetX,
          shadowOffsetY: textSettings.shadowOffsetY
        }}
        welcomeMessage={textSettings.content}
      />
      </DiscordDataLoader>
    </div>
  );
}