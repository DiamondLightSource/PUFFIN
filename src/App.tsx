import { useState, useEffect } from 'react'
import './App.css'
import './thumnails.css'
import ThumbnailCard from './thumbnail'
import type {MapName} from './thumbnail'
import thumbnail_data from './assets/mappings2.json'


const originalThumbnailData = Object.values(thumbnail_data)
const thumbnailData = originalThumbnailData.map((thumbnail) => ({
  ...thumbnail,
  id: `${thumbnail.dtag}_${thumbnail.event_idx}`
}))


type MapLabels = "Event" | "2FoFc" | "FoFc" | "Overlay" | "Surrounds"
export type DecisionLabels = "Yes" | "No" | "Review"
export type ThumbnailActivityLabels = "Rock" | "Contour"


interface mapFile {
  mapName: MapName,
  label: MapLabels
}

const mapFileNames: mapFile[] = [
  {"label": "Event", "mapName": "event_thumbnail"}, 
  {"label": "2FoFc", "mapName": "mtz_thumbnail"}, 
  {"label": "FoFc", "mapName": "fofc_thumbnail"}, 
  {"label": "Overlay", "mapName": "overlay_thumbnail"},
  {"label": "Surrounds", "mapName": "clash_thumbnail"}
]

export type SiteID = number | string



const siteData = thumbnailData.map(item => item.site_idx)
const siteList: SiteID[] = [... new Set(siteData)]
const buttonList: DecisionLabels[] = ["Yes", "Review", "No"]
const thumbnailActivityList: ThumbnailActivityLabels[] = ["Rock", "Contour"]



thumbnailData.sort((a, b) => b.event_score - a.event_score)
let title: string = '';


export default function MyApp() {
  const [mapName, setMapName] = useState<MapName>("event_thumbnail")
  const [siteID, setSiteID] = useState<SiteID>("All")
  const [activeIDButton, setActiveIDButton] = useState<SiteID>("All")
  const [activeMapButton, setActiveMapButton] = useState<MapName>("event_thumbnail")
  const [activeActivityButton, setActiveActivityButton] = useState<ThumbnailActivityLabels>("Rock")
  const [activeThumbnails, setActiveThumbnails] = useState<string[]>([]);
  const [decision, setDecision] = useState<Record<string, DecisionLabels>>({})
  const [decisionButton, setDecisionButton] = useState<DecisionLabels | "All">("All")
  const [showDiv, setShowDiv] = useState<"All" | "Site" | "Reviewed">("All")
  

  const applyDecision = (decision: DecisionLabels, activeThumbnailsArray: string[]) => {
    setDecision(previous => {
      const updated = { ...previous };

      activeThumbnailsArray.forEach(id => {
        updated[id] = decision;
      });

      return updated;
    });
  };


  const handleDecisions = (decision: DecisionLabels) => {
    const currentSelectedThumbnails = activeThumbnails;
    applyDecision(decision, currentSelectedThumbnails);
    setActiveThumbnails([]);
  };

  const handleReset = () => {
    setShowDiv("All")
    setDecisionButton("All");
    setActiveIDButton("All");
    setSiteID("All");
    setActiveThumbnails([]);
    setDecision({});
    downloadDecisionJSON();
  }


  if (siteID === "All" && decisionButton === "All") {
    title = ""
  } else if (decisionButton !== "All") {
    title = `Reviewed - ${decisionButton}`;
  } else {
    title = `Site ${siteID}`;
  }

  const downloadDecisionJSON = () => {
    const blob = new Blob(
      [JSON.stringify(decision, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "decision.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className='top-container'>
        <div className='controls-container'>
          <div className='maps-container'>
            <h3>Maps</h3>
            {mapFileNames.map(mapName => (
              <button 
              key={mapName.label}
              className={`main-button ${activeMapButton === mapName.mapName ? "active" : ""}`} type="button" 
              onClick={() => {
                setMapName(mapName.mapName)
                setActiveMapButton(mapName.mapName)
              }}>{mapName.label}</button>
            ))}
          </div>
          <div>
            <h3>Action</h3>
            {thumbnailActivityList.map(activityName => (
              <button
              key={activityName}
              className={`main-button ${activeActivityButton === activityName ? "active" : ""}`} type="button" 
              onClick={() => {
                setActiveActivityButton(activityName)
              }}
              >{activityName}</button>
            ))}
            
          </div>
        </div>
        <div className='decision-container'>
          <h3>Decision</h3>  
          {buttonList.map(buttonName => (
            <button 
            key={`${buttonName}_decision`}
            className="main-button" 
            onClick={() => {
              handleDecisions(buttonName)
            }
            }>{buttonName}</button>
          ))}
        </div>
      </div>
      <div className='main-container'>
        <button
        key='all-button'
        className={`main-button ${showDiv === "All" ? "active" : ""}`} type="button" 
          onClick={() => {
            setShowDiv("All")
            setActiveIDButton("All")
            setSiteID("All")
            setDecisionButton("All")
          }}
        >All</button>
        <button 
          key='site-list'
          className={`main-button ${showDiv === "Site" ? "active" : ""}`} type="button" 
          onClick={() => {
            setShowDiv("Site")
            setActiveIDButton(siteList[0])
            setSiteID(siteList[0])
            setDecisionButton("All")
          }}
          >Sites</button>
        <button 
            key='reviewed-list'
            className={`main-button ${showDiv === "Reviewed" ? "active" : ""}`} type="button" 
            onClick={() => {
              setShowDiv("Reviewed")
              setDecisionButton("Yes")
            }}
            >Reviewed</button>
        <div className='sites-container' style={{ display: showDiv === "Site" ? "block" : "none" }}>
            {/* <h3>Sites</h3> */}
            {siteList.map(siteID => (
              <button 
              key={siteID}
              className={`main-button ${activeIDButton === siteID && decisionButton === "All" ? "active" : ""}`} type="button" 
              onClick={() => {
                setSiteID(siteID);
                setActiveIDButton(siteID)
                setDecisionButton("All")
              }}>{siteID}</button>
            ))}
          </div>
          <div className='reviewed-container' style={{ display: showDiv === "Reviewed" ? "block" : "none" }}>
            {/* <h3>Reviewed</h3> */}
            {buttonList.map(buttonName => (
              <button 
              key={`${buttonName}_review`}
              className={`main-button ${decisionButton === buttonName ? "active" : ""}`} 
              onClick={() => {
                setDecisionButton(buttonName)
                setSiteID("All")}
            }>{buttonName}</button>
          ))}
        </div>
        <h1>{title}</h1>
        <div className='thumbnail-container'>
        <ThumbnailCard 
        mapName={mapName} 
        thumbnailData={thumbnailData} 
        siteID={siteID}
        activeThumbnails={activeThumbnails}
        setActiveThumbnails={setActiveThumbnails}
        activeActivityButton={activeActivityButton}
        decision={decision}
        decisionButton={decisionButton}/>
        </div>      
      </div>
      <button
      key="reset"
      className='main-button'
      onClick={() => handleReset()}>Reset</button>
    </div>
  );
}

