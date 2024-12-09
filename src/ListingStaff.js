import { useState } from "react"
import Swal from 'sweetalert2';
function ListingStaff({appName, appURL, appPrice, appDescription})
{
    const [name,setName]=useState(appName)
    const [url,setURL]=useState(appURL)
    const [price,setPrice]=useState(appPrice)
    const [desc,setDesc]=useState(appDescription)

    function showSwal(e)
    {
         Swal.fire({
            title: `${name}`,
            html: `<b>Price:</b> ${price} <br/> <b>Link to Product:</b> <a target="_blank" rel="noreferrer" style={{overflow:"hidden", marginLeft:"3px"}} href=${url}>
                    link
                </a>`,
            // icon: "info",
            confirmButtonText:"OK",
            confirmButtonColor:"green"
          });
    }


    return(
        <div onClick={showSwal} style={{marginBottom:"5px", alignItems:"center",display:"flex", justifyContent:"space-between", height:"30px", paddingRight:"7px",border:"1px solid green", paddingLeft:"7px", borderRadius:"5px", cursor:'pointer'}}>
            <div style={{textOverflow: "ellipsis",whiteSpace: "nowrap", overflow:"hidden"}} >
                {name}
            </div>
            <div style={{display:"flex",  justifyContent:"space-around"}}>
                <div style={{overflow:"hidden"}}>
                    {price}
                </div>
                <a target="_blank" rel="noreferrer" style={{overflow:"hidden", marginLeft:"20px"}} href={url}>
                    link
                </a>
            </div>
        </div>
    )
}

export default ListingStaff;