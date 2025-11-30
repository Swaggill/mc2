Projet minimal – frontend React + backend Express (in-memory) + script CraftOS pour afficher la liste sur un Advanced Monitor (ComputerCraft / CC: Tweaked).

Quickstart:
1. `npm install`
2. `npm run start`   (build and start server on :3000)

CraftOS usage example (sur l'ordinateur Minecraft):
`monitor.lua http://192.168.0.10:3000/api/items`
=======
# Liste & status

Projet minimal – frontend React + backend Express (in-memory) + script CraftOS pour afficher la liste sur un Advanced Monitor (ComputerCraft / CC: Tweaked).

Déploiement sur Render:
- Frontend: Static Site sur Render (avec `npm run build`)
- Backend: Web Service sur Render (avec `npm run server`)

Quickstart local:
1. `npm install`
2. `npm run server`  (start api on :3000)
3. `npm run start`   (start vite dev server)

CraftOS usage example (sur l'ordinateur Minecraft):
`wget https://your-render-app.onrender.com/monitor.lua`
puis `lua monitor.lua`
