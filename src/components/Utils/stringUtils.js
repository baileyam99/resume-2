export const capitalizeWords = (input) => {
    if (!input || typeof input !== 'string') {
        return '';
    }

    const splitInput = input.split(' ');
    const formattedString = [];
    for (let i = 0; i < splitInput.length; i++) {
        if (splitInput[i].toLowerCase() === 'vs') {
            formattedString.push('vs');
        } else if (splitInput[i].toLowerCase() === 'uncw') {
            formattedString.push('UNCW');
        } else if (splitInput[i].toLowerCase() === 'and') {
            formattedString.push('&');
        } else {
            formattedString.push(splitInput[i].charAt(0).toUpperCase() + splitInput[i].slice(1).toLowerCase());
        }
    }
    return formattedString.join(' ');
};

export const capitalizeFirstLetter = (input) => {
    if (!input || typeof input !== 'string') {
        return '';
    }
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
};

export const toIdFormat = (string) => {
    if (!string || typeof string !== 'string') {
        return '';
    }
    const formattedString = string.replace(/[ _/]/g, '-');
    
    const splitInput = formattedString.split('-');
    
    const result = splitInput.map(word => {
        if (word.toLowerCase() === 'vs') return 'vs';
        if (word.toLowerCase() === 'uncw') return 'UNCW';
        return word;
    });
    
    return result.join('-');
};

export const generateAllSeasons = () => {
    const now = new Date();
    const timeFrame = now.getFullYear() - 2018;
    const seasons = [];
    for (let i = timeFrame; i >= 0; i--) {
        seasons.push(`${2018 + i}-${2018 + (i + 1)}`);
    }
    return seasons;
}

export const isOnlySpace = (str) => str.trim() === '';
