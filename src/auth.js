// Map for localStorage keys
const LOCALSTORAGE_KEYS = {
    accessToken: 'auth_access_token',
    mandate: 'mandate',
    refreshToken: 'auth_refresh_token',
    expireTime: 'auth_token_expire_time',
    timestamp: 'auth_token_timestamp',
    reload: 'page_reload',
};

export const STORAGE_KEYS = LOCALSTORAGE_KEYS;

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES = {
    accessToken: localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
    mandate: localStorage.getItem(LOCALSTORAGE_KEYS.mandate),
    refreshToken: localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
    expireTime: localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
    timestamp: localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
    reload: localStorage.getItem(LOCALSTORAGE_KEYS.reload),
};

const getAccessToken = () => {
    if (!window) {
        console.log('Window is not', localStorage.getItem(LOCALSTORAGE_KEYS.accessToken));
        getAccessToken();
    }
    // If there's an error OR the token in localStorage has expired, refresh the token
    console.log(LOCALSTORAGE_KEYS.accessToken, localStorage.getItem(LOCALSTORAGE_KEYS.accessToken), hasTokenExpired());
    if (hasTokenExpired() || LOCALSTORAGE_VALUES.accessToken === 'undefined' || LOCALSTORAGE_VALUES.accessToken === null) {
        // refreshToken();
        if (LOCALSTORAGE_VALUES.accessToken === 'undefined' || LOCALSTORAGE_VALUES.accessToken === null) {
            logout();
            // window.localStorage.setItem(LOCALSTORAGE_KEYS.reload, true);
        }
        if ((LOCALSTORAGE_VALUES.accessToken === 'undefined' || LOCALSTORAGE_VALUES.accessToken === null) && LOCALSTORAGE_VALUES.reload) {
            window.localStorage.setItem(LOCALSTORAGE_KEYS.reload, false);
            window.location = window.location.origin;
        }
    }

    // If there is a valid access token in localStorage, use that
    if (LOCALSTORAGE_VALUES.accessToken && LOCALSTORAGE_VALUES.accessToken !== 'undefined') {
        return LOCALSTORAGE_VALUES.accessToken;
    }
}
export const accessToken = getAccessToken();


const getMandate = () => {
    if (!window) {
        console.log('Window is not', localStorage.getItem(LOCALSTORAGE_KEYS.mandate));
        getMandate();
    }

    // if user is authenticated has has user data in localStorage
    if (LOCALSTORAGE_VALUES.mandate && LOCALSTORAGE_VALUES.mandate !== 'undefined') {
        return LOCALSTORAGE_VALUES.mandate ? JSON.parse(LOCALSTORAGE_VALUES.mandate) : null;
    }
    return null;
}

export const getUser = getMandate();

function hasTokenExpired() {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
        return false;
    }
    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed / 1000) > Number(expireTime);
};

const refreshToken = async () => {
    try {
        // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
        if (!LOCALSTORAGE_VALUES.refreshToken || LOCALSTORAGE_VALUES.refreshToken === 'undefined' || (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000) < 1000) {
            console.error('No refresh token available');
            logout();
        }

        // Use `/refresh_token` endpoint from our Node app
        const { data } = null;  //await axios.get(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

        // Update localStorage values
        window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
        window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

        // Reload the page for localStorage updates to be reflected
        window.location.reload();

    } catch (e) {
        console.error(e);
    }
};

export function logout() {
    // Clear all localStorage items
    for (const property in LOCALSTORAGE_KEYS) {
        window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    // Navigate to homepage
    // window.location = window.location.origin;
};