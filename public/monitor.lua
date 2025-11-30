-- CraftOS (ComputerCraft/Tweaked) script to display list from the API on an advanced monitor
-- Usage: place this file on the computer and run `lua monitor.lua http://<server-ip>:3000/api/items`

local args = { ... }
local url = args[1] or 'https://mc2-okg3.onrender.com/api/items'
local monitor = peripheral.find('monitor')
if not monitor then
  print('Advanced monitor not found. Attach one and try again.')
  return
end

monitor.setTextScale(0.5)
local http = http
if not http then
  print('HTTP API must be enabled in the server (minecraft).')
  return
end

local function fetch()
  local ok, res = pcall(function() return http.get(url) end)
  if not ok or not res then return nil, 'fetch failed' end
  local body = res.readAll()
  res.close()
  local data = textutils.unserializeJSON and textutils.unserializeJSON(body) or textutils.unserialize(body)
  return data
end

local function draw(list)
  monitor.clear()
  local w, h = monitor.getSize()
  local y = 1
  monitor.setCursorPos(1,y)
  monitor.write('Liste (rafraichi every 5s)')
  y = y + 2
  for i, item in ipairs(list) do
    if y > h then break end
    -- Build one-line: "Label — ... status"
    local line = string.format('%d) %s — %s', item.id, item.label, item.status)
    -- If too long, cut
    if #line > w then line = string.sub(line,1,w) end
    monitor.setCursorPos(1,y)
    monitor.write(line)
    y = y + 1
  end
end

while true do
  local list, err = fetch()
  if list then
    draw(list)
  else
    monitor.clear()
    monitor.setCursorPos(1,1)
    monitor.write('Erreur: '..tostring(err))
  end
  sleep(5)
end
