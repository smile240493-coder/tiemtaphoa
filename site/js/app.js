(()=>{
"use strict";
const ADMIN_PASS="admin123"; /* ĐỔI MẬT KHẨU NÀY trước khi triển khai */
const K={p:"lh_products",s:"lh_settings",c:"lh_cart",o:"lh_orders"};
const D=window.SHOP||{settings:{},products:[]};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const rd=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const vnd=n=>new Intl.NumberFormat("vi-VN").format(n)+"₫";
let P=rd(K.p,null)||D.products,S=rd(K.s,null)||D.settings||{},C=rd(K.c,{});
const page=document.body.dataset.page;
const saveC=()=>{wr(K.c,C);badge()};
const badge=()=>{const n=Object.values(C).reduce((a,b)=>a+b,0),e=$("#cn");if(e)e.textContent=n};
const cats=()=>[...new Set(P.map(p=>p.cat))];
const hue=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h};
const shrink=(f,max,q)=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",q))};i.onerror=no;i.src=r.result};r.onerror=no;r.readAsDataURL(f)});
const media=v=>{const m=v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);return m?`<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Video sản phẩm" loading="lazy" allowfullscreen></iframe>`:`<video src="${esc(v)}" controls preload="metadata" playsinline></video>`};

/* Header & footer */
const links=[["index.html","Trang chủ","home"],["gioi-thieu.html","Giới thiệu","about"],["san-pham.html","Sản phẩm","products"],["lien-he.html","Liên hệ","contact"]];
$("#hdr").innerHTML=`<nav class="nav" aria-label="Chính"><a class="logo" href="index.html">Tiện Ích Store</a>${links.map(l=>`<a class="l ${l[2]===page?"on":""}" href="${l[0]}">${l[1]}</a>`).join("")}
<form class="search" action="san-pham.html" role="search"><input name="q" type="search" placeholder="Tìm sản phẩm" aria-label="Tìm sản phẩm"></form>
<a class="l cartlink" href="gio-hang.html">Giỏ hàng (<span id="cn">0</span>)</a></nav>`;
$("#ftr").innerHTML=`<div class="wrap"><div><h3>Tiện Ích Store</h3><p>Phụ kiện điện thoại và đồ gia dụng, bảo hành rõ ràng, giao toàn quốc.</p></div>
<div><h3>Liên kết</h3><p>${links.map(l=>`<a href="${l[0]}">${l[1]}</a>`).join("<br>")}</p></div>
<div><h3>Liên hệ</h3><p>123 Đường Mẫu, Hà Nội<br>0900 000 000<br><a href="quan-tri.html">Quản trị</a></p></div></div>`;
badge();
const hw=$("#herowrap");if(hw&&S.heroBg){hw.style.backgroundImage=`url("${S.heroBg.replace(/"/g,"%22")}")`;hw.classList.add("hasbg")}

/* Thẻ sản phẩm + cửa sổ chi tiết */
const imgs=p=>p.imgs||[];
const card=p=>{const a=imgs(p)[0];return `<article class="card"><button class="lk pw" data-v="${p.id}" aria-label="Xem chi tiết ${esc(p.name)}">${a?`<img class="thumb" src="${esc(a)}" alt="${esc(p.name)}" loading="lazy" width="400" height="300">`:`<div class="thumb" style="background:hsl(${hue(p.name)} 32% 38%)">${esc(p.name[0])}</div>`}${p.video?'<span class="vb">Video</span>':""}</button>
<div class="b"><small>${esc(p.cat)}</small><h3>${esc(p.name)}</h3><small>${esc(p.desc)}</small><div class="price">${vnd(p.price)}</div><div class="acts"><button class="btn sec" data-v="${p.id}">Chi tiết</button><button class="btn" data-add="${p.id}">Thêm vào giỏ</button></div></div></article>`};
const dlg=document.createElement("dialog");dlg.className="dlg";dlg.setAttribute("aria-label","Chi tiết sản phẩm");document.body.append(dlg);
const open=id=>{const p=P.find(x=>x.id==id);if(!p)return;const im=imgs(p);
dlg.innerHTML=`<div class="in"><div class="main" id="mm">${im[0]?`<img src="${esc(im[0])}" alt="${esc(p.name)}">`:""}${p.video&&!im[0]?media(p.video):""}</div>
<div class="th">${im.map((x,i)=>`<img src="${esc(x)}" alt="Ảnh ${i+1}" data-g="${i}" class="${i?"":"on"}">`).join("")}${p.video&&im[0]?`<img src="${esc(im[0])}" alt="Xem video" data-vid="1" style="opacity:.6">`:""}</div>
<div><small>${esc(p.cat)}</small><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p><div class="price">${vnd(p.price)}</div></div>
<div class="acts"><button class="btn" data-add="${p.id}">Thêm vào giỏ</button><button class="btn sec" id="xc">Đóng</button></div></div>`;
dlg.showModal();$("#xc",dlg).onclick=()=>dlg.close();
$$("[data-g]",dlg).forEach(i=>i.onclick=()=>{$$("[data-g],[data-vid]",dlg).forEach(x=>x.classList.remove("on"));i.classList.add("on");$("#mm",dlg).innerHTML=`<img src="${esc(im[i.dataset.g])}" alt="${esc(p.name)}">`});
const v=$("[data-vid]",dlg);if(v)v.onclick=()=>{$$("[data-g]",dlg).forEach(x=>x.classList.remove("on"));$("#mm",dlg).innerHTML=media(p.video)}};
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener("close",()=>{dlg.innerHTML=""});
document.addEventListener("click",e=>{const v=e.target.closest("[data-v]");if(v){open(v.dataset.v);return}
const b=e.target.closest("[data-add]");if(!b)return;const id=b.dataset.add;C[id]=(C[id]||0)+1;saveC();b.textContent="Đã thêm";setTimeout(()=>b.textContent="Thêm vào giỏ",1200)});

if(page==="home")$("#featured").innerHTML=P.filter(p=>p.hot).slice(0,4).map(card).join("")||"<p>Chưa có sản phẩm nổi bật.</p>";

if(page==="products"){
const u=new URLSearchParams(location.search),q=$("#q"),c=$("#cat"),s=$("#sort");
c.innerHTML='<option value="">Tất cả danh mục</option>'+cats().map(x=>`<option>${esc(x)}</option>`).join("");
q.value=u.get("q")||"";c.value=u.get("cat")||"";
const bare=t=>t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").toLowerCase();
const draw=()=>{let r=P.filter(p=>(!c.value||p.cat===c.value)&&(!q.value||bare(p.name+" "+p.desc).includes(bare(q.value))));
if(s.value)r.sort((a,b)=>s.value==="asc"?a.price-b.price:b.price-a.price);
$("#count").textContent=r.length+" sản phẩm";$("#list").innerHTML=r.map(card).join("")||"<p>Không tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác.</p>"};
[q,c,s].forEach(x=>x.addEventListener("input",draw));draw()}

if(page==="contact")$("#cf").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);
location.href=`mailto:xinchao@tienichstore.vn?subject=${encodeURIComponent("Liên hệ từ "+f.get("name"))}&body=${encodeURIComponent(f.get("msg")+"\n\n"+f.get("name")+" – "+f.get("email"))}`;
$("#cmsg").textContent="Đang mở ứng dụng email của bạn…"});

if(page==="cart"){
const box=$("#cartbox");
const draw=(done)=>{
if(done){box.innerHTML=`<div class="ok"><h2>Đặt hàng thành công</h2><p>Mã đơn <strong>${done}</strong>. Chúng tôi sẽ gọi xác nhận trong vòng 2 giờ.</p><a class="btn" href="san-pham.html">Tiếp tục mua sắm</a></div>`;return}
const items=Object.keys(C).map(id=>({p:P.find(x=>x.id==id),n:C[id]})).filter(x=>x.p);
if(!items.length){box.innerHTML='<p>Giỏ hàng đang trống.</p><a class="btn" href="san-pham.html">Chọn sản phẩm</a>';return}
const tot=items.reduce((a,x)=>a+x.p.price*x.n,0);
box.innerHTML=`<div class="tw"><table><thead><tr><th>Sản phẩm</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead><tbody>${items.map(x=>`<tr><td>${esc(x.p.name)}</td><td>${vnd(x.p.price)}</td><td><input class="qty" type="number" min="1" value="${x.n}" data-q="${x.p.id}" aria-label="Số lượng"></td><td>${vnd(x.p.price*x.n)}</td><td><button class="btn del sm" data-rm="${x.p.id}">Xóa</button></td></tr>`).join("")}</tbody></table></div>
<div class="sum"><span>Tổng cộng</span><span>${vnd(tot)}</span></div>
<form id="of" class="form"><h2>Thông tin giao hàng</h2><label>Họ tên<input name="name" required autocomplete="name"></label><label>Số điện thoại<input name="phone" type="tel" required pattern="0[0-9]{9}" title="Nhập số điện thoại 10 chữ số" autocomplete="tel"></label><label>Địa chỉ nhận hàng<input name="addr" required autocomplete="street-address"></label><label>Ghi chú<textarea name="note" rows="2"></textarea></label><button class="btn">Đặt hàng</button></form>`;
$$("[data-q]",box).forEach(i=>i.onchange=()=>{C[i.dataset.q]=Math.max(1,+i.value||1);saveC();draw()});
$$("[data-rm]",box).forEach(b=>b.onclick=()=>{delete C[b.dataset.rm];saveC();draw()});
$("#of").onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const O=rd(K.o,[]);const id="TI"+Date.now().toString().slice(-7);
O.unshift({id,time:new Date().toLocaleString("vi-VN"),...f,total:tot,items:items.map(x=>x.p.name+" × "+x.n)});wr(K.o,O);C={};saveC();draw(id)}};
draw()}

/* Quản trị */
if(page==="admin"){
const A=$("#adm");let tab="p",w=null,ok=sessionStorage.getItem("lh_ok")==="1";
const save=()=>{if(!(wr(K.p,P)&&wr(K.s,S)))alert("Bộ nhớ trình duyệt đã đầy. Hãy dùng đường dẫn ảnh (img/ten.jpg) hoặc xóa bớt ảnh tải lên.")};
const dl=()=>{const b=new Blob(["window.SHOP="+JSON.stringify({settings:S,products:P},null,1)+";\n"],{type:"text/javascript"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="data.js";a.click()};
const draw=()=>{
if(!ok){A.innerHTML=`<h1>Đăng nhập quản trị</h1><form id="lf" class="form" style="max-width:360px"><label>Mật khẩu<input type="password" id="pw" required autocomplete="current-password"></label><button class="btn">Đăng nhập</button><p id="le" class="err" role="alert"></p></form>`;
$("#lf").onsubmit=e=>{e.preventDefault();if($("#pw").value===ADMIN_PASS){ok=true;sessionStorage.setItem("lh_ok","1");draw()}else $("#le").textContent="Mật khẩu chưa đúng."};return}
const O=rd(K.o,[]);
A.innerHTML=`<div class="adm-head"><h1>Quản trị</h1><div class="acts"><button class="btn sm" id="dl">Tải data.js để đăng lên web</button><button class="btn sec sm" id="lo">Đăng xuất</button></div></div>
<p class="note">Thay đổi đang lưu như bản nháp trên máy này. Khách chỉ thấy sau khi bạn tải <strong>data.js</strong>, chép đè vào thư mục <strong>js/</strong> rồi đưa lên GitHub để Vercel cập nhật.</p>
<div class="tabs"><button class="btn ${tab==="p"?"":"sec"}" data-t="p">Sản phẩm (${P.length})</button><button class="btn ${tab==="s"?"":"sec"}" data-t="s">Ảnh nền</button><button class="btn ${tab==="o"?"":"sec"}" data-t="o">Đơn hàng (${O.length})</button></div><div id="tb"></div>`;
$("#dl").onclick=dl;$("#lo").onclick=()=>{sessionStorage.removeItem("lh_ok");ok=false;draw()};
$$("[data-t]",A).forEach(b=>b.onclick=()=>{tab=b.dataset.t;w=null;draw()});
const tb=$("#tb");
if(tab==="o"){tb.innerHTML=O.length?`<div class="tw"><table><thead><tr><th>Mã</th><th>Khách hàng</th><th>Sản phẩm</th><th>Tổng</th></tr></thead><tbody>${O.map(o=>`<tr><td>${esc(o.id)}<br><small>${esc(o.time)}</small></td><td>${esc(o.name)}<br>${esc(o.phone)}<br><small>${esc(o.addr)}</small></td><td>${o.items.map(esc).join("<br>")}</td><td>${vnd(o.total)}</td></tr>`).join("")}</tbody></table></div>`:"<p>Chưa có đơn hàng nào.</p>";return}
if(tab==="s"){tb.innerHTML=`<div class="fgrid"><div class="full"><h2>Ảnh nền trang chủ</h2><div class="bgpv" style="${S.heroBg?`background-image:url('${esc(S.heroBg)}')`:""}" role="img" aria-label="Xem trước ảnh nền"></div></div>
<label>Tải ảnh từ máy<input type="file" id="bf" accept="image/*"></label><label>Hoặc dán link / đường dẫn ảnh<input id="bu" placeholder="img/banner.jpg hoặc https://…" value="${S.heroBg&&!S.heroBg.startsWith("data:")?esc(S.heroBg):""}"></label>
<div class="full"><button class="btn" id="bs">Lưu link ảnh</button> <button class="btn del" id="bd">Xóa ảnh nền</button></div></div>`;
$("#bf").onchange=async e=>{if(e.target.files[0]){S.heroBg=await shrink(e.target.files[0],1600,.75);save();draw()}};
$("#bs").onclick=()=>{S.heroBg=$("#bu").value.trim();save();draw()};$("#bd").onclick=()=>{S.heroBg="";save();draw()};return}
tb.innerHTML=(w?`<form id="pf" class="fgrid"><label>Tên sản phẩm<input name="name" required value="${esc(w.name)}"></label><label>Danh mục<input name="cat" required list="cl" value="${esc(w.cat)}"><datalist id="cl">${cats().map(c=>`<option value="${esc(c)}">`).join("")}</datalist></label><label>Giá (₫)<input name="price" type="number" min="0" step="1000" required value="${w.price}"></label><label>Link video (YouTube hoặc .mp4)<input name="video" value="${esc(w.video||"")}" placeholder="https://youtu.be/… hoặc video/ten.mp4"></label><label class="full">Mô tả<textarea name="desc" rows="2">${esc(w.desc)}</textarea></label><label class="full"><span><input type="checkbox" name="hot" style="width:auto" ${w.hot?"checked":""}> Hiển thị ở trang chủ</span></label>
<div class="full"><strong>Ảnh sản phẩm</strong> <small>(ảnh đầu tiên là ảnh đại diện)</small><div class="pv">${w.imgs.map((x,i)=>`<div><img src="${esc(x)}" alt="Ảnh ${i+1}"><button type="button" data-x="${i}" aria-label="Xóa ảnh ${i+1}">×</button></div>`).join("")}</div></div>
<label>Tải ảnh từ máy (chọn nhiều ảnh)<input type="file" id="pi" accept="image/*" multiple></label><label>Hoặc dán link / đường dẫn ảnh<input id="pu" placeholder="img/ten.jpg"></label>
<div class="full"><button type="button" class="btn sec sm" id="pa">Thêm ảnh từ link</button></div>
<div class="full"><button class="btn">Lưu sản phẩm</button> <button type="button" class="btn sec" id="cx">Hủy</button></div></form>`:`<p><button class="btn" id="nw">Thêm sản phẩm</button> <button class="btn sec" id="rs">Bỏ bản nháp, dùng lại dữ liệu đã đăng</button></p>`)+
`<div class="tw"><table><thead><tr><th>Tên</th><th>Danh mục</th><th>Giá</th><th></th></tr></thead><tbody>${P.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.cat)}</td><td>${vnd(p.price)}</td><td><button class="btn sec sm" data-e="${p.id}">Sửa</button> <button class="btn del sm" data-d="${p.id}">Xóa</button></td></tr>`).join("")}</tbody></table></div>`;
if($("#nw"))$("#nw").onclick=()=>{w={id:0,name:"",cat:cats()[0]||"",price:0,imgs:[],video:"",desc:"",hot:0};draw()};
if($("#rs"))$("#rs").onclick=()=>{if(confirm("Xóa bản nháp trên máy này?")){localStorage.removeItem(K.p);localStorage.removeItem(K.s);P=D.products;S=D.settings||{};draw()}};
if($("#cx"))$("#cx").onclick=()=>{w=null;draw()};
$$("[data-e]",tb).forEach(b=>b.onclick=()=>{const p=P.find(x=>x.id==b.dataset.e);w={...p,imgs:[...(p.imgs||[])]};draw();scrollTo(0,0)});
$$("[data-d]",tb).forEach(b=>b.onclick=()=>{if(confirm("Xóa sản phẩm này?")){P=P.filter(p=>p.id!=b.dataset.d);save();draw()}});
const pf=$("#pf");if(pf){
const sync=()=>{const f=new FormData(pf);Object.assign(w,{name:f.get("name"),cat:f.get("cat"),price:+f.get("price"),video:f.get("video").trim(),desc:f.get("desc"),hot:f.get("hot")?1:0})};
pf.addEventListener("input",sync);
$$("[data-x]",pf).forEach(b=>b.onclick=()=>{sync();w.imgs.splice(+b.dataset.x,1);draw()});
$("#pi").onchange=async e=>{sync();for(const f of e.target.files)w.imgs.push(await shrink(f,900,.8));draw()};
$("#pa").onclick=()=>{sync();const v=$("#pu").value.trim();if(v)w.imgs.push(v);draw()};
pf.onsubmit=ev=>{ev.preventDefault();sync();const o={...w,id:w.id||Date.now(),name:w.name.trim(),cat:w.cat.trim(),desc:w.desc.trim()};
if(w.id)P=P.map(p=>p.id===w.id?o:p);else P.unshift(o);w=null;save();draw()}}};
draw()}
})();
