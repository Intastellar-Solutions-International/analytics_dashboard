export function clearTextfield(textfield){
    textfield.value = "";
}

export function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    hostname = hostname.split('.');
    hostname.reverse();

    return hostname[1] + "." + hostname[0];
}