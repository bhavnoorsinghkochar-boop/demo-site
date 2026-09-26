import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bike,
  Navigation,
  MapPin,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Phone,
  ShieldCheck,
  Layers,
  Radio,
  Clock,
  Sparkles,
  CheckCircle2,
  Crosshair,
  Maximize2,
  Minimize2,
  Info,
  Car,
  UtensilsCrossed,
} from 'lucide-react';
import { Order } from '../types';

export interface SimulatedDeliveryMapViewProps {
  order: Order;
  destinationAddress: string;
  restaurantLocation: string;
  restaurantName: string;
  className?: string;
}

// Landmark waypoints representing key points in Ludhiana along Ferozpur Road
interface Point {
  x: number;
  y: number;
}

const ROUTE_POINTS: Point[] = [
  { x: 120, y: 390 }, // 0: Laa Mamma Mia Kitchen (Rajguru Nagar)
  { x: 170, y: 360 }, // 1: Rajguru Nagar Main Market Exit
  { x: 230, y: 340 }, // 2: Ferozpur Road Service Lane
  { x: 310, y: 310 }, // 3: Bhai Bala Chowk Flyover Approach
  { x: 390, y: 275 }, // 4: Bhai Bala Chowk Underpass
  { x: 470, y: 240 }, // 5: Sarabha Nagar Intersection
  { x: 540, y: 210 }, // 6: Malhar Road Junction
  { x: 620, y: 170 }, // 7: BRS Nagar Main Arterial
  { x: 680, y: 140 }, // 8: Colony Entrance
  { x: 730, y: 110 }, // 9: Customer Delivery Destination
];

// Helper to compute point along polyline at t in [0, 1]
function getPositionOnRoute(points: Point[], t: number): { point: Point; angle: number } {
  if (t <= 0) return { point: points[0], angle: -30 };
  if (t >= 1) return { point: points[points.length - 1], angle: -30 };

  const totalSegments = points.length - 1;
  const scaledT = t * totalSegments;
  const segmentIndex = Math.min(Math.floor(scaledT), totalSegments - 1);
  const segmentFrac = scaledT - segmentIndex;

  const p1 = points[segmentIndex];
  const p2 = points[segmentIndex + 1];

  const x = p1.x + (p2.x - p1.x) * segmentFrac;
  const y = p1.y + (p2.y - p1.y) * segmentFrac;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  return { point: { x, y }, angle };
}

export const SimulatedDeliveryMapView: React.FC<SimulatedDeliveryMapViewProps> = ({
  order,
  destinationAddress,
  restaurantLocation,
  restaurantName,
  className = '',
}) => {
  // Map interactive state
  const [zoom, setZoom] = useState<number>(1);
  const [mapTheme, setMapTheme] = useState<'light' | 'dark' | 'satellite'>('light');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showRiderCard, setShowRiderCard] = useState<boolean>(true);
  const [gpsPing, setGpsPing] = useState<number>(0);

  // Determine initial progress based on order status
  const defaultProgress = useMemo(() => {
    switch (order.status) {
      case 'placed':
        return 0.05;
      case 'confirmed':
        return 0.12;
      case 'preparing':
        return 0.22;
      case 'ready':
        return 0.65;
      case 'completed':
        return 1.0;
      case 'cancelled':
        return 0.0;
      default:
        return 0.2;
    }
  }, [order.status]);

  const [progress, setProgress] = useState<number>(defaultProgress);

  // Update default progress when order status changes externally
  useEffect(() => {
    setProgress(defaultProgress);
  }, [defaultProgress]);

  // Live GPS simulation loop
  useEffect(() => {
    if (!isPlaying) return;
    if (order.status === 'completed' || order.status === 'cancelled') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const step = 0.004 * simSpeed;
        if (prev >= 0.98) {
          return 0.98; // Stay near destination until completed
        }
        return Math.min(0.98, prev + step);
      });
      setGpsPing((p) => (p + 1) % 1000);
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, order.status]);

  const currentRiderPos = useMemo(() => {
    return getPositionOnRoute(ROUTE_POINTS, progress);
  }, [progress]);

  // Simulated metrics
  const totalDistanceKm = 3.2;
  const remainingDistanceKm = Math.max(0, (totalDistanceKm * (1 - progress))).toFixed(1);
  const estimatedMinsRemaining = Math.max(1, Math.round((1 - progress) * 18));
  const currentSpeedKmh =
    order.status === 'completed'
      ? 0
      : order.status === 'ready'
      ? Math.round(28 + Math.sin(gpsPing * 0.3) * 6)
      : progress > 0.3
      ? Math.round(22 + Math.cos(gpsPing * 0.4) * 4)
      : 0;

  // Lat / Long calculations for Ludhiana around Rajguru Nagar (30.89° N, 75.82° E)
  const baseLat = 30.8924;
  const baseLng = 75.8213;
  const currentLat = (baseLat + progress * 0.024).toFixed(4);
  const currentLng = (baseLng + progress * 0.018).toFixed(4);

  // SVG route string
  const routePathD = useMemo(() => {
    return ROUTE_POINTS.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, []);

  // Past route path (the road traveled so far)
  const traveledPathD = useMemo(() => {
    const totalSegments = ROUTE_POINTS.length - 1;
    const scaledT = progress * totalSegments;
    const currentSeg = Math.min(Math.floor(scaledT), totalSegments - 1);
    const subPoints = ROUTE_POINTS.slice(0, currentSeg + 1);
    subPoints.push(currentRiderPos.point);

    return subPoints.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, [progress, currentRiderPos]);

  // Delivery rider profile (simulated)
  const riderProfile = {
    name: 'Gurpreet Singh',
    phone: '+91 98888 12345',
    vehicle: 'Ather 450X (PB 10 ML 2026)',
    rating: '4.9 ★ (1,420+ trips)',
    battery: '88%',
    temperature: 'Thermal Box: 62°C (Hot & Fresh)',
  };

  return (
    <div
      id="simulated-delivery-map-container"
      className={`rounded-3xl border border-[#E6DEC8] overflow-hidden bg-white shadow-md transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'relative'
      } ${className}`}
    >
      {/* Top Map Control Bar */}
      <div className="bg-[#FAF7F2] border-b border-[#E6DEC8] px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#143627] text-[#C69234] flex items-center justify-center shadow-xs">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#143627]">Live GPS Delivery Radar</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Simulated Real-Time</span>
              </span>
            </div>
            <p className="text-[11px] text-[#65736C]">
              Laa Mamma Mia Kitchen (Rajguru Nagar) ➔ Ludhiana Corridor ➔ Drop-off Point
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Map Layer Switcher */}
          <div className="flex items-center rounded-xl bg-white border border-[#E6DEC8] p-0.5 shadow-2xs">
            <button
              onClick={() => setMapTheme('light')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                mapTheme === 'light' ? 'bg-[#143627] text-white shadow-xs' : 'text-[#65736C] hover:text-[#143627]'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapTheme('dark')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                mapTheme === 'dark' ? 'bg-[#143627] text-white shadow-xs' : 'text-[#65736C] hover:text-[#143627]'
              }`}
            >
              Night
            </button>
            <button
              onClick={() => setMapTheme('satellite')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                mapTheme === 'satellite' ? 'bg-[#143627] text-white shadow-xs' : 'text-[#65736C] hover:text-[#143627]'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center rounded-xl bg-white border border-[#E6DEC8] p-0.5 shadow-2xs">
            <button
              onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))}
              className="p-1.5 hover:bg-[#FAF7F2] text-[#143627] rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}
              className="p-1.5 hover:bg-[#FAF7F2] text-[#143627] rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-[#FAF7F2] text-[#143627] rounded-lg transition-colors"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen((f) => !f)}
            className="p-2 rounded-xl bg-white border border-[#E6DEC8] hover:bg-[#FAF7F2] text-[#143627] transition-colors shadow-2xs"
            title={isFullscreen ? 'Exit full screen' : 'Expand full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div
        className={`relative overflow-hidden select-none transition-all ${
          isFullscreen ? 'flex-1 min-h-[450px]' : 'h-80 sm:h-96'
        } ${
          mapTheme === 'dark'
            ? 'bg-[#0E1713]'
            : mapTheme === 'satellite'
            ? 'bg-[#18231C]'
            : 'bg-[#F2EFE9]'
        }`}
      >
        {/* Transformable Canvas with Zoom Scale */}
        <div
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 820 480"
            className="w-full h-full preserve-3d"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Patterns for blocks / satellite terrain */}
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={mapTheme === 'dark' ? '#1A2922' : mapTheme === 'satellite' ? '#213329' : '#E8E2D6'}
                  strokeWidth="1"
                />
              </pattern>

              {/* Glowing filter for route */}
              <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#2E7D58" floodOpacity="0.6" />
              </filter>

              {/* Gradient for active traveled path */}
              <linearGradient id="active-path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C69234" />
                <stop offset="60%" stopColor="#2E7D58" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>

              {/* Waterway / Canal pattern */}
              <linearGradient id="canal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={mapTheme === 'dark' ? '#0D2B35' : '#C7E4E8'} />
                <stop offset="100%" stopColor={mapTheme === 'dark' ? '#09212A' : '#B8DCDE'} />
              </linearGradient>
            </defs>

            {/* Base Background Grid */}
            <rect width="820" height="480" fill="url(#grid-pattern)" />

            {/* Simulated Parks & Green Spaces (Rakh Bagh, Rose Garden, Sarabha Nagar Park) */}
            <g id="parks-and-greens" opacity={mapTheme === 'dark' ? '0.25' : '0.45'}>
              {/* Rajguru Nagar Surroundings Greenery */}
              <path
                d="M 50 320 Q 90 310 130 350 T 90 440 T 40 400 Z"
                fill="#8CB89B"
              />
              {/* Sarabha Nagar Park */}
              <path
                d="M 380 180 Q 430 170 450 210 T 400 250 T 360 210 Z"
                fill="#8CB89B"
              />
              {/* Leisure Valley Ludhiana */}
              <path
                d="M 600 60 Q 660 50 700 90 T 670 140 T 580 110 Z"
                fill="#8CB89B"
              />
            </g>

            {/* Simulated Sidhwan Canal / Water Body crossing Ludhiana */}
            <path
              d="M 0 160 Q 200 190 400 150 T 820 130"
              fill="none"
              stroke="url(#canal-grad)"
              strokeWidth="24"
              opacity="0.8"
            />
            <text
              x="220"
              y="180"
              fill={mapTheme === 'dark' ? '#4A7A8C' : '#5E97A6'}
              fontSize="9"
              fontFamily="sans-serif"
              letterSpacing="2"
              opacity="0.7"
            >
              SIDHWAN CANAL
            </text>

            {/* Secondary City Streets & Neighborhood Grid */}
            <g
              id="city-grid-roads"
              stroke={mapTheme === 'dark' ? '#1D2F27' : mapTheme === 'satellite' ? '#263B2F' : '#DFD7C7'}
              strokeWidth="4"
              strokeLinecap="round"
            >
              {/* Horizontal Streets */}
              <line x1="20" y1="80" x2="800" y2="80" />
              <line x1="30" y1="240" x2="800" y2="240" />
              <line x1="50" y1="360" x2="800" y2="360" />
              <line x1="40" y1="430" x2="780" y2="430" />

              {/* Vertical / Angled Streets */}
              <line x1="160" y1="20" x2="160" y2="460" />
              <line x1="280" y1="20" x2="280" y2="460" />
              <line x1="430" y1="20" x2="430" y2="460" />
              <line x1="560" y1="20" x2="560" y2="460" />
              <line x1="690" y1="20" x2="690" y2="460" />
            </g>

            {/* Major Highway: Ferozpur Road (NH 5) Main Arterial */}
            <path
              d="M 30 430 L 780 70"
              fill="none"
              stroke={mapTheme === 'dark' ? '#2C4438' : '#D1C7B3'}
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              d="M 30 430 L 780 70"
              fill="none"
              stroke={mapTheme === 'dark' ? '#3B5949' : '#EDE6D7'}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Center Yellow Dividing Line on Ferozpur Road */}
            <path
              d="M 30 430 L 780 70"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              opacity="0.6"
            />

            {/* Landmark City Blocks & Complexes */}
            {/* Rajguru Nagar Market Block */}
            <g id="rajguru-nagar-block">
              <rect
                x="80"
                y="350"
                width="70"
                height="65"
                rx="8"
                fill={mapTheme === 'dark' ? '#1B2F25' : '#FFE4E6'}
                stroke="#DC2626"
                strokeWidth="2"
              />
              <text
                x="115"
                y="386"
                textAnchor="middle"
                fill="#DC2626"
                fontSize="8"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                RAJGURU NGR
              </text>
              <text
                x="115"
                y="398"
                textAnchor="middle"
                fill={mapTheme === 'dark' ? '#8CB89B' : '#65736C'}
                fontSize="7"
                fontFamily="sans-serif"
              >
                1st Floor Dining
              </text>
            </g>

            {/* Westend Mall / MBD Mall Landmark */}
            <rect
              x="260"
              y="280"
              width="50"
              height="35"
              rx="4"
              fill={mapTheme === 'dark' ? '#18271F' : '#E8DFCE'}
              stroke={mapTheme === 'dark' ? '#23382D' : '#D4C9B4'}
            />
            <text
              x="285"
              y="301"
              textAnchor="middle"
              fill={mapTheme === 'dark' ? '#6B8E7B' : '#8A978E'}
              fontSize="7"
              fontFamily="sans-serif"
            >
              MBD Mall
            </text>

            {/* PAU (Punjab Agricultural University) Campus indicator */}
            <rect
              x="360"
              y="60"
              width="140"
              height="80"
              rx="10"
              fill={mapTheme === 'dark' ? '#12231A' : '#E2EBDC'}
              stroke={mapTheme === 'dark' ? '#1A3326' : '#C7D9BE'}
            />
            <text
              x="430"
              y="105"
              textAnchor="middle"
              fill={mapTheme === 'dark' ? '#4E7F65' : '#5E8569'}
              fontSize="8"
              fontWeight="bold"
              fontFamily="sans-serif"
              letterSpacing="1"
            >
              PAU CAMPUS
            </text>

            {/* PLANNED ROUTE PATH (Inactive / Remaining Road) */}
            <path
              d={routePathD}
              fill="none"
              stroke={mapTheme === 'dark' ? '#2C493B' : '#BACDBF'}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="6 4"
            />

            {/* ACTIVE TRAVELED ROUTE (Glowing Green / Amber Path) */}
            <path
              d={traveledPathD}
              fill="none"
              stroke="url(#active-path-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#route-glow)"
            />

            {/* Milestone Waypoint Circles */}
            {ROUTE_POINTS.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={idx === 0 || idx === ROUTE_POINTS.length - 1 ? 4 : 2.5}
                fill={
                  idx === 0
                    ? '#C69234'
                    : idx === ROUTE_POINTS.length - 1
                    ? '#E11D48'
                    : mapTheme === 'dark'
                    ? '#3C5C4B'
                    : '#A2B9A9'
                }
              />
            ))}

            {/* RESTAURANT ORIGIN PIN (Rajguru Nagar, Ludhiana) */}
            <g transform={`translate(${ROUTE_POINTS[0].x}, ${ROUTE_POINTS[0].y})`}>
              {/* Pulse circle */}
              <circle cx="0" cy="0" r="16" fill="#C69234" opacity="0.2">
                <animate attributeName="r" values="10;22;10" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
              </circle>
              {/* Outer halo */}
              <circle cx="0" cy="0" r="13" fill="#143627" stroke="#C69234" strokeWidth="2.5" />
              {/* Center icon mark */}
              <circle cx="0" cy="0" r="5" fill="#C69234" />
            </g>

            {/* CUSTOMER DESTINATION PIN */}
            <g
              transform={`translate(${ROUTE_POINTS[ROUTE_POINTS.length - 1].x}, ${
                ROUTE_POINTS[ROUTE_POINTS.length - 1].y
              })`}
            >
              {/* Pulse circle */}
              <circle cx="0" cy="0" r="18" fill="#E11D48" opacity="0.2">
                <animate attributeName="r" values="12;26;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Pin body */}
              <path
                d="M 0 -22 C -8 -22 -12 -16 -12 -8 C -12 2 0 14 0 14 C 0 14 12 2 12 -8 C 12 -16 8 -22 0 -22 Z"
                fill="#E11D48"
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
              />
              <circle cx="0" cy="-10" r="4" fill="#FFFFFF" />
            </g>

            {/* LIVE MOVING DELIVERY RIDER MARKER */}
            <g
              transform={`translate(${currentRiderPos.point.x}, ${currentRiderPos.point.y})`}
              className="transition-transform duration-200 ease-linear"
            >
              {/* Pulsing Radar Ring around rider */}
              <circle cx="0" cy="0" r="22" fill="#10B981" opacity="0.25">
                <animate attributeName="r" values="14;28;14" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.05;0.6" dur="1.8s" repeatCount="indefinite" />
              </circle>

              {/* Rider Vehicle Beacon Base */}
              <circle
                cx="0"
                cy="0"
                r="16"
                fill="#143627"
                stroke="#10B981"
                strokeWidth="3"
                filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))"
              />

              {/* Heading Indicator Needle pointing towards road angle */}
              <g transform={`rotate(${currentRiderPos.angle})`}>
                <polygon points="0,-20 -5,-13 5,-13" fill="#10B981" />
              </g>

              {/* Vehicle Icon representation */}
              <circle cx="0" cy="0" r="9" fill="#FAF7F2" />
              <g transform="translate(-6, -6) scale(0.65)">
                <path
                  d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4"
                  fill="none"
                  stroke="#143627"
                  strokeWidth="2.5"
                />
                <circle cx="7" cy="17" r="2" fill="#143627" />
                <circle cx="17" cy="17" r="2" fill="#143627" />
              </g>
            </g>

            {/* Street Names / Road Labels Overlay */}
            <text
              x="290"
              y="260"
              fill={mapTheme === 'dark' ? '#7DA08F' : '#738378'}
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
              transform="rotate(-26, 290, 260)"
              letterSpacing="3"
            >
              FEROZPUR ROAD (NH 5)
            </text>

            <text
              x="520"
              y="185"
              fill={mapTheme === 'dark' ? '#7DA08F' : '#738378'}
              fontSize="9"
              fontFamily="sans-serif"
              transform="rotate(-26, 520, 185)"
              letterSpacing="2"
            >
              BHAI RANDHIR SINGH NAGAR
            </text>
          </svg>
        </div>

        {/* Floating Rider & Telemetry HUD Overlay (Top-Left) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 max-w-[280px] sm:max-w-xs">
          {/* Live Rider Badge */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-[#E6DEC8] p-3 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#143627] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  GS
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#143627]">{riderProfile.name}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">★ 4.9</span>
                </div>
                <p className="text-[10px] text-[#65736C] font-mono leading-tight">
                  {riderProfile.vehicle}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[9px] text-emerald-800 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Thermal Seal Box</span>
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${riderProfile.phone.replace(/\s+/g, '')}`}
              className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center transition-colors shrink-0 shadow-2xs"
              title="Call delivery rider"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Metrics Card */}
          <div className="rounded-2xl bg-[#143627]/95 backdrop-blur-md text-white p-2.5 px-3 shadow-lg border border-white/10 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C69234]" />
              <span>
                ETA: <strong className="text-emerald-300 text-xs">{estimatedMinsRemaining} mins</strong>
              </span>
            </div>
            <span className="text-white/40">|</span>
            <div>
              <span>Dist: <strong className="text-white">{remainingDistanceKm} km</strong></span>
            </div>
            <span className="text-white/40">|</span>
            <div className="font-mono text-emerald-300">
              {currentSpeedKmh} km/h
            </div>
          </div>
        </div>

        {/* Floating Telemetry Coordinates & Status (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white/90 text-[10px] font-mono border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>GPS: {currentLat}°N, {currentLng}°E</span>
          <span className="text-white/30">|</span>
          <span className="text-[#C69234]">Ferozpur Rd Corridor</span>
        </div>

        {/* Floating Controls: Play / Pause / Step Simulation (Bottom-Right) */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E6DEC8] p-1 shadow-lg">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="p-2 rounded-xl bg-[#143627] text-white hover:bg-[#235D43] transition-colors shadow-2xs flex items-center gap-1 text-[11px] font-bold"
            title={isPlaying ? 'Pause live GPS simulation' : 'Play live GPS simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => setProgress(0.05)}
            className="p-2 rounded-xl hover:bg-[#FAF7F2] text-[#143627] transition-colors"
            title="Restart from Laa Mamma Mia Kitchen"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#65736C]" />
          </button>

          {/* Speed multiplier toggle */}
          <button
            onClick={() => setSimSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
            className="px-2 py-1.5 rounded-xl text-[10px] font-bold text-[#143627] hover:bg-[#FAF7F2] border border-[#E6DEC8] transition-colors"
            title="Adjust simulation speed"
          >
            {simSpeed}x Speed
          </button>
        </div>
      </div>

      {/* Interactive Scrubbing Slider & Status Progression bar */}
      <div className="bg-[#FAF7F2] border-t border-[#E6DEC8] px-4 py-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#143627] font-bold text-[11px]">
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>{restaurantName || 'Laa Mamma Mia (Rajguru Nagar)'}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#65736C]">
            <span>Simulation scrubber:</span>
            <span className="font-bold text-[#143627] font-mono">{Math.round(progress * 100)}%</span>
          </div>

          <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[130px]">{destinationAddress.split(',')[0]}</span>
          </div>
        </div>

        {/* Route Scrubber Slider */}
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={(e) => {
              setProgress(parseFloat(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-2 bg-[#E6DEC8] rounded-lg appearance-none cursor-pointer accent-[#235D43]"
          />
        </div>

        {/* Route Stages Milestones */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-[10px]">
          <div className={`text-left ${progress >= 0.05 ? 'text-[#235D43] font-bold' : 'text-[#93A199]'}`}>
            1. Kitchen Dispatched
          </div>
          <div className={`text-center ${progress >= 0.35 ? 'text-[#235D43] font-bold' : 'text-[#93A199]'}`}>
            2. Ferozpur Rd Flyover
          </div>
          <div className={`text-center ${progress >= 0.7 ? 'text-[#235D43] font-bold' : 'text-[#93A199]'}`}>
            3. Sector Turn
          </div>
          <div className={`text-right ${progress >= 0.95 ? 'text-emerald-700 font-bold' : 'text-[#93A199]'}`}>
            4. At Doorstep
          </div>
        </div>
      </div>
    </div>
  );
};
