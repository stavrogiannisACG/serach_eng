import { useState } from "react";
import Swal from 'sweetalert2';

function VSRListing({ rank, id, distance, url }) {
    const [myrank, setRank] = useState(rank)
    const [myid, SetID] = useState(id)
    const [mydistance, setDistance] = useState(distance)
    const [myurl, setUrl] = useState(url)
    function showSwal(e) {
        Swal.fire({
            title: `${myid}`,
            html: `<b>Distance:</b> ${mydistance} 
                <br/> 
                <b>Link to Product:</b> <a target="_blank" rel="noreferrer" style={{overflow:"hidden", marginLeft:"3px"}} href=${myurl}>
                    link
                </a>`,
            confirmButtonText: "OK",
            confirmButtonColor: "green"
        });
    }

    return (
        <div onClick={showSwal} style={{ marginBottom: "5px", alignItems: "center", display: "flex", justifyContent: "space-between", height: "30px", paddingRight: "7px", border: "1px solid green", paddingLeft: "7px", borderRadius: "5px", cursor: 'pointer' }}>
            <div style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }} >
                {myid}
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div style={{ overflow: "hidden" }}>
                    {mydistance}
                </div>
                <a target="_blank" rel="noreferrer" style={{ overflow: "hidden", marginLeft: "20px" }} href={myurl}>
                    link
                </a>
            </div>

        </div>
    )
}
export default VSRListing;