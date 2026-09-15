export function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: reject
        });
    });
}

export function getDateRange(records) {
    const dates = records.map(r => {
        const [month, day, year] =
            r.Date.split("/")
        return new Date(year, month - 1, day);
    });
    return {
        earliest: new Date(
            Math.min(...dates)
        ),
        latest: new Date(
            Math.max(...dates)
        )
    };
}
