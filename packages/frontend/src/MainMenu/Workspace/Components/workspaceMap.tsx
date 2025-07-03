import { Button } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import '../Css/workspaceMap.css'
import { use, useEffect, useState, useRef } from "react";
import { ID } from "shared-types";
// import { Space, SpaceStatus } from '../../../../../../types/workspace'
import { WorkspaceType } from "shared-types"
import { Space, SpaceStatus } from "shared-types";
import { useStore } from "zustand";
import { useWorkSpaceStore } from "../../../Stores/Workspace/workspaceStore";
import { ThemeConfig } from "../../../Common/Service/themeConfig";
import MenuIcon from '@mui/icons-material/Menu';
import { set } from "zod";

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

  const www: Space[] = [
    // שורה עליונה - חדרי ישיבות
    {
      id: "space-001",
      name: "חדר ישיבות A",
      description: "חדר ישיבות גדול עם מקרן ל-8 אנשים",
      type: "PRIVATE_ROOM" as WorkspaceType,
      status: SpaceStatus.INACTIVE,
      room: "קומה 1",
      positionX: 20,
      positionY: 20,
      width: 280,
      height: 120,
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z"
    },
    {
      id: "space-002",
      name: "חדר ישיבות B",
      description: "חדר ישיבות קטן ל-4 אנשים",
      type: "PRIVATE_ROOM" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      room: "קומה 1",
      currentCustomerId: "customer-002",
      currentCustomerName: "שרה לוי",
      positionX: 320,
      positionY: 20,
      width: 250,
      height: 120,
      createdAt: "2024-01-12T10:00:00Z",
      updatedAt: "2024-01-22T16:30:00Z"
    },
    {
      id: "space-003",
      name: "חדר מנהלים",
      description: "חדר ישיבות יוקרתי עם שולחן עגול",
      type: "PRIVATE_ROOM" as WorkspaceType,
      status: SpaceStatus.OCCUPIED,
      room: "קומה 1",
      currentCustomerId: "customer-003",
      currentCustomerName: "דוד אברהם",
      positionX: 590,
      positionY: 20,
      width: 280,
      height: 120,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-24T10:00:00Z"
    },

    // שורה שנייה - עמדות עבודה
    {
      id: "space-004",
      name: "עמדה 1",
      description: "עמדת עבודה אישית עם מחשב",
      type: "DESK_IN_ROOM" as WorkspaceType,
      status: SpaceStatus.OCCUPIED,
      room: "קומה 1",
      currentCustomerId: "customer-001",
      currentCustomerName: "יוסי כהן",
      positionX: 20,
      positionY: 160,
      width: 170,
      height: 100,
      createdAt: "2024-01-10T09:30:00Z",
      updatedAt: "2024-01-20T14:15:00Z"
    },
    {
      id: "space-005",
      name: "עמדה 2",
      description: "עמדת עבודה עם מסך כפול",
      type: "DESK_IN_ROOM" as WorkspaceType,
      status: SpaceStatus.RESERVED,
      room: "קומה 1",
      positionX: 210,
      positionY: 160,
      width: 170,
      height: 100,
      createdAt: "2024-01-03T15:30:00Z",
      updatedAt: "2024-01-21T13:10:00Z"
    },
    {
      id: "space-006",
      name: "עמדה 3",
      description: "עמדת עבודה סטנדרטית",
      type: "DESK_IN_ROOM" as WorkspaceType,
      status: SpaceStatus.MAINTENANCE,
      room: "קומה 1",
      positionX: 400,
      positionY: 160,
      width: 170,
      height: 100,
      createdAt: "2024-01-08T07:45:00Z",
      updatedAt: "2024-01-23T11:20:00Z"
    },
    {
      id: "space-007",
      name: "עמדה 4",
      description: "עמדת עבודה עם נוף",
      type: "DESK_IN_ROOM" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      room: "קומה 1",
      positionX: 590,
      positionY: 160,
      width: 170,
      height: 100,
      createdAt: "2024-01-14T11:15:00Z",
      updatedAt: "2024-01-19T14:30:00Z"
    },

    // שורה שלישית - אזורים משותפים
    {
      id: "space-008",
      name: "אזור משותף",
      description: "אזור עבודה משותף עם ספות ושולחנות",
      type: "OPEN_SPACE" as WorkspaceType,
      status: SpaceStatus.RESERVED,
      room: "קומה 1",
      positionX: 20,
      positionY: 280,
      width: 360,
      height: 120,
      createdAt: "2024-01-05T12:00:00Z",
      updatedAt: "2024-01-18T09:45:00Z"
    },
    {
      id: "space-009",
      name: "חדר שקט",
      description: "חדר לעבודה מרוכזת ושיחות טלפון",
      type: "CLIKAH_CARD" as WorkspaceType,
      status: SpaceStatus.OCCUPIED,
      room: "קומה 1",
      currentCustomerId: "customer-005",
      currentCustomerName: "רחל כהן",
      positionX: 400,
      positionY: 280,
      width: 200,
      height: 120,
      createdAt: "2024-01-09T16:45:00Z",
      updatedAt: "2024-01-24T13:20:00Z"
    },
    {
      id: "space-010",
      name: "לובי כניסה",
      description: "אזור קבלת פנים ומתנה",
      type: "OPEN_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      room: "קומה 1",
      positionX: 620,
      positionY: 280,
      width: 250,
      height: 120,
      createdAt: "2024-01-01T08:00:00Z",
      updatedAt: "2024-01-22T14:45:00Z"
    },

    // שורה רביעית - שירותים
    {
      id: "space-011",
      name: "מטבחון",
      description: "מטבחון עם מקרר ומיקרוגל",
      type: "OPEN_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      room: "קומה 1",
      positionX: 20,
      positionY: 420,
      width: 200,
      height: 100,
      createdAt: "2024-01-04T09:15:00Z",
      updatedAt: "2024-01-17T12:30:00Z"
    },
    {
      id: "space-012",
      name: "חדר הדפסה",
      description: "חדר עם מדפסות",
      type: "CLIKAH_CARD" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      room: "קומה 1",
      positionX: 240,
      positionY: 420,
      width: 180,
      height: 100,
      createdAt: "2024-01-06T11:00:00Z",
      updatedAt: "2024-01-19T16:20:00Z"
    },
    {
      id: "space-013",
      name: "חדר אחסון",
      description: "חדר אחסון לציוד משרדי",
      type: "PRIVATE_ROOM" as WorkspaceType,
      status: SpaceStatus.INACTIVE,
      room: "קומה 1",
      positionX: 440,
      positionY: 420,
      width: 160,
      height: 100,
      createdAt: "2024-01-02T10:30:00Z",
      updatedAt: "2024-01-15T15:45:00Z"
    },
    {
      id: "space-014",
      name: "פינת קפה",
      description: "אזור מנוחה עם מכונת קפה",
      type: "OPEN_SPACE" as WorkspaceType,
      status: SpaceStatus.AVAILABLE,
      room: "קומה 1",
      positionX: 620,
      positionY: 420,
      width: 250,
      height: 100,
      createdAt: "2024-01-07T14:20:00Z",
      updatedAt: "2024-01-20T11:15:00Z"
    }
  ];

  const navigate = useNavigate()
  const { workSpaces, getAllSpaces, updateSpace, deleteSpace, addSpace, getMapByOcoupancy } = useWorkSpaceStore();
  const [details, setDetails] = useState({
    name: "",
    description: "",
    type: "",
    status: "",
    room: "",
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
    getAllSpaces();
  }, [])

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
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 1));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // פונקציות גרירה - תיקון הלוגיקה
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
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
      const newZoom = 0.5 + (percentage * 2.5);
      setZoom(newZoom);
    }
  };
  const ocoupancy = (d: Date) => {
    getMapByOcoupancy(d);
    setDisplayDate(d);
  }

  const handleSliderMouseUp = () => {
    setIsSliderDragging(false);
  };

  return <div className="workspaceMap">
    <h1>{displayDate.toLocaleDateString()}</h1>
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

          <div className="zoomLevel">{Math.round(zoom * 100)}%</div>

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
            cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }}
        >
          <div
            className="mapContent"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: '0 0'
            }}
          >
            {www.length > 0 && www.map((w) => {
              const hasActiveSearch = activeStatusSearch || activeTypeSearch;
              const matchesStatusSearch = !activeStatusSearch || w.status === selectedStatus;
              const matchesTypeSearch = !activeTypeSearch || w.type === selectedType;
              const isHighlighted = !hasActiveSearch || (matchesStatusSearch && matchesTypeSearch);
              return <div
                key={w.id}
                className={`space ${w.status} ${!isHighlighted ? 'dimmed' : 'highlighted'}`}
                style={{
                  left: `${w.positionX}px`,
                  top: `${w.positionY}px`,
                  width: `${w.width}px`,
                  height: `${w.height}px`,
                  opacity: isHighlighted ? 1 : 0.3,
                  filter: isHighlighted ? 'none' : 'grayscale(50%)'
                }}
                onMouseLeave={() => { setCurrentId("-1") }}
                onMouseEnter={(e) => {
                  // מניעת הפעלת גרירה כשעוברים על חלל
                  e.stopPropagation();
                  if(w.id)
                    setCurrentId(w.id);
                  setDetails({
                    ...details, name: w.name, description: w.description || "",
                    type: w.type, status: w.status, room: w.room || "", currentCustomerId: w.currentCustomerId || "",
                    currentCustomerName: w.currentCustomerName || "", positionX: w.positionX, positionY: w.positionY,
                    width: w.width, height: w.height, createdAt: w.createdAt, updatedAt: w.updatedAt
                  });
                }}
                onMouseDown={(e) => {
                  // מניעת הפעלת גרירה כשלוחצים על חלל
                  e.stopPropagation();
                }}
                //הקצאה
                onClick={() => { if (w.status === SpaceStatus.AVAILABLE) {navigate('') } else if (w.status === SpaceStatus.INACTIVE) navigate('')}}
              >
                {currentId !== w.id ? <div>{w.name} {w.type}</div> : <div>{detailsTodisplay()}</div>}
              </div>
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
}
