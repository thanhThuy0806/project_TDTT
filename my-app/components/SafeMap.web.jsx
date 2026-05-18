import React from "react";

export default function SafeMap({ latitude, longitude }) {
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.005}%2C${latitude - 0.005}%2C${longitude + 0.005}%2C${latitude + 0.005}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  
  return (
    <iframe
      src={osmUrl}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0,
      }}
      title="Safety Map Web"
    />
  );
}