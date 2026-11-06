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
// , backgroundColor:'white'
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
                        I found the website a useful way to quickly triage fragment hits:
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
                    <label htmlFor='missing' className='form-label'>
                        Do you feel anything is missing from the application?
                    </label>
                    <TextField
                    //   required
                    id="missing"
                    name='missing'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    // value={formName}
                    onChange={handleChange}
                    //   color='warning'
                    variant='outlined'
                    //   defaultValue="Hello World"
                    />
                </div>
                    <div className='form-div'>
                    <label htmlFor='general-feedback' className='form-label'>
                        Any other feedback?
                    </label>
                    <TextField
                    //   required
                    id="general-feedback"
                    name='general-feedback'
                    multiline={true}
                    fullWidth
                    rows={4}
                    slotProps={{htmlInput: {
                        maxLength: 2000}
                    }}
                    // value={formName}
                    onChange={handleChange}
                    //   color='warning'
                    variant='outlined'
                    //   defaultValue="Hello World"
                    />
                </div>
            </div>
        </Box>
  )
}

