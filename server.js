// Minimal Express API to store items in-memory. For production replace with DB.
const express = require('express')
const cors = require('cors')
const path = require('path')
const os = require('os')
const app = express()
app.use(cors())
app.use(express.json())

let nextId = 1
let items = [ { id: nextId++, label: 'Tâche 1', status: 'urgent' }, { id: nextId++, label: 'Tâche 2', status: 'moyen' }, { id: nextId++, label: 'Tâche 3', status: 'tranquille' } ]

app.get('/api/items', (req, res)=>{
  res.json(items)
})

app.post('/api/items', (req, res)=>{
  const { label, status } = req.body
  if(!label) return res.status(400).json({ error: 'label required' })
  const it = { id: nextId++, label, status: status || 'offline' }
  items.push(it)
  res.status(201).json(it)
})

app.delete('/api/items/:id',(req,res)=>{
  const id = Number(req.params.id)
  const old = items.length
  items = items.filter(i=>i.id !== id)
  if(items.length === old) return res.status(404).json({error:'not found'})
  res.status(204).end()
})

app.patch('/api/items/:id',(req,res)=>{
  const id = Number(req.params.id)
  const it = items.find(i=>i.id===id)
  if(!it) return res.status(404).json({error:'not found'})
  const { status, label } = req.body
  if(status) it.status = status
  if(label) it.label = label
  res.json(it)
})

// Serve frontend built files if any
app.use(express.static(path.join(__dirname, 'dist')))

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000
app.listen(port, ()=>{
  console.log('Server running on port', port)
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`Server IP: http://${iface.address}:${port}`)
      }
    }
  }
})
