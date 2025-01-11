import{a as Ze,g as He,O as Ie,e as ge,s as re,T as ko,Q as ne,_ as n,r as a,u as Xe,b as Ye,U as Ge,h as Ke,j as i,c as D,d as Qe,V as qe,z as Je,W as Mo,X as J,Y as $o,Z as Vo,$ as Se,a0 as We,a1 as ee,a2 as _o,P as v,D as jo,B as Oo}from"./index-CoAGLqSD.js";function Fo(e){return He("MuiLink",e)}const Ao=Ze("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]),eo={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},Bo=e=>eo[e]||e,Do=({theme:e,ownerState:o})=>{const r=Bo(o.color),s=Ie(e,`palette.${r}`,!1)||o.color,p=Ie(e,`palette.${r}Channel`);return"vars"in e&&p?`rgba(${p} / 0.4)`:ge(s,.4)},Eo=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant","sx"],No=e=>{const{classes:o,component:r,focusVisible:s,underline:p}=e,c={root:["root",`underline${ne(p)}`,r==="button"&&"button",s&&"focusVisible"]};return Qe(c,Fo,o)},Io=re(ko,{name:"MuiLink",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:r}=e;return[o.root,o[`underline${ne(r.underline)}`],r.component==="button"&&o.button]}})(({theme:e,ownerState:o})=>n({},o.underline==="none"&&{textDecoration:"none"},o.underline==="hover"&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},o.underline==="always"&&n({textDecoration:"underline"},o.color!=="inherit"&&{textDecorationColor:Do({theme:e,ownerState:o})},{"&:hover":{textDecorationColor:"inherit"}}),o.component==="button"&&{position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"},[`&.${Ao.focusVisible}`]:{outline:"auto"}})),ze=a.forwardRef(function(o,r){const s=Xe({props:o,name:"MuiLink"}),{className:p,color:c="primary",component:h="a",onBlur:l,onFocus:C,TypographyClasses:E,underline:N="always",variant:L="inherit",sx:w}=s,I=Ye(s,Eo),{isFocusVisibleRef:R,onBlur:S,onFocus:W,ref:z}=Ge(),[U,k]=a.useState(!1),Z=Ke(r,z),H=m=>{S(m),R.current===!1&&k(!1),l&&l(m)},M=m=>{W(m),R.current===!0&&k(!0),C&&C(m)},$=n({},s,{color:c,component:h,focusVisible:U,underline:N,variant:L}),V=No($);return i.jsx(Io,n({color:c,className:D(V.root,p),classes:E,component:h,onBlur:H,onFocus:M,ref:Z,ownerState:$,variant:L,sx:[...Object.keys(eo).includes(c)?[]:[{color:c}],...Array.isArray(w)?w:[w]]},I))});function So(e){return He("MuiTooltip",e)}const b=Ze("MuiTooltip",["popper","popperInteractive","popperArrow","popperClose","tooltip","tooltipArrow","touch","tooltipPlacementLeft","tooltipPlacementRight","tooltipPlacementTop","tooltipPlacementBottom","arrow"]),Wo=["arrow","children","classes","components","componentsProps","describeChild","disableFocusListener","disableHoverListener","disableInteractive","disableTouchListener","enterDelay","enterNextDelay","enterTouchDelay","followCursor","id","leaveDelay","leaveTouchDelay","onClose","onOpen","open","placement","PopperComponent","PopperProps","slotProps","slots","title","TransitionComponent","TransitionProps"];function zo(e){return Math.round(e*1e5)/1e5}const Uo=e=>{const{classes:o,disableInteractive:r,arrow:s,touch:p,placement:c}=e,h={popper:["popper",!r&&"popperInteractive",s&&"popperArrow"],tooltip:["tooltip",s&&"tooltipArrow",p&&"touch",`tooltipPlacement${ne(c.split("-")[0])}`],arrow:["arrow"]};return Qe(h,So,o)},Zo=re(qe,{name:"MuiTooltip",slot:"Popper",overridesResolver:(e,o)=>{const{ownerState:r}=e;return[o.popper,!r.disableInteractive&&o.popperInteractive,r.arrow&&o.popperArrow,!r.open&&o.popperClose]}})(({theme:e,ownerState:o,open:r})=>n({zIndex:(e.vars||e).zIndex.tooltip,pointerEvents:"none"},!o.disableInteractive&&{pointerEvents:"auto"},!r&&{pointerEvents:"none"},o.arrow&&{[`&[data-popper-placement*="bottom"] .${b.arrow}`]:{top:0,marginTop:"-0.71em","&::before":{transformOrigin:"0 100%"}},[`&[data-popper-placement*="top"] .${b.arrow}`]:{bottom:0,marginBottom:"-0.71em","&::before":{transformOrigin:"100% 0"}},[`&[data-popper-placement*="right"] .${b.arrow}`]:n({},o.isRtl?{right:0,marginRight:"-0.71em"}:{left:0,marginLeft:"-0.71em"},{height:"1em",width:"0.71em","&::before":{transformOrigin:"100% 100%"}}),[`&[data-popper-placement*="left"] .${b.arrow}`]:n({},o.isRtl?{left:0,marginLeft:"-0.71em"}:{right:0,marginRight:"-0.71em"},{height:"1em",width:"0.71em","&::before":{transformOrigin:"0 0"}})})),Ho=re("div",{name:"MuiTooltip",slot:"Tooltip",overridesResolver:(e,o)=>{const{ownerState:r}=e;return[o.tooltip,r.touch&&o.touch,r.arrow&&o.tooltipArrow,o[`tooltipPlacement${ne(r.placement.split("-")[0])}`]]}})(({theme:e,ownerState:o})=>n({backgroundColor:e.vars?e.vars.palette.Tooltip.bg:ge(e.palette.grey[700],.92),borderRadius:(e.vars||e).shape.borderRadius,color:(e.vars||e).palette.common.white,fontFamily:e.typography.fontFamily,padding:"4px 8px",fontSize:e.typography.pxToRem(11),maxWidth:300,margin:2,wordWrap:"break-word",fontWeight:e.typography.fontWeightMedium},o.arrow&&{position:"relative",margin:0},o.touch&&{padding:"8px 16px",fontSize:e.typography.pxToRem(14),lineHeight:`${zo(16/14)}em`,fontWeight:e.typography.fontWeightRegular},{[`.${b.popper}[data-popper-placement*="left"] &`]:n({transformOrigin:"right center"},o.isRtl?n({marginLeft:"14px"},o.touch&&{marginLeft:"24px"}):n({marginRight:"14px"},o.touch&&{marginRight:"24px"})),[`.${b.popper}[data-popper-placement*="right"] &`]:n({transformOrigin:"left center"},o.isRtl?n({marginRight:"14px"},o.touch&&{marginRight:"24px"}):n({marginLeft:"14px"},o.touch&&{marginLeft:"24px"})),[`.${b.popper}[data-popper-placement*="top"] &`]:n({transformOrigin:"center bottom",marginBottom:"14px"},o.touch&&{marginBottom:"24px"}),[`.${b.popper}[data-popper-placement*="bottom"] &`]:n({transformOrigin:"center top",marginTop:"14px"},o.touch&&{marginTop:"24px"})})),Xo=re("span",{name:"MuiTooltip",slot:"Arrow",overridesResolver:(e,o)=>o.arrow})(({theme:e})=>({overflow:"hidden",position:"absolute",width:"1em",height:"0.71em",boxSizing:"border-box",color:e.vars?e.vars.palette.Tooltip.bg:ge(e.palette.grey[700],.9),"&::before":{content:'""',margin:"auto",display:"block",width:"100%",height:"100%",backgroundColor:"currentColor",transform:"rotate(45deg)"}}));let oe=!1;const Ue=new _o;let B={x:0,y:0};function te(e,o){return(r,...s)=>{o&&o(r,...s),e(r,...s)}}const Yo=a.forwardRef(function(o,r){var s,p,c,h,l,C,E,N,L,w,I,R,S,W,z,U,k,Z,H;const M=Xe({props:o,name:"MuiTooltip"}),{arrow:$=!1,children:V,components:m={},componentsProps:y={},describeChild:oo=!1,disableFocusListener:to=!1,disableHoverListener:be=!1,disableInteractive:ro=!1,disableTouchListener:no=!1,enterDelay:ye=100,enterNextDelay:xe=0,enterTouchDelay:so=700,followCursor:se=!1,id:io,leaveDelay:Te=0,leaveTouchDelay:ao=1500,onClose:ve,onOpen:we,open:lo,placement:Pe="bottom",PopperComponent:ie,PopperProps:x={},slotProps:T={},slots:X={},title:P,TransitionComponent:po=We,TransitionProps:co}=M,Ce=Ye(M,Wo),g=a.isValidElement(V)?V:i.jsx("span",{children:V}),Le=Je(),uo=Mo(),[_,Re]=a.useState(),[ae,mo]=a.useState(null),Y=a.useRef(!1),le=ro||se,ke=J(),pe=J(),G=J(),Me=J(),[ho,$e]=$o({controlled:lo,default:!1,name:"Tooltip",state:"open"});let f=ho;const ce=Vo(io),j=a.useRef(),K=Se(()=>{j.current!==void 0&&(document.body.style.WebkitUserSelect=j.current,j.current=void 0),Me.clear()});a.useEffect(()=>K,[K]);const Ve=t=>{Ue.clear(),oe=!0,$e(!0),we&&!f&&we(t)},Q=Se(t=>{Ue.start(800+Te,()=>{oe=!1}),$e(!1),ve&&f&&ve(t),ke.start(Le.transitions.duration.shortest,()=>{Y.current=!1})}),q=t=>{Y.current&&t.type!=="touchstart"||(_&&_.removeAttribute("title"),pe.clear(),G.clear(),ye||oe&&xe?pe.start(oe?xe:ye,()=>{Ve(t)}):Ve(t))},ue=t=>{pe.clear(),G.start(Te,()=>{Q(t)})},{isFocusVisibleRef:_e,onBlur:fo,onFocus:go,ref:bo}=Ge(),[,je]=a.useState(!1),Oe=t=>{fo(t),_e.current===!1&&(je(!1),ue(t))},Fe=t=>{_||Re(t.currentTarget),go(t),_e.current===!0&&(je(!0),q(t))},Ae=t=>{Y.current=!0;const u=g.props;u.onTouchStart&&u.onTouchStart(t)},yo=t=>{Ae(t),G.clear(),ke.clear(),K(),j.current=document.body.style.WebkitUserSelect,document.body.style.WebkitUserSelect="none",Me.start(so,()=>{document.body.style.WebkitUserSelect=j.current,q(t)})},xo=t=>{g.props.onTouchEnd&&g.props.onTouchEnd(t),K(),G.start(ao,()=>{Q(t)})};a.useEffect(()=>{if(!f)return;function t(u){(u.key==="Escape"||u.key==="Esc")&&Q(u)}return document.addEventListener("keydown",t),()=>{document.removeEventListener("keydown",t)}},[Q,f]);const To=Ke(g.ref,bo,Re,r);!P&&P!==0&&(f=!1);const de=a.useRef(),vo=t=>{const u=g.props;u.onMouseMove&&u.onMouseMove(t),B={x:t.clientX,y:t.clientY},de.current&&de.current.update()},O={},me=typeof P=="string";oo?(O.title=!f&&me&&!be?P:null,O["aria-describedby"]=f?ce:null):(O["aria-label"]=me?P:null,O["aria-labelledby"]=f&&!me?ce:null);const d=n({},O,Ce,g.props,{className:D(Ce.className,g.props.className),onTouchStart:Ae,ref:To},se?{onMouseMove:vo}:{}),F={};no||(d.onTouchStart=yo,d.onTouchEnd=xo),be||(d.onMouseOver=te(q,d.onMouseOver),d.onMouseLeave=te(ue,d.onMouseLeave),le||(F.onMouseOver=q,F.onMouseLeave=ue)),to||(d.onFocus=te(Fe,d.onFocus),d.onBlur=te(Oe,d.onBlur),le||(F.onFocus=Fe,F.onBlur=Oe));const wo=a.useMemo(()=>{var t;let u=[{name:"arrow",enabled:!!ae,options:{element:ae,padding:4}}];return(t=x.popperOptions)!=null&&t.modifiers&&(u=u.concat(x.popperOptions.modifiers)),n({},x.popperOptions,{modifiers:u})},[ae,x]),A=n({},M,{isRtl:uo,arrow:$,disableInteractive:le,placement:Pe,PopperComponentProp:ie,touch:Y.current}),he=Uo(A),Be=(s=(p=X.popper)!=null?p:m.Popper)!=null?s:Zo,De=(c=(h=(l=X.transition)!=null?l:m.Transition)!=null?h:po)!=null?c:We,Ee=(C=(E=X.tooltip)!=null?E:m.Tooltip)!=null?C:Ho,Ne=(N=(L=X.arrow)!=null?L:m.Arrow)!=null?N:Xo,Po=ee(Be,n({},x,(w=T.popper)!=null?w:y.popper,{className:D(he.popper,x==null?void 0:x.className,(I=(R=T.popper)!=null?R:y.popper)==null?void 0:I.className)}),A),Co=ee(De,n({},co,(S=T.transition)!=null?S:y.transition),A),Lo=ee(Ee,n({},(W=T.tooltip)!=null?W:y.tooltip,{className:D(he.tooltip,(z=(U=T.tooltip)!=null?U:y.tooltip)==null?void 0:z.className)}),A),Ro=ee(Ne,n({},(k=T.arrow)!=null?k:y.arrow,{className:D(he.arrow,(Z=(H=T.arrow)!=null?H:y.arrow)==null?void 0:Z.className)}),A);return i.jsxs(a.Fragment,{children:[a.cloneElement(g,d),i.jsx(Be,n({as:ie??qe,placement:Pe,anchorEl:se?{getBoundingClientRect:()=>({top:B.y,left:B.x,right:B.x,bottom:B.y,width:0,height:0})}:_,popperRef:de,open:_?f:!1,id:ce,transition:!0},F,Po,{popperOptions:wo,children:({TransitionProps:t})=>i.jsx(De,n({timeout:Le.transitions.duration.shorter},t,Co,{children:i.jsxs(Ee,n({},Lo,{children:[P,$?i.jsx(Ne,n({},Ro,{ref:mo})):null]}))}))}))]})}),fe=({color:e,outline:o,size:r,sx:s,...p})=>{const c=e&&!o&&{color:"background.paper",bgcolor:`${e}.main`},h=o&&{color:e?`${e}.main`:"primary.main",bgcolor:"background.paper",border:"2px solid",borderColor:e?`${e}.main`:"primary.main"};let l={};switch(r){case"badge":l={width:28,height:28};break;case"xs":l={width:34,height:34};break;case"sm":l={width:40,height:40};break;case"lg":l={width:72,height:72};break;case"xl":l={width:82,height:82};break;case"md":l={width:60,height:60};break;default:l={}}return i.jsx(jo,{sx:{...c,...h,...l,...s},...p})};fe.propTypes={color:v.string,outline:v.bool,size:v.string,sx:v.object};const Go=({title:e,link:o,icon:r})=>{const s=Je();return i.jsx(Yo,{title:e||"Reference",placement:"left",children:i.jsxs(Oo,{disableRipple:!0,children:[!r&&i.jsx(fe,{component:ze,href:o,"aria-label":"redirect pages",target:"_blank",alt:"MUI Logo",size:"badge",outline:!0,children:i.jsxs("svg",{width:"500",height:"500",viewBox:"0 0 500 500",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsxs("g",{clipPath:"url(#clip0)",children:[i.jsx("path",{d:"M100 260.9V131L212.5 195.95V239.25L137.5 195.95V282.55L100 260.9Z",fill:s.palette.primary[800]}),i.jsx("path",{d:"M212.5 195.95L325 131V260.9L250 304.2L212.5 282.55L287.5 239.25V195.95L212.5 239.25V195.95Z",fill:s.palette.primary.main}),i.jsx("path",{d:"M212.5 282.55V325.85L287.5 369.15V325.85L212.5 282.55Z",fill:s.palette.primary[800]}),i.jsx("path",{d:"M287.5 369.15L400 304.2V217.6L362.5 239.25V282.55L287.5 325.85V369.15ZM362.5 195.95V152.65L400 131V174.3L362.5 195.95Z",fill:s.palette.primary.main})]}),i.jsx("defs",{children:i.jsx("clipPath",{id:"clip0",children:i.jsx("rect",{width:"300",height:"238.3",fill:"white",transform:"translate(100 131)"})})})]})}),r&&i.jsx(fe,{component:ze,href:o,target:"_blank",size:"badge",color:"primary",outline:!0,"aria-label":"material-ui",children:r})]})})};Go.propTypes={icon:v.node,link:v.string,title:v.string};export{Go as C,ze as L};