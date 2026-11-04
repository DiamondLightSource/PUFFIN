import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getScoreSvg } from './thumbnail';


function createBasicTableData(
    scoreRating: string, 
    eventScore: string, 
    buildScore: string, 
    resScore: string, 
    finalRworkRfree: string,
    rworkMinusRfree: string){
    return {scoreRating, eventScore, buildScore, resScore, finalRworkRfree, rworkMinusRfree};
}


function createRfreeRworkScoreData(
    scoreRating: string,
    rfreeGoodRes: string,
    rfreeOkRes: string, 
    rfreeBadRes: string,
    rworkGoodRes: string,
    rworkOkRes: string,
    rworkBadRes: string
){
    return {scoreRating, rfreeGoodRes, rfreeOkRes, rfreeBadRes, rworkGoodRes, rworkOkRes, rworkBadRes};
}


const basicScoreBreakdown = [
    createBasicTableData("good", "\u2265 0.9", "\u003E 0.9", "\u003C 2.5", "Rwork, Rfree and Rwork - Rfree all have Good ratings", "\u2264 0.05"),
    createBasicTableData("ok", "\u2265 0.8 - 0.9", "\u003E 0.8", "\u2265 2.5 - 3", "Any of Rwork, Rfree and Rwork - Rfree have an OK rating", "0.05 - 0.08"),
    createBasicTableData("bad", "\u003C 0.8", "\u2264 0.8", "\u2265 3", "Any of Rwork, Rfree and Rwork - Rfree have a Bad rating", "\u003E 0.08")
]

const rfreeRworkScoreBreakdown = [
    createRfreeRworkScoreData("", "\u003C 2.5 \u00C5", "\u2265 2.5  \u00C5 - 3  \u00C5", "\u2265 3  \u00C5", "\u003C 2.5  \u00C5", "\u2265 2.5  \u00C5 - 3  \u00C5", "\u2265 3  \u00C5"),
    createRfreeRworkScoreData("good", "\u2264 0.22", "\u2264 0.25", "\u2264 0.28", "\u2264 0.27", "\u2264 0.3", "\u2264 0.33"),
    createRfreeRworkScoreData("ok",  "\u2265 0.22 - 0.26", "\u2265 0.25 - 0.29", "\u2265 0.28 - 0.33", "\u2265 0.27 - 0.32", "\u2265 0.3 - 0.34", "\u2265 0.33 - 0.38"),
    createRfreeRworkScoreData("bad", "\u003E 0.26", "\u003E 0.29", "\u003E 0.33", "\u003E 0.32", "\u003E 0.34", "\u003E 0.38"),
]

export default function HelpSection() {
  const id = React.useId();
  return (
    <div>
        <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon sx={{color: "white"}}/>}
          aria-controls={`${id}-panel1-content`}
          id={`${id}-panel1-header`}
        >
          <Typography component="span" sx={{fontWeight: "bold"}}>Page overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div className='flex-accordion-content'>
                <img
                    src = "src/assets/help/page_overview.png"
                    style={{width: "500px"}} />
                <Typography component="div" variant="body1">
                    <ul>
                        <li><strong>Toolbar:</strong> Controls what fragment cards show. See Toolbar options.</li>
                        <li><strong>Navigation:</strong> Controls which fragment cards are visible.</li>
                        <li><strong>Fragment cards:</strong> Card showing fragment hit. See Fragment card fields.</li>
                        <li><strong>Complete analysis:</strong> Finish analysis.</li>
                    </ul>
                </Typography>
            </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon  sx={{color: "white"}}/>}
          aria-controls={`${id}-panel2-content`}
          id={`${id}-panel1-header`}
        >
          <Typography component="span" sx={{fontWeight: "bold"}}>Toolbar options</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <img
                src = "src/assets/help/menu_options.png"
                style={{width: "1000px"}} />
            <Typography component="div" variant="body1">
                <ul>
                    <li><strong>Help:</strong> Show the help page</li>
                    <li><strong>Thumbnail image:</strong> Changes what is visible in the thumbnail image: 
                    <ul>
                        <li><strong>Event:</strong> Shows the event map at 2&sigma;</li>
                        <li><strong>2FoFc:</strong> Shows the 2FoFc at 1&sigma;</li>
                        <li><strong>FoFc:</strong> Shows the FoFc at &#177;3&sigma;</li>
                        <li><strong>Overlay:</strong> Shows an overaly of the event map (2&sigma;), 2FoFc (1&sigma;) and FoFc (&#177;3&sigma;) </li>
                        <li><strong>Surrounds:</strong> Shows residues and solvents within 3&#8491; of the fragment</li>
                    </ul>
                    </li>
                    <li><strong>Movie behaviour:</strong> Changes what movie is shown when the mouse is over the thumbnail image:
                    <ul>
                        <li><strong>Contour:</strong> Changing contour levels</li>
                        <li><strong>Rock:</strong> Rocking ligand</li>
                    </ul>
                    </li>
                    <li><strong>Multiselection options:</strong> Select or deselect all visible thumbnails</li>
                    <li><strong>Assign decision:</strong> Assign a decision to selected thumbnails</li>
                </ul>
            </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon  sx={{color: "white"}}/>}
          aria-controls={`${id}-panel3-content`}
          id={`${id}-panel3-header`}
        >
          <Typography component="span" sx={{fontWeight: "bold"}}>Navigation</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div className='flex-accordion-content multicontent'>
                <img
                    src = "src/assets/help/navigation_all.png"
                    style={{width: "700px"}} />
                <Typography>
                    Shows all fragment cards that have not been assigned a decision (yes, review, no).
                </Typography>
            </div>
            <div className='flex-accordion-content multicontent'>
                <img
                    src = "src/assets/help/navigation_sites.png"
                    style={{width: "700px"}} />
                <Typography>
                    Shows all fragment cards within a site as identified by PanDDA2 that have not been assigned a decision (yes, review, no). Use the numbered buttons to change between sites.
                </Typography>
            </div>
            <div className='flex-accordion-content multicontent'>
                <img
                    src = "src/assets/help/navigation_decision.png"
                    style={{width: "700px"}} />
                <Typography>
                    Shows all fragment cards assigned to a selected decision (in this example, shows fragment cards that have been assigned as Review). 
                    Use the Yes, Review, No buttons to change which fragment cards are visible.
                </Typography>
            </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon  sx={{color: "white"}}/>}
          aria-controls={`${id}-panel4-content`}
          id={`${id}-panel4-header`}
        >
          <Typography component="span" sx={{fontWeight: "bold"}}>Fragment card fields</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div className='flex-accordion-content'>
                <img
                    src = "src/assets/help/thumbnail_schematic.png"
                    style={{width: "500px"}} />
                <Typography variant="body1" component="div">
                    <ul>
                        <li><strong>Movie indicator:</strong> Indicates if movie available (either contour or rock depending on selected behaviour)</li>
                        <li><strong>Contour level:</strong> Indicates contour level of image. Not present on overlay images. For overlay images contour levels are Event map: 2&sigma;, 2FoFc: 1&sigma; and FoFc &#177;3&sigma;</li> 
                        <li><strong>Thumbnail image:</strong> Image changes depending on selected menu option. Event map shown in example.</li>
                        <li><strong>Dataset name #Event ID:</strong> Dataset identifier (dtag) and event ID number</li>
                        <li><strong>Thumbnail metrics:</strong> Event score, Build score, Rwork/ Rfree, Resolution. See Score breakdowns for details.</li>
                    </ul>
                </Typography>
            </div>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon  sx={{color: "white"}}/>}
          aria-controls={`${id}-panel5-content`}
          id={`${id}-panel5-header`}
        >
          <Typography component="span" sx={{fontWeight: "bold"}}>Score breakdowns</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div className='table-div'>
                General breakdown
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="right">Event Score</TableCell>
                            <TableCell align="right">Build Score</TableCell>
                            <TableCell align="right">Resolution (&#8491;)</TableCell>
                            <TableCell align="right">Rwork/Rfree</TableCell>
                            <TableCell align="right">Rwork - Rfree</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            { basicScoreBreakdown.map((row) => (
                                <TableRow
                                key={row.scoreRating}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {getScoreSvg(row.scoreRating, false)}
                                </TableCell>
                                <TableCell align="right">{row.eventScore}</TableCell>
                                <TableCell align="right">{row.buildScore}</TableCell>
                                <TableCell align="right">{row.resScore}</TableCell>
                                <TableCell align="right">{row.finalRworkRfree}</TableCell>
                                <TableCell align="right">{row.rworkMinusRfree}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className='table-div'>
                Rwork and Rfree breakdown
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell sx={{borderRight: 2, borderColor: "divider"}}></TableCell>
                            <TableCell colSpan={3} sx={{borderRight: 2, borderColor: "divider"}} align="center">Rwork</TableCell>
                            <TableCell colSpan={3} align="center">Rfree</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            { rfreeRworkScoreBreakdown.map((row) => (
                                <TableRow
                                key={row.scoreRating}
                                >
                                <TableCell component="th" scope="row" sx={{borderRight: 2, borderColor: "divider"}}>
                                    {row.scoreRating !== "" ? getScoreSvg(row.scoreRating, false) : "Resolution (\u00C5)"}
                                </TableCell>
                                <TableCell align="right">{row.rworkGoodRes}</TableCell>
                                <TableCell align="right">{row.rworkOkRes}</TableCell>
                                <TableCell sx={{borderRight: 2, borderColor: "divider"}} align="right">{row.rworkBadRes}</TableCell>
                                <TableCell align="right">{row.rfreeGoodRes}</TableCell>
                                <TableCell align="right">{row.rfreeOkRes}</TableCell>
                                <TableCell align="right">{row.rfreeBadRes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
