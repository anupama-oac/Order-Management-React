import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';



import { useState, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────
const CURRENT_USER = { name:"Ahmed Al Mansoor", email:"ahmed@fitorder.ae", role:"super_admin" };

const ROLES = [
  { key:"super_admin", label:"Super Admin", color:"#6b21a8", bg:"#faf5ff", border:"#d8b4fe",
    permissions:["Full access to all modules","Add, edit, deactivate users","Assign & change roles","Revert order stages","Access admin settings"] },
  { key:"operations",  label:"Operations",  color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe",
    permissions:["View & manage orders","Move orders through pipeline stages","Send WhatsApp & email notifications","Print delivery notes","Cannot revert order stages","No access to admin users"] },
];

const ALL_STAGES = [
  { id:0, key:"new",        label:"New order"        },
  { id:1, key:"processing", label:"Order processing" },
  { id:2, key:"dispatched", label:"Dispatching"      },
  { id:3, key:"completed",  label:"Order completed"  },
];

const UFC_MEMBERS     = ["Ali Hassan","Mohammed Rashid","Tariq Al Farsi","Khalid Nasser","Saeed Al Mansoori"];
const SUPPLIERS       = ["Al Futtaim Sports","Sport Zone Supplier","Fitness World","Gulf Equipment Co."];
const EXT_DRIVERS     = ["Ahmed Bilal","Raju Kumar","Santhosh P.","Vikram Singh"];
const CHANNEL_PRESETS = ["UFC Team","Supplier","Max Courier","First Flight","Naqel Express","3rd Party Driver"];
const INSTALL_OPTS    = [
  { value:"with_delivery",  label:"Installation along with this delivery",   color:"#065f46", bg:"#ecfdf5", border:"#6ee7b7" },
  { value:"with_remaining", label:"Installation along with remaining items", color:"#92400e", bg:"#fffbeb", border:"#fcd34d" },
  { value:"later",          label:"Installation on a later day",             color:"#6b21a8", bg:"#faf5ff", border:"#d8b4fe" },
];
const WH_OPTIONS = [
  { value:"na",           label:"N/A",             desc:"Items not from warehouse",     color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb" },
  { value:"request_sent", label:"Request sent",     desc:"Warehouse request submitted",  color:"#1d4ed8", bg:"#eff6ff", border:"#bfdbfe" },
  { value:"not_sent",     label:"Request not sent", desc:"Yet to send warehouse request",color:"#92400e", bg:"#fffbeb", border:"#fcd34d" },
];
const COMPANY = { name:"FitOrder", tagline:"Fitness Equipment Specialists", address:"Office 204, Building 7, Al Quoz Industrial Area 1, Dubai, UAE", phone:"+971 4 123 4567", email:"info@fitorder.ae", website:"www.fitorder.ae", trn:"100234567800003" };

const ORDERS_DATA = [
  { id:"1", invoiceNo:"INV-1041", customer:"Al Reem Fitness",      email:"orders@alreem.ae",        phone:"+971 50 111 2233", address:"Unit 5, Al Quoz, Dubai", trn:"100111222300001", items:[{id:"i1",name:"Treadmill Pro X2",sku:"TM-PRX2",qty:1,price:12000},{id:"i2",name:"Weight Set 20kg",sku:"WS-20KG",qty:1,price:500}], invoiceDate:"2026-06-10", zohoStatus:"Draft", stage:0 },
  { id:"2", invoiceNo:"INV-1042", customer:"Dubai Sports Hub",     email:"purchase@dubaisports.ae", phone:"+971 55 234 5678", address:"Shop 12, JLT, Dubai",     trn:"100222333400002", items:[{id:"i1",name:"Rowing Machine RM-5",sku:"RM-5-BLK",qty:1,price:8200}],                                                                  invoiceDate:"2026-06-10", zohoStatus:"Sent",  stage:1 },
  { id:"3", invoiceNo:"INV-1044", customer:"ProGym Supplies",      email:"admin@progym.ae",         phone:"+971 56 456 7890", address:"Unit 14, Al Quoz 3, Dubai",trn:"100987654300001", items:[{id:"i1",name:"Cable Machine CM-10",sku:"CM-10-BLK",qty:1,price:12000},{id:"i2",name:"Dumbbell Rack 5–30kg",sku:"DR-530",qty:1,price:4700},{id:"i3",name:"Resistance Bands Pack",sku:"RB-PACK-5",qty:2,price:500}], invoiceDate:"2026-06-09", zohoStatus:"Draft", stage:2 },
  { id:"4", invoiceNo:"INV-1045", customer:"AbuDhabi Fitness Co.", email:"ops@adfitness.ae",        phone:"+971 54 567 8901", address:"Mussafah, Abu Dhabi",      trn:"100444555600004", items:[{id:"i1",name:"Smith Machine SM-2",sku:"SM-2-SLV",qty:1,price:7600}],                                                                  invoiceDate:"2026-06-08", zohoStatus:"Sent",  stage:3 },
  { id:"5", invoiceNo:"INV-1046", customer:"Iron Arena",           email:"hello@ironarena.ae",      phone:"+971 50 678 9012", address:"Ras Al Khaimah",           trn:"100555666700005", items:[{id:"i1",name:"Leg Press LP-7",sku:"LP-7-BLK",qty:1,price:4200},{id:"i2",name:"EZ Curl Bar Set",sku:"EZ-BAR",qty:1,price:800}],       invoiceDate:"2026-06-07", zohoStatus:"Draft", stage:0 },
  { id:"6", invoiceNo:"INV-1047", customer:"Flex Gym Sharjah",     email:"info@flexgym.ae",         phone:"+971 55 789 0123", address:"Al Majaz, Sharjah",        trn:"100666777800006", items:[{id:"i1",name:"Functional Trainer FT-4",sku:"FT-4-RED",qty:1,price:14300}],                                                              invoiceDate:"2026-06-07", zohoStatus:"Draft", stage:1 },
];

const ADMIN_USERS_DATA = [
  { id:1, name:"Ahmed Al Mansoor", email:"ahmed@fitorder.ae",  role:"super_admin", status:"active",   created:"01 Jun 2026" },
  { id:2, name:"Sara Al Hashimi",  email:"sara@fitorder.ae",   role:"operations",  status:"active",   created:"03 Jun 2026" },
  { id:3, name:"Khalid Nasser",    email:"khalid@fitorder.ae", role:"operations",  status:"active",   created:"05 Jun 2026" },
  { id:4, name:"Riya Sharma",      email:"riya@fitorder.ae",   role:"operations",  status:"inactive", created:"07 Jun 2026" },
];

const SIDEBAR_NAV = [
  { group:"Orders", items:[
    { label:"New orders",          badge:2, icon:"M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" },
    { label:"All orders",          badge:0, icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label:"Processing orders",   badge:2, icon:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { label:"Delivered orders",    badge:1, icon:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ]},
  { group:"Admin", items:[
    { label:"Admin users", icon:"M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" },
  ]},
];

const todayStr    = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const fmtDate     = d => { if(!d) return "—"; const p=d.split("-"); if(p.length<3) return d; const [y,m,day]=p; return `${day} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+m-1]} ${y}`; };
const fmtDateLong = d => { if(!d) return "—"; const p=d.split("-"); if(p.length<3) return d; const [y,m,day]=p; return `${day} ${["January","February","March","April","May","June","July","August","September","October","November","December"][+m-1]} ${y}`; };
const initials    = n => (n||"").split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();
const nowLabel    = () => { const d=new Date(); return `${d.getDate()} Jun 2026, ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")} ${d.getHours()>=12?"PM":"AM"}`; };
const dnNo        = (inv,n) => `DN-${inv.replace("INV-","")}-T${n}`;

const INP = {fontSize:12,padding:"7px 10px",border:"1px solid #e5e7eb",borderRadius:7,outline:"none",fontFamily:"system-ui",color:"#111",background:"#fff",width:"100%",boxSizing:"border-box"};
const SEC = {fontSize:11,fontWeight:500,color:"#6b7280",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"};

// ── Shared components ─────────────────────────────────────────────────────────
function Icon({ path, size=16 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{flexShrink:0}}>
      {path.split(" M").map((p,i)=><path key={i} d={(i===0?"":"M")+p}/>)}
    </svg>
  );
}
function Toggle({ on, onChange, label }) {
  return (
    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
      <div onClick={onChange} style={{width:34,height:20,borderRadius:10,background:on?"#059669":"#d1d5db",position:"relative",transition:"background 0.2s",flexShrink:0,cursor:"pointer"}}>
        <div style={{position:"absolute",top:3,left:on?17:3,width:14,height:14,borderRadius:"50%",background:"#fff",transition:"left 0.2s"}}/>
      </div>
      <span style={{fontSize:12,color:"#374151"}}>{label}</span>
    </label>
  );
}
function ComboBox({ label, options, value, onChange, placeholder }) {
  const [open,setOpen]=useState(false); const [query,setQuery]=useState(value||"");
  const filtered=options.filter(o=>o.toLowerCase().includes(query.toLowerCase()));
  return (
    <div style={{position:"relative"}}>
      {label&&<div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>{label}</div>}
      <input value={query} onChange={e=>{setQuery(e.target.value);onChange(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),150)} placeholder={placeholder||"Type or select…"} style={INP}/>
      {open&&(filtered.length>0||(query&&!options.includes(query)))&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:7,zIndex:50,marginTop:2,boxShadow:"0 4px 12px rgba(0,0,0,0.08)",maxHeight:160,overflowY:"auto"}}>
          {filtered.map(o=><div key={o} onMouseDown={()=>{setQuery(o);onChange(o);setOpen(false);}} style={{padding:"8px 12px",fontSize:12,color:"#111",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>{o}</div>)}
          {query&&!options.includes(query)&&<div onMouseDown={()=>{onChange(query);setOpen(false);}} style={{padding:"8px 12px",fontSize:12,color:"#059669",cursor:"pointer",fontWeight:500}}>+ Use "{query}"</div>}
        </div>
      )}
    </div>
  );
}
function MultiSelectCombo({ label, options, selected, onChange }) {
  const [open,setOpen]=useState(false); const [query,setQuery]=useState("");
  const toggle=v=>onChange(selected.includes(v)?selected.filter(x=>x!==v):[...selected,v]);
  const addCustom=()=>{const v=query.trim();if(v&&!selected.includes(v))onChange([...selected,v]);setQuery("");setOpen(false);};
  const filtered=options.filter(o=>o.toLowerCase().includes(query.toLowerCase())&&!selected.includes(o));
  return (
    <div style={{position:"relative"}}>
      {label&&<div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>{label}</div>}
      {selected.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>{selected.map(s=><span key={s} style={{background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7",borderRadius:20,fontSize:11,padding:"3px 10px",display:"flex",alignItems:"center",gap:5}}>{s}<span onClick={()=>toggle(s)} style={{cursor:"pointer",fontWeight:700,fontSize:13}}>×</span></span>)}</div>}
      <input value={query} onChange={e=>{setQuery(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),150)} placeholder="Search or type…" style={INP}/>
      {open&&(filtered.length>0||(query.trim()&&!options.includes(query.trim())))&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:7,zIndex:50,marginTop:2,boxShadow:"0 4px 12px rgba(0,0,0,0.08)",maxHeight:180,overflowY:"auto"}}>
          {filtered.map(o=><div key={o} onMouseDown={()=>{toggle(o);setQuery("");setOpen(false);}} style={{padding:"8px 12px",fontSize:12,color:"#111",cursor:"pointer",display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}><input type="checkbox" readOnly checked={selected.includes(o)} style={{accentColor:"#059669",pointerEvents:"none"}}/>{o}</div>)}
          {query.trim()&&!options.includes(query.trim())&&!selected.includes(query.trim())&&<div onMouseDown={addCustom} style={{padding:"8px 12px",fontSize:12,color:"#059669",cursor:"pointer",fontWeight:500}}>+ Add "{query.trim()}"</div>}
        </div>
      )}
    </div>
  );
}

// ── Delivery Note Modal ───────────────────────────────────────────────────────
function LogoMark({ size=32 }) {
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#059669"/><path d="M10 28 L20 12 L30 28" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 22 L26 22" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="12" r="2.5" fill="#fff"/></svg>;
}
function DeliveryNoteModal({ trip, tripNo, totalTrips, order, onClose }) {
  const printRef = useRef();
  const dn = dnNo(order.invoiceNo, tripNo);
  const itemsInTrip = order.items.filter(i => trip.items.has(i.id));
  const handlePrint = () => {
    const win = window.open("","_blank");
    win.document.write(`<html><head><title>${dn}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:13px;color:#111}.wrap{width:210mm;padding:16mm;margin:0 auto}table{width:100%;border-collapse:collapse}th,td{padding:8px 10px;font-size:12px;text-align:left}thead th{background:#f3f4f6;font-weight:700;border-bottom:2px solid #059669}tbody tr{border-bottom:1px solid #e5e7eb}</style></head><body>${printRef.current.innerHTML}</body></html>`);
    win.document.close(); win.focus(); setTimeout(()=>{win.print();win.close();},300);
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:300,display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"24px 16px"}}>
      <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:700,boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 20px",borderBottom:"1px solid #e5e7eb",background:"#f9fafb",borderRadius:"12px 12px 0 0"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:13,fontWeight:500,color:"#111"}}>Delivery Note — {dn}</span>
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7"}}>Trip {tripNo}</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handlePrint} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"7px 14px",background:"#059669",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:500}}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg>
              Print
            </button>
            <button onClick={onClose} style={{fontSize:12,padding:"7px 12px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#6b7280",cursor:"pointer"}}>Close</button>
          </div>
        </div>
        <div style={{padding:"20px 24px",background:"#f3f4f6"}}>
          <div ref={printRef} style={{background:"#fff",borderRadius:8,padding:"28px 32px",border:"1px solid #e5e7eb",fontFamily:"Arial,sans-serif",fontSize:13,color:"#111",lineHeight:1.5}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,paddingBottom:16,borderBottom:"2px solid #059669"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}><LogoMark size={40}/><div><div style={{fontSize:18,fontWeight:700,color:"#059669"}}>{COMPANY.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{COMPANY.tagline}</div></div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,color:"#111",marginBottom:3}}>DELIVERY NOTE</div><div style={{fontSize:12,color:"#6b7280"}}>{dn}</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:16}}>
              {[{title:"From",name:COMPANY.name,lines:[COMPANY.address,`Tel: ${COMPANY.phone}`,COMPANY.email],sub:`TRN: ${COMPANY.trn}`},{title:"Deliver To",name:order.customer.name,lines:[order.customer.address,`Tel: ${order.customer.phone}`,order.customer.email],sub:`TRN: ${order.customer.trn||"—"}`}].map(col=>(
                <div key={col.title}><div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>{col.title}</div>
                  <div style={{fontSize:12,lineHeight:1.7}}><div style={{fontWeight:700,color:"#111"}}>{col.name}</div>{col.lines.map((l,i)=><div key={i} style={{color:"#374151"}}>{l}</div>)}<div style={{color:"#6b7280",marginTop:2}}>{col.sub}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",marginBottom:16,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[["Invoice No.",order.invoiceNo],["Invoice Date",fmtDateLong(order.invoiceDate)],["Delivery Date",fmtDateLong(trip.date)],["DN No.",dn],["Trip",`Trip ${tripNo} of ${totalTrips}`],["Status",order.zohoStatus]].map(([l,v])=>(
                <div key={l}><div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",marginBottom:2}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:"#111"}}>{v}</div></div>
              ))}
            </div>
            <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
              <thead><tr style={{background:"#f3f4f6",borderBottom:"2px solid #059669"}}>{["#","Item","SKU","Qty","Condition"].map((h,i)=><th key={h} style={{padding:"8px 10px",fontSize:11,fontWeight:700,color:"#374151",textAlign:i>=3?"center":"left"}}>{h}</th>)}</tr></thead>
              <tbody>{itemsInTrip.map((item,i)=>(
                <tr key={item.id} style={{borderBottom:"1px solid #f3f4f6",background:i%2===0?"#fff":"#fafafa"}}>
                  <td style={{padding:"8px 10px",fontSize:12,color:"#6b7280"}}>{i+1}</td>
                  <td style={{padding:"8px 10px",fontSize:12,fontWeight:600,color:"#111"}}>{item.name}</td>
                  <td style={{padding:"8px 10px",fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>{item.sku}</td>
                  <td style={{padding:"8px 10px",fontSize:12,textAlign:"center",fontWeight:700}}>{item.qty}</td>
                  <td style={{padding:"8px 10px",textAlign:"center"}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7",fontWeight:600}}>Good</span></td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:16}}>
              {[["Delivered by","FitOrder Representative"],["Received by","Customer / Authorised Signatory"]].map(([l,s])=>(
                <div key={l}><div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",marginBottom:5}}>{l}</div>
                  <div style={{border:"1px solid #d1d5db",borderRadius:6,height:56,marginBottom:5}}/>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#9ca3af"}}><span>Name &amp; Signature</span><span>Date: ___________</span></div>
                  <div style={{marginTop:2,fontSize:10,color:"#b0b7c0"}}>{s}</div>
                </div>
              ))}
            </div>
            <div style={{borderTop:"1px solid #e5e7eb",paddingTop:10,display:"flex",justifyContent:"space-between"}}>
              <div style={{fontSize:10,color:"#9ca3af"}}>{COMPANY.website} · {COMPANY.phone}</div>
              <div style={{fontSize:10,color:"#9ca3af"}}>Page 1 of 1 · {dn}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TripForm ──────────────────────────────────────────────────────────────────
function TripForm({ tripNo, order, savedItemIds, onSave, onCancel }) {
  const available = order.items.filter(i => !savedItemIds.has(i.id));
  const [selIds,      setSelIds]     = useState(() => available.map(i=>i.id));
  const [commonInst,  setCommonInst] = useState("");
  const [itemInst,    setItemInst]   = useState({});
  const [date,        setDate]       = useState(todayStr());
  const [channel,     setChannel]    = useState("");
  const [teamMembers, setTeamMembers]= useState([]);
  const [supplier,    setSupplier]   = useState("");
  const [tracking,    setTracking]   = useState("");
  const [driverName,  setDriverName] = useState("");
  const [contacted,   setContacted]  = useState("no");
  const [sendWa,      setSendWa]     = useState(true);
  const [sendEm,      setSendEm]     = useState(true);
  const isUFC=channel==="UFC Team", isSupplier=channel==="Supplier", is3PDrv=channel==="3rd Party Driver";
  const is3PL=channel&&!isUFC&&!isSupplier&&!is3PDrv;
  const canSave=selIds.length>0&&channel!=="";
  const isFullTrip = savedItemIds.size===0;
  const toggleItem=id=>setSelIds(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const setInst=(id,v)=>setItemInst(p=>({...p,[id]:v}));
  return (
    <div style={{border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
        <span style={{fontSize:13,fontWeight:500,color:"#111"}}>Delivery trip {tripNo}</span>
        {selIds.length>0&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7"}}>{selIds.length} item{selIds.length>1?"s":""} selected</span>}
      </div>
      <div style={{padding:"14px",display:"flex",flexDirection:"column",gap:12}}>
        <div>
          <div style={{fontSize:11,fontWeight:500,color:"#6b7280",marginBottom:8}}>Items in this trip</div>
          {available.map(item=>{
            const isSel=selIds.includes(item.id);
            return (
              <div key={item.id} style={{border:`1px solid ${isSel?"#059669":"#e5e7eb"}`,borderRadius:8,overflow:"hidden",marginBottom:6}}>
                <label style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",cursor:"pointer",background:isSel?"#f0fdf4":"#fff"}}>
                  <input type="checkbox" checked={isSel} onChange={()=>toggleItem(item.id)} style={{accentColor:"#059669",width:13,height:13,flexShrink:0}}/>
                  <span style={{flex:1,fontWeight:500,color:"#111",fontSize:12}}>{item.name}</span>
                  <span style={{fontSize:11,color:"#9ca3af",marginRight:6}}>SKU: {item.sku}</span>
                  <span style={{fontSize:11,color:"#6b7280"}}>Qty: {item.qty}</span>
                </label>
                {!isFullTrip&&isSel&&(
                  <div style={{borderTop:"1px solid #e5e7eb",padding:"8px 12px",background:"#fafafa"}}>
                    <div style={{fontSize:11,color:"#6b7280",marginBottom:5}}>Installation for this item</div>
                    <div style={{display:"flex",flexDirection:"column",gap:3}}>
                      {INSTALL_OPTS.map(opt=>{const active=itemInst[item.id]===opt.value;return(<label key={opt.value} style={{display:"flex",alignItems:"center",gap:7,fontSize:11,cursor:"pointer",padding:"5px 9px",borderRadius:6,border:`1px solid ${active?opt.border:"#e5e7eb"}`,background:active?opt.bg:"#fff",color:active?opt.color:"#374151"}}><input type="radio" name={`inst-${item.id}-t${tripNo}`} checked={active} onChange={()=>setInst(item.id,opt.value)} style={{accentColor:"#059669",flexShrink:0}}/>{opt.label}</label>);})}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {order.items.filter(i=>savedItemIds.has(i.id)).map(item=>(
            <div key={item.id} style={{border:"1px solid #e5e7eb",borderRadius:8,marginBottom:6,opacity:0.4}}>
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"#fff"}}>
                <input type="checkbox" disabled checked={false} style={{width:13,height:13,flexShrink:0}}/>
                <span style={{flex:1,fontWeight:500,color:"#111",fontSize:12}}>{item.name}</span>
                <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:"#f3f4f6",color:"#9ca3af",border:"1px solid #e5e7eb"}}>Already dispatched</span>
              </div>
            </div>
          ))}
          {isFullTrip&&selIds.length>0&&(
            <div style={{marginTop:4,background:"#fafafa",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>Installation for all items</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}}>
                {INSTALL_OPTS.map(opt=>{const active=commonInst===opt.value;return(<label key={opt.value} style={{display:"flex",alignItems:"center",gap:7,fontSize:11,cursor:"pointer",padding:"5px 9px",borderRadius:6,border:`1px solid ${active?opt.border:"#e5e7eb"}`,background:active?opt.bg:"#fff",color:active?opt.color:"#374151"}}><input type="radio" name={`common-inst-t${tripNo}`} checked={active} onChange={()=>setCommonInst(opt.value)} style={{accentColor:"#059669",flexShrink:0}}/>{opt.label}</label>);})}
              </div>
            </div>
          )}
        </div>
        <div><div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>Dispatch date</div><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{...INP,width:"50%"}}/></div>
        <ComboBox label="Delivery channel" options={CHANNEL_PRESETS} value={channel} onChange={setChannel} placeholder="Select or type channel…"/>
        {isUFC&&<MultiSelectCombo label="Assign team members" options={UFC_MEMBERS} selected={teamMembers} onChange={setTeamMembers}/>}
        {isSupplier&&<ComboBox label="Supplier name" options={SUPPLIERS} value={supplier} onChange={setSupplier} placeholder="Select or type supplier…"/>}
        {is3PL&&<div><div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>Tracking number</div><input type="text" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. NQL-123456789" style={INP}/></div>}
        {is3PDrv&&<ComboBox label="Driver name" options={EXT_DRIVERS} value={driverName} onChange={setDriverName} placeholder="Select or type driver…"/>}
        <div>
          <div style={SEC}>Customer contacted?</div>
          <div style={{display:"flex",gap:8}}>
            {[["yes","Yes, contacted"],["no","Not yet"]].map(([v,l])=>(
              <label key={v} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,cursor:"pointer",padding:"7px 12px",borderRadius:8,border:`1px solid ${contacted===v?(v==="yes"?"#059669":"#e5e7eb"):"#e5e7eb"}`,background:contacted===v?(v==="yes"?"#f0fdf4":"#fff"):"#fff",flex:1,justifyContent:"center",fontWeight:500}}>
                <input type="radio" name={`cont-t${tripNo}`} checked={contacted===v} onChange={()=>setContacted(v)} style={{accentColor:"#059669"}}/>{l}
              </label>
            ))}
          </div>
          {contacted==="no"&&<div style={{marginTop:6,fontSize:11,color:"#b91c1c",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:6,padding:"5px 10px"}}>Please contact the customer before dispatching.</div>}
        </div>
        <div style={{borderTop:"1px solid #f3f4f6",paddingTop:10}}>
          <div style={SEC}>Send notifications</div>
          <div style={{display:"flex",gap:20,marginBottom:4}}><Toggle on={sendWa} onChange={()=>setSendWa(v=>!v)} label="WhatsApp (Gallabox)"/><Toggle on={sendEm} onChange={()=>setSendEm(v=>!v)} label="Email (Mailgun)"/></div>
          {(sendWa||sendEm)&&<div style={{fontSize:11,color:"#6b7280"}}>Pre-set dispatch message sent automatically on save.</div>}
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4,borderTop:"1px solid #f3f4f6"}}>
          {onCancel&&<button onClick={onCancel} style={{fontSize:12,padding:"7px 14px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#6b7280",cursor:"pointer"}}>Cancel</button>}
          <button onClick={()=>onSave({id:Date.now(),items:new Set(selIds),date,channel})} disabled={!canSave}
            style={{fontSize:12,padding:"7px 18px",background:canSave?"#059669":"#e5e7eb",color:canSave?"#fff":"#9ca3af",border:"none",borderRadius:7,cursor:canSave?"pointer":"not-allowed",fontWeight:500}}>
            Save trip {tripNo}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stage Components ──────────────────────────────────────────────────────────
function NewOrderStage({ addLog, onAdvance, nextLabel }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:10,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:8,padding:"12px 14px"}}>
        <svg width="15" height="15" fill="none" stroke="#1d4ed8" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div><div style={{fontSize:12,fontWeight:500,color:"#1e3a8a"}}>Order pulled from Zoho Books</div><div style={{fontSize:11,color:"#3b82f6"}}>Review and confirm this order to move it into processing.</div></div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>{addLog("Order confirmed","New order","stage");onAdvance();}}
          style={{fontSize:12,padding:"8px 20px",background:"#111827",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,display:"inline-flex",alignItems:"center",gap:6}}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Order confirmed — move to {nextLabel}
        </button>
      </div>
    </div>
  );
}

function ProcessingStage({ addLog, onAdvance, nextLabel }) {
  const [whStatus,setWhStatus]=useState("na");
  const [internalNote,setNote]=useState("");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 14px",display:"flex",flexDirection:"column",gap:14}}>
        <div>
          <div style={SEC}>Warehouse request status</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {WH_OPTIONS.map(opt=>(
              <label key={opt.value} onClick={()=>{setWhStatus(opt.value);addLog(`Warehouse status: ${opt.label}`,"Order processing","warehouse");}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",border:`1px solid ${whStatus===opt.value?opt.border:"#e5e7eb"}`,borderRadius:8,cursor:"pointer",background:whStatus===opt.value?opt.bg:"#fff"}}>
                <input type="radio" name="wh" checked={whStatus===opt.value} onChange={()=>{}} style={{accentColor:"#059669"}}/>
                <div style={{flex:1}}><div style={{fontSize:12,fontWeight:500,color:whStatus===opt.value?opt.color:"#111"}}>{opt.label}</div><div style={{fontSize:11,color:"#9ca3af"}}>{opt.desc}</div></div>
                {whStatus===opt.value&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:opt.bg,color:opt.color,border:`1px solid ${opt.border}`,fontWeight:500}}>Selected</span>}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div style={SEC}>Internal note</div>
          <textarea value={internalNote} onChange={e=>setNote(e.target.value)} placeholder="Add an internal note (optional)…" rows={2} style={{...INP,resize:"vertical"}}/>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={onAdvance} style={{fontSize:12,padding:"8px 18px",background:"#111827",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>Move to {nextLabel} →</button></div>
    </div>
  );
}

function DispatchingStage({ order, addLog, onAdvance, nextLabel, isLast }) {
  const [savedTrips,setSavedTrips]=useState([]);
  const [showForm,  setShowForm]  =useState(true);
  const [printTrip, setPrintTrip] =useState(null);
  const savedIds     =new Set(savedTrips.flatMap(t=>[...t.items]));
  const allDispatched=order.items.every(i=>savedIds.has(i.id));
  const pendingCount =order.items.filter(i=>!savedIds.has(i.id)).length;
  const handleSave=data=>{setSavedTrips(p=>[...p,{...data,tripNo:p.length+1}]);setShowForm(false);addLog(`Delivery trip ${savedTrips.length+1} saved`,"Dispatching","stage");};
  const removeTrip=idx=>setSavedTrips(p=>p.filter((_,i)=>i!==idx).map((t,i)=>({...t,tripNo:i+1})));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {printTrip&&<DeliveryNoteModal trip={printTrip} tripNo={savedTrips.findIndex(t=>t.id===printTrip.id)+1} totalTrips={savedTrips.length} order={order} onClose={()=>setPrintTrip(null)}/>}
      {savedTrips.length>0&&(
        <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px"}}>
          <div style={{fontSize:11,fontWeight:500,color:"#6b7280",marginBottom:8}}>Dispatch progress</div>
          {order.items.map(item=>{const done=savedIds.has(item.id);const trip=savedTrips.find(t=>t.items.has(item.id));return(
            <div key={item.id} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,marginBottom:5}}>
              <span style={{width:16,height:16,borderRadius:"50%",background:done?"#059669":"#e5e7eb",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>}</span>
              <span style={{flex:1,color:done?"#374151":"#9ca3af"}}>{item.name}</span>
              {done&&<span style={{fontSize:10,color:"#6b7280"}}>Trip {trip?.tripNo} · {trip?.date}</span>}
              {!done&&<span style={{fontSize:10,color:"#f59e0b",fontWeight:500}}>Pending</span>}
            </div>
          );})}
          {allDispatched?<div style={{marginTop:8,fontSize:11,color:"#065f46",background:"#ecfdf5",border:"1px solid #6ee7b7",borderRadius:6,padding:"5px 10px"}}>All items dispatched. Ready to proceed.</div>
            :<div style={{marginTop:8,fontSize:11,color:"#92400e",background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:6,padding:"5px 10px"}}>{pendingCount} item{pendingCount>1?"s":""} not yet dispatched.</div>}
        </div>
      )}
      {savedTrips.map((trip,idx)=>(
        <div key={trip.id} style={{border:"1px solid #6ee7b7",borderRadius:10,background:"#f0fdf4",padding:"10px 14px"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <span style={{width:22,height:22,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><svg width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></span>
              <div><div style={{fontSize:12,fontWeight:500,color:"#065f46"}}>Trip {trip.tripNo} — {trip.date} — {trip.channel||"—"}</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{[...trip.items].map(id=>order.items.find(i=>i.id===id)?.name).filter(Boolean).join(", ")}</div>
              </div>
            </div>
            <button onClick={()=>removeTrip(idx)} style={{fontSize:11,color:"#dc2626",background:"none",border:"none",cursor:"pointer",flexShrink:0}}>Remove</button>
          </div>
          <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #bbf7d0",display:"flex",justifyContent:"flex-end"}}>
            <button onClick={()=>setPrintTrip(trip)} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"6px 14px",background:"#059669",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:500}}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z"/></svg>
              Print Delivery Note
            </button>
          </div>
        </div>
      ))}
      {showForm&&<TripForm key={savedTrips.length} tripNo={savedTrips.length+1} order={order} savedItemIds={savedIds} onSave={handleSave} onCancel={savedTrips.length>0?()=>setShowForm(false):null}/>}
      {!showForm&&!allDispatched&&(
        <button onClick={()=>setShowForm(true)} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"9px 14px",border:"1px dashed #d1d5db",borderRadius:8,background:"#fff",color:"#6b7280",cursor:"pointer",alignSelf:"flex-start"}}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
          Schedule next delivery trip
        </button>
      )}
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:4}}>
        <button onClick={()=>{addLog("All items dispatched","Dispatching");onAdvance();}} disabled={!allDispatched||showForm}
          style={{fontSize:12,padding:"8px 18px",background:allDispatched&&!showForm?"#111827":"#e5e7eb",color:allDispatched&&!showForm?"#fff":"#9ca3af",border:"none",borderRadius:8,cursor:allDispatched&&!showForm?"pointer":"not-allowed",fontWeight:500}}>
          {isLast?"Mark as complete":`Move to ${nextLabel} →`}
        </button>
      </div>
    </div>
  );
}

function CompletedStage() {
  const [sendWa,setSendWa]=useState(true); const [sendEm,setSendEm]=useState(true); const [done,setDone]=useState(false);
  if(done) return(
    <div style={{background:"#ecfdf5",border:"1px solid #6ee7b7",borderRadius:8,padding:"20px",textAlign:"center"}}>
      <div style={{fontSize:24,marginBottom:8}}>🎉</div>
      <div style={{fontSize:14,fontWeight:500,color:"#065f46",marginBottom:4}}>Order completed!</div>
      <div style={{fontSize:12,color:"#6b7280"}}>Review request sent to customer.</div>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"14px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#ecfdf5",border:"1px solid #6ee7b7",borderRadius:7,padding:"10px 12px",marginBottom:14}}>
          <svg width="16" height="16" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><div style={{fontSize:12,fontWeight:500,color:"#065f46"}}>All items delivered</div><div style={{fontSize:11,color:"#6b7280"}}>Send a review request and mark order as completed.</div></div>
        </div>
        <div style={SEC}>Send review request</div>
        <div style={{display:"flex",gap:20,marginBottom:8}}><Toggle on={sendWa} onChange={()=>setSendWa(v=>!v)} label="WhatsApp (Gallabox)"/><Toggle on={sendEm} onChange={()=>setSendEm(v=>!v)} label="Email (Mailgun)"/></div>
        {(sendWa||sendEm)&&<div style={{fontSize:11,color:"#6b7280"}}>Pre-set review request message sent automatically on completion.</div>}
      </div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={()=>setDone(true)} style={{fontSize:12,padding:"8px 20px",background:"#059669",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500,display:"inline-flex",alignItems:"center",gap:6}}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Complete order &amp; send review
        </button>
      </div>
    </div>
  );
}

// ── Order Detail Page ─────────────────────────────────────────────────────────
function OrderDetailPage({ order, onBack, currentUser }) {
  const [currentStage,setStage]=useState(order.stage);
  const [activeTab,   setActiveTab]=useState("pipeline");
  const [activityLog, setActivityLog]=useState([{id:1,time:"10 Jun 2026, 09:41 AM",user:"Admin",action:"Order pulled from Zoho Books",stage:"New order",type:"system"},{id:2,time:"10 Jun 2026, 10:15 AM",user:"Admin",action:"Order moved to processing",stage:"Order processing",type:"stage"}]);
  const [schedDate,   setSchedDate]=useState(""); const [schedSaved,setSchedSaved]=useState(false);
  const [specialNote, setSpecNote]=useState("");  const [noteSaved,  setNoteSaved]=useState(false);
  const curIdx=Math.max(0,ALL_STAGES.findIndex(s=>s.id===currentStage));
  const curStage=ALL_STAGES[curIdx];
  const addLog=(action,stage,type="stage")=>setActivityLog(p=>[...p,{id:p.length+1,time:nowLabel(),user:"Admin",action,stage,type}]);
  const advance=()=>{const next=ALL_STAGES[curIdx+1];if(next){setStage(next.id);addLog(`Order moved to ${next.label}`,next.label);}};
  const revert=id=>{setStage(id);addLog(`Order reverted to ${ALL_STAGES[id].label}`,ALL_STAGES[id].label,"revert");};
  const grandTotal=order.items.reduce((s,i)=>s+(i.price*i.qty),0);
  const logColor=t=>({system:"#6b7280",stage:"#059669",revert:"#d97706",warehouse:"#6b21a8",schedule:"#0891b2",msg:"#1d4ed8",note:"#db2777"})[t]||"#059669";
  const logBg=t=>({system:"#f3f4f6",stage:"#ecfdf5",revert:"#fef3c7",warehouse:"#faf5ff",schedule:"#ecfeff",msg:"#eff6ff",note:"#fdf2f8"})[t]||"#ecfdf5";
  const logLabel=t=>({system:"System",stage:"Stage",revert:"Reverted",warehouse:"Warehouse",schedule:"Schedule",msg:"Message",note:"Note"})[t]||"Stage";

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <header style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#6b7280",background:"none",border:"none",cursor:"pointer"}}><Icon size={14} path="M15 19l-7-7 7-7"/> Back</button>
          <span style={{color:"#d1d5db"}}>/</span>
          <span style={{fontSize:12,fontWeight:500,color:"#111"}}>{order.invoiceNo}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {schedSaved&&<span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:"#ecfeff",color:"#0e7490",border:"1px solid #a5f3fc",display:"flex",alignItems:"center",gap:5}}><Icon size={12} path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>{fmtDate(schedDate)}</span>}
          <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:"#f3f4f6",color:"#4b5563",border:"1px solid #e5e7eb"}}>Zoho: {order.zohoStatus}</span>
          <span style={{fontSize:11,padding:"4px 10px",borderRadius:20,background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7"}}>{curStage.label}</span>
        </div>
      </header>
      <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
        <div style={{display:"grid",gridTemplateColumns:"290px 1fr",gap:16,alignItems:"start"}}>
          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Schedule */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}><Icon size={14} path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/><span style={{fontSize:13,fontWeight:500,color:"#111"}}>Order schedule</span></div>
                {schedSaved&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7"}}>Scheduled</span>}
              </div>
              {schedSaved?(<div><div style={{background:"#f9fafb",borderRadius:7,padding:"8px 12px",marginBottom:8}}><div style={{fontSize:10,color:"#9ca3af",marginBottom:2}}>Scheduled date</div><div style={{fontSize:13,fontWeight:500,color:"#111"}}>{fmtDate(schedDate)}</div></div><button onClick={()=>setSchedSaved(false)} style={{fontSize:11,padding:"5px 12px",border:"1px solid #e5e7eb",borderRadius:6,background:"#fff",color:"#6b7280",cursor:"pointer"}}>Edit</button></div>):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <div><div style={{fontSize:11,color:"#6b7280",marginBottom:3}}>Schedule date</div><input type="date" value={schedDate} onChange={e=>setSchedDate(e.target.value)} style={INP}/></div>
                  <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>{if(!schedDate)return;setSchedSaved(true);addLog(`Scheduled for ${fmtDate(schedDate)}`,curStage.label,"schedule");}} disabled={!schedDate} style={{fontSize:12,padding:"7px 16px",background:schedDate?"#111827":"#e5e7eb",color:schedDate?"#fff":"#9ca3af",border:"none",borderRadius:7,cursor:schedDate?"pointer":"not-allowed",fontWeight:500}}>Save schedule</button></div>
                </div>
              )}
            </div>
            {/* Customer */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:11,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12}}>Customer</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#d1fae5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,color:"#065f46",flexShrink:0}}>{initials(order.customer.name)}</div>
                <div><div style={{fontSize:13,fontWeight:500,color:"#111"}}>{order.customer.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{order.customer.email}</div></div>
              </div>
              {[{icon:"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",val:order.customer.phone},{icon:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",val:order.customer.address}].map((r,i)=>(<div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:5}}><span style={{color:"#9ca3af",marginTop:1,flexShrink:0}}><Icon size={13} path={r.icon}/></span><span style={{fontSize:12,color:"#374151",lineHeight:1.4}}>{r.val}</span></div>))}
              <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f3f4f6"}}>
                <div style={{fontSize:11,fontWeight:500,color:"#6b7280",marginBottom:6}}>Special note</div>
                {noteSaved&&specialNote?(<div><div style={{fontSize:12,color:"#374151",background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:7,padding:"7px 10px",marginBottom:6,lineHeight:1.5}}>{specialNote}</div><button onClick={()=>setNoteSaved(false)} style={{fontSize:11,padding:"4px 10px",border:"1px solid #e5e7eb",borderRadius:6,background:"#fff",color:"#6b7280",cursor:"pointer"}}>Edit</button></div>):(
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    <textarea value={specialNote} onChange={e=>setSpecNote(e.target.value)} placeholder='e.g. "Customer will contact us once facility is ready"' rows={2} style={{...INP,resize:"vertical"}}/>
                    <div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>{if(!specialNote.trim())return;setNoteSaved(true);addLog("Special note added",curStage.label,"note");}} disabled={!specialNote.trim()} style={{fontSize:11,padding:"5px 12px",background:specialNote.trim()?"#374151":"#e5e7eb",color:specialNote.trim()?"#fff":"#9ca3af",border:"none",borderRadius:6,cursor:specialNote.trim()?"pointer":"not-allowed"}}>Save</button></div>
                  </div>
                )}
              </div>
            </div>
            {/* Invoice */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:11,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Invoice</div>
              {[["Invoice no.",order.invoiceNo],["Date",fmtDate(order.invoiceDate)],["Zoho status",order.zohoStatus]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"5px 0",borderBottom:"1px solid #f9fafb"}}><span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:500,color:"#111"}}>{v}</span></div>))}
            </div>
            {/* Items */}
            <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:11,fontWeight:500,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:10}}>Items</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr style={{borderBottom:"1px solid #f3f4f6"}}>{["Item","SKU","Qty","Price"].map(h=><th key={h} style={{textAlign:h==="Qty"||h==="Price"?"right":"left",padding:"4px 0",color:"#9ca3af",fontWeight:500,paddingRight:h!=="Price"?6:0}}>{h}</th>)}</tr></thead>
                <tbody>{order.items.map((item,i)=>(<tr key={item.id} style={{borderBottom:i<order.items.length-1?"1px solid #f9fafb":"none"}}><td style={{padding:"6px 6px 6px 0",color:"#111",fontWeight:500}}>{item.name}</td><td style={{padding:"6px 6px 6px 0",color:"#9ca3af",fontFamily:"monospace",fontSize:10}}>{item.sku}</td><td style={{padding:"6px 0",color:"#6b7280",textAlign:"right",paddingRight:6}}>{item.qty}</td><td style={{padding:"6px 0",color:"#111",textAlign:"right"}}>AED {(item.price*item.qty).toLocaleString()}</td></tr>))}</tbody>
              </table>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10,paddingTop:8,borderTop:"1px solid #e5e7eb"}}><span style={{fontSize:13,fontWeight:500,color:"#111"}}>Total</span><span style={{fontSize:13,fontWeight:500,color:"#059669"}}>AED {grandTotal.toLocaleString()}</span></div>
            </div>
          </div>
          {/* RIGHT */}
          <div>
            <div style={{display:"flex",gap:0,marginBottom:14,background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:4,width:"fit-content"}}>
              {[["pipeline","Order pipeline"],["log","Activity log"]].map(([k,l])=>(
                <button key={k} onClick={()=>setActiveTab(k)} style={{fontSize:12,padding:"6px 16px",borderRadius:6,border:"none",cursor:"pointer",fontWeight:activeTab===k?500:400,background:activeTab===k?"#111827":"transparent",color:activeTab===k?"#fff":"#6b7280"}}>
                  {l}{k==="log"&&<span style={{marginLeft:6,fontSize:10,background:activeTab===k?"#374151":"#f3f4f6",color:activeTab===k?"#d1d5db":"#6b7280",padding:"1px 6px",borderRadius:20}}>{activityLog.length}</span>}
                </button>
              ))}
            </div>
            {activeTab==="pipeline"&&(
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"20px"}}>
                {ALL_STAGES.map(stage=>{
                  const isActive=stage.id===currentStage, isDone=stage.id<currentStage, isPending=stage.id>currentStage;
                  const isLast=stage.id===ALL_STAGES[ALL_STAGES.length-1].id;
                  const nextLabel=ALL_STAGES[stage.id+1]?.label;
                  const showLine=stage.id<ALL_STAGES.length-1;
                  const dotStyle={width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:500,...(isDone?{background:"#059669",color:"#fff",border:"2px solid #059669"}:isActive?{background:"#059669",color:"#fff",border:"2px solid #059669",boxShadow:"0 0 0 4px #d1fae5"}:{background:"#fff",color:"#9ca3af",border:"2px solid #e5e7eb"})};
                  return(
                    <div key={stage.id} style={{display:"flex",gap:12}}>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <div style={dotStyle}>{isDone?<Icon size={14} path="M5 13l4 4L19 7"/>:<span>{stage.id+1}</span>}</div>
                        {showLine&&<div style={{width:2,flex:1,minHeight:16,background:isDone?"#059669":"#e5e7eb",margin:"4px 0"}}/>}
                      </div>
                      <div style={{flex:1,paddingBottom:20}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:isPending?0:10}}>
                          <div><div style={{fontSize:13,fontWeight:500,color:isPending?"#9ca3af":"#111"}}>{stage.label}</div><div style={{fontSize:11,marginTop:1,color:isDone?"#6b7280":isActive?"#059669":"#d1d5db"}}>{isDone?"Completed":isActive?"Current stage":"Pending"}</div></div>
                          {isDone&&currentUser.role==="super_admin"&&<button onClick={()=>revert(stage.id)} style={{fontSize:11,padding:"4px 10px",border:"1px solid #e5e7eb",borderRadius:6,background:"#fff",color:"#6b7280",cursor:"pointer"}}>← Revert</button>}
                        </div>
                        {isActive&&(
                          stage.key==="new"        ?<NewOrderStage addLog={addLog} onAdvance={advance} nextLabel={nextLabel}/>:
                          stage.key==="processing" ?<ProcessingStage addLog={addLog} onAdvance={advance} nextLabel={nextLabel}/>:
                          stage.key==="dispatched"  ?<DispatchingStage order={order} addLog={addLog} onAdvance={advance} nextLabel={nextLabel} isLast={isLast}/>:
                          stage.key==="completed"   ?<CompletedStage/>:null
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab==="log"&&(
              <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"12px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:500,color:"#111"}}>Activity log</span><span style={{fontSize:11,color:"#9ca3af"}}>{activityLog.length} events</span></div>
                <div style={{padding:"4px 0"}}>
                  {[...activityLog].reverse().map((log,i,arr)=>(
                    <div key={log.id} style={{display:"flex",gap:12,padding:"10px 16px",borderBottom:i<arr.length-1?"1px solid #f9fafb":"none",alignItems:"flex-start"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:logColor(log.type),flexShrink:0,marginTop:5}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2,flexWrap:"wrap"}}><span style={{fontSize:12,color:"#111",fontWeight:500}}>{log.action}</span><span style={{fontSize:10,padding:"1px 7px",borderRadius:20,background:logBg(log.type),color:logColor(log.type)}}>{logLabel(log.type)}</span></div>
                        <div style={{fontSize:11,color:"#9ca3af"}}>{log.time} · {log.user} · {log.stage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Orders Listing Page ───────────────────────────────────────────────────────
function OrdersListingPage({ orders, filterStage, onOrderClick }) {
  const [search,setSearch]=useState(""); const [statusFilter,setStatusFilter]=useState(""); const [sort,setSort]=useState("date-desc");
  const stageLabel={0:"New order",1:"Order processing",2:"Dispatching",3:"Order completed"};
  const stageBadge=(s)=>({0:{bg:"#eff6ff",color:"#1e3a8a",border:"#bfdbfe"},1:{bg:"#faeeda",color:"#633806",border:"#fcd34d"},2:{bg:"#eeedfe",color:"#3c3489",border:"#cecbf6"},3:{bg:"#ecfdf5",color:"#065f46",border:"#6ee7b7"}}[s]||{bg:"#f3f4f6",color:"#374151",border:"#e5e7eb"});

  let filtered = orders.filter(o=>{
    if(filterStage!==null&&o.stage!==filterStage) return false;
    const q=search.toLowerCase();
    const mq=!q||(o.invoiceNo+o.customer.name+o.items.map(i=>i.name).join("")).toLowerCase().includes(q);
    const ms=!statusFilter||o.zohoStatus===statusFilter;
    return mq&&ms;
  });
  if(sort==="date-asc") filtered=[...filtered].sort((a,b)=>a.invoiceDate.localeCompare(b.invoiceDate));
  else filtered=[...filtered].sort((a,b)=>b.invoiceDate.localeCompare(a.invoiceDate));

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <header style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div><div style={{fontSize:15,fontWeight:500,color:"#111"}}>{filterStage===null?"All orders":filterStage===0?"New orders":filterStage===1?"Processing orders":filterStage===2?"Dispatching orders":"Delivered orders"}</div><div style={{fontSize:11,color:"#9ca3af"}}>Zoho Books connected · Last sync: 10 Jun 2026, 09:41 AM</div></div>
        <button style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"7px 14px",background:"#111827",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}><Icon size={13} path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/> Sync Zoho</button>
      </header>
      <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[{l:"Total",v:orders.length,c:"#111"},{l:"Draft",v:orders.filter(o=>o.zohoStatus==="Draft").length,c:"#b45309"},{l:"Sent",v:orders.filter(o=>o.zohoStatus==="Sent").length,c:"#1d4ed8"}].map(s=>(
            <div key={s.l} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"11px 14px"}}><div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>{s.l}</div><div style={{fontSize:20,fontWeight:500,color:s.c}}>{s.v}</div></div>
          ))}
        </div>
        {/* Toolbar */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,flex:1,background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"7px 11px"}}>
            <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:"#111",width:"100%"}} placeholder="Search invoice, customer, item…" value={search} onChange={e=>setSearch(e.target.value)}/>
            {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:12}}>✕</button>}
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{fontSize:11,padding:"7px 10px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#374151",cursor:"pointer",outline:"none"}}>
            <option value="">Zoho: all</option><option value="Draft">Draft</option><option value="Sent">Sent</option>
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{fontSize:11,padding:"7px 10px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#374151",cursor:"pointer",outline:"none"}}>
            <option value="date-desc">Newest first</option><option value="date-asc">Oldest first</option>
          </select>
        </div>
        {/* Table */}
        <div style={{border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden",background:"#fff"}}>
          <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
            <colgroup><col style={{width:100}}/><col style={{width:"30%"}}/><col style={{width:80}}/><col style={{width:90}}/><col style={{width:110}}/><col style={{width:80}}/></colgroup>
            <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
              <tr>{["Invoice","Customer","Date","Zoho","Stage","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,fontWeight:500,color:"#6b7280"}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length===0?(<tr><td colSpan={6} style={{padding:"40px",textAlign:"center",color:"#9ca3af",fontSize:12}}>No orders found</td></tr>):
              filtered.map((o,i)=>{
                const sb=stageBadge(o.stage);
                return(
                  <tr key={o.id} style={{borderBottom:i<filtered.length-1?"1px solid #f3f4f6":"none",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                    onClick={()=>onOrderClick(o)}>
                    <td style={{padding:"10px 12px"}}><span style={{fontWeight:500,color:"#2563eb",fontSize:12}}>{o.invoiceNo}</span></td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:27,height:27,borderRadius:"50%",background:"#d1fae5",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:"#065f46",flexShrink:0}}>{initials(o.customer.name)}</div>
                        <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:500,color:"#111",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.customer.name}</div><div style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.customer.email}</div></div>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px",fontSize:11,color:"#6b7280"}}>{fmtDate(o.invoiceDate)}</td>
                    <td style={{padding:"10px 12px"}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:500,...(o.zohoStatus==="Sent"?{background:"#eff6ff",color:"#1d4ed8",border:"1px solid #bfdbfe"}:{background:"#f3f4f6",color:"#4b5563",border:"1px solid #e5e7eb"})}}>{o.zohoStatus}</span></td>
                    <td style={{padding:"10px 12px"}}><span style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:500,background:sb.bg,color:sb.color,border:`1px solid ${sb.border}`,whiteSpace:"nowrap"}}>{stageLabel[o.stage]}</span></td>
                    <td style={{padding:"10px 12px"}} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>onOrderClick(o)} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,padding:"5px 10px",background:"#111827",color:"#fff",border:"none",borderRadius:6,cursor:"pointer"}}>Open →</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{padding:"9px 14px",background:"#f9fafb",borderTop:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af"}}>{filtered.length} of {orders.length} orders</div>
        </div>
      </div>
    </div>
  );
}

// ── Admin Users Page ──────────────────────────────────────────────────────────
function AdminUsersPage() {
  const [users,setUsers]=useState(ADMIN_USERS_DATA);
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const [roleFilter,setRoleFilter]=useState("");
  const [showRoles,setShowRoles]=useState(false);
  const filtered=users.filter(u=>{const q=search.toLowerCase();return(!q||(u.name+u.email).toLowerCase().includes(q))&&(!roleFilter||u.role===roleFilter);});
  const handleSave=data=>{if(modal==="add")setUsers(p=>[...p,{id:Date.now(),...data,created:"10 Jun 2026"}]);else setUsers(p=>p.map(u=>u.id===modal.id?{...u,...data}:u));setModal(null);};
  const toggleStatus=id=>setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==="active"?"inactive":"active"}:u));

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <header style={{background:"#fff",borderBottom:"1px solid #e5e7eb",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div><div style={{fontSize:15,fontWeight:500,color:"#111"}}>Admin users</div><div style={{fontSize:11,color:"#9ca3af"}}>Manage team members and their access roles</div></div>
        <button onClick={()=>setModal("add")} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"7px 14px",background:"#111827",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:500}}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add user
        </button>
      </header>
      <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[{l:"Super admins",v:users.filter(u=>u.role==="super_admin"&&u.status==="active").length,c:"#6b21a8"},{l:"Operations",v:users.filter(u=>u.role==="operations"&&u.status==="active").length,c:"#1d4ed8"},{l:"Inactive",v:users.filter(u=>u.status==="inactive").length,c:"#6b7280"}].map(s=>(
            <div key={s.l} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"11px 14px"}}><div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>{s.l}</div><div style={{fontSize:20,fontWeight:500,color:s.c}}>{s.v}</div></div>
          ))}
        </div>
        {/* Role info toggle */}
        <div style={{marginBottom:14}}>
          <button onClick={()=>setShowRoles(o=>!o)} style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,padding:"6px 12px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#374151",cursor:"pointer"}}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            {showRoles?"Hide role permissions":"View role permissions"}
          </button>
          {showRoles&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:10}}>
              {ROLES.map(r=>(
                <div key={r.key} style={{border:`1px solid ${r.border}`,borderRadius:8,padding:"12px 14px",background:r.bg}}>
                  <div style={{fontSize:12,fontWeight:500,color:r.color,marginBottom:8}}>{r.label}</div>
                  {r.permissions.map((p,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,fontSize:11,color:"#374151",marginBottom:3}}>
                      <span style={{color:p.startsWith("Cannot")||p.startsWith("No access")?"#dc2626":"#059669",flexShrink:0}}>
                        {p.startsWith("Cannot")||p.startsWith("No access")?"✕":"✓"}
                      </span>{p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Toolbar */}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:7,flex:1,background:"#fff",border:"1px solid #e5e7eb",borderRadius:8,padding:"7px 11px"}}>
            <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input style={{background:"transparent",border:"none",outline:"none",fontSize:12,color:"#111",width:"100%"}} placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{fontSize:11,padding:"7px 10px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#374151",cursor:"pointer",outline:"none"}}>
            <option value="">All roles</option><option value="super_admin">Super Admin</option><option value="operations">Operations</option>
          </select>
        </div>
        {/* Table */}
        <div style={{border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden",background:"#fff"}}>
          <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
            <colgroup><col style={{width:"30%"}}/><col style={{width:"30%"}}/><col style={{width:110}}/><col style={{width:90}}/><col style={{width:90}}/></colgroup>
            <thead style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb"}}>
              <tr>{["Name","Email","Role","Status","Actions"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,fontWeight:500,color:"#6b7280"}}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((user,i)=>{
                const role=ROLES.find(r=>r.key===user.role);
                return(
                  <tr key={user.id} style={{borderBottom:i<filtered.length-1?"1px solid #f3f4f6":"none"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                    <td style={{padding:"11px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:role?.bg||"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,color:role?.color||"#374151",flexShrink:0}}>{initials(user.name)}</div>
                        <div><div style={{fontSize:12,fontWeight:500,color:"#111"}}>{user.name}</div><div style={{fontSize:10,color:"#9ca3af"}}>Added {user.created}</div></div>
                      </div>
                    </td>
                    <td style={{padding:"11px 12px",fontSize:12,color:"#6b7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</td>
                    <td style={{padding:"11px 12px"}}>{role&&<span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:500,background:role.bg,color:role.color,border:`1px solid ${role.border}`}}>{role.label}</span>}</td>
                    <td style={{padding:"11px 12px"}}>{user.status==="active"?<span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:500,background:"#ecfdf5",color:"#065f46",border:"1px solid #6ee7b7"}}>Active</span>:<span style={{fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:500,background:"#f3f4f6",color:"#6b7280",border:"1px solid #e5e7eb"}}>Inactive</span>}</td>
                    <td style={{padding:"11px 12px"}}>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setModal(user)} style={{width:28,height:28,borderRadius:6,border:"1px solid #e5e7eb",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#6b7280"}} onMouseEnter={e=>{e.currentTarget.style.background="#f3f4f6";}} onMouseLeave={e=>{e.currentTarget.style.background="#fff";}}>
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={()=>toggleStatus(user.id)} style={{width:28,height:28,borderRadius:6,border:`1px solid ${user.status==="active"?"#fecaca":"#6ee7b7"}`,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:user.status==="active"?"#dc2626":"#059669"}} onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                          {user.status==="active"?<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>:<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{padding:"9px 14px",background:"#f9fafb",borderTop:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af"}}>{filtered.length} of {users.length} users</div>
        </div>
      </div>
      {/* User modal */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:420,boxShadow:"0 20px 60px rgba(0,0,0,0.15)",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #f3f4f6",background:"#f9fafb"}}>
              <span style={{fontSize:14,fontWeight:500,color:"#111"}}>{modal==="add"?"Add new user":"Edit user"}</span>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9ca3af"}}>×</button>
            </div>
            <UserEditForm init={modal==="add"?null:modal} onSave={handleSave} onCancel={()=>setModal(null)}/>
          </div>
        </div>
      )}
    </div>
  );
}

function UserEditForm({ init, onSave, onCancel }) {
  const [name,setName]=useState(init?.name||""); const [email,setEmail]=useState(init?.email||"");
  const [password,setPass]=useState(""); const [role,setRole]=useState(init?.role||"operations");
  const [status,setStatus]=useState(init?.status||"active"); const [errors,setErrors]=useState({});
  const validate=()=>{const e={};if(!name.trim())e.name="Name is required";if(!email.trim())e.email="Email is required";else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))e.email="Invalid email";if(!init&&!password.trim())e.password="Password is required";if(!init&&password&&password.length<6)e.password="Min 6 characters";setErrors(e);return!Object.keys(e).length;};
  const handleSave=()=>{if(!validate())return;onSave({name:name.trim(),email:email.trim(),role,status});};
  return(
    <div>
      <div style={{padding:"20px"}}>
        {[["Name","text",name,setName,"Full name","name"],["Email","email",email,setEmail,"user@fitorder.ae","email"],["Password","password",password,setPass,init?"Leave blank to keep current":"Min 6 characters","password"]].map(([l,t,v,sv,ph,k])=>(
          <div key={k} style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:4}}>{l}</div>
            <input type={t} value={v} onChange={e=>sv(e.target.value)} placeholder={ph} style={{...INP,borderColor:errors[k]?"#fca5a5":"#e5e7eb"}}/>
            {errors[k]&&<div style={{fontSize:11,color:"#dc2626",marginTop:3}}>{errors[k]}</div>}
          </div>
        ))}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>Role</div>
          {ROLES.map(r=>(
            <label key={r.key} onClick={()=>setRole(r.key)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:8,border:`1px solid ${role===r.key?r.border:"#e5e7eb"}`,background:role===r.key?r.bg:"#fff",cursor:"pointer",marginBottom:6}}>
              <input type="radio" name="role" checked={role===r.key} onChange={()=>{}} style={{accentColor:"#059669",marginTop:2,flexShrink:0}}/>
              <div><div style={{fontSize:12,fontWeight:500,color:role===r.key?r.color:"#111"}}>{r.label}</div><div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{r.permissions.slice(0,2).join(" · ")}</div></div>
            </label>
          ))}
        </div>
        <div>
          <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>Status</div>
          <div style={{display:"flex",gap:8}}>
            {[["active","Active"],["inactive","Inactive"]].map(([v,l])=>(
              <label key={v} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,cursor:"pointer",padding:"7px 14px",borderRadius:7,border:`1px solid ${status===v?(v==="active"?"#059669":"#e5e7eb"):"#e5e7eb"}`,background:status===v?(v==="active"?"#f0fdf4":"#f9fafb"):"#fff",flex:1,justifyContent:"center",fontWeight:500}}>
                <input type="radio" name="status" checked={status===v} onChange={()=>setStatus(v)} style={{accentColor:"#059669"}}/>{l}
              </label>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",padding:"12px 20px",borderTop:"1px solid #f3f4f6",background:"#f9fafb"}}>
        <button onClick={onCancel} style={{fontSize:12,padding:"7px 14px",border:"1px solid #e5e7eb",borderRadius:7,background:"#fff",color:"#6b7280",cursor:"pointer"}}>Cancel</button>
        <button onClick={handleSave} style={{fontSize:12,padding:"7px 18px",background:"#111827",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontWeight:500}}>{init?"Save changes":"Add user"}</button>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, setCollapsed, activeNav, setActiveNav }) {
  return(
    <aside style={{width:collapsed?52:200,minWidth:collapsed?52:200,background:"#111827",display:"flex",flexDirection:"column",transition:"width 0.2s",overflow:"hidden"}}>
      <div style={{padding:"14px 14px 10px",display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between",borderBottom:"1px solid #1f2937"}}>
        {!collapsed&&<span style={{fontSize:15,fontWeight:500,color:"#fff"}}>Fit<span style={{color:"#34d399"}}>Order</span></span>}
        <button onClick={()=>setCollapsed(c=>!c)} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",padding:2,display:"flex"}}><Icon size={16} path={collapsed?"M13 5l7 7-7 7M5 5l7 7-7 7":"M11 19l-7-7 7-7m8 14l-7-7 7-7"}/></button>
      </div>
      <nav style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {SIDEBAR_NAV.map(group=>(
          <div key={group.group}>
            {!collapsed&&<div style={{fontSize:10,fontWeight:500,color:"#4b5563",padding:"8px 14px 4px",textTransform:"uppercase",letterSpacing:"0.07em"}}>{group.group}</div>}
            {group.items.map(item=>{
              const active=activeNav===item.label;
              return(
                <button key={item.label} onClick={()=>setActiveNav(item.label)} title={collapsed?item.label:""} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px 0":"8px 14px",border:"none",cursor:"pointer",background:active?"#1f2937":"transparent",color:active?"#34d399":"#9ca3af",justifyContent:collapsed?"center":"flex-start",position:"relative"}}>
                  <Icon path={item.icon} size={16}/>
                  {!collapsed&&<span style={{fontSize:13,flex:1,textAlign:"left"}}>{item.label}</span>}
                  {!collapsed&&item.badge>0&&<span style={{fontSize:10,fontWeight:500,background:"#374151",color:"#d1d5db",padding:"1px 6px",borderRadius:20}}>{item.badge}</span>}
                  {active&&<span style={{position:"absolute",left:0,top:4,bottom:4,width:3,background:"#34d399",borderRadius:"0 3px 3px 0"}}/>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{padding:"10px 14px",borderTop:"1px solid #1f2937",display:"flex",alignItems:"center",gap:9,justifyContent:collapsed?"center":"flex-start"}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#065f46",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,color:"#34d399",flexShrink:0}}>{initials(CURRENT_USER.name)}</div>
        {!collapsed&&<div><div style={{fontSize:12,fontWeight:500,color:"#e5e7eb"}}>{CURRENT_USER.name.split(" ")[0]}</div><div style={{fontSize:10,color:"#6b7280"}}>Super Admin</div></div>}
      </div>
    </aside>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [collapsed,  setCollapsed]  = useState(false);
  const [activeNav,  setActiveNav]  = useState("New orders");
  const [activeOrder,setActiveOrder]= useState(null);
  const [orders,     setOrders]     = useState(ORDERS_DATA);

  const navToStageFilter = {
    "New orders":        0,
    "All orders":        null,
    "Processing orders": 1,
    "Delivered orders":  3,
  };

  const handleOrderClick = order => setActiveOrder(order);
  const handleBack = () => setActiveOrder(null);

  const filterStage = navToStageFilter[activeNav] !== undefined ? navToStageFilter[activeNav] : null;

  return (
    <div style={{fontFamily:"system-ui,sans-serif",fontSize:14,display:"flex",height:"100vh",overflow:"hidden",background:"#f3f4f6"}}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activeNav={activeNav} setActiveNav={v=>{setActiveNav(v);setActiveOrder(null);}}/>
      {activeNav==="Admin users" ? (
        <AdminUsersPage/>
      ) : activeOrder ? (
        <OrderDetailPage order={activeOrder} onBack={handleBack} currentUser={CURRENT_USER}/>
      ) : (
        <OrdersListingPage orders={orders} filterStage={filterStage} onOrderClick={handleOrderClick}/>
      )}
    </div>
  );
}

// export default App;