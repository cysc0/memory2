## My (significant) changes

assets/css/app.css - custom css for memory game  
assets/js/memory-game.jsx  
assets/js/socket.js  
lib/memory_web/channels/games_channel.ex  
lib/memory/game.ex  
(nginx/service files, elixir config files, etc)  
  
## Tile Flashing behavior
  
When clicking the first tile in a pair, the client sends ONE
request to ask for that tile's contents.
When clicking the second tile in a pair, the client sends TWO
requests, the first to ask for the second tile's contents,
and the second to ask the server if the pair matches, if not,
the server sends back the state with that pair wiped out
(otherwise if they matched, the server echos the state
received from the client). Upon receiving that
second request, the server sleeps briefly before responding.  
In short, it is handled server side.