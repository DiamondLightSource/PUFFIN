// import thumbnail_data from './assets/mapping.json'
import { useState, useEffect } from 'react'
import type { Thumbnail } from "./types";
import type {SiteID, DecisionLabels, ThumbnailActivityLabels} from "./App";


interface ThumbnailProps {
  mapName: MapName;
  thumbnailData: Thumbnail[];
  siteID: SiteID;
  activeThumbnails: string[];
  setActiveThumbnails: React.Dispatch<React.SetStateAction<string[]>>;
  activeActivityButton: ThumbnailActivityLabels;
  decision: Decision;
  decisionButton: DecisionLabels | "All"
}


interface Decision {
  [id: string] : DecisionLabels
}

  

export type MapName = "event_thumbnail" | "mtz_thumbnail" | "fofc_thumbnail" | "overlay_thumbnail" | "clash_thumbnail";
type MapGif = "event_gif" | "mtz_gif" | "fofc_gif" | "overlay_gif" | "clash_gif" | "event_contour_thumbnail" | "mtz_contour_thumbnail" | "no_gif"


function ThumbnailCard({mapName, thumbnailData, siteID, activeThumbnails, setActiveThumbnails, activeActivityButton, decisionButton, decision} : ThumbnailProps){

  const toggleThumbnail = (id: string) => {
    setActiveThumbnails(previous => {
      if (previous.includes(id)) {
        return previous.filter(thumbnailId => thumbnailId !== id);
      }
      return [...previous, id];
    });
  };



  const activeGif : MapGif = 
    mapName === "mtz_thumbnail" && activeActivityButton === "Rock"
    ? "mtz_gif"
    : mapName === "mtz_thumbnail" && activeActivityButton === "Contour"
    ? "mtz_contour_thumbnail"
    : mapName === "fofc_thumbnail" && activeActivityButton === "Rock"
    ? "fofc_gif"
    : mapName === "overlay_thumbnail" && activeActivityButton === "Rock"
    ? "overlay_gif"
    : mapName === "clash_thumbnail" && activeActivityButton === "Rock"
    ? "clash_gif"
    : mapName === "event_thumbnail" && activeActivityButton === "Contour"
    ? "event_contour_thumbnail"
    : mapName === "event_thumbnail" && activeActivityButton === "Rock"
    ? "event_gif"
    : "no_gif";
  
  const getReadableMapName = (nameOfMap : MapName) => {
    if (nameOfMap === "event_thumbnail") {
      return "Event map "
    } else if (nameOfMap === "mtz_thumbnail") {
      return "2FoFc map "
    } else if (nameOfMap === "fofc_thumbnail") {
      return "FoFc map "
    } else if (nameOfMap === "overlay_thumbnail") {
      return "Overlay of event map, 2FoFc map and FoFc map "
    } else {
      return "Event map with residues, solvents etc within 3 Angstrom radius "
    }
  }


  const getRfreeRworkStatus = (rwork : number, rfree : number, resolution : number) => {
    let rworkStatus = null
    let rfreeStatus = null
    let rdiffStatus = null
    if (resolution < 2.5) {
      if (rwork <= 0.22) {
        rworkStatus = "good" 
      } else if (rwork >= 0.22 && rwork <= 0.26) {
        rworkStatus = "ok"
      } else {
        rworkStatus = "bad"
      }

      if (rfree <= 0.27) {
        rfreeStatus = "good"
      } else if (rfree >= 0.27 && rfree <= 0.32) {
        rfreeStatus = "ok"
      } else {
        rfreeStatus = "bad"
      }

    } else if (resolution >= 2.5 && resolution < 3) {
      if (rwork <= 0.25) {
        rworkStatus = "good" 
      } else if (rwork >= 0.25 && rwork <= 0.29) {
        rworkStatus = "ok"
      } else {
        rworkStatus = "bad"
      }

      if (rfree <= 0.3) {
        rfreeStatus = "good"
      } else if (rfree >= 0.3 && rfree <= 0.34) {
        rfreeStatus = "ok"
      } else {
        rfreeStatus = "bad"
      }
      
    } else {
      if (rwork <= 0.28) {
        rworkStatus = "good" 
      } else if (rwork >= 0.28 && rwork <= 0.33) {
        rworkStatus = "ok"
      } else {
        rworkStatus = "bad"
      }

      if (rfree <= 0.33) {
        rfreeStatus = "good"
      } else if (rfree >= 0.33 && rfree <= 0.38) {
        rfreeStatus = "ok"
      } else {
        rfreeStatus = "bad"
      }
    }
    
    if (rwork - rfree <= 0.05) {
      rdiffStatus = "good"
    } else if (rwork - rfree > 0.05 && rwork - rfree <= 0.08) {
      rdiffStatus = "ok"
    } else {
      rdiffStatus = "bad"
    }

    if (rworkStatus === "bad" || rfreeStatus === "bad" || rdiffStatus === "bad") {
      return "bad"
    } else if (rworkStatus === "ok" || rfreeStatus === "ok" || rdiffStatus === "ok") {
      return "ok"
    } else {
      return "good"
    }
  }




  const scoreSvg = (scoreType : string, activeStatus : boolean) => {
    let colour = "white"
    if (activeStatus === false){
      if (scoreType === "good") {
        colour = "#4cbb17"
      } else if (scoreType === "ok") {
        colour = "orange"
      } else {
        colour = "#ff2800"
      }
    }

     if (scoreType === "good") {
      return  <svg  className = "warning-label" xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill={colour} viewBox="0 0 24 24" >
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m-1.29 13.71c-.2.2-.45.29-.71.29s-.51-.1-.71-.29l-3-3L7.7 11.3l2.29 2.29 5.29-5.29 1.41 1.41-6 6Z"></path>
              </svg>
    } else if (scoreType === "ok") {
      return <svg  className = "warning-label" xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill={colour} viewBox="0 0 24 24" >
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m5 11H7v-2h10z"></path>
              </svg>
    } else {
      return <svg  className = "warning-label" xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
              fill={colour} viewBox="0 0 24 24" >
              {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
              <path d="M19.07 19.07c3.9-3.9 3.9-10.24 0-14.14C17.18 3.04 14.67 2 12 2S6.82 3.04 4.93 4.93c-3.9 3.9-3.9 10.24 0 14.14 1.95 1.95 4.51 2.92 7.07 2.92s5.12-.98 7.07-2.92M7.76 14.83 10.59 12 7.76 9.17l1.41-1.41L12 10.59l2.83-2.83 1.41 1.41L13.41 12l2.83 2.83-1.41 1.41L12 13.41l-2.83 2.83z"></path>
            </svg>
    }

  }



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
              tabIndex={0}
              src= {thumbnailSrc} 
              alt = {`${getReadableMapName(mapName)} for ${thumbnail.dtag} event ${thumbnail.event_idx}`}
              onMouseEnter={gifSrc ? (e) => {e.currentTarget.src = gifSrc;}: undefined}
              onMouseOut={(e) => {e.currentTarget.src = thumbnailSrc;}} 
              onFocus={gifSrc ? (e) => {e.currentTarget.src = gifSrc;}: undefined}
              onBlur={(e) => {e.currentTarget.src = thumbnailSrc;}}
              style={{
              width: "200px"
              }}/>
            </div>
            <h3>{thumbnail.dtag} #{thumbnail.event_idx} </h3>
        <div className="statistics">

            { thumbnail["clash_thumbnail"] && ( <div className='clash-warning'>
              <svg  className={`warning-label ${activeThumbnails.includes(thumbnail.id) ? "active-warning" : ""}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16"  
                fill="#ff2800" viewBox="0 0 24 24" >
                {/* Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free */}
                <path d="M12.87 2.51c-.35-.63-1.4-.63-1.75 0l-9.99 18c-.17.31-.17.69.01.99.18.31.51.49.86.49h20c.35 0 .68-.19.86-.49a1 1 0 0 0 .01-.99zM13 19h-2v-2h2zm0-4h-2V9h2z"></path>
              </svg>
              <p className={`clash-warning-label ${activeThumbnails.includes(thumbnail.id) ? "active-warning" : ""}`}><b>Clash or close contact</b></p>
            </div> )}
            <div className="row">
              <div className='score-info'>
                {thumbnail.event_score >= 0.9 ? scoreSvg("good", activeThumbnails.includes(thumbnail.id) ? true : false) :
                  (thumbnail.event_score >= 0.8 && thumbnail.event_score < 0.9) ? scoreSvg("ok", activeThumbnails.includes(thumbnail.id) ? true : false) :
                  scoreSvg("bad", activeThumbnails.includes(thumbnail.id) ? true : false)}
                {/* eventScoreSvg(thumbnail.event_score, activeThumbnails.includes(thumbnail.id) ? true : false) */}
                <p><b>Event:</b> {Math.round(thumbnail.event_score * 100) / 100}</p>
              </div>
              <div>
                <p><b>Build:</b> {Math.round(thumbnail.build_score * 100) / 100}</p>
              </div>
            </div>
            <div className="row">
              <div className='score-info'>
                {scoreSvg(getRfreeRworkStatus(thumbnail.r_work, thumbnail.r_free, thumbnail.analysed_resolution), activeThumbnails.includes(thumbnail.id) ? true : false)}
                <p><b>rw/rf:</b> {thumbnail.r_work}/{thumbnail.r_free}</p>
              </div>
              <div className="score-info">
                {thumbnail.analysed_resolution < 2.5 ? scoreSvg("good", activeThumbnails.includes(thumbnail.id) ? true : false) : 
                (thumbnail.analysed_resolution >= 2.5 && thumbnail.analysed_resolution < 3)? scoreSvg("ok", activeThumbnails.includes(thumbnail.id) ? true : false) : 
                scoreSvg("bad", activeThumbnails.includes(thumbnail.id) ? true : false)}
                <p><b>Res.:</b> {thumbnail.analysed_resolution}</p>
              </div>
            </div>
        </div>
        </button>
      )
    }
  );
}

export default ThumbnailCard;