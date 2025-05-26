import { SORT_ORDER } from "../constants/constants.js";

export function parseSortOrder(sortOrder) {
    const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);

    if(isKnownOrder) {
        return sortOrder;
    }
    return SORT_ORDER.ASC;
}

export function parsedSortBy(sortBy) {
    const keysOfContact = ['_id', 'name', 'phoneNumber', 'email', 'isFavourite', 'contactType'];

    if (keysOfContact.includes(sortBy)) {
        return sortBy;
    }
    return 'name';
}
export function parsedSortParams(query) {
    const {sortOrder, sortBy} = query;

    const parsedSortOrder = parseSortOrder(sortOrder);
    const parsedSortby = parsedSortBy(sortBy);

    return {
        sortOrder: parsedSortOrder,
        sortBy: parsedSortby
    };
};