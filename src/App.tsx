import { useState, useEffect } from 'react'
import './App.css'
import './thumnails.css'
import ThumbnailCard from './thumbnail'
import type {MapName} from './thumbnail'
import thumbnail_data from './assets/version2_mappings.json'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Divider, Button, Stack, Pagination } from '@mui/material'
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';




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
  {"label": "Event", "mapName": "eventmap_thumbnail"}, 
  {"label": "2FoFc", "mapName": "mtz_thumbnail"}, 
  {"label": "FoFc", "mapName": "fofc_thumbnail"}, 
  {"label": "Overlay", "mapName": "overlay_eventmap_fofc_thumbnail"},
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
  const [mapName, setMapName] = useState<MapName>("eventmap_thumbnail")
  const [siteID, setSiteID] = useState<SiteID>("All")
  const [activeIDButton, setActiveIDButton] = useState<SiteID>("All")
  const [activeMapButton, setActiveMapButton] = useState<MapName>("eventmap_thumbnail")
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
    title = `Decision - ${decisionButton}`;
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


  console.log(Math.max(...siteList.map(Number)))

  return (
    <div className='page-container'>
      <div className='top-container'>
        <div className='maps-container'>   
            <Tabs 
              className= "navigation-tabs"
              value = {activeMapButton} 
              onChange={(event, newMap) => {
                    setMapName(newMap)
                    setActiveMapButton(newMap)
                  }} 
              aria-label="Available maps"
              >
              {mapFileNames.map(mapName => (  
                <Tab 
                  key = {mapName.mapName}
                  label = {mapName.label} 
                  value = {mapName.mapName}
                />
                ))}
            </Tabs>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: '#9ca3af',
                margin: '10px 10px',
              }}
            />
            <Tabs 
              className= "navigation-tabs"
              value={activeActivityButton}
              onChange={(event, newActivity) => {
                setActiveActivityButton(newActivity)
              }}
              aria-label="Map behaviour"
              >
                {thumbnailActivityList.map(activityName => (
                  <Tab 
                    key = {activityName}
                    label = {activityName}
                    value = {activityName}
                  />
                  ))}
              </Tabs>

        </div>
        <div className='decision-container'>
          <Stack direction="row" spacing={2}
            sx= {{
              paddingRight: 5
            }}>
            {buttonList.map(buttonName => (
              <Button
                className="main-button"
                variant="outlined"
                key={`${buttonName}_decision`}
                onClick={() => {
                  handleDecisions(buttonName)
                  }
                }
                sx= {{
                  color: "white",
                  borderColor: "#646973",
                  "&:hover": {
                    borderColor: "#646973",
                    backgroundColor: "green"
                  }
                }}
                >{buttonName}</Button>
            ))}
          </Stack>
        </div>
      </div>
      <div className='main-container'>
        <Stack direction= "row" spacing={2} 
          sx= {{
            justifyContent: "center",
            paddingTop: 2,
            paddingBottom: 2
          }}>
          <Button
            key='all-button'
            variant={showDiv === "All" ? "contained" : "outlined"}
            onClick={() => {
              setShowDiv("All")
              setActiveIDButton("All")
              setSiteID("All")
              setDecisionButton("All")
            }}
            sx= {{
              color: "white",
              borderColor: "#646973",
              backgroundColor: showDiv === "All" ? "green" : "transparent",
              "&:hover": {
                borderColor: "#646973",
                backgroundColor: "green"
              },
              "&:active": {
                borderColor: "#646973",
                backgroundColor: "green"
              }
            }}
          >All</Button>
          <Button 
            key='site-list'
            variant={showDiv === "Site" ? "contained" : "outlined"}
            onClick={() => {
              setShowDiv("Site")
              setActiveIDButton(siteList[0])
              setSiteID(siteList[0])
              setDecisionButton("All")
            }}
            sx= {{
              color: "white",
              borderColor: "#646973",
              backgroundColor: showDiv === "Site" ? "green" : "transparent",
              "&:hover": {
                borderColor: "#646973",
                backgroundColor: "green"
              },
              "&:active": {
                borderColor: "#646973",
                backgroundColor: "green"
              }
            }}
            >Sites</Button>
          <Button 
              key='reviewed-list'
              variant={showDiv === "Reviewed" ? "contained" : "outlined"}
              onClick={() => {
                setShowDiv("Reviewed")
                setDecisionButton("Yes")
              }}
              sx= {{
              color: "white",
              borderColor: "#646973",
              backgroundColor: showDiv === "Reviewed" ? "green" : "transparent",
              "&:hover": {
                borderColor: "#646973",
                backgroundColor: "green"
              },
              "&:active": {
                borderColor: "#646973",
                backgroundColor: "green"
              }
            }}
              >Decision</Button>
        </Stack>
        <div className='sites-container' style={{ display: showDiv === "Site" ? "block" : "none"}}>
          
            <Stack spacing={2} sx = {{alignItems: "center"}}>
              <Pagination 
                count={Math.max(...siteList.map(Number))} 
                shape='rounded' 
                variant='outlined'
                siblingCount={4}
                onChange={(event, page) => {
                  setSiteID(page);
                  setActiveIDButton(page)
                  setDecisionButton("All")
                }}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                    borderColor: "#646973",
                  },

                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "green",
                    color: "white",
                    borderColor: "#646973",
                  },
                }}/>

            </Stack>
          </div>
          <div className='reviewed-container' style={{ display: showDiv === "Reviewed" ? "block" : "none" }}>
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


