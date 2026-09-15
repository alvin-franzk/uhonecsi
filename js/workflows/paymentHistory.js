const dates = records.map(
    r => new Date(r.Date)
);

const earliest =
    new Date(
        Math.min(...dates)
    );

const latest =
    new Date(
        Math.max(...dates)
    );
