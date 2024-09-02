const get_event_information_function = {
    "name": "get_event_information",
    "description": "Get the event information from the input text.",
    "parameters": {
        "type": "object",
        "properties": {
            "title": {
                "type": "string",
                "description": "The title of the Course. Here title will be the course name and not course code."
            },
            "start_date": {
                "type": "string",
                "description": "The start date of the event. If it is an all-day event, use the format YYYYMMDD. Otherwise, use the format YYYYMMDDTHHMMSSZ. If a weekday name was present, choose the next available date with that weekday. Add 4 hours to time to make it EST."
            },
            "end_date": {
                "type": "string",
                "description": "The end date of the event if it exists. If it is an all-day event, use the format YYYYMMDD. Otherwise, use the format YYYYMMDDTHHMMSSZ."
            },
            "location": {
                "type": "string",
                "description": "The location of the event. Usually the room number with building code."
            },
            "description": {
                "type": "string",
                "description": "The description of the event. Maximum number of characters is 500. Description would include course code, section, professor name"
            },
            "recurrence": {
                "type": "string",
                "description": "The recurrence rule for the event. Example: RRULE:FREQ=WEEKLY;BYDAY=TU"
            }
        },
        "required": ["title", "start_date", "location", "description", "recurrence"]
    }
}

const generate_ical_file_function = {
    "name": "generate_ical_file",
    "description": "Generate an .ical file based on the events listed in the input text.",
    "parameters": {
        "type": "object",
        "properties": {
            "filename": {
                "type": "string",
                "description": "The filename of the .ical file."
            },
            "ical": {
                "type": "string",
                "description": ".ical file in text format."
            },
        },
        "required": ["filename", "ical"]
    }
}


export function GCalLink(selectionText) {

    const params = {
        prompt: `Assuming today's date is ${new Date().toISOString()}, extract the event information of this text: ${selectionText}`,
        functions: [get_event_information_function]
    }

    return params;
}

export function iCalDownload(selectionText) {

    const params = {
        prompt: `Assuming today's date is ${new Date().toISOString()}, generate an .ical file based on the events listed in the following text: ${selectionText}.`,
        functions: [generate_ical_file_function]
    }

    return params;
}

export function autoSelect(selectionText) {

    const params = {
        prompt: `Assume today's date is ${new Date().toISOString()}. 
        
        Instructions:        
        A student is building his course calendar.
        You will Use get_event_information_function().

        The format of text could be something like :
        
        "COMS 4113 W sec:001
        FUND-LARGE-SCALE DIST SYS	Roxana Geambasu	3.00
        Letter Grade	Fr	10:10am-12:40pm
        CSC 451"

        In this case, "Fr" is the day of the week, Friday, and "10:10am-12:40pm" is the time of the day.
        So you will choose the next available Friday as the start date. Pass the times will all in EST.
        So you should add 4 hours to all your calculations. for now.

        Title would be "FUND LARGE SCALE DIST SYS". 
        Location would be CSC 451
        Rest of the details will all be in the description, which should be crisp and to-the-point.
        Just include course code (COMS 4113 W), section (sec:001), professor name (Roxana Geambasu) in the description.
        The recurrence would be every Friday. So you would pass recur=RRULE:FREQ=WEEKLY;BYDAY=FR
        
        Another example is :

        "IEOR 8100 E sec:001
        DIFFUSION MODELS AI & RL	Xunyu Zhou	3.00
        Letter Grade	Mo We	10:10am-11:25am
        MUD 337"
        
        Title would be "DIFFUSION MODELS AI RL".
        Location would be MUD 337.
        Times would be Monday 10:10am-11:25am EST. (Wednesday will be repeated in the recurrence)
        Description would include course code (IEOR 8100 E), section (sec:001), professor name (Xunyu Zhou).
        The recurrence would be every Monday and Wednesday. So you would pass recur=RRULE:FREQ=WEEKLY;BYDAY=MO,WE


        You might be required to do processing some other text and different use cases rather than the above examples 
        You will extract the information as needed from the text intelligently. 
        Don't recur in cases where it is not specified and is likely to be a one time event.
        Courses will be repeated weekly, so you will use the recurrence rule as specified before.

        Now using the above instructions, Analyze the following text: ${selectionText} 
        `
        ,
        functions: [get_event_information_function, generate_ical_file_function]
    }

    return params;
}