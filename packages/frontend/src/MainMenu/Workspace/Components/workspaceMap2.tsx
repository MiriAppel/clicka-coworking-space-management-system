import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import '../Css/workspaceMap.css';
import { use, useEffect, useState, useRef } from "react";
import { ID, Room, RoomStatus, RoomType } from "shared-types";
// import { Space, SpaceStatus } from '../../../../../../types/workspace'
import { WorkspaceType } from "shared-types"
import { Space, SpaceStatus } from "shared-types";
import { useStore } from "zustand";
import { useWorkSpaceStore } from "../../../Stores/Workspace/workspaceStore";
import { ThemeConfig } from "../../../Common/Service/themeConfig";
import MenuIcon from '@mui/icons-material/Menu';
import { set } from "zod";

const getSpaceColor = (status: SpaceStatus, isHighlighted: boolean) => {
  if (!isHighlighted) return '#cccccc'; // אפור עבור חללים לא מודגשים
  
  switch (status) {
    case SpaceStatus.AVAILABLE:
      return '#4CAF50'; // ירוק - פנוי
    case SpaceStatus.OCCUPIED:
      return '#f44336'; // אדום - תפוס
    case SpaceStatus.RESERVED:
      return '#FF9800'; // כתום - שמור
    case SpaceStatus.MAINTENANCE:
      return '#9C27B0'; // סגול - תחזוקה
    default:
      return '#2196F3'; // כחול - ברירת מחדל
  }
};

export const WorkspaceMap = () => {
  // State עבור זום ומיקום המפה
  const [zoomLevel, setZoomLevel] = useState(1);
  const mapViewportRef = useRef<HTMLDivElement>(null);

  // State עבור גרירה
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: ''
  });

  const www: Space[] = [ 
                {
      id: "space-002",
      name: "לאונז'",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 0,
      positionY:0,
      width: 2840,
      height: 1060,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-001",
      name: "כניסה ראשית",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 0,
      positionY: 960,
      width: 500,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name: "דלת כניסה ראשית",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 0,
      positionY: 1050,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name: "דלת כניסה",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 500,
      positionY: 960,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name: "חדר open space",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 200,
      positionY: 200,
      width: 580,
      height: 260,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
            {
      id: "space-002",
      name: "מטבח",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 900,
      positionY: 460,
      width: 333,
      height: 442,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
                {
      id: "space-002",
      name: " 1יציאה מטבח",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 900,
      positionY: 600,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name: " 2יציאה מטבח",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 900,
      positionY: 800,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name: " 3יציאה מטבח",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1100,
      positionY: 890,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name: "מעלית",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 900,
      positionY: 160,
      width: 150,
      height: 150,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name: "כניסה נגישה",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 900,
      positionY: 310,
      width: 150,
      height: 150,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name: "יציאה חצר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 780,
      positionY: 200,
      width: 120,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name:"כניסה נגישה",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 920,
      positionY: 460,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name:"קיר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 100,
      positionY: 460,
      width: 1,
      height: 500,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name:"קיר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 110,
      positionY: 460,
      width: 100,
      height: 1,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה open space",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 770,
      positionY: 210,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"קיר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1050,
      positionY: 160,
      width: 370,
      height: 1,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"יציאה לחצר 2",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1320,
      positionY: 160,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"חדר ישיבות",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1420,
      positionY: 60,
      width: 450,
      height: 335,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה חדר ישיבות",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1750,
      positionY: 385,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 3",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1870,
      positionY: 60,
      width: 170,
      height: 335,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 3",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2025,
      positionY: 290,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 4",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2040,
      positionY: 60,
      width: 290,
      height: 170,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 4",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2040,
      positionY: 230,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 5",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2140,
      positionY: 230,
      width: 290,
      height: 170,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 5",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2140,
      positionY: 240,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"phone booth",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1650,
      positionY: 480,
      width: 120,
      height: 120,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה phone booth",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1700,
      positionY: 480,
      width: 60,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
            {
      id: "space-002",
      name:"שירותים",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1650,
      positionY: 662,
      width: 580,
      height: 400,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה שירותים",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1650,
      positionY: 950,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 2",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1770,
      positionY: 480,
      width: 230,
      height: 180,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 2",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1770,
      positionY: 480,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 1",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1650,
      positionY: 600,
      width: 150,
      height: 190,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 1",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 1650,
      positionY: 700,
      width: 10,
      height: 80,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
    {
      id: "space-002",
      name:"משרד 6",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2005,
      positionY: 480,
      width: 285,
      height: 189,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 6",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2010,
      positionY: 480,
      width: 100,
      height: 10,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 7",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2005,
      positionY: 665,
      width: 285,
      height: 205,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 7",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2280,
      positionY: 680,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"ארון חשמל",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2230,
      positionY: 875,
      width: 60,
      height: 190,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"קיר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2430,
      positionY: 400,
      width: 1,
      height: 50,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"עמדת הדפסה",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2430,
      positionY: 450,
      width: 60,
      height: 120,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 8",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2430,
      positionY: 570,
      width:312,
      height: 255,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"כניסה משרד 8",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2430,
      positionY: 570,
      width: 10,
      height: 100,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"משרד 9",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2430,
      positionY: 825,
      width: 310,
      height: 250,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"ארון תקשורת",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2740,
      positionY: 950,
      width: 40,
      height: 120,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"קיר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 2280,
      positionY: 1060,
      width: 150,
      height: 1,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
        {
      id: "space-002",
      name:"קיר",
      type: "PUBLIC_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      positionX: 500,
      positionY: 1060,
      width: 1150,
      height: 1,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-01T08:00:00Z"
    },
  ];


  const navigate = useNavigate()
  const { workSpaces, getWorkspaceById, updateWorkspace, deleteWorkspace, createWorkspace, getAllWorkspace ,getHistory} = useWorkSpaceStore();
  const [details, setDetails] = useState({
    name: "",
    description: "",
    type: "",
    status: "",
    workspaceMapId: "",
    // room: "",
    currentCustomerId: "",
    currentCustomerName: "",
    positionX: 0,
    positionY: 0,
    width: 0,
    height: 0,
    createdAt: "",
    updatedAt: ""
  });
  const [currentId, setCurrentId] = useState("-1");
  const uniqueStatus = Object.values(SpaceStatus);
  const uniqueType = Object.values(WorkspaceType);
  const [selectedStatus, setSelectedStatus] = useState("PLACEHOLDER");
  const [selectedType, setSelectedType] = useState("PLACEHOLDER");
  const [activeStatusSearch, setActiveStatusSearch] = useState(false);
  const [activeTypeSearch, setActiveTypeSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSliderDragging, setIsSliderDragging] = useState(false);
  const [displayDate, setDisplayDate] = useState(new Date());

  useEffect(() => {
    getAllWorkspace();
  }, [])


useEffect(() => {
  // חישוב גבולות המפה לפי כל האובייקטים
  const allSpaces = [...www];
  if (allSpaces.length === 0) return;
  
  const maxX = Math.max(...allSpaces.map(w => (w.positionX || 0) + (w.width || 0)));
  const maxY = Math.max(...allSpaces.map(w => (w.positionY || 0) + (w.height || 0)));

  // קבל את גודל ה-viewport בפועל
  const viewport = mapViewportRef.current;
  if (viewport) {
    // השאר מרווח של 50px מכל צד
    const availableWidth = viewport.offsetWidth - 100;
    const availableHeight = viewport.offsetHeight - 100;
    
    const scaleX = availableWidth / maxX;
    const scaleY = availableHeight / maxY;
    
    // בחר את קנה המידה הקטן ביותר כדי שהכל ייכנס
    const scale = Math.min(scaleX, scaleY);
    
    setZoom(scale);
    
    // מרכז את המפה
    const centerX = (availableWidth - (maxX * scale)) / 2;
    const centerY = (availableHeight - (maxY * scale)) / 2;
    setPan({ x: centerX, y: centerY });
  }
}, [www, isSidebarOpen]); // 👈 יתעדכן כשהסיידבר נפתח/נסגר


  useEffect(() => {
    if (selectedStatus !== "" && selectedStatus !== "PLACEHOLDER") {
      setActiveStatusSearch(true);
    }
    else setActiveStatusSearch(false);
  }, [selectedStatus]);

  useEffect(() => {
    if (selectedType !== "" && selectedType !== "PLACEHOLDER") {
      setActiveTypeSearch(true);
    }
    else setActiveTypeSearch(false);
  }, [selectedType]);

  // פונקציות זום
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3)); // 👈 זום יחסי במקום קבוע
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1)); // 👈 זום יחסי במקום קבוע
  };

  const handleResetZoom = () => {
    // חזרה לתצוגה מלאה של המפה
    const viewport = mapViewportRef.current;
    if (viewport && www.length > 0) {
      const maxX = Math.max(...www.map(w => (w.positionX || 0) + (w.width || 0)));
      const maxY = Math.max(...www.map(w => (w.positionY || 0) + (w.height || 0)));
      
      const availableWidth = viewport.offsetWidth - 100;
      const availableHeight = viewport.offsetHeight - 100;
      
      const scaleX = availableWidth / maxX;
      const scaleY = availableHeight / maxY;
      const scale = Math.min(scaleX, scaleY);
      
      setZoom(scale);
      
      const centerX = (availableWidth - (maxX * scale)) / 2;
      const centerY = (availableHeight - (maxY * scale)) / 2;
      setPan({ x: centerX, y: centerY });
    }
  };

  // פונקציות גרירה - תיקון הלוגיקה
  const handleMouseDown = (e: React.MouseEvent) => {
    // אפשר גרירה תמיד, לא רק כשהזום גדול מ-1
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newPan = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPan(newPan);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // פונקציה להצגת פרטי החלל
  const detailsTodisplay = () => {
    return <div>
      <h2>{details.description}</h2>
      {/* <h4 className={details.status}>{details.status}</h4> */}
      {/* <h5>{details.room}</h5> */}
      {details.currentCustomerId && details.currentCustomerName ?
        <h6> {details.currentCustomerName} {details.currentCustomerId}</h6> : "פנוי"}
      {/* <h6>גודל: {details.width} x {details.height}</h6> */}
    </div>
  }

  const resetSearch = () => {
    setActiveStatusSearch(false);
    setActiveTypeSearch(false);
    setSelectedStatus("PLACEHOLDER");
    setSelectedType("PLACEHOLDER");
  };

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSliderDragging(true);
  };

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (isSliderDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      // חשב את הזום הראשוני
      const viewport = mapViewportRef.current;
      if (viewport && www.length > 0) {
        const maxX = Math.max(...www.map(w => (w.positionX || 0) + (w.width || 0)));
        const maxY = Math.max(...www.map(w => (w.positionY || 0) + (w.height || 0)));
        const availableWidth = viewport.offsetWidth - 100;
        const availableHeight = viewport.offsetHeight - 100;
        const scaleX = availableWidth / maxX;
        const scaleY = availableHeight / maxY;
        const baseZoom = Math.min(scaleX, scaleY);
        // טווח מהזום הבסיסי עד פי 3
        const newZoom = baseZoom + (percentage * (baseZoom * 2));
        setZoom(newZoom);
      }
    }
  };
  const ocoupancy = (d: Date) => {
    //בדיקה האם זה התאריך הנוכחי
    if (d.toDateString() === new Date().toDateString())
      getAllWorkspace(); // אם כן, טוען את כל החללים
    else {
      // המרה לפורמט YYYY-MM-DD לפני השליחה
      const formattedDate = d.toISOString().split('T')[0];
      console.log('Selected date:', formattedDate);
      console.log('🚀 BUTTON CLICKED! Date:', d);
      getHistory(d);
      setDisplayDate(d);
    }
  }
  const handleSliderMouseUp = () => {
    setIsSliderDragging(false);
  };
  return (
    <div className="workspaceMap">
      <h1>{displayDate.toLocaleDateString()}</h1>
      {/* 👇 הוסף את ה-tooltip כאן */}
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          {tooltip.content}
        </div>
      )}
      <div className={`contentContainer ${!isSidebarOpen ? 'fullWidth' : ''}`}>
        <button
          className={`toggleSidebarBtn ${isSidebarOpen ? 'open' : 'closed'}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "הסתר תפריט" : "הצג תפריט"}
        >
          <MenuIcon />        </button>
        <div className={`right ${!isSidebarOpen ? 'hidden' : ''}`}>
          <div className="search">
            <div>
              <label>סטטוס</label>
              <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value) }}>
                <option value="PLACEHOLDER" disabled>choose status to search</option>
                {uniqueStatus.map((status, index) => {
                  return <option key={status} value={status}>{status}</option>
                })}
              </select>
            </div>
            <div>
              <label>סוג</label>
              <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value) }}>
                <option value="PLACEHOLDER" disabled>choose type to search</option>
                {uniqueType.map((type, index) => {
                  return <option key={type} value={type}>{type}</option>
                })}
              </select>
            </div>
            <Button onClick={resetSearch} className="clearSearchBtn">Clear Search</Button>
          </div>
          <div className="displayByDate">
            <label>תאריך</label>
            <input type="date" onChange={(e) => { ocoupancy(new Date(e.target.value)) }} />
          </div>
          <Button onClick={() => { navigate('/') }} className="backBtn">Back</Button>
        </div>
        <div className="mapContainer" data-zoom={zoom > 1}>
          {/* כפתורי זום */}
          <div className="zoomControls">
            <button className="zoomBtn" onClick={handleZoomOut} title="הקטן">-</button>

            <div className="zoomSlider" onMouseMove={handleSliderMouseMove} onMouseUp={handleSliderMouseUp} onMouseLeave={handleSliderMouseUp}
              onClick={(e) => {
                if (!isSliderDragging) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  const newZoom = 0.5 + (percentage * 2.5);
                  setZoom(Math.max(0.5, Math.min(3, newZoom)));
                }
              }}
            >
              <div
                className="zoomSliderTrack"
                style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
              />
              <div
                className="zoomSliderThumb"
                style={{ left: `${((zoom - 0.5) / 2.5) * 100}%` }}
                onMouseDown={handleSliderMouseDown}
              />
            </div>

            <button className="zoomBtn" onClick={handleZoomIn} title="הגדל">+</button>

            <div className="zoomLevel">
              {Math.round((zoom / (0.1)) * 10)}% {/* 👈 חישוב יחסי */}
            </div>

            <button className="zoomBtn resetBtn" onClick={handleResetZoom} title="איפוס">⌂</button>
          </div>

          {/* מפה עם זום וגרירה */}
          <div
            className={`mapViewport ${isDragging ? 'dragging' : ''}`}
            ref={mapViewportRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <svg
              className="mapContent"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: '0 0',
                width: '2840px',
                height: '1060px',
                minWidth: '2840px',
                minHeight: '1060px'
              }}
            >
              {www.length > 0 && www.map((w) => {
                const hasActiveSearch = activeStatusSearch || activeTypeSearch;
                const matchesStatusSearch = !activeStatusSearch || w.status === selectedStatus;
                const matchesTypeSearch = !activeTypeSearch || w.type === selectedType;
                const isHighlighted = !hasActiveSearch || (matchesStatusSearch && matchesTypeSearch);
                
                return (
                  <g key={w.id}>
                    <rect
                      x={w.positionX}
                      y={w.positionY}
                      width={w.width}
                      height={w.height}
                      fill={getSpaceColor(w.status, isHighlighted)}
                      stroke={isHighlighted ? "#333" : "#999"}
                      strokeWidth="2"
                      opacity={isHighlighted ? 1 : 0.3}
                      className={`space-rect ${w.status}`}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setCurrentId(w.id||"");
                        
                        // הצגת tooltip
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          visible: true,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 10,
                          content: `${w.name} - ${w.status}`
                        });
                        
                        setDetails({
                          name: w.name,
                          description: w.description || "",
                          type: w.type,
                          status: w.status,
                          workspaceMapId: w.workspaceMapId || "",
                          // room: w.room || "",
                          currentCustomerId: w.currentCustomerId || "",
                          currentCustomerName: w.currentCustomerName || "",
                          positionX: w.positionX,
                          positionY: w.positionY,
                          width: w.width,
                          height: w.height,
                          createdAt: w.createdAt,
                          updatedAt: w.updatedAt
                        });
                      }}
                      onMouseLeave={() => {
                        setCurrentId("-1");
                        setTooltip(prev => ({ ...prev, visible: false }));
                      }}
                      onClick={() => {
                        if (w.status === SpaceStatus.AVAILABLE) {
                          if (w.type === WorkspaceType.OPEN_SPACE) {
                            navigate('/bookingCalendar');
                          } else {
                            navigate('/assignmentForm');
                          }
                        }
                      }}
                    />
                    
                    {/* הוספת טקסט על החלל */}
                    {w.width > 80 && w.height > 40 && (
                      <text
                        x={w.positionX + w.width / 2}
                        y={w.positionY + w.height / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.min(w.width / 6, w.height / 3, 16)}
                        fill="white"
                        className="space-text"
                        style={{ pointerEvents: 'none' }}
                      >
                        {w.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}