// Nth weekday of month
function getNthWeekdayOfMonth(year, month, weekday, n) {
    const date = new Date(year, month, 1);

    while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
    }

    date.setDate(date.getDate() + (n - 1) * 7);

    return date;
}

// For Memorial Day / last weekday of month
function getLastWeekdayOfMonth(year, month, weekday) {
    const date = new Date(year, month + 1, 0);

    while (date.getDay() !== weekday) {
        date.setDate(date.getDate() - 1);
    }

    return date;
}

// Needed for holidays that land on weekends
function getObservedHoliday(year, month, day) {
    const date = new Date(year, month, day);

    if (date.getDay() === 6) {
        date.setDate(date.getDate() - 1);
    } else if (date.getDay() === 0) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}

function getFederalHolidays(year) {
    return [
        getObservedHoliday(year, 0, 1), // New Year
        getNthWeekdayOfMonth(year, 0, 1, 3), // MLK
        getNthWeekdayOfMonth(year, 1, 1, 3), // Presidents
        getLastWeekdayOfMonth(year, 4, 1), // Memorial
        getObservedHoliday(year, 5, 19), // Juneteenth
        getObservedHoliday(year, 6, 4), // Independence
        getNthWeekdayOfMonth(year, 8, 1, 1), // Labor
        getNthWeekdayOfMonth(year, 9, 1, 2), // Columbus
        getObservedHoliday(year, 10, 11), // Veterans
        getNthWeekdayOfMonth(year, 10, 4, 4), // Thanksgiving
        getObservedHoliday(year, 11, 25) // Christmas
    ];
}

function isFederalHoliday(date) {
    const holidays = getFederalHolidays(date.getFullYear());

    return holidays.some(holiday =>
        sameDate(holiday, date)
    );
}

function parseDateInput(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

// holiday disclaimer helper
function getHolidayDisclaimer(holidays) {
    return [...new Set(
        holidays.map(
            h =>
                `${getHolidayName(h)} (${formatDateForCalc(h)})`
        )
    )].join(", ");
}

// Format date as MM/DD/YYYY
function formatDateForCalc(date) {
    return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric"
    });
}

function getHolidayName(date) {
    const year = date.getFullYear();

    const holidays = [
        { name: "New Year's Day", date: getObservedHoliday(year, 0, 1) },
        { name: "MLK Day", date: getNthWeekdayOfMonth(year, 0, 1, 3) },
        { name: "Presidents Day", date: getNthWeekdayOfMonth(year, 1, 1, 3) },
        { name: "Memorial Day", date: getLastWeekdayOfMonth(year, 4, 1) },
        { name: "Juneteenth", date: getObservedHoliday(year, 5, 19) },
        { name: "Independence Day", date: getObservedHoliday(year, 6, 4) },
        { name: "Labor Day", date: getNthWeekdayOfMonth(year, 8, 1, 1) },
        { name: "Columbus Day", date: getNthWeekdayOfMonth(year, 9, 1, 2) },
        { name: "Veterans Day", date: getObservedHoliday(year, 10, 11) },
        { name: "Thanksgiving", date: getNthWeekdayOfMonth(year, 10, 4, 4) },
        { name: "Christmas Day", date: getObservedHoliday(year, 11, 25) }
    ];

    const match = holidays.find(
        h => sameDate(h.date, date)
    );

    return match ? match.name : null;
}

// Add calendar days
function addCalendarDays(startDate, days) {
    const result = new Date(startDate);
    result.setDate(result.getDate() + days);
    return result;
}

// Add business days
function addBusinessDays(startDate, days) {
    const result = new Date(startDate);

    let addedDays = 0;
    const excludedHolidays = [];

    while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        const dayOfWeek = result.getDay();
        const isWeekend =
            dayOfWeek === 0 || dayOfWeek === 6;
        if (isFederalHoliday(result)) {
            excludedHolidays.push(new Date(result));
            continue;
        }
        if (!isWeekend) {
            addedDays++;
        }
    }
    return {
        date: result,
        holidays: excludedHolidays
    };
}

// Main future date calculator
function calculateFutureDate() {
    if (!beginDateFuture.value || !noOfDaysFuture.value) {
        endDateFuture.textContent = "--";
        futureDateDisclaimer.textContent = "";
        return;
    }

    const startDate = parseDateInput(beginDateFuture.value);
    const days = parseInt(noOfDaysFuture.value, 10);

    if (isNaN(days) || days < 0) {
        endDateFuture.textContent = "--";
        return;
    }

    let resultDate;

    if (calendarDaysFuture.checked) {
        resultDate = addCalendarDays(startDate, days);
        endDateFuture.textContent =
            formatDateForCalc(resultDate);
        futureDateDisclaimer.textContent = "";
    } else {
        const result = addBusinessDays(startDate, days);
        endDateFuture.textContent =
            formatDateForCalc(result.date);
        if (result.holidays.length) {
            futureDateDisclaimer.textContent =
                "Excluded federal holidays: " +
                getHolidayDisclaimer(result.holidays);
        } else {
            futureDateDisclaimer.textContent = "";
        }
    }
}

// ------------------ DAYS BETWEEN CALCULATOR

function getBusinessDaysBetween(startDate, endDate) {
    let count = 0;
    const current = new Date(startDate);
    const excludedHolidays = [];
    while (current < endDate) {
        current.setDate(current.getDate() + 1);
        const dayOfWeek = current.getDay();
        const isWeekend =
            dayOfWeek === 0 ||
            dayOfWeek === 6;
        if (isFederalHoliday(current)) {

            excludedHolidays.push(
                new Date(current)
            );

            continue;
        }
        if (!isWeekend) {
            count++;
        }
    }
    return {
        days: count,
        holidays: excludedHolidays
    };
}

// Days between dates
function getCalendarDaysBetween(startDate, endDate) {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.round(
        (endDate - startDate) / msPerDay
    );
}

// Main Days Between Calculator
function calculateDaysBetween() {
    if (
        !beginDateBetween.value ||
        !endDateBetween.value
    ) {
        totalDaysBetween.textContent = "--";
        daysBetweenDisclaimer.textContent = "";
        return;
    }
    const startDate =
        parseDateInput(beginDateBetween.value);
    const endDate =
        parseDateInput(endDateBetween.value);
    if (endDate < startDate) {
        totalDaysBetween.textContent = "--";
        daysBetweenDisclaimer.textContent = "";
        return;
    }
    if (calendarDaysBetween.checked) {
        const days = getCalendarDaysBetween(
            startDate,
            endDate
        );
        totalDaysBetween.textContent = days;
        daysBetweenDisclaimer.textContent = "";
    } else {
        const result =
            getBusinessDaysBetween(
                startDate,
                endDate
            );
        totalDaysBetween.textContent =
            result.days;

        if (result.holidays.length) {
            daysBetweenDisclaimer.textContent =
                "Excluded federal holidays: " +
                getHolidayDisclaimer(result.holidays);
        } else {
            daysBetweenDisclaimer.textContent = "";
        }
    }
}

// Julian Date Converter
function julianToGregorian(julian) {
    const value = String(julian).trim();

    let year;
    let dayOfYear;

    // YYYYDDD
    if (value.length === 7) {
        year = parseInt(
            value.substring(0, 4),
            10
        );
        dayOfYear = parseInt(
            value.substring(4),
            10
        );

        // YYDDD
    } else if (value.length === 5) {
        year =
            2000 +
            parseInt(
                value.substring(0, 2),
                10
            );

        dayOfYear = parseInt(
            value.substring(2),
            10
        );
    } else {

        return null;

    }
    if (
        year < 1900 ||
        year > 2200
    ) {
        return null;
    }
    // Leap year check
    const isLeapYear =
        (year % 4 === 0 && year % 100 !== 0) ||
        year % 400 === 0;
    const maxDays =
        isLeapYear ? 366 : 365;
    if (
        dayOfYear < 1 ||
        dayOfYear > maxDays
    ) {
        return null;
    }
    return new Date(
        year,
        0,
        dayOfYear
    );
}

// main julian calc
function calculateJulianDate() {

    if (!julianDate.value) {
        calendarDate.textContent = "--";
        return;
    }
    const result =
        julianToGregorian(
            julianDate.value
        );
    if (!result) {
        calendarDate.textContent =
            "Invalid Julian Date";
        return;
    }
    calendarDate.textContent =
        formatDateForCalc(result);
}

// Events
beginDateFuture.addEventListener("input", calculateFutureDate);
noOfDaysFuture.addEventListener("input", calculateFutureDate);

calendarDaysFuture.addEventListener("change", calculateFutureDate);
workingDaysFuture.addEventListener("change", calculateFutureDate);

beginDateBetween.addEventListener("input", calculateDaysBetween);
endDateBetween.addEventListener("input", calculateDaysBetween);

calendarDaysBetween.addEventListener("change", calculateDaysBetween);
workingDaysBetween.addEventListener("change", calculateDaysBetween);

julianDate.addEventListener("input", calculateJulianDate);