import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useDangerTracking — Custom hook kết nối frontend với backend danger warning.
 *
 * Luồng hoạt động:
 * 1. Lấy vị trí GPS của user qua Browser Geolocation API
 * 2. Mở WebSocket tới backend /ws/tracking
 * 3. Gửi tọa độ mỗi 30 giây (hoặc khi vị trí thay đổi đáng kể)
 * 4. Nhận cảnh báo nguy hiểm từ backend
 *
 * @returns {{ alerts, isDanger, placeName, userPosition, isConnected, error }}
 */

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";
const SEND_INTERVAL = 30000; // 30 giây
const MIN_DISTANCE_CHANGE = 0.0005; // ~50m — gửi lại nếu di chuyển xa hơn

function useDangerTracking() {
  const [alerts, setAlerts] = useState([]);
  const [isDanger, setIsDanger] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const lastSentRef = useRef(null); // tọa độ gửi lần cuối
  const intervalRef = useRef(null);
  const positionRef = useRef(null); // vị trí hiện tại (dùng trong interval)

  // Kiểm tra tọa độ đã thay đổi đáng kể chưa
  const hasMovedEnough = useCallback((newPos) => {
    if (!lastSentRef.current) return true;
    const dLat = Math.abs(newPos.lat - lastSentRef.current.lat);
    const dLng = Math.abs(newPos.lng - lastSentRef.current.lng);
    return dLat > MIN_DISTANCE_CHANGE || dLng > MIN_DISTANCE_CHANGE;
  }, []);

  // Gửi tọa độ qua WebSocket
  const sendPosition = useCallback(
    (pos) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && pos) {
        const payload = { lat: pos.lat, lng: pos.lng };
        wsRef.current.send(JSON.stringify(payload));
        lastSentRef.current = pos;
        console.log("[DangerTracking] Sent:", payload);
      }
    },
    []
  );

  useEffect(() => {
    // ── 1. Kết nối WebSocket ──
    function connectWebSocket() {
      const ws = new WebSocket(`${WS_URL}/ws/tracking`);

      ws.onopen = () => {
        console.log("[DangerTracking] WebSocket connected");
        setIsConnected(true);
        setError(null);

        // Gửi vị trí ngay khi kết nối
        if (positionRef.current) {
          sendPosition(positionRef.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("[DangerTracking] Received:", data);

          setIsDanger(data.is_danger || false);
          setPlaceName(data.place_name || "");
          setAlerts(data.alerts || []);
        } catch (e) {
          console.error("[DangerTracking] Parse error:", e);
        }
      };

      ws.onclose = () => {
        console.log("[DangerTracking] WebSocket disconnected");
        setIsConnected(false);

        // Auto-reconnect sau 5 giây
        setTimeout(() => {
          console.log("[DangerTracking] Reconnecting...");
          connectWebSocket();
        }, 5000);
      };

      ws.onerror = (e) => {
        console.error("[DangerTracking] WebSocket error:", e);
        setError("Không thể kết nối tới server cảnh báo");
      };

      wsRef.current = ws;
    }

    connectWebSocket();

    // ── 2. Theo dõi vị trí GPS ──
    let watchId = null;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPosition(newPos);
          positionRef.current = newPos;

          // Gửi ngay nếu di chuyển đáng kể
          if (hasMovedEnough(newPos)) {
            sendPosition(newPos);
          }
        },
        (err) => {
          console.error("[DangerTracking] Geolocation error:", err);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError("Bạn cần cho phép truy cập vị trí để nhận cảnh báo");
              break;
            case err.POSITION_UNAVAILABLE:
              setError("Không thể xác định vị trí của bạn");
              break;
            case err.TIMEOUT:
              setError("Quá thời gian chờ vị trí");
              break;
            default:
              setError("Lỗi không xác định khi lấy vị trí");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    } else {
      setError("Trình duyệt không hỗ trợ Geolocation");
    }

    // ── 3. Gửi định kỳ mỗi 30 giây ──
    intervalRef.current = setInterval(() => {
      if (positionRef.current) {
        sendPosition(positionRef.current);
      }
    }, SEND_INTERVAL);

    // ── Cleanup ──
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // tránh auto-reconnect khi unmount
        wsRef.current.close();
      }
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sendPosition, hasMovedEnough]);

  return {
    alerts,
    isDanger,
    placeName,
    userPosition,
    isConnected,
    error,
  };
}

export default useDangerTracking;
