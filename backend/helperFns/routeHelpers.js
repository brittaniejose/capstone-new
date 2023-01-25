function checkForTag (postTag) {
    if (postTag.length === 0) {
        return postTag;
    } else {
        postTag[0].name = '#' + postTag[0].name;
        return postTag[0].name;
    }
}

function checkForHashtag(postContent) {
    const regex = /#[a-z\d-]+/gi;
    const hashtags = postContent.match(regex);
    return hashtags;
}

function extractHashtags(postContent) {
    // Regex to match hashtags
    const regex = /(?:^|\s)(#[\w-]+)/gi;
    const matches = postContent.match(regex);

    // Extract the hashtags from the matches
    if(matches) {
        return matches.map(match => match.trim().slice(1));
    }
    return []
}

module.exports = {
    checkForHashtag: checkForHashtag,
    checkForTag: checkForTag,
    extractHashtags: extractHashtags
}