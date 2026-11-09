import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';



export function FeedbackForm({onSubmit, formData, setFormData, handleChange}) {

    const handleSubmit = (e) => {
        e.preventDefault();

        // Pass form values to the parent
        onSubmit(formData);

        console.log("Form submitted!!!")
    };

  return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { mb: 3}}}
            noValidate
            autoComplete="off"
            id="feedback-form" onSubmit={handleSubmit}
            >
            <div className='form-box'>
                <div className='form-div'>
                    <label htmlFor='usefulness' className='form-label'>
                        I found the tool a useful way to quickly triage fragment hits:
                    </label>
                    <TextField 
                      id="usefulness" 
                      name='usefulness' 
                      value={formData["usefulness"] ?? ""} 
                      sx = {{width: '25ch'}}
                      select 
                      onChange={handleChange}>
                        <MenuItem value="Strongly agree">Strongly agree</MenuItem>
                        <MenuItem value="Agree">Agree</MenuItem>
                        <MenuItem value="Neutral">Neutral</MenuItem>
                        <MenuItem value="Disagree">Disagree</MenuItem>
                        <MenuItem value="Strongly disagree">Strongly disagree</MenuItem>
                    </TextField>

                </div>
                <div className='form-div'>
                    <label htmlFor='projects' className='form-label'>
                        This tool will help me with my projects:
                    </label>
                    <TextField 
                      id="projects" 
                      name='projects' 
                      value={formData["projects"] ?? "Neutral"} 
                      sx = {{width: '25ch'}}
                      select 
                      onChange={handleChange}>
                        <MenuItem value="Strongly agree">Strongly agree</MenuItem>
                        <MenuItem value="Agree">Agree</MenuItem>
                        <MenuItem value="Neutral">Neutral</MenuItem>
                        <MenuItem value="Disagree">Disagree</MenuItem>
                        <MenuItem value="Strongly disagree">Strongly disagree</MenuItem>
                    </TextField>
                </div>
                <div className='form-div'>
                    <label htmlFor='project-examples' className='form-label'>
                        Please elaborate
                    </label>
                    <TextField
                    id="project-examples"
                    name='project-examples'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    onChange={handleChange}
                    variant='outlined'
                    value={formData["project-examples"] ?? ""}
                    />
                </div>
                <div className='form-div'>
                    <label htmlFor='usage' className='form-label'>
                        I would use this tool:
                    </label>
                    <TextField 
                      id="usage" 
                      name='usage' 
                      value={formData["usage"] ?? "Neutral"} 
                      sx = {{width: '25ch'}}
                      select 
                      onChange={handleChange}>
                        <MenuItem value="Strongly agree">Strongly agree</MenuItem>
                        <MenuItem value="Agree">Agree</MenuItem>
                        <MenuItem value="Neutral">Neutral</MenuItem>
                        <MenuItem value="Disagree">Disagree</MenuItem>
                        <MenuItem value="Strongly disagree">Strongly disagree</MenuItem>
                    </TextField>
                </div>                
                <div className='form-div'>
                    <label htmlFor='usage-details' className='form-label'>
                        Please elaborate
                    </label>
                    <TextField
                    id="usage-details"
                    name='usage-details'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    onChange={handleChange}
                    variant='outlined'
                    value={formData["usage-details"] ?? ""}
                    />
                </div>
                <div className='form-div'>
                    <label htmlFor='confidence' className='form-label'>
                        I felt confident making decisions about the fragments:
                    </label>
                    <TextField 
                      id="confidence" 
                      name='confidence' 
                      value={formData["confidence"] ?? "Neutral"} 
                      sx = {{width: '25ch'}}
                      select 
                      onChange={handleChange}>
                        <MenuItem value="Strongly agree">Strongly agree</MenuItem>
                        <MenuItem value="Agree">Agree</MenuItem>
                        <MenuItem value="Neutral">Neutral</MenuItem>
                        <MenuItem value="Disagree">Disagree</MenuItem>
                        <MenuItem value="Strongly disagree">Strongly disagree</MenuItem>
                    </TextField>
                </div>
                <div className='form-div'>
                    <label htmlFor='confidence-details' className='form-label'>
                        Please elaborate
                    </label>
                    <TextField
                    id="confidence-details"
                    name='confidence-details'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    onChange={handleChange}
                    variant='outlined'
                    value={formData["confidence-details"] ?? ""}
                    />
                </div>
                <div className='form-div'>
                    <label htmlFor='missing' className='form-label'>
                        Do you feel anything is missing from the tool?
                    </label>
                    <TextField
                    id="missing"
                    name='missing'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    onChange={handleChange}
                    variant='outlined'
                    value={formData["missing"] ?? ""}
                    />
                </div>
                <div className='form-div'>
                    <label htmlFor='general-feedback' className='form-label'>
                        Any other feedback?
                    </label>
                    <TextField
                    id="general-feedback"
                    name='general-feedback'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    onChange={handleChange}
                    variant='outlined'
                    value={formData["general-feedback"] ?? ""}
                    />
                </div>
            </div>
        </Box>
  )
}

