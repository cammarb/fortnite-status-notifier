type Incident = {
    code: string
    name: string
    message: string
    impact: string
    timestamp: string
}

type Month = 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec';

const formatDate = (dateString: string): {
    startDate: Date,
    endDate: Date
} | null => {
    // Oct <var data-var=&#39;date&#39;>1</var>, <var data-var=&#39;time&#39;>08:00</var> - <var data-var=&#39;time&#39;>10:15</var> UTC
    const regex = /(\w+) <var data-var=&#39;date&#39;>(\d+)<\/var>, <var data-var=&#39;time&#39;>(\d+:\d+)<\/var> - <var data-var=&#39;time&#39;>(\d+:\d+)<\/var> UTC/
    const match = dateString.match(regex);

    const monthNames = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05',
        'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10',
        'Nov': '11', 'Dec': '12'
    };

    if (match) {
        const month = monthNames[match[1] as Month]
        const day = match[2].length === 1 ? '0' + match[2] : match[2];
        const startTime = match[3];
        const endTime = match[4];

        const startDateString = `${new Date().getFullYear()}-${month}-${day}T${startTime}:00Z`;
        const endDateString = `${new Date().getFullYear()}-${month}-${day}T${endTime}:00Z`;

        const startDate = new Date(startDateString);
        const endDate = new Date(endDateString)

        return {
            startDate, endDate
        }
    } else {
        console.error("No match found for date string:", dateString);
        return null
    }
};


const getUpdates = async () => {
    const response = await fetch('https://status.epicgames.com/history')
    const html = await response.text()

    const divRegex = /<div data-react-class="HistoryIndex" data-react-props="([^"]+)">/;
    const match = html.match(divRegex);

    if (match && match[1]) {
        const dataProps = match[1];

        const jsonString = decodeURIComponent(dataProps.replace(/&quot;/g, '"'));
        const jsonData = JSON.parse(jsonString);

        const currentMonth = jsonData["months"][0].incidents

        currentMonth.forEach((incident: Incident) => {
            if (incident.name.includes('[Scheduled] Fortnite: Downtime')) {
                console.log('Name: ', incident.name);
                const incidentTimestamp = formatDate(incident.timestamp)
                console.log('Date formated:', incidentTimestamp);

                const currentDate = new Date()

                if (incidentTimestamp) {
                    if (currentDate < incidentTimestamp.startDate) {
                        console.log('Updates will happen soon.');
                    } else if (currentDate === incidentTimestamp.startDate) {
                        console.log('There is an update today.');
                    }
                } else {
                    console.log('Failed to parse incident timestamp.');
                }
            }

        })

    } else {
        console.error("No matching data found.");
    }

}

getUpdates()