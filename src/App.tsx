import { useState, useRef, useEffect } from 'react'
import './App.css'
import './thumnails.css'
import type { Thumbnail } from "./types";
import ThumbnailCard from './thumbnail'
import HelpSection from './help';
import type {MapName} from './thumbnail'
import thumbnail_data from './assets/northern_mappings.json'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Divider, Button, Stack, Pagination, Typography } from '@mui/material'
import { FeedbackForm } from './form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';




const originalThumbnailData = Object.values(thumbnail_data)
const thumbnailData = originalThumbnailData.map((thumbnail) => ({
  ...thumbnail,
  id: `${thumbnail.dtag}_${thumbnail.event_idx}`
}))


type MapLabels = "Event" | "2FoFc" | "FoFc" | "Overlay" | "Surrounds"
export type DecisionLabels = "Yes" | "No" | "Review"
export type ThumbnailActivityLabels = "Contour" | "Rock" 


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
const thumbnailActivityList: ThumbnailActivityLabels[] = ["Contour", "Rock"]



thumbnailData.sort((a, b) => b.event_score - a.event_score)
let title: string = '';


export default function MyApp() {
  const [mapName, setMapName] = useState<MapName>("eventmap_thumbnail")
  const [siteID, setSiteID] = useState<SiteID>("All")
  const [activeMapButton, setActiveMapButton] = useState<MapName>("eventmap_thumbnail")
  const [activeActivityButton, setActiveActivityButton] = useState<ThumbnailActivityLabels>("Contour")
  const [activeThumbnails, setActiveThumbnails] = useState<string[]>([]);
  const [decision, setDecision] = useState<Record<string, DecisionLabels>>({})
  const [decisionButton, setDecisionButton] = useState<DecisionLabels | "All">("All")
  const [showDiv, setShowDiv] = useState<"All" | "Site" | "Reviewed">("All")
  const [showContent, setShowContent] = useState<"Introduction" | "MainContent" | "Help" | "Feedback">("Introduction")
  const [startTime, setStartTime] = useState<number>()
  const [analysisTime, setAnalysisTime] = useState<number>()
  const mapStartTime = useRef<number | null>(null)
  const gifStartTime = useRef<number | null>(null)
  const [gifViewTimes, setGifViewTimes] = useState({
    "eventmap_gif": 0, 
    "mtz_gif": 0, 
    "fofc_gif": 0, 
    "overlay_eventmap_fofc_gif": 0, 
    "clash_gif": 0, 
    "eventmap_contour_gif": 0, 
    "mtz_contour_gif": 0, 
    "clash_contour_gif": 0,
    "no_gif": 0
  })

  const [gifViewCounts, setGifViewCounts] = useState({
    "eventmap_gif": 0, 
    "mtz_gif": 0, 
    "fofc_gif": 0, 
    "overlay_eventmap_fofc_gif": 0, 
    "clash_gif": 0, 
    "eventmap_contour_gif": 0, 
    "mtz_contour_gif": 0, 
    "clash_contour_gif": 0,
    "no_gif": 0
  })
  const [formData, setFormData] = useState({
    "years-experience": "No experience",
    "usefulness": "Neutral",
    "missing": null,
    "general-feedback": null
  });
  const [viewTimes, setViewTimes] = useState({
    "eventmap_thumbnail" : 0,
    "mtz_thumbnail" : 0,
    "fofc_thumbnail" : 0,
    "overlay_eventmap_fofc_thumbnail" : 0,
    "clash_thumbnail" : 0
  })
  const [mapCounts, setMapCounts] = useState({
    "eventmap_thumbnail" : 1,
    "mtz_thumbnail" : 0,
    "fofc_thumbnail" : 0,
    "overlay_eventmap_fofc_thumbnail" : 0,
    "clash_thumbnail" : 0
  })
  
  const startGifTimer = (activeGif: string) => {
    // Finish timing the previous view
    if (gifStartTime.current !== null) {

      const elapsed = Date.now() - gifStartTime.current;

      setGifViewTimes(prev => ({
        ...prev,
        [activeGif]:
          prev[activeGif] + elapsed
      }));
    }

    // Start timing the new view
    gifStartTime.current = Date.now();
  }
  
  
  const finishGifTimer = (activeGif: string) => {

    if (gifStartTime.current !== null) {

      const elapsed = Date.now() - gifStartTime.current;

      setGifViewTimes(prev => ({
        ...prev,
        [activeGif]:
          prev[activeGif] + elapsed
      }));

      gifStartTime.current = null;
    }
  };
    
  const updateGifCounts = (activeGif: string) => {
    setGifViewCounts(prev => ({
      ...prev,
      [activeGif]: (prev[activeGif] ?? 0) + 1
    }))
  }


  const startMapTimer = () => {
    // Finish timing the previous view
    if (mapStartTime.current !== null) {

      const elapsed = Date.now() - mapStartTime.current;

      setViewTimes(prev => ({
        ...prev,
        [activeMapButton]:
          prev[activeMapButton] + elapsed
      }));
    }

    // Start timing the new view
    mapStartTime.current = Date.now();
  }


  const finishMapTimer = () => {

    if (mapStartTime.current !== null) {

      const elapsed = Date.now() - mapStartTime.current;

      setViewTimes(prev => ({
        ...prev,
        [activeMapButton]:
          prev[activeMapButton] + elapsed
      }));

      mapStartTime.current = null;
    }
  };
  
  const updateMapCounts = (activeMap: string) => {
    setMapCounts(prev => ({
      ...prev,
      [activeMap]: (prev[activeMap] ?? 0) + 1
    }))
  }


  const validateTextField = (value) => {
    const regex = /^[\p{L}\p{N}\p{P}\p{Z}\p{S}\r\n]*$/u;
    return regex.test(value);
  };


  const validateFormField = (e) => {
    const validExperience = [
      "No experience", "Less than a year", "1 - 2 years",
      "3 - 5 years", "More than 5 years"
    ]

    const validUsefulness = [
      "Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"
    ]
      if (e.target.name === "missing" || e.target.name === "general-feedback") {
          if (e.target.value.length < 2000 && validateTextField(e.target.value) === true) {
              return true
          } else {
              return false
          }

      } else if (e.target.name === "usefulness"){
          return validUsefulness.includes(e.target.value)
          
      } else if (e.target.name === "years-experience") {
          return validExperience.includes(e.target.value)

      } else {
          return false
      }
  }

  const handleChange = (e) => {
    const updatedForm= {
        ...formData,
        [e.target.name]: e.target.value
    };

    if (!e.target.name) {
        console.warn("Form field is missing a name attribute:", e.target);
        return;
    }
    
    if (validateFormField(e) === true){
        setFormData(updatedForm);
    }

    return;

  };

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
    if (analysisTime != null) {
        downloadDecisionJSON(analysisTime, formData, viewTimes, mapCounts, gifViewTimes, gifViewCounts);
      } else {
        downloadDecisionJSON(null, formData, viewTimes, mapCounts, gifViewTimes, gifViewCounts)
      }
      
      setShowContent("Introduction")
    
    setShowDiv("All")
    setDecisionButton("All");
    // setActiveIDButton("All");
    setSiteID("All");
    setActiveThumbnails([]);
    setDecision({});
    setFormData({
      "years-experience": "No experience",
      "usefulness": "Neutral",
      "general-feedback": null,
      "missing": null})
    setMapCounts({
      "eventmap_thumbnail" : 1,
      "mtz_thumbnail" : 0,
      "fofc_thumbnail" : 0,
      "overlay_eventmap_fofc_thumbnail" : 0,
      "clash_thumbnail" : 0
    })
    mapStartTime.current = null
    setViewTimes({
      "eventmap_thumbnail" : 0,
      "mtz_thumbnail" : 0,
      "fofc_thumbnail" : 0,
      "overlay_eventmap_fofc_thumbnail" : 0,
      "clash_thumbnail" : 0
    })
    setGifViewTimes({
      "eventmap_gif": 0, 
      "mtz_gif": 0, 
      "fofc_gif": 0, 
      "overlay_eventmap_fofc_gif": 0, 
      "clash_gif": 0, 
      "eventmap_contour_gif": 0, 
      "mtz_contour_gif": 0, 
      "clash_contour_gif": 0,
      "no_gif": 0
    })
    setGifViewCounts({
      "eventmap_gif": 0, 
      "mtz_gif": 0, 
      "fofc_gif": 0, 
      "overlay_eventmap_fofc_gif": 0, 
      "clash_gif": 0, 
      "eventmap_contour_gif": 0, 
      "mtz_contour_gif": 0, 
      "clash_contour_gif": 0,
      "no_gif": 0
    })
  };
      
  const handleTransition = () => {
    if (startTime != null) {
      setAnalysisTime(Date.now() - startTime)
    }
    setShowContent("Feedback")
  }

    const handleFormSubmit = () => {
      handleReset()
    };


  const handleBulkSelection = (buttonValue : string, thumbnailData : Thumbnail[]) => {
    if (buttonValue === 'selectAll') {
      thumbnailData
      .filter(thumbnail => siteID === "All" || thumbnail.site_idx === siteID)
      .filter(thumbnail => 
      decisionButton === "All"
        ? !(thumbnail.id in decision)
        : decision[thumbnail.id] === decisionButton)
        .map(thumbnail => {

        setActiveThumbnails(previous => {
          return [...previous, thumbnail.id];
        }) 
      })
    } else if (buttonValue === 'deselectAll'){
        setActiveThumbnails([]);
    }
  }



  if (siteID === "All" && decisionButton === "All") {
    title = ""
  } else if (decisionButton !== "All") {
    title = `Decision - ${decisionButton}`;
  } else {
    title = `Site ${siteID}`;
  }

  const downloadDecisionJSON = (totalTime, formData, mapTimes, mapCounts, gifViewTimes, gifViewCounts) => {
    // const mapTimesAsSeconds = Object.fromEntries(
    //   Object.entries(mapTimes).map(([key, value]) => [
    //     key,
    //     Math.round(value/1000)
    //   ])
    // );

    // console.log(mapTimes)
    // console.log(Object.entries(mapTimes))
    // console.log(mapTimesAsSeconds)

    const jsonData = {
      ...decision,
      "formData": formData,
      "Time": totalTime,
      "mapTimes" : mapTimes,
      "mapCounts" : mapCounts,
      "gifTimes" : gifViewTimes,
      "gifCounts": gifViewCounts 
    }

    const blob = new Blob(
      [JSON.stringify(jsonData, null, 2)],
      { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "decision.json";
    a.click();

    URL.revokeObjectURL(url);
  };


  return (
    <div className='page-container'>
      <div className='top-container' style={{ display: showContent === "MainContent" ? "flex" : "none"}}>
        <div className='maps-container'> 
          <Button
            aria-label='Show help section'
            key='open_help'
            onClick={() => {
              setShowContent("Help")
            }}>
              <svg  className='help-icon' xmlns="http://www.w3.org/2000/svg" width="35" height="35" 
                fill="white" viewBox="0 0 24 24" >
                {/* <!--Boxicons v3.0.8 https://boxicons.com | License  https://docs.boxicons.com/free--> */}
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m1 16h-2v-2h2zm0-4.34V14h-2v-1c0-.43.27-.8.67-.94.58-.2 2.24-1.03 2.24-2.07 0-.82-.54-1.57-1.32-1.86-1.04-.38-2.28.19-2.65 1.21l-1.88-.68c.75-2.06 3.13-3.16 5.21-2.41 1.56.57 2.62 2.07 2.64 3.73 0 1.98-1.87 3.17-2.91 3.68"></path>
            </svg> 
          </Button> 
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
              value = {activeMapButton} 
              onChange={(event, newMap) => {
                    startMapTimer()
                    setMapName(newMap)
                    setActiveMapButton(newMap)
                    updateMapCounts(newMap)
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

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: '#9ca3af',
                margin: '10px 10px',
              }}
            />

            <Tabs
              className='navigation-tabs'
              value={false}
              onChange= {(event, selectionType) => {handleBulkSelection(selectionType, thumbnailData, decision)}}
              aria-label= "Selection behaviour"
              >
                <Tab key = "selectAll" label = "select All" value = "selectAll"/>
                <Tab key = "deselectAll" label = "deselect All" value = "deselectAll"/>
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
        <div className='introduction' style={{ display: showContent === "Introduction" ? "flex" : "none"}}>
          <h1>Welcome</h1>
          <Typography sx={{mb: 5}}>
            This App is being developed as a proof-of-concept for an approach to quickly triage fragment hits. 
            Future development will include integration of Moorhen to enable deeper inspection of hits following triage.
          </Typography>

          <Typography className='get-started' sx={{fontWeight: "bold", mb: 8}}>
            When ready please add your crystallography experience level and click the Start button below to analyse the fragment hits. When finished please click the Finish button, fill in the survey and click Submit. 
            Thank you for participating &#128516;
          </Typography>
          <Box>
            <div className='form-div'>
              <label htmlFor='years-experience' className='form-label'>
                  I have been working in crystallography for:
              </label>
              <TextField 
                id="years-experience" 
                name='years-experience' 
                fullWidth
                slotProps={{
                  htmlInput: {
                    form: 'feedback-form'
                  }
                }}
                sx={{mb: 3}}
                value={formData["years-experience"] ?? "No experience"} 
                select 
                onChange={handleChange}>
                  <MenuItem value="No experience">No experience</MenuItem>
                  <MenuItem value="Less than a year">Less than a year</MenuItem>
                  <MenuItem value="1 - 2 years">1 - 2 years</MenuItem>
                  <MenuItem value="3 - 5 years">3 - 5 years</MenuItem>
                  <MenuItem value="More than 5 years">More than 5 years</MenuItem>
              </TextField>

            </div>
          </Box>

          <Button
            key='start-app'
            variant="outlined"
            onClick={() => {
              setStartTime(Date.now())
              startMapTimer()
              setShowContent("MainContent")
            }}
            sx= {{
              margin: 2,
              color: "white",
              borderColor: "#646973",
              "&:hover": {
                borderColor: "#646973",
                backgroundColor: "green"
              },
              "&:active": {
                borderColor: "#646973",
                backgroundColor: "green"
              }
            }}
            >Start
          </Button>
        </div>
        <div className='help' style={{ display: showContent === "Help" || showContent === "Introduction" ? "flex" : "none"}}>
          <h1>Help</h1>
          <HelpSection/>
          <Button 
            key='close_help'
            aria-label='close help section'
            variant="outlined"
            onClick={() => {
              setShowContent("MainContent")
            }}
            sx= {{
              display: showContent === "Help" ? "flex" : "none",
              margin: 2,
              color: "white",
              borderColor: "#646973",
              "&:hover": {
                borderColor: "#646973",
                backgroundColor: "green"
              },
              "&:active": {
                borderColor: "#646973",
                backgroundColor: "green"
              }
            }}
            >Close</Button>

        </div>

        <div className='user-feedback' style={{display: showContent === "Feedback" ? "flex" :"none"}}>
            <h1>Feedback</h1>
            <Typography sx={{mb: 5}}>
              Please complete the form below and click Submit to submit the results of the fragment analysis. Thank you for participating &#128516;
            </Typography>
            <FeedbackForm onSubmit={handleFormSubmit} formData={formData} setFormData={setFormData} handleChange={handleChange}/>
            <Button
              form="feedback-form"
              key="reset"
              className='main-button'
              variant="outlined"
              sx= {{
                width: 'auto', 
                color: "white",
                borderColor: "#646973",
                "&:hover": {
                  borderColor: "#646973",
                  backgroundColor: "green"
                },
                "&:active": {
                  borderColor: "#646973",
                  backgroundColor: "green"
                }
              }}
              type='submit'>Submit</Button>
        </div>

        <div className='main-content' style={{ display: showContent === "MainContent" ? "block" : "none"}}>
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
                // setActiveIDButton("All")
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
                // setActiveIDButton(siteList[0])
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
                  setSiteID("All")
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
                    // setActiveIDButton(page)
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
              <Stack direction="row" spacing={2} sx = {{justifyContent: "center"}}>
                {buttonList.map(buttonName => (
                  <Button 
                  key={`${buttonName}_review`}
                  // className={`main-button ${decisionButton === buttonName ? "active" : ""}`} 
                  variant={decisionButton === buttonName ? "contained" : "outlined"}
                  onClick={() => {
                    setDecisionButton(buttonName)
                    setSiteID("All")}
                  }
                  sx= {{
                    color: "white",
                    borderColor: "#646973",
                    backgroundColor: decisionButton === buttonName ? "green" : "transparent",
                    "&:hover": {
                      borderColor: "#646973",
                      backgroundColor: "green"
                    },
                    "&:active": {
                      borderColor: "#646973",
                      backgroundColor: "green"
                    }
                  }}
                  >{buttonName}</Button>
              ))}
              </Stack>
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
            decisionButton={decisionButton}
            startGifTimer={startGifTimer}
            finishGifTimer={finishGifTimer}
            updateGifCounts={updateGifCounts}
            />
          </div>      
          <Button
          key="reset"
          // className='main-button'
          variant="outlined"
          onClick={() => {
            finishMapTimer()
            handleTransition()}}
          sx= {{
            color: "white",
            borderColor: "#646973",
            "&:hover": {
              borderColor: "#646973",
              backgroundColor: "green"
            },
            "&:active": {
              borderColor: "#646973",
              backgroundColor: "green"
            }
          }}
          >Finish</Button>
        </div>
      </div>
    </div>
  );
}


