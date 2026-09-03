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
          <div className='thumbnail-images'>
            { thumbnail[activeGif] && (
            <svg  className="play-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
              fill="#000000" viewBox="0 0 24 24" >
              {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
              <path d="M6.51 18.87c.15.09.32.13.49.13s.36-.05.51-.14l10-6c.3-.18.49-.51.49-.86s-.18-.68-.49-.86l-10-6a.99.99 0 0 0-1.01-.01c-.31.18-.51.51-.51.87v12c0 .36.19.69.51.87Z"></path>
            </svg> )}
          <img 
              src= {thumbnail[mapName]} 
              onMouseOver={thumbnail[activeGif] ? (e) => e.currentTarget.src = thumbnail[activeGif] : undefined}
              onMouseOut={(e) => e.currentTarget.src = thumbnail[mapName]} 
              style={{
              width: "200px"
              }}/>
            </div>
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