'use strict';

// When the extension button is clicked, clear all cookies associated with the website on the current tab

// First, let's set up the functions that will allow this extension to work
// Let's start with a simple function that will return the current tab
const getCurrentTab = (callback) => {

    // Specify the search query that will get us the current tab
    let tabQuery = {
        active: true,
        currentWindow: true
    };

    // Now run the query, and get the URL from the first returned tab (this is safe, as there should only be one tab returned anyway)
    chrome.tabs.query(tabQuery, (tabs) => {

        // Get the details for the first tab, which should be the current one
        let currentTab = tabs[0];

        // Now let's return those details
        return callback(currentTab);

    });

};

// Now let's set up our function that will clear all cookies that are associated with our hostname (passed as a parameter)
const clearAllCookiesForSite = () => {

    // First, let's get our current tab
    getCurrentTab((tab) => {

        // We'll set this to true if there's an error
        let error = false;

        // Now get the hostname (i.e. domain) from the tab URL
        // The hostname should be the *fourth* matching group (i.e. index 3) from the regular expression
        let tabURL = tab.url;
        let urlRegex = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
        let hostname = tabURL.split(urlRegex)[3]; // www.example.com
        let host = tabURL.split(urlRegex)[1] + hostname; // http://www.example.com

        // Now use Chrome's cookies API to get all cookies associated with that domain, and delete them
        // First, declare what cookies we're looking for (i.e. those associated with the active website)
        let cookieQuery = {
            domain: hostname
        };

        // Now get all of the cookies matching our query
        chrome.cookies.getAll(cookieQuery, (cookieList) => {
            // Now loop through each cookie, deleting it
            for (var i = 0; i < cookieList.length; i++) {

                // Get the relevant details of our cookie
                let cookieDetails = {
                    url: host,
                    name: cookieList[i].name
                };

                // Use these details to delete the relevant cookie
                chrome.cookies.remove(cookieDetails, (result) => {
                    // If result is null, there was an error, so report this to the console for now
                    if (result === null) {
                        console.error('There was an error removing the cookie \'' + cookieDetails.name + '\'');
                        error = true;
                    }
                });
            }

            // If error is still false, return a success message to the browser console
            if (!error) {
                console.log(cookieList.length + ' cookie(s) successfully removed');
            }

        });

    });

};

// Clear all cookies for the current website when the button is clicked
chrome.browserAction.onClicked.addListener(() => {
    clearAllCookiesForSite();
});
