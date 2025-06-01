import { validContactType } from "../constants/constants.js";

function parseIsFavourite(favourite) {
    if(favourite === undefined || favourite === null ) {
        return undefined;
    }
    if(typeof favourite === 'string') {
        const loverCaseFavourite = favourite.toLowerCase();
        if(loverCaseFavourite === 'true') return true;
        if(loverCaseFavourite === 'false') return false;
    }
    return undefined;
}

function parseContactType(contactType) {
    if(!contactType || typeof contactType !== 'string' ) {
        return undefined;
    }

    const trimmedType = contactType.trim();
    if(trimmedType === '' || !validContactType.includes(trimmedType)) {
        return undefined;
    }
    return trimmedType;
}


export function parseFilterParams(query) {
    const {isFavourite, contactType} = query;

    const parsedIsFavourite = parseIsFavourite(isFavourite);
    const parsedContactType = parseContactType(contactType);

    return {
        isFavourite: parsedIsFavourite,
        contactType: parsedContactType,
    };
}