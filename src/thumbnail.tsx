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
  

export type MapName = "event_thumbnail" | "mtz_thumbnail" | "fofc_thumbnail" | "overlay_thumbnail" | "clash_thumbnail";
type MapGif = "event_gif" | "mtz_gif" | "fofc_gif" | "overlay_gif" | "clash_gif"


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
    : mapName === "clash_thumbnail"
    ? "clash_gif"
    : "event_gif";
  

    return thumbnailData
    .filter(thumbnail => siteID === "All" || thumbnail.site_idx === siteID)
    .filter(thumbnail => 
      decisionButton === "All"
        ? !(thumbnail.id in decision)
        : decision[thumbnail.id] === decisionButton)
    .map(thumbnail => {  
      const thumbnailSrc = thumbnail[mapName] ?? thumbnail["event_thumbnail"];
      const gifSrc = thumbnail[activeGif];
      return(
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
              src= {thumbnailSrc} 
              onMouseEnter={gifSrc ? (e) => {e.currentTarget.src = gifSrc;}: undefined}
              onMouseOut={(e) => {e.currentTarget.src = thumbnailSrc;}} 
              style={{
              width: "200px"
              }}/>
            </div>
            <h3>{thumbnail.dtag}</h3>
            <h4> Event {thumbnail.event_idx}</h4>
        <div className="statistics">

            { thumbnail["clash_thumbnail"] && ( <div className='clash-warning'>
              <svg  className="warning-label" xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill="#bb2124" viewBox="0 0 24 24" >
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M12.87 2.51c-.35-.63-1.4-.63-1.75 0l-9.99 18c-.17.31-.17.69.01.99.18.31.51.49.86.49h20c.35 0 .68-.19.86-.49a1 1 0 0 0 .01-.99zM13 19h-2v-2h2zm0-4h-2V9h2z"></path>
              </svg>
              <p className='clash-warning-label'><b>Clash or close contact</b></p>
            </div> )}
            <p><b>Event score:</b> {thumbnail.z_peak}</p>
            <p><b>Build score:</b> {thumbnail.build_score}</p>
            <p><b>rfree/rwork:</b> {thumbnail.r_free}/{thumbnail.r_work}</p>
            <p><b>Resolution:</b> {thumbnail.analysed_resolution}</p>
        </div>
        </button>
      )
    }
  );
}

export default ThumbnailCard;