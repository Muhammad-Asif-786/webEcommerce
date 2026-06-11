import React, { useEffect, useState } from "react"

const useMobile = (breakpoint = 768)=>{
    const [isMobile,setIsMobile] = useState(window.innerWidth < breakpoint)

    const handleResize = ()=>{
        const checkpoint = window.innerWidth < breakpoint
        setIsMobile(checkpoint)
    }

    useEffect(()=>{
        handleResize()

        window.addEventListener('resize',handleResize)

        return ()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[])

    return [ isMobile ]
}

export default useMobile






// Soch lo tum ek website bana rahe ho 🖥️ jo computer aur mobile dono pe chalti hai. Ab tum chahte ho ke website automatically samjhe ke banda mobile use kar raha hai ya desktop 📱💻

// Usi ke liye ye chhota sa superpower hook likha gaya hai —
// useMobile() 🪄

// Ye kya karta hai:

// Website ke window width ko check karta hai.

// Agar width 768 pixels se chhoti hai → kehta hai “ye mobile hai” ✅
// agar badi hai → kehta hai “ye desktop hai” 🖥️

// Jab window resize hoti hai (jaise user ne window chhoti/bari ki),
// to ye hook turant update kar deta hai.

// Iska result hota hai —
// tum apne component me const [isMobile] = useMobile() likh kar easily check kar sakte ho:

// {isMobile ? "Mobile View" : "Desktop View"}


// Matlab ye hook tumhare app ko responsive aur smart banata hai 🧠