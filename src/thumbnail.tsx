// import thumbnail_data from './assets/mapping.json'
import { useState, useEffect } from 'react'
import type { Thumbnail } from "./types";
import type {SiteID, DecisionLabels} from "./App";


interface ThumbnailProps {
  mapName: MapName;
  thumbnailData: Thumbnail[];
  siteID: SiteID;
  activeThumbnails: string[];
  setActiveThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
  decision: Decision;
  decisionButton: DecisionLabels | "All"
}


interface Decision {
  [id: string] : DecisionLabels
}

// 
  

export type MapName = "event_thumbnail" | "mtz_thumbnail" | "fofc_thumbnail" | "overlay_thumbnail";
type MapGif = "event_gif" | "mtz_gif" | "fofc_gif" | "overlay_gif"


function ThumbnailCard({mapName, thumbnailData, siteID, activeThumbnails, setActiveThumbnails, decisionButton, decision} : ThumbnailProps){

  const toggleThumbnail = (id: string) => {
    setActiveThumbnails(previous => {
      if (previous.includes(id)) {
        return previous.filter(thumbnailId => thumbnailId !== id);
      }
      return [...previous, id];
    });
  };

  const activeGif : MapGif = 
    mapName === "mtz_thumbnail"
    ? "mtz_gif"
    : mapName === "fofc_thumbnail"
    ? "fofc_gif"
    : mapName === "overlay_thumbnail"
    ? "overlay_gif"
    : "event_gif";
  

    return thumbnailData
    .filter(thumbnail => siteID === "All" || thumbnail.site_idx === siteID)
    .filter(thumbnail => 
      decisionButton === "All"
        ? !(thumbnail.id in decision)
        : decision[thumbnail.id] === decisionButton)
    .map(thumbnail => (
        <button 
        key={thumbnail.id}
        className={`card ${activeThumbnails.includes(thumbnail.id) ? "active" : ""}`} onClick={() => toggleThumbnail(thumbnail.id)}>
        <img 
            src= {thumbnail[mapName]} 
            onMouseOver={(e) => e.currentTarget.src = thumbnail[activeGif]}
            onMouseOut={(e) => e.currentTarget.src = thumbnail[mapName]} 
            style={{
            width: "200px"
            }}/>
            <h3>{thumbnail.dtag}</h3>
            <h4> Event {thumbnail.event_idx}</h4>
        <div className="statistics">
            <p><b>Event score:</b> {thumbnail.z_peak}</p>
            <p><b>Build score:</b> {thumbnail.build_score}</p>
            <p><b>rfree/rwork:</b> {thumbnail.r_free}/{thumbnail.r_work}</p>
            <p><b>Resolution:</b> {thumbnail.analysed_resolution}</p>
        </div>
        </button>
    )
  );
}

export default ThumbnailCard;