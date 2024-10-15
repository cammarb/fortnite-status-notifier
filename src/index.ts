type Incident = {
    code: string
    name: string
    message: string
    impact: string
    timestamp: string
}

type Update = {
    name: string,
    dates: {
        startDate: Date;
        endDate: Date;
    }
}

type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

/**
 * @param date as a string
 * 
 * @returns the date in ISO format
 * 
 * Example of date string:
 * Oct <var data-var=&#39;date&#39;>1</var>, <var data-var=&#39;time&#39;>08:00</var> - <var data-var=&#39;time&#39;>10:15</var> UTC
 * 
 *  */
const getDates = (dateString: string) => {
    try {
        const regex = /(\w+) <var data-var=&#39;date&#39;>(\d+)<\/var>, <var data-var=&#39;time&#39;>(\d+:\d+)<\/var> - <var data-var=&#39;time&#39;>(\d+:\d+)<\/var> UTC/
        const match = dateString.match(regex);

        if (!match) throw new Error('Match not found.')

        const monthNames = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05',
            'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10',
            'Nov': '11', 'Dec': '12'
        };

        const month = monthNames[match[1] as Month]
        const day = match[2].length === 1 ? '0' + match[2] : match[2]
        const startTime = match[3]
        const endTime = match[4]

        const startDateString = `${new Date().getFullYear()}-${month}-${day}T${startTime}:00Z`
        const endDateString = `${new Date().getFullYear()}-${month}-${day}T${endTime}:00Z`

        const startDate = new Date(startDateString)
        const endDate = new Date(endDateString)

        return { startDate, endDate }
    } catch (e) {
        console.error(e);
    }
}

/**
 * 
 * @param incidentHistory 
 * 
 * @returns incidents that are related to updates and downtime.
 */
const getIncidentsOfCurrentMonth = (incidentHistory: string) => {
    const jsonString = decodeURIComponent(incidentHistory.replace(/&quot;/g, '"'));
    const jsonData = JSON.parse(jsonString);

    const incidentsOfCurrentMonth = jsonData["months"][0].incidents

    return incidentsOfCurrentMonth
}

const getDowntimeIncidents = (incidents: Incident[]) => {
    try {
        const downtimeIncidents: Incident[] = []
        incidents.forEach((incident: Incident) => {
            if (incident.name.includes('[Scheduled] Fortnite: Downtime')) {
                downtimeIncidents.push(incident)
            }
        })

        return downtimeIncidents
    } catch (e) {
        console.error(e)
    }
}


const getDowntimeIncidentsOfCurrentMonth = async () => {
    try {
        const response = await fetch('https://status.epicgames.com/history')
        const html = await response.text()

        const divRegex = /<div data-react-class="HistoryIndex" data-react-props="([^"]+)">/
        const match = html.match(divRegex)
        if (!match || match[1]) throw new Error('No match found.')

        const incidentsOfCurrentMonth = getIncidentsOfCurrentMonth(match[1])
        const downtimeIncidents = getDowntimeIncidents(incidentsOfCurrentMonth)

        return downtimeIncidents
    } catch (e) {
        console.error(e)
    }
}

const getUpdates = async () => {
    try {
        const incidents = await getDowntimeIncidentsOfCurrentMonth()

        const updates: Update[] = []
        incidents?.forEach((incident: Incident) => {
            const dates = getDates(incident.timestamp)
            const name = incident.name
            if (!dates) throw new Error('Undefined dates.')
            updates.push({ name, dates })
        })

        return updates
    } catch (e) {
        console.error(e)
    }
}

const sendUpdateMessage = async () => {
    try {
        const updates = await getUpdates()
        if (!updates) throw new Error('No updates found.')

        const currentDate = new Date()

        updates.forEach((update: Update) => {
            if (currentDate < update.dates.startDate) {
                console.log(`An update will happen on ${update.dates.startDate} until ${update.dates.endDate}.`);
            } else if (currentDate >= update.dates.startDate && currentDate < update.dates.endDate) {
                console.log(`There is an update today from ${update.dates.startDate} until ${update.dates.endDate}.`);
            } else if (currentDate > update.dates.endDate) {
                console.log(`The last update was on ${update.dates.startDate} until ${update.dates.endDate}.`);
            }
        })
    } catch (e) {
        console.error(e)
    }
}