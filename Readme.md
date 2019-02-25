Installation : 
```
git clone https://github.com/R3tr0Mu4z/instagram-bot
cd instagram-bot
npm install -g ./
```

Commands : 
```
instagram-bot -h
Options:
  -V, --version           output the version number
  --followers [value]     Scrape followers of a user --followers target-username -u USERNAME -p PASSWORD -f FILENAME
  --following [value]     Scrape following of a user --following target-username -u USERNAME -p PASSWORD -f FILENAME
  --posts [value]         Scrape posts from location, profile, tag, search page --posts https://www.instagram.com/muaz_asif -f FILENAME
  --likers [value]        Scrape likers from post --likers https://www.instagram.com/p/BtJOmVqFue1/ -u USERNAME -p PASSWORD -f FILENAME
  --like [value]          Like posts (import posts from json file) --like ./files/Posts.json  -u USERNAME -p PASSWORD -i SECONDS
  --comment [value]       Like posts (import posts from json file) --comment ./files/Posts.json -f ./files/Comments.json  -u USERNAME -p PASSWORD -i SECONDS
  --follow [value]        Follow users  --follow ./files/Users.json  -u USERNAME -p PASSWORD -i SECONDS
  --unfollow [value]      Unfollow users  --unfollow ./files/Users.json  -u USERNAME -p PASSWORD -i SECONDS
  --posters [value]       Scrape posters --posters ./files/Posts.json -f FILENAME
  -u, --username [value]  Your Username
  -p, --password [value]  Your Password
  -f, --file [value]      File Name (default: "File")
  -i, --interval <n>      Interval in seconds (default: "100")
  --post [value]          File containing posts
  -h, --help              output usage information
```

Scrape Followers 
```
instagram-bot --followers target-username -u USERNAME -p PASSWORD -f FILENAME
```
Scrape Following 
```
instagram-bot --following target-username -u USERNAME -p PASSWORD -f FILENAME
```
Scrape users who liked a post
```
instagram-bot --likers https://www.instagram.com/p/BtJOmVqFue1/ -u USERNAME -p PASSWORD -f FILENAME
```
Like Posts
```
instagram-bot --like ./files/Posts.json  -u USERNAME -p PASSWORD -i SECONDS
```
Check ./files/Posts.json for sample posts

Comment
```
instagram-bot --comment ./files/Posts.json -f ./files/Comments.json  -u USERNAME -p PASSWORD -i SECONDS
```
Check ./files/Comments.json for sample comments

Follow 
```
instagram-bot --follow ./files/Users.json  -u USERNAME -p PASSWORD -i SECONDS
```
Check ./files/Users.json for sample users

Scrape posters from posts
```
instagram-bot --posters ./files/Posts.json -f FILENAME
```
Unfollow users
Make a list of followers then
```
instagram-bot --unfollow ./files/Users.json  -u USERNAME -p PASSWORD -i SECONDS
```
