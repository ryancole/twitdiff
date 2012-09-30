Get a list of Twitter users who have unfollowed you.

```
ryan@ryan-server:~/repos/twitdiff$ ./bin/twitdiff.js
Checking to see who has unfollowed: richardbranson
Unfollowed by: Emma Louise Hudson (Emmie92)
Unfollowed by: Rikkeb (Rikkeb)
Unfollowed by: Mpho Motaung (Mphorable_)
Unfollowed by: Kylie (Pemberley72)
Unfollowed by: Michael Magarinos (MikeMagarinos)
```

The first invokation of this script simply creates a cache file for subsequent checks. It will always report that nobody has unfollowed you during this initial check.

To use this script, clone the repo and install the dependencies using `npm install`. Modify `bin/twitdiff.js` to include the Twitter handle that you wish to check. This script does not authenticate or authorize using OAuth. This script simply uses public API endpoints and makes two requests during a single invokation.