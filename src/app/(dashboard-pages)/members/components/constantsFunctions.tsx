'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDiscordDataForSection } from '@/hooks/useDiscordData'
import { useDiscordChannels } from '@/hooks/useDiscordChannels'
import { useWelcomeSettings } from '@/hooks/useWelcomeSettings';
import { useDiscordMembers } from '@/hooks/useDiscordMembers';

export function useMembersPageData() {
    const { discordData, user } = useAuth();
    const { 
        members, 
        humanMembers, 
        botMembers, 
        loading: membersLoading, 
        error: membersError, 
        totalMembers, 
        totalHumans, 
        totalBots,
        refreshMembers 
    } = useDiscordMembers();
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [previewMode, setPreviewMode] = useState(false);
    const [activeTab, setActiveTab] = useState('background');
    const [showDiscordPreview, setShowDiscordPreview] = useState(false);
    const [showDesignTip, setShowDesignTip] = useState(true);

    const handleMouseDown = (e: React.MouseEvent, element: string) => {
        setSelectedElement(element);
        setIsDragging(true);
        setIsResizing(false);
        setDragStart({ x: e.clientX, y: e.clientY });
        e.preventDefault();
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !selectedElement) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // Get actual canvas dimensions from the DOM element
        const canvasElement = typeof window !== 'undefined' ? document.querySelector('.design-canvas') : null;
        const canvasWidth = canvasElement ? canvasElement.clientWidth : 400;
        const canvasHeight = canvasElement ? canvasElement.clientHeight : 256;

        if (selectedElement === 'avatar') {
        setAvatarSettings(prev => {
            const newX = prev.position.x + deltaX;
            const newY = prev.position.y + deltaY;
            
            // Calculate boundaries to allow avatar to reach the edges with extra margin
            const avatarHalfSize = avatarSettings.size / 2;
            const maxX = (canvasWidth / 2) - avatarHalfSize + 20; // Extra margin for right edge
            const minX = -(canvasWidth / 2) + avatarHalfSize - 20; // Extra margin for left edge
            const maxY = (canvasHeight / 2) - avatarHalfSize + 20; // Extra margin for bottom edge
            const minY = -(canvasHeight / 2) + avatarHalfSize - 20; // Extra margin for top edge
            
            const position = {
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY))
            };
            
            return {
            ...prev,
            position: snapToGrid ? snapToGridPosition(position) : position
            };
        });
        } else if (selectedElement === 'text') {
        // Text moves only without resizing
        setTextSettings(prev => {
            const newX = prev.position.x + deltaX;
            const newY = prev.position.y + deltaY;
            
            // Calculate dynamic boundaries based on actual canvas size
            const fontSize = textSettings.fontSize || 24;
            const textContent = textSettings.content || 'النص';
            // Calculate actual text width based on font size and text length
            const textWidth = Math.max(textContent.length * fontSize * 0.6, 50); // More accurate width calculation
            const textHeight = fontSize;
            
            // Add safety margin to ensure text stays well within canvas
            const safetyMarginX = 30;
            const safetyMarginY = 10; // Smaller margin for Y to allow full vertical range
            const maxX = (canvasWidth / 2) - (textWidth / 2) - safetyMarginX; // Right edge with margin
            const minX = -(canvasWidth / 2) + (textWidth / 2) + safetyMarginX; // Left edge with margin
            const maxY = (canvasHeight / 2) - (textHeight / 2) - safetyMarginY; // Bottom edge with margin
            const minY = -(canvasHeight / 2) + (textHeight / 2) + safetyMarginY; // Top edge with margin
            
            const position = {
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY))
            };
            
            return {
            ...prev,
            position: snapToGrid ? snapToGridPosition(position) : position
            };
        });
        } else if (selectedElement === 'background') {
        setBackgroundSettings(prev => ({
            ...prev,
            position: {
            x: prev.position.x + deltaX,
            y: prev.position.y + deltaY
            }
        }));
        }

        setDragStart({ x: e.clientX, y: e.clientY });
    };

    // Enhanced Layers Management with integrated settings
    const [layers, setLayers] = useState([]);

    // Helper functions to get settings for backward compatibility
    const getLayerSettings = (layerId: string) => {
        const layer = layers.find(l => l.id === layerId);
        return layer?.settings || {};
    };

    // Enhanced layer settings update functions
    const setBackgroundSettings = (newSettings: any) => {
        setLayers(prev => prev.map(layer => 
            layer.id === 'background' 
                ? { ...layer, settings: typeof newSettings === 'function' ? newSettings(layer.settings) : newSettings }
                : layer
        ));
    };

    const setAvatarSettings = (newSettings: any) => {
        setLayers(prev => prev.map(layer => 
            layer.id === 'avatar' 
                ? { ...layer, settings: typeof newSettings === 'function' ? newSettings(layer.settings) : newSettings }
                : layer
        ));
    };

    const setTextSettings = (newSettings: any) => {
        setLayers(prev => prev.map(layer => 
            layer.id === 'text' 
                ? { ...layer, settings: typeof newSettings === 'function' ? newSettings(layer.settings) : newSettings }
                : layer
        ));
    };

    // Generic function to update any layer's settings
    const updateLayerSettings = (layerId: string, newSettings: any) => {
        setLayers(prev => prev.map(layer => 
            layer.id === layerId 
                ? { ...layer, settings: typeof newSettings === 'function' ? newSettings(layer.settings) : newSettings }
                : layer
        ));
    };

    const backgroundSettings = getLayerSettings('background');
    const avatarSettings = getLayerSettings('avatar');  
    const textSettings = getLayerSettings('text');
    const [selectedLayer, setSelectedLayer] = useState<string>('background');

    const handleLayerVisibilityChange = (layerId: string, visible: boolean) => {
        setLayers(prev => prev.map(layer => 
        layer.id === layerId ? { ...layer, visible } : layer
        ));
    };

    const handleLayerOrderChange = (layerId: string, direction: 'up' | 'down') => {
        setLayers(prev => prev.map(layer => 
            layer.id === layerId ? { ...layer } : layer
        ));
    };

    // Enhanced layer management functions
    const handleLayerAdd = (newLayer: { 
        id: string; 
        name: string; 
        type: 'background' | 'avatar' | 'text'; 
        visible: boolean; 
        order: number;
        settings?: any;
    }) => {
        const defaultSettings = {
            background: {
                image: '/defaults/freepik__assistant__82097.png',
                opacity: 100,
                blur: 4,
                brightness: 100,
                contrast: 100,
                position: { x: 0, y: 0 },
                scale: 1,
                backgroundSize: 'cover'
            },
            avatar: {
                image: '/defaults/freepik_assistant_1755945656357.webp',
                size: 120,
                borderRadius: 50,
                borderWidth: 4,
                borderColor: '#00D4FF',
                position: { x: 0, y: 0 }
            },
            text: {
                content: 'New Text Layer',
                fontSize: 24,
                subFontSize: 16,
                fontFamily: 'Arial',
                color: '#ffffff',
                fontWeight: 'bold',
                textAlign: 'center',
                position: { x: 0, y: 0 },
                textShadow: true,
                shadowColor: '#000000',
                shadowBlur: 4,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        };

        const layerWithSettings = {
            ...newLayer,
            settings: newLayer.settings || defaultSettings[newLayer.type] || {}
        };

        console.log("\n\n---------------------------------\n\n", 'Adding layer:', layerWithSettings, 'with order:', layerWithSettings.order, "\n\n---------------------------------\n\n");
        setLayers(prev => [...prev, layerWithSettings]);
        setSelectedLayer(layerWithSettings.id);
    };

    const handleLayerDelete = (layerId: string) => {
        setLayers(prev => {
            const filteredLayers = prev.filter(layer => layer.id !== layerId);
            // إعادة ترتيب الطبقات بعد الحذف
            return filteredLayers.map((layer, index) => ({
                ...layer,
                order: index + 1
            }));
        });
        
        // إذا تم حذف الطبقة المحددة، اختر طبقة أخرى
        if (selectedLayer === layerId) {
            const remainingLayers = layers.filter(layer => layer.id !== layerId);
            if (remainingLayers.length > 0) {
                setSelectedLayer(remainingLayers[0].id);
            }
        }
    };

    // Grid System State
    const [showGrid, setShowGrid] = useState(false);
    const [gridSize, setGridSize] = useState(20);
    const [snapToGrid, setSnapToGrid] = useState(false);

    // Preview Controls State
    const [canvasZoom, setCanvasZoom] = useState(100);
    const [canvasSize, setCanvasSize] = useState('medium'); // 'small', 'medium', 'large'

    // Custom Canvas Dimensions State
    const [customCanvasDimensions, setCustomCanvasDimensions] = useState({
        width: 400,
        height: 256,
        useCustom: false
    });

    // Grid System Functions
    const snapToGridPosition = (position: { x: number; y: number }) => {
        if (!snapToGrid) return position;
        return {
        x: Math.round(position.x / gridSize) * gridSize,
        y: Math.round(position.y / gridSize) * gridSize
        };
    };

    const getCanvasStyle = () => {
        let width = 400;
        let height = 256;
        
        if (customCanvasDimensions.useCustom) {
        width = customCanvasDimensions.width;
        height = customCanvasDimensions.height;
        } else {
        const baseHeight = 256;
        const baseWidth = 400;
        
        switch (canvasSize) {
            case 'small':
            height = baseHeight * 0.75;
            width = baseWidth * 0.75;
            break;
            case 'large':
            height = baseHeight * 1.5;
            width = baseWidth * 1.5;
            break;
            default:
            height = baseHeight;
            width = baseWidth;
        }
        }
        
        return {
        width: `${width}px`,
        height: `${height}px`,
        transform: `scale(${canvasZoom / 100})`,
        transformOrigin: 'top left',
        overflow: 'hidden'
        };
    };

    // Welcome & Leave Messages using custom hook
    const {
        welcomeSettings,
        leaveSettings,
        autoRoleSettings,
        updateWelcomeSettings,
        updateLeaveSettings,
        updateAutoRoleSettings,
        saveSettings,
        saving,
        hasUnsavedChanges,
        lastSaved
    } = useWelcomeSettings();

    // Auto Role settings from hook
    const autoRoleEnabled = autoRoleSettings.enabled;
    const selectedRole = autoRoleSettings.roleId;

    const setAutoRoleEnabled = (enabled: boolean) => {
        updateAutoRoleSettings({ enabled });
    };

    const setSelectedRole = (roleId: string) => {
        updateAutoRoleSettings({ roleId });
    };

    // جلب الرتب من Discord API
    const { 
        availableRoles, 
        getRoleColor, 
        loading: rolesLoading,
        hasSelectedServer,
        selectedServer,
        error: rolesError,
        refreshData: refreshRoles 
    } = useDiscordDataForSection('welcome');

    // جلب القنوات النصية من Discord API
    const { 
        textChannels,
        loading: channelsLoading,
        error: channelsError,
        refreshChannels
    } = useDiscordChannels();

    const discordDataLoading = rolesLoading || channelsLoading || membersLoading;
    const discordDataError = rolesError || channelsError || membersError;
    const refreshData = () => {
        refreshRoles();
        refreshChannels();
        refreshMembers();
    };



    // Keywords for messages
    const keywordSuggestions = [
        '{user}', '{server}', '{memberCount}', '{date}', '{time}'
    ];

    // Function to process text and replace placeholders
    const processText = (text: string) => {
        const userName = "Ahmed Mohamed";
        const serverName = "Awesome Server";
        const memberCount = "1,234";
        
        const processedText = text
        .replace(/{user}/g, userName)
        .replace(/{server}/g, serverName)
        .replace(/{memberCount}/g, memberCount)
        .replace(/{date}/g, new Date().toLocaleDateString('en-US'))
        .replace(/{time}/g, new Date().toLocaleTimeString('en-US'));
        
        // Handle line breaks with different font sizes
        return processedText.split('\n').map((line, index) => (
        <div 
            key={index}
            style={{
            fontSize: index === 0 ? textSettings.fontSize : textSettings.subFontSize
            }}
        >
            {line}
        </div>
        ));
    };

    // Member growth data for chart (using real data as base)
    const memberGrowthData = [
        { month: 'January', members: Math.max(0, totalMembers - 800), active: Math.max(0, totalHumans - 500), new: 150 },
        { month: 'February', members: Math.max(0, totalMembers - 650), active: Math.max(0, totalHumans - 400), new: 180 },
        { month: 'March', members: Math.max(0, totalMembers - 500), active: Math.max(0, totalHumans - 300), new: 200 },
        { month: 'April', members: Math.max(0, totalMembers - 320), active: Math.max(0, totalHumans - 200), new: 220 },
        { month: 'May', members: Math.max(0, totalMembers - 150), active: Math.max(0, totalHumans - 100), new: 250 },
        { month: 'June', members: totalMembers, active: totalHumans, new: 280 }
    ];

    // Reset functions
    const resetBackground = () => {
        setBackgroundSettings({
        image: '/defaults/freepik__assistant__82097.png',
        opacity: 100,
        blur: 4,
        brightness: 100,
        contrast: 100,
        position: { x: 0, y: 0 },
        scale: 1,
        backgroundSize: 'cover'
        });
    };

    const resetAvatar = () => {
        setAvatarSettings({
        image: '/defaults/freepik_assistant_1755945656357.webp',
        size: 120,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#00D4FF',
        position: { x: 0, y: 0 }
        });
    };

    const resetText = () => {
        setTextSettings({
        content: 'Welcome {user}!\nYou are member #1,234',
        fontSize: 24,
        subFontSize: 16,
        fontFamily: 'Arial',
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        position: { x: 0, y: 0 },
        textShadow: true,
        shadowColor: '#000000',
        shadowBlur: 4,
        shadowOffsetX: 2,
        shadowOffsetY: 2
        });
    };

    const resetLayers = () => {
        setLayers([
        { id: 'text', name: 'Text', type: 'text' as const, visible: true, order: 3 },
        { id: 'avatar', name: 'Avatar', type: 'avatar' as const, visible: true, order: 2 },
        { id: 'background', name: 'Background', type: 'background' as const, visible: true, order: 1 }
        ]);
    };

    const resetCanvas = () => {
        setCustomCanvasDimensions({
        width: 400,
        height: 256,
        useCustom: false
        });
    };

    // Handle element clicks to switch tabs
    const handleElementClick = (element: string) => {
        setActiveTab(element);
        setSelectedElement(element);
    };

    return {
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
        updateLayerSettings,
        getLayerSettings,
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
        handleElementClick
    }
}