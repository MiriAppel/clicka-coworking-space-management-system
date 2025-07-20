import { useEffect, useRef, useState } from 'react';
import '../Css/workspaceMap.css';
import { Room, RoomStatus, RoomType, Space, SpaceStatus, WorkspaceType } from 'shared-types';
import { Button } from '@mui/material';
import { useWorkSpaceStore } from '../../../Stores/Workspace/workspaceStore';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
// import { AssignmentForm } from './assignmentForm';

export const WorkspaceMap = () => {

    const www: Space[] = [
        // {
        //     id: "space-002",
        //     name: "לאונז'",
        //     type: "PUBLIC_SPACE" as WorkspaceType,
        //     status: SpaceStatus.NONE,
        //     positionX: 0,
        //     positionY: 0,
        //     width: 2840,
        //     height: 1060,
        //     createdAt: "2024-01-01T08:00:00Z",
        //     updatedAt: "2024-01-01T08:00:00Z"
        // },
        {
            id: "space-001",
            name: "כניסה ראשית",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            status: SpaceStatus.MAINTENANCE,
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
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
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
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 780,
            positionY: 200,
            width: 120,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה נגישה",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 920,
            positionY: 460,
            width: 100,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "קיר",
            type: "WALL" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 100,
            positionY: 460,
            width: 1,
            height: 500,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "קיר",
            type: "WALL" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 110,
            positionY: 460,
            width: 100,
            height: 1,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה open space",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 770,
            positionY: 210,
            width: 10,
            height: 100,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "קיר",
            type: "WALL" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1050,
            positionY: 160,
            width: 370,
            height: 1,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "יציאה לחצר 2",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1320,
            positionY: 160,
            width: 100,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        // {
        //     id: "space-002",
        //     name: "חדר ישיבות",
        //     type: "PUBLIC_SPACE" as WorkspaceType,
        //     status: SpaceStatus.AVAILABLE,
        //     positionX: 1420,
        //     positionY: 60,
        //     width: 450,
        //     height: 335,
        //     createdAt: "2024-01-01T08:00:00Z",
        //     updatedAt: "2024-01-01T08:00:00Z"
        // },
        {
            id: "space-002",
            name: "כניסה חדר ישיבות",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1750,
            positionY: 385,
            width: 100,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 3",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.OCCUPIED,
            positionX: 1870,
            positionY: 60,
            width: 170,
            height: 335,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה משרד 3",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2030,
            positionY: 290,
            width: 10,
            height: 100,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 4",
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
            name: "כניסה משרד 4",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2040,
            positionY: 220,
            width: 100,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 5",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.OCCUPIED,
            positionX: 2140,
            positionY: 230,
            width: 290,
            height: 170,
            currentCustomerName: "יוסי כהן",
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה משרד 5",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2140,
            positionY: 240,
            width: 10,
            height: 100,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "phone booth",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1650,
            positionY: 480,
            width: 120,
            height: 120,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה phone booth",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1700,
            positionY: 480,
            width: 60,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "שירותים",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1650,
            positionY: 662,
            width: 580,
            height: 400,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה שירותים",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1650,
            positionY: 950,
            width: 10,
            height: 100,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 2",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1770,
            positionY: 480,
            width: 235,
            height: 180,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה משרד 2",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1770,
            positionY: 480,
            width: 100,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 1",
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
            name: "כניסה משרד 1",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 1650,
            positionY: 700,
            width: 10,
            height: 80,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 6",
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
            name: "כניסה משרד 6",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2010,
            positionY: 480,
            width: 100,
            height: 10,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 7",
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
            name: "כניסה משרד 7",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2280,
            positionY: 680,
            width: 10,
            height: 100,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "ארון חשמל",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2230,
            positionY: 875,
            width: 60,
            height: 190,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "קיר",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2430,
            positionY: 400,
            width: 1,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדת הדפסה",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2430,
            positionY: 450,
            width: 60,
            height: 120,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 8",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2430,
            positionY: 570,
            width: 312,
            height: 255,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "כניסה משרד 8",
            type: "DOOR_PASS" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2430,
            positionY: 570,
            width: 10,
            height: 100,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "משרד 9",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2430,
            positionY: 825,
            width: 310,
            height: 236,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "ארון תקשורת",
            type: "PUBLIC_SPACE" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2740,
            positionY: 940,
            width: 40,
            height: 120,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "קיר",
            type: "WALL" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 2280,
            positionY: 1060,
            width: 150,
            height: 1,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "קיר",
            type: "WALL" as WorkspaceType,
            status: SpaceStatus.NONE,
            positionX: 500,
            positionY: 1060,
            width: 1150,
            height: 1,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 1",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1110,
            positionY: 200,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 2",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1110,
            positionY: 260,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 3",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1110,
            positionY: 320,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 4",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1170,
            positionY: 200,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 5",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1170,
            positionY: 260,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 6",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1170,
            positionY: 320,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 7",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1300,
            positionY: 540,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 8",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1300,
            positionY: 600,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 9",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1300,
            positionY: 660,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 10",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1300,
            positionY: 720,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 11",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1360,
            positionY: 540,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 12",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1360,
            positionY: 600,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 13",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1360,
            positionY: 660,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "עמדה 14",
            type: "COMPUTER_STAND" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1360,
            positionY: 720,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדת קבלה",
            type: "RECEPTION_DESK" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 700,
            positionY: 550,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 במשרד 3",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1890,
            positionY: 180,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 2 במשרד 3",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1890,
            positionY: 100,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 4",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2250,
            positionY: 120,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 במשרד 5",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2340,
            positionY: 310,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 8",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2500,
            positionY: 750,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 2 משרד 8",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2600,
            positionY: 750,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 9",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2500,
            positionY: 985,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 2 משרד 9",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2600,
            positionY: 985,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 3 משרד 9",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2600,
            positionY: 880,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 6",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2150,
            positionY: 550,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 2",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1900,
            positionY: 550,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 1",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 1700,
            positionY: 650,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 1 משרד 7",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2200,
            positionY: 800,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-reception",
            name: "עמדה 2 משרד 7",
            type: "DESK_IN_ROOM" as WorkspaceType,
            status: SpaceStatus.AVAILABLE,
            positionX: 2100,
            positionY: 800,
            width: 50,
            height: 50,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
    ];
    const rrr: Room[] = [
        {
            id: "space-002",
            name: "לאונז'",
            type: "LOUNGE" as RoomType,
            status: RoomStatus.AVAILABLE,
            positionX: 0,
            positionY: 0,
            hourlyRate: 1,
            capacity: 10,
            workspaceMapId: "space-002",
            discountedHourlyRate: 1,
            description: "חדר ישיבות מרווח עם מסך טלוויזיה",
            width: 2840,
            height: 1060,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },
        {
            id: "space-002",
            name: "חדר ישיבות",
            type: "MEETING_ROOM" as RoomType,
            status: RoomStatus.AVAILABLE,
            positionX: 1420,
            positionY: 60,
            hourlyRate: 1,
            discountedHourlyRate: 1,
            capacity: 10,
            workspaceMapId: "space-002",
            description: "חדר ישיבות מרווח עם מסך טלוויזיה",
            width: 450,
            height: 335,
            createdAt: "2024-01-01T08:00:00Z",
            updatedAt: "2024-01-01T08:00:00Z"
        },


    ]
    // const { workSpaces, getAllWorkspace, updateWorkspace, deleteWorkspace, createWorkspace, getHistory } = useWorkSpaceStore();
    const { getAllWorkspace, getHistory } = useWorkSpaceStore();
    const uniqueStatus = Object.values(SpaceStatus);
    const uniqueType = Object.values(WorkspaceType);
    const [selectedStatus, setSelectedStatus] = useState("PLACEHOLDER");
    const [selectedType, setSelectedType] = useState("PLACEHOLDER");
    const [activeStatusSearch, setActiveStatusSearch] = useState(false);
    const [activeTypeSearch, setActiveTypeSearch] = useState(false);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [scale, setScale] = useState(1);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [mapDimensions,] = useState({ width: 2840, height: 1060 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    // const [details, setDetails] = useState({
    //     name: "",
    //     description: "",
    //     type: "",
    //     status: "",
    //     workspaceMapId: "",
    //     // room: "",
    //     currentCustomerId: "",
    //     currentCustomerName: "",
    //     positionX: 0,
    //     positionY: 0,
    //     width: 0,
    //     height: 0,
    //     createdAt: "",
    //     updatedAt: ""
    // });
    // const [roomDetails, setRoomDetails] = useState({

    // });
    const navigate = useNavigate()
    const [zoom, setZoom] = useState(3);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    // const [initialScale, setInitialScale] = useState(1);
    // const [signal, setSignal] = useState(1);

    useEffect(() => {
        getAllWorkspace();
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [getAllWorkspace])
    useEffect(() => {
        getAllWorkspace();
    }, [getAllWorkspace]);
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
    //קנה מידה של המפה
    // הוסף אחרי ה-useEffect הקיימים
    useEffect(() => {
        const calculateScale = () => {
            const container = document.querySelector('.spaces');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const scaleX = (containerRect.width - 20) / mapDimensions.width;
                const scaleY = (containerRect.height - 20) / mapDimensions.height;
                const newScale = Math.min(scaleX, scaleY, 1);
                setScale(newScale);
            }
        };
        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [mapDimensions]);
    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev * 1.2, 100));
    };
    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev / 1.2, 3));
    };
    const handleResetZoom = () => {
        setZoom(3); // איפוס ל-300%
        applyPan({ x: 0, y: 0 });
    };
    const getZoomStep = () => {
        if (zoom < 10) return 0.1;
        if (zoom < 100) return 1;
        if (zoom < 1000) return 10;
        return 100;
    };
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom >= 3) {
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
            applyPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleMiniMapClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // קנה מידה של המפה הממוזערת
        const scaleX = mapDimensions.width / rect.width;
        const scaleY = mapDimensions.height / rect.height;

        const targetX = clickX * scaleX;
        const targetY = clickY * scaleY;

        const centerOffsetX = containerSize.width / (2 * scale * zoom);
        const centerOffsetY = containerSize.height / (2 * scale * zoom);

        applyPan({
            x: -(targetX - centerOffsetX) * scale * zoom,
            y: -(targetY - centerOffsetY) * scale * zoom
        });
    };
    const resetSearch = () => {
        setActiveStatusSearch(false);
        setActiveTypeSearch(false);
        setSelectedStatus("PLACEHOLDER");
        setSelectedType("PLACEHOLDER");
    };
    const ocoupancy = (d: Date) => {
        //בדיקה האם זה התאריך הנוכחי
        if (d.toDateString() === new Date().toDateString())
            getAllWorkspace();
        else {
            // המרה לפורמט YYYY-MM-DD לפני השליחה
            // const formattedDate = d.toISOString().split('T')[0];
            getHistory(d);
        }
        // ?
        setDisplayDate(d);
    }

    const getSpaceClass = (space: Space) => {
        const name = space.name.toLowerCase();
        if (name.includes('דלת') || name.includes('כניסה') || name.includes('יציאה')) {
            return 'door';
        }
        if (name.includes('קיר')) {
            return 'wall';
        }
        if (name.includes('שירותים')) {
            return 'bathroom';
        }
        if (name.includes('מטבח')) {
            return 'kitchen';
        }
        if (name.includes('ארון') || name.includes('עמדת')) {
            return 'NONE';
        }
        return space.status;
    };
    const getRoomSpaceClass = (room: Room) => {
        const name = room.name.toLowerCase();
        if (name.includes('לאונז')) {
            return 'lounge';
        }
        if (name.includes('ישיבות')) {
            return 'meeting';
        }
        return room.status;
    };

    // const getPanBounds = () => {
    //     const scaledWidth = mapDimensions.width * scale * zoom;
    //     const scaledHeight = mapDimensions.height * scale * zoom;

    //     return {
    //         minX: containerSize.width - scaledWidth,
    //         maxX: 0,
    //         minY: containerSize.height - scaledHeight,
    //         maxY: 0
    //     };
    // };

    const applyPan = (newPan: { x: number; y: number }) => {
        const scaledWidth = mapDimensions.width * 1 * zoom;
        const scaledHeight = mapDimensions.height * 1 * zoom;

        let minX, maxX, minY, maxY;

        if (scaledWidth <= containerSize.width) {
            // אם המפה קטנה מהקונטיינר - מרכז אותה
            const centerX = (containerSize.width - scaledWidth) / 2;
            minX = maxX = centerX;
        } else {
            // אם המפה גדולה מהקונטיינר - אפשר גרירה בגבולות
            maxX = 0; // הקצה השמאלי של המפה לא יעבור את השמאל של הקונטיינר
            minX = containerSize.width - scaledWidth; // הקצה הימני של המפה לא יעבור את הימין של הקונטיינר
        }

        if (scaledHeight <= containerSize.height) {
            // אם המפה קטנה מהקונטיינר - מרכז אותה
            const centerY = (containerSize.height - scaledHeight) / 2;
            minY = maxY = centerY;
        } else {
            // אם המפה גדולה מהקונטיינר - אפשר גרירה בגבולות
            maxY = 0; // הקצה העליון של המפה לא יעבור את העליון של הקונטיינר
            minY = containerSize.height - scaledHeight; // הקצה התחתון של המפה לא יעבור את התחתון של הקונטיינר
        }

        const clampedX = Math.max(Math.min(newPan.x, maxX), minX);
        const clampedY = Math.max(Math.min(newPan.y, maxY), minY);

        setPan({ x: clampedX, y: clampedY });
    };

    const getSpaceIcon = (space: Space) => {
        const name = space.name.toLowerCase();

        // אל תחזיר אייקון עבור עמדות - הן יקבלו אייקון מחשב
        if (name.includes('עמדה') && (space.type === 'COMPUTER_STAND' || space.type === 'DESK_IN_ROOM')) {
            return null; // ← שינוי כאן
        }

        if (name.includes('שירותים')) return '🚻';
        if (name.includes('מטבח')) return '🍽️';
        if (name.includes('מעלית')) return '🛗';
        if (name.includes('ארון חשמל')) return '⚡';
        if (name.includes('ארון תקשורת')) return '📡';
        if (name.includes('עמדת הדפסה')) return '🖨️';
        if (name.includes('קבלה')) return '📋';

        return null;
    };
    const getRoomSpaceIcon = (room: Room) => {
        const name = room.name.toLowerCase();
        if (name.includes('לאונז')) return '🛋️';
        if (name.includes('ישיבות')) return '👥';
        return null;
    };
    const renderComputerStand = (space: Space) => {
        if (!(space.type === 'COMPUTER_STAND' || space.type === 'DESK_IN_ROOM')) return null;

        const centerX = space.positionX + space.width / 2;
        const centerY = space.positionY + space.height / 2;

        return (
            <g style={{ pointerEvents: 'none' }}>
                {/* מסך */}
                <rect
                    x={centerX - 15}
                    y={centerY - 12}
                    width="30"
                    height="20"
                    fill="#2c3e50"
                    stroke="#34495e"
                    strokeWidth="1"
                    rx="2"
                />
                {/* מסך פנימי - צבע לפי סטטוס */}
                <rect
                    x={centerX - 12}
                    y={centerY - 9}
                    width="24"
                    height="15"
                    fill={space.status === SpaceStatus.AVAILABLE ? '#caf9d5' :
                        space.status === SpaceStatus.OCCUPIED ? '#f6c1bd' : '#f7d6a5'}
                    rx="1"
                />
                {/* בסיס */}
                <rect
                    x={centerX - 3}
                    y={centerY + 8}
                    width="6"
                    height="4"
                    fill="#7f8c8d"
                />
                <rect
                    x={centerX - 10}
                    y={centerY + 12}
                    width="20"
                    height="2"
                    fill="#95a5a6"
                    rx="1"
                />
            </g>
        );
    };

    // const renderReceptionDesk = (space: Space) => {
    //     if (space.type !== 'RECEPTION_DESK') return null;
    //     const centerX = space.positionX + space.width / 2;
    //     const centerY = space.positionY + space.height / 2;
    //     return (
    //         <g>
    //             {/* שולחן חצי עיגול */}
    //             <path
    //                 d={`M ${centerX - 18} ${centerY + 3} A 18 12 0 0 1 ${centerX + 18} ${centerY + 3} L ${centerX + 15} ${centerY + 8} L ${centerX - 15} ${centerY + 8} Z`}
    //                 fill="#8B4513"
    //                 stroke="#654321"
    //                 strokeWidth="1"
    //             />
    //             {/* משטח עליון */}
    //             <ellipse
    //                 cx={centerX}
    //                 cy={centerY}
    //                 rx="18"
    //                 ry="10"
    //                 fill="#D2691E"
    //                 stroke="#A0522D"
    //                 strokeWidth="1"
    //             />
    //         </g>
    //     );
    // };
    return <div className="all">
        <h1>{displayDate.toLocaleDateString()}</h1>
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
        <button
            className={`toggleSidebarBtn ${isSidebarOpen ? 'open' : 'closed'}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            title={isSidebarOpen ? "הסתר תפריט" : "הצג תפריט"}
        >
            <MenuIcon />        </button>
        {/* <div className="content">  */}
        <div className={`content ${!isSidebarOpen ? 'sidebarHidden' : ''}`}>
            <div className={`search ${!isSidebarOpen ? 'hidden' : ''}`}>                <div className='statusAndType'>
                <h2>חיפוש וסינון</h2>
                <label>סטטוס</label>
                <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value) }}>
                    <option value="PLACEHOLDER" disabled>choose status to search</option>
                    {uniqueStatus.map((status, index) => {
                        return <option key={status} value={status}>{status}</option>
                    })}
                </select>
                <label>סוג</label>
                <select value={selectedType} onChange={(e) => { setSelectedType(e.target.value) }}>
                    <option value="PLACEHOLDER" disabled>choose type to search</option>
                    {uniqueType.map((type, index) => {
                        return <option key={type} value={type}>{type}</option>
                    })}
                </select>
            </div>
                <Button onClick={resetSearch} className="clearSearchBtn">Clear Search</Button>
                <div className='displayDate'>
                    <h2>תצוגת מפה</h2>
                    <label>תאריך</label>
                    <input type="date" onChange={(e) => { ocoupancy(new Date(e.target.value)) }} />
                </div>
                <Button onClick={() => { navigate('/') }} className="backBtn">Back</Button>
            </div>

            <div className={`workspaceMap ${!isSidebarOpen ? 'fullWidth' : ''}`}>
                <div className="spaces" ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ cursor: zoom >= 3 ? (isDragging ? 'grabbing' : 'grab') : 'default', position: 'relative' }}>
                    <svg
                        className="mapContent"
                        style={{
                            transform: `scale(${scale * zoom}) translate(${pan.x / (scale * zoom)}px, ${pan.y / (scale * zoom)}px)`,
                            transformOrigin: '0 0',
                            width: `${mapDimensions.width}px`,
                            height: `${mapDimensions.height}px`,
                        }}
                        viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
                    >
                        <defs>
                            <pattern id="doorPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                                <rect width="10" height="10" fill="#f8f9fa" />
                                <path d="M0,10 L10,0" stroke="#6c757d" strokeWidth="1" />
                            </pattern>
                        </defs>
                        {rrr.length > 0 && rrr.map((r) => {
                            // const hasActiveSearch = activeStatusSearch || activeTypeSearch;
                            // const matchesStatusSearch = !activeStatusSearch || r.status === selectedStatus;
                            // const matchesTypeSearch = !activeTypeSearch || r.type === selectedType;
                            // const isHighlighted = !hasActiveSearch || (matchesStatusSearch && matchesTypeSearch);


                            return (
                                <g key={r.id}>
                                    {r.width > 50 && r.height > 30 && (
                                        <g>
                                            <rect
                                                x={r.positionX}
                                                y={r.positionY}
                                                width={r.width}
                                                height={r.height}
                                                className={`space-rect room-space ${getRoomSpaceClass(r)}`} // הוסף room-space
                                            // שאר הקוד...
                                            />
                                            {getRoomSpaceIcon(r) && (

                                                <text
                                                    x={r.positionX + r.width / 2}
                                                    y={r.positionY + r.height / 2 - 15}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize="48"
                                                    fill="#333"
                                                    style={{
                                                        pointerEvents: 'none',
                                                        fontWeight: 'bold',
                                                        fontFamily: 'Arial Unicode MS, Segoe UI Emoji, sans-serif'
                                                    }}
                                                >
                                                    {getRoomSpaceIcon(r)}
                                                </text>
                                            )}
                                            <text
                                                x={r.positionX + r.width / 2}
                                                y={r.positionY + r.height / 2 + (getRoomSpaceIcon(r) ? 5 : 0)}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize={Math.min(r.width / 8, r.height / 4, 12)}
                                                fill="white"
                                                className="space-text"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {r.name}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                        {www.length > 0 && www.map((w) => {
                            const hasActiveSearch = activeStatusSearch || activeTypeSearch;
                            const matchesStatusSearch = !activeStatusSearch || w.status === selectedStatus;
                            const matchesTypeSearch = !activeTypeSearch || w.type === selectedType;
                            const isHighlighted = !hasActiveSearch || (matchesStatusSearch && matchesTypeSearch);

                            // הוסף את השורה הזו - זה השינוי העיקרי!
                            const isWorkstation = w.type === 'COMPUTER_STAND' || w.type === 'DESK_IN_ROOM';

                            return (
                                <g key={w.id}>
                                    {isWorkstation ? (
                                        // כל העמדות יעברו דרך הענף הזה
                                        <g
                                            className={`space-rect ${getSpaceClass(w)}`}
                                            style={{ opacity: isHighlighted ? 1 : 0.3 }}
                                            onMouseEnter={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setTooltip({
                                                    visible: true,
                                                    x: rect.left + rect.width / 2,
                                                    y: rect.top - 10,
                                                    content: `${w.name} - ${w.status}`
                                                });
                                                // setDetails({
                                                //     name: w.name,
                                                //     description: w.description || "",
                                                //     type: w.type,
                                                //     status: w.status,
                                                //     workspaceMapId: w.workspaceMapId || "",
                                                //     // room: w.room || "",
                                                //     currentCustomerId: w.currentCustomerId || "",
                                                //     currentCustomerName: w.currentCustomerName || "",
                                                //     positionX: w.positionX,
                                                //     positionY: w.positionY,
                                                //     width: w.width,
                                                //     height: w.height,
                                                //     createdAt: w.createdAt,
                                                //     updatedAt: w.updatedAt
                                                // });
                                            }}
                                            onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
                                            onClick={() => {
                                                if (w.status === SpaceStatus.AVAILABLE) {
                                                    navigate('/assignmentForm');
                                                }
                                            }}
                                        >
                                            <rect
                                                x={w.positionX}
                                                y={w.positionY}
                                                width={w.width}
                                                height={w.height}
                                                className={`space-rect ${getSpaceClass(w)}`}
                                                stroke={isHighlighted ? "#333" : "#999"}
                                                strokeWidth="2"
                                                opacity={0.3}
                                            />
                                            {renderComputerStand(w)}
                                            <text
                                                x={w.positionX + w.width / 2}
                                                y={w.positionY + w.height + 15}
                                                textAnchor="middle"
                                                fontSize="8"
                                                fill="#333"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {w.name}
                                            </text>
                                        </g>
                                    ) : (
                                        <rect
                                            x={w.positionX}
                                            y={w.positionY}
                                            width={w.width}
                                            height={w.height}
                                            stroke={isHighlighted ? "#333" : "#999"}
                                            strokeWidth="2"
                                            opacity={isHighlighted ? 1 : 0.3}
                                            className={`space-rect ${getSpaceClass(w)}`}
                                            onMouseEnter={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setTooltip({
                                                    visible: true,
                                                    x: rect.left + rect.width / 2,
                                                    y: rect.top - 10,
                                                    content: ['door', 'wall', 'bathroom', 'kitchen', 'NONE'].includes(getSpaceClass(w))
                                                        ? w.name
                                                        : `${w.name} - ${w.status} ${w.currentCustomerName ? `${w.currentCustomerName}` : ""},`
                                                });
                                                // setDetails({
                                                //     name: w.name,
                                                //     description: w.description || "",
                                                //     type: w.type,
                                                //     status: w.status,
                                                //     workspaceMapId: w.workspaceMapId || "",
                                                //     // room: w.room || "",
                                                //     currentCustomerId: w.currentCustomerId || "",
                                                //     currentCustomerName: w.currentCustomerName || "",
                                                //     positionX: w.positionX,
                                                //     positionY: w.positionY,
                                                //     width: w.width,
                                                //     height: w.height,
                                                //     createdAt: w.createdAt,
                                                //     updatedAt: w.updatedAt
                                                // });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltip(prev => ({ ...prev, visible: false }));
                                            }}
                                            onClick={() => {
                                                if (w.status === SpaceStatus.AVAILABLE) {
                                                    if (w.type === WorkspaceType.OPEN_SPACE) {
                                                        navigate('/bookingCalendar');
                                                    } else {
                                                        // <AssignmentForm  workspaceId={w.id} workspaceName={ w.name }  workspaceType={w.type} assignedDate={displayDate} />
                                                    }
                                                }
                                            }}
                                        >
                                            {renderComputerStand(w)}
                                        </rect>
                                    )}
                                    {w.width > 50 && w.height > 30 && (
                                        <g>
                                            {getSpaceIcon(w) && (
                                                <text
                                                    x={w.positionX + w.width / 2}
                                                    y={w.positionY + w.height / 2 - 15}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize="48"
                                                    fill="#333"
                                                    style={{
                                                        pointerEvents: 'none',
                                                        fontWeight: 'bold',
                                                        fontFamily: 'Arial Unicode MS, Segoe UI Emoji, sans-serif'
                                                    }}
                                                >
                                                    {getSpaceIcon(w)}
                                                </text>
                                            )}
                                            <text
                                                x={w.positionX + w.width / 2}
                                                y={w.positionY + w.height / 2 + (getSpaceIcon(w) ? 5 : 0)}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontSize={Math.min(w.width / 8, w.height / 4, 12)}
                                                fill="white"
                                                className="space-text"
                                                style={{ pointerEvents: 'none' }}
                                            >
                                                {w.name}
                                            </text>
                                            {/* הצגת שם לקוח אם קיים */}
                                            {w.currentCustomerName && (
                                                <text
                                                    x={w.positionX + w.width / 2}
                                                    y={w.positionY + w.height / 2 + (getSpaceIcon(w) ? 20 : 15)}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontSize={Math.min(w.width / 10, w.height / 5, 10)}
                                                    fill="#ffeb3b"
                                                    style={{ pointerEvents: 'none', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                                                >
                                                    👤 {w.currentCustomerName}
                                                </text>
                                            )}
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                        
                    </svg>
                </div>
                <div className="zoom">
                    <div className="zoom-controls">
                        <button className="zoom-btn" onClick={handleZoomOut} disabled={zoom <= 3}> - </button>
                        <div className="zoom-slider">
                            <input
                                type="range"
                                min="3"
                                max="100"
                                step={getZoomStep()}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="slider"
                            />
                            <span className="zoom-value">{Math.round(zoom * 100)}%</span>
                        </div>
                        <button className="zoom-btn" onClick={handleZoomIn} disabled={zoom >= 10}>+</button>
                        <button className="reset-btn" onClick={handleResetZoom}>⌂</button>
                    </div>
                </div>
            </div>
        </div>
        <div
            className="minimap"
            style={{
                position: 'absolute',
                // bottom: 10,
                // right: 50,
                top: 80,
                left: 20,
                width: 200,
                height: 100,
                border: '1px solid #999',
                background: '#fff',
                zIndex: 100,
                overflow: 'hidden'
            }}
        >
            <svg
                onClick={handleMiniMapClick}
                viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
                width="200"
                height="100"
                style={{ cursor: 'pointer' }}
            >
                {www.map(w => (
                    <rect
                        key={w.id}
                        x={w.positionX}
                        y={w.positionY}
                        width={w.width}
                        height={w.height}
                        fill="#ddd"
                        stroke="#333"
                        strokeWidth="0.5"
                    />
                ))}
                <rect
                    x={-pan.x / (scale * zoom) /* ← משמר התאמה בין תצוגה לפאן */}
                    y={-pan.y / (scale * zoom)}
                    width={containerSize.width / (scale * zoom)}
                    height={containerSize.height / (scale * zoom)}
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                />
            </svg>
        </div>
    </div>
}