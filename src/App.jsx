import React, { useEffect, useState } from 'react'

const API = {
  list: 'http://localhost:3000/api/items',
}

function StatusBadge({ status }){
  const cls = status === 'urgent' ? 'status-badge status-urgent' : status === 'moyen' ? 'status-badge status-moyen' : 'status-badge status-tranquille'
  return <div className={cls}>{status}</div>
}

export default function App(){
  const [items, setItems] = useState([])
  const [label, setLabel] = useState('')
  const [status, setStatus] = useState('urgent')
  const [loading, setLoading] = useState(false)

  async function fetchList(){
    setLoading(true)
    try{
      const res = await fetch(API.list)
      const json = await res.json()
      setItems(json)
    }catch(e){
      console.error(e)
    }finally{setLoading(false)}
  }

  useEffect(()=>{fetchList()},[])

  async function addItem(){
    if(!label) return
    const payload = { label, status }
    const res = await fetch(API.list, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if(res.ok){ setLabel(''); fetchList() }
  }

  async function removeItem(id){
    const res = await fetch(`${API.list}/${id}`, { method: 'DELETE' })
    if(res.ok) fetchList()
  }

  async function changeStatus(id, newStatus){
    // update using PATCH
    const res = await fetch(`${API.list}/${id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status: newStatus }) })
    if(res.ok) fetchList()
  }

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1 style={{margin:0}}>Liste & status</h1>
          <div className="small">Ajouter/enlever des entrées — chaque entrée a un statut affiché dans un carré</div>
        </div>
        <div className="card" style={{display:'flex',gap:8,alignItems:'center'}}>
          <input className="input" placeholder="Nom de l'élément" value={label} onChange={e=>setLabel(e.target.value)} />
          <select value={status} onChange={e=>setStatus(e.target.value)} className="input" style={{maxWidth:140}}>
            <option value="urgent">urgent</option>
            <option value="moyen">moyen</option>
            <option value="tranquille">tranquille</option>
          </select>
          <button className="btn" onClick={addItem}>Ajouter</button>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <strong>Liste</strong>
          <div className="small">{loading ? 'Chargement...' : `${items.length} élément(s)`}</div>
        </div>

        <div className="list">
          {items.map(it=> (
            <div key={it.id} className="item card" style={{borderLeft:`4px solid rgba(255,255,255,0.03)`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700}}>{it.label}</div>
                  <div className="small">ID: {it.id}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
                  <StatusBadge status={it.status} />
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn small" onClick={()=>changeStatus(it.id, it.status === 'urgent' ? 'moyen' : it.status === 'moyen' ? 'tranquille' : 'urgent')}>Toggle</button>
                    <button className="btn small" onClick={()=>removeItem(it.id)}>Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
