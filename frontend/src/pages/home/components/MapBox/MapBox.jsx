// import * as React from 'react'
// import Map, {Marker, NavigationControl, FullscreenControl} from 'react-map-gl'
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Fix lỗi không hiển thị marker mặc định
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "./MapBox.module.css";

// Phiên bản hiện tại đang sử dụng Open Street Map mô phỏng thay vì
// MapBox( vì nó miễn phí:))
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// Icon riêng cho vị trí user (xanh dương)
const userIcon = L.divIcon({
  className: styles.userMarker,
  html: '<div class="user-marker-pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Thông tin token, khi hoàn thành tích hợp api thì chuyển nó thành
// token thật
const MAPBOX_TOKEN = "MAPBOX_ACCESS_TOKEN";

// Default vị trí (Hà Nội) nếu chưa có GPS
const DEFAULT_POSITION = [21.0285, 105.8542];

// Component con để di chuyển map khi vị trí thay đổi
function MapUpdater({ center }) {
  const map = useMap();
  if (center) {
    map.setView(center, map.getZoom());
  }
  return null;
}

// phiên bản sử dụng Open Street map
export function TravelMap({ userPosition }) {
  const center = userPosition
    ? [userPosition.lat, userPosition.lng]
    : DEFAULT_POSITION;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "1.25em",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          className={"leaflet-attribution-flag leaflet-control-attribution"}
        />

        {/* Di chuyển map theo vị trí user */}
        <MapUpdater center={center} />

        {/* Marker vị trí hiện tại của user */}
        {userPosition && (
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={userIcon}
          >
            <Popup>
              📍 Vị trí của bạn
              <br />
              <small>{userPosition.lat.toFixed(5)}, {userPosition.lng.toFixed(5)}</small>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
// phần bản đồ hiển thị
// export function TravelMap(props) {
//     // hook chứa các thông tin về vị trí được chọn hiện tại trên bản đò
//     // nên sử dụng context để thuận tiện giao tiếp giữa các thành phần
//     const [viewState, setViewState] = React.useState({
//         // Tọa độ ở Hà Nội
//         longtitude: 105.8342,
//         latitude: 21.0278,
//         zoom: 13,
//         pitch: 45,
//     });
//     return (
//         <div>
//             <Map
//                 {...viewState}
//                 onMove={evt => setViewState(evt.viewState)}
//                 mapStyle='mapbox://styles/mapbox/streets-v12'
//                 mapboxApiAccessToken={MAPBOX_TOKEN}
//                 terrain={{source: 'mapbox-dem', exageration: 1.5}}
//             >
//                 <NavigationControl position='top-right' />
//                 <FullscreenControl position='top-right' />
//             </Map>  {/* 3D */}
//         </div>
//     )
// }
